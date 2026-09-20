import express from 'express';
import {
  catalogCoursesQuerySchema,
  updateLessonProgressSchema,
  type EntitlementDto,
  type LibraryCourseDto,
} from '@nurman-course/shared';
import type { Prisma } from '../../generated/client';
import { resolveLessonAccess } from '../../content/access';
import { prisma } from '../../lib/prisma';
import { requireAuth, type AuthenticatedRequest } from '../../middleware/auth';

const router = express.Router();

function activeEntitlementWhere(userId: string, now: Date): Prisma.EntitlementWhereInput {
  return {
    userId,
    revokedAt: null,
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
  };
}

router.get('/api/me/entitlements', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const now = new Date();
    const entitlements = await prisma.entitlement.findMany({
      where: {
        userId: req.user!.id,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        course: { active: true, status: 'published', publishedAt: { lte: now } },
      },
      select: {
        source: true,
        expiresAt: true,
        revokedAt: true,
        course: { select: { slug: true, title: true } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
    const data: EntitlementDto[] = entitlements.map((entitlement) => ({
      courseSlug: entitlement.course.slug,
      courseTitle: entitlement.course.title,
      source: entitlement.source,
      expiresAt: entitlement.expiresAt?.toISOString() ?? null,
      active: entitlement.revokedAt === null
        && (entitlement.expiresAt === null || entitlement.expiresAt > now),
    }));
    res.set('Cache-Control', 'private, no-store');
    res.json({ data });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

router.get('/api/me/lesson-progress', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const rows = await prisma.lessonProgress.findMany({
      where: { userId: req.user!.id, completed: true },
      select: { lesson: { select: { slug: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.set('Cache-Control', 'private, no-store');
    res.json({ data: { completedLessonSlugs: rows.map((row) => row.lesson.slug) } });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Gagal memuat progress lesson.' } });
  }
});

router.get('/api/me/courses', requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = catalogCoursesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Query library tidak valid',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  try {
    const now = new Date();
    const { page, limit, search, category, level, accessTier } = parsed.data;
    const lessonWhere = { status: 'published' as const, publishedAt: { lte: now } };
    const where: Prisma.CourseWhereInput = {
      active: true,
      status: 'published',
      publishedAt: { lte: now },
      OR: [
        { accessTier: 'free' },
        { accessTier: 'paid', entitlements: { some: activeEntitlementWhere(req.user!.id, now) } },
      ],
      ...(search
        ? {
            AND: {
              OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } },
              ],
            },
          }
        : {}),
      ...(category ? { category } : {}),
      ...(level ? { level } : {}),
      ...(accessTier ? { accessTier } : {}),
    };
    const [courses, totalItems] = await prisma.$transaction([
      prisma.course.findMany({
        where,
        select: {
          slug: true,
          title: true,
          description: true,
          level: true,
          category: true,
          accessTier: true,
          price: true,
          author: { select: { name: true } },
          sections: {
            select: {
              _count: {
                select: {
                  lessons: { where: lessonWhere },
                },
              },
              lessons: {
                where: {
                  ...lessonWhere,
                  progresses: { some: { userId: req.user!.id, completed: true } },
                },
                select: { id: true },
              },
            },
          },
        },
        orderBy: [{ publishedAt: 'desc' }, { title: 'asc' }, { slug: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    const data: LibraryCourseDto[] = courses.map((course) => {
      const totalLessons = course.sections.reduce((total, section) => total + section._count.lessons, 0);
      const completedLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);
      return {
        slug: course.slug,
        title: course.title,
        description: course.description,
        level: course.level,
        category: course.category,
        accessTier: course.accessTier,
        price: course.price,
        author: course.author,
        lessonCount: totalLessons,
        progress: {
          completedLessons,
          totalLessons,
          percentage: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
        },
      };
    });

    res.set('Cache-Control', 'private, no-store');
    res.json({ data, pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) } });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

router.patch('/api/me/lessons/:slug/progress', requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = updateLessonProgressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Progress tidak valid',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  try {
    const now = new Date();
    const decision = await resolveLessonAccess(req.params.slug, req.user!, now);
    if (decision.kind === 'not_found') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Lesson tidak ditemukan' } });
      return;
    }
    if (decision.kind !== 'allowed') {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Tidak dapat mengubah progress lesson ini' } });
      return;
    }

    const lesson = decision.lesson;
    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: req.user!.id, lessonId: lesson.id } },
      create: { userId: req.user!.id, lessonId: lesson.id, completed: parsed.data.completed },
      update: { completed: parsed.data.completed, updatedAt: now },
      select: { completed: true, updatedAt: true },
    });
    res.set('Cache-Control', 'private, no-store');
    res.json({
      data: {
        lessonSlug: lesson.slug,
        completed: progress.completed,
        updatedAt: progress.updatedAt.toISOString(),
      },
    });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

export { router as meRouter };
