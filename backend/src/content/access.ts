import { prisma } from '../lib/prisma';
import type { AuthenticatedUser } from '../middleware/auth';

export type ContentAccessDecision =
  | { kind: 'not_found' }
  | { kind: 'allowed'; lesson: LessonWithContext; cache: 'public' | 'private' }
  | { kind: 'login_required'; courseSlug: string; courseTitle: string; price: number | null }
  | { kind: 'purchase_required'; courseSlug: string; courseTitle: string; price: number | null };

type LessonWithContext = NonNullable<Awaited<ReturnType<typeof findLesson>>>;

async function findLesson(slug: string) {
  return prisma.lesson.findUnique({
    where: { slug },
    include: {
      section: {
        include: {
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              price: true,
              accessTier: true,
              status: true,
              publishedAt: true,
              active: true,
            },
          },
        },
      },
    },
  });
}

export async function resolveLessonAccess(
  slug: string,
  user: AuthenticatedUser | null,
  now = new Date(),
): Promise<ContentAccessDecision> {
  const lesson = await findLesson(slug);
  if (
    !lesson
    || lesson.status !== 'published'
    || !lesson.publishedAt
    || lesson.publishedAt > now
    || !lesson.section.course.active
    || lesson.section.course.status !== 'published'
    || !lesson.section.course.publishedAt
    || lesson.section.course.publishedAt > now
  ) {
    return { kind: 'not_found' };
  }

  const course = lesson.section.course;
  if (lesson.visibility === 'public') {
    return { kind: 'allowed', lesson, cache: 'public' };
  }

  if (!user) {
    return {
      kind: 'login_required',
      courseSlug: course.slug,
      courseTitle: course.title,
      price: course.price,
    };
  }

  if (course.accessTier === 'free') {
    return { kind: 'allowed', lesson, cache: 'private' };
  }

  if (course.accessTier !== 'paid') return { kind: 'not_found' };

  const entitlement = await prisma.entitlement.findFirst({
    where: {
      userId: user.id,
      courseId: course.id,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    select: { id: true },
  });

  if (!entitlement) {
    return {
      kind: 'purchase_required',
      courseSlug: course.slug,
      courseTitle: course.title,
      price: course.price,
    };
  }

  return { kind: 'allowed', lesson, cache: 'private' };
}
