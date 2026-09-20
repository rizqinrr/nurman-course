import express from 'express';
import type { Prisma } from '../../generated/client';
import type { ReaderLessonDto } from '@nurman-course/shared';
import { resolveLessonAccess, type LessonAccessContext } from '../../content/access';
import { prisma } from '../../lib/prisma';
import { optionalAuth, type AuthenticatedRequest } from '../../middleware/auth';

export const readerRouter = express.Router();

function navigationAccessWhere(
  lesson: LessonAccessContext,
  user: AuthenticatedRequest['user'],
  now: Date,
): Prisma.LessonWhereInput {
  if (!user || lesson.section.course.accessTier === null) return { visibility: 'public' };
  if (lesson.section.course.accessTier === 'free') return {};
  return {
    OR: [
      { visibility: 'public' },
      {
        visibility: 'entitled',
        section: {
          course: {
            entitlements: {
              some: {
                userId: user.id,
                revokedAt: null,
                OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
              },
            },
          },
        },
      },
    ],
  };
}

async function findNeighbours(
  lesson: LessonAccessContext,
  user: AuthenticatedRequest['user'],
  now: Date,
): Promise<{ previousSlug: string | null; nextSlug: string | null }> {
  const published = {
    status: 'published' as const,
    publishedAt: { lte: now },
    section: {
      courseId: lesson.section.course.id,
      course: {
        active: true,
        status: 'published' as const,
        publishedAt: { lte: now },
      },
    },
    ...navigationAccessWhere(lesson, user, now),
  };
  const location = {
    sectionOrder: lesson.section.order,
    lessonOrder: lesson.order,
    lessonId: lesson.id,
  };
  const before: Prisma.LessonWhereInput[] = [
    { section: { order: { lt: location.sectionOrder } } },
    { section: { order: location.sectionOrder }, order: { lt: location.lessonOrder } },
    { section: { order: location.sectionOrder }, order: location.lessonOrder, id: { lt: location.lessonId } },
  ];
  const after: Prisma.LessonWhereInput[] = [
    { section: { order: { gt: location.sectionOrder } } },
    { section: { order: location.sectionOrder }, order: { gt: location.lessonOrder } },
    { section: { order: location.sectionOrder }, order: location.lessonOrder, id: { gt: location.lessonId } },
  ];
  const [previous, next] = await prisma.$transaction([
    prisma.lesson.findFirst({
      where: { ...published, AND: [{ OR: before }] },
      select: { slug: true },
      orderBy: [{ section: { order: 'desc' } }, { order: 'desc' }, { id: 'desc' }],
    }),
    prisma.lesson.findFirst({
      where: { ...published, AND: [{ OR: after }] },
      select: { slug: true },
      orderBy: [{ section: { order: 'asc' } }, { order: 'asc' }, { id: 'asc' }],
    }),
  ]);
  return { previousSlug: previous?.slug ?? null, nextSlug: next?.slug ?? null };
}

readerRouter.get('/api/reader/lessons/:slug', optionalAuth, async (req: AuthenticatedRequest, res) => {
  const now = new Date();

  try {
    const decision = await resolveLessonAccess(req.params.slug, req.user ?? null, now);

    res.set('Cache-Control', 'private, no-store');

    if (decision.kind === 'not_found') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Lesson tidak ditemukan' } });
      return;
    }

    if (decision.kind === 'login_required') {
      res.status(401).json({
        error: {
          code: 'LOGIN_REQUIRED',
          message: 'Masuk untuk membaca lesson ini',
          requiredAccess: 'login',
          courseSlug: decision.courseSlug,
          courseTitle: decision.courseTitle,
          price: decision.price,
        },
      });
      return;
    }

    if (decision.kind === 'purchase_required') {
      res.status(403).json({
        error: {
          code: 'PURCHASE_REQUIRED',
          message: 'Beli course untuk membaca lesson ini',
          requiredAccess: 'purchase',
          courseSlug: decision.courseSlug,
          courseTitle: decision.courseTitle,
          price: decision.price,
        },
      });
      return;
    }

    const lesson = decision.lesson;
    const { previousSlug, nextSlug } = await findNeighbours(lesson, req.user, now);
    const progress = req.user ? await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: req.user.id, lessonId: lesson.id } },
      select: { completed: true },
    }) : null;
    const tracked = await prisma.$transaction([
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { readCount: { increment: 1 } },
        select: { readCount: true },
      }),
      prisma.trackingEvent.create({
        data: {
          eventType: 'lesson_read',
          userId: req.user?.id ?? null,
          lessonId: lesson.id,
          ipAddress: typeof req.ip === 'string' && req.ip.length <= 45 ? req.ip : null,
          userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'].slice(0, 512) : null,
        },
        select: { id: true },
      }),
    ]);
    const payload: ReaderLessonDto = {
      slug: lesson.slug,
      title: lesson.title,
      summary: lesson.summary,
      bodyText: lesson.bodyText,
      estimatedMinutes: lesson.estimatedMinutes,
      readCount: tracked[0].readCount,
      completed: progress?.completed ?? false,
      breadcrumb: {
        courseSlug: lesson.section.course.slug,
        courseTitle: lesson.section.course.title,
        sectionTitle: lesson.section.title,
      },
      previousSlug,
      nextSlug,
    };

    res.set('Cache-Control', decision.cache === 'public' ? 'public, max-age=0, must-revalidate' : 'private, no-store');
    res.json({ data: payload });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});
