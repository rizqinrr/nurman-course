import type { CatalogCourseDetailDto, CatalogCourseDto, CatalogCoursesQuery, ContentAccessRequirement } from '@nurman-course/shared';
import type { Prisma } from '../../generated/client';
import { prisma } from '../../lib/prisma';

const publicCourseSelect = {
  slug: true,
  title: true,
  description: true,
  level: true,
  category: true,
  accessTier: true,
  price: true,
  author: { select: { name: true } },
} as const;

function publishedCourseWhere(query: CatalogCoursesQuery, now: Date): Prisma.CourseWhereInput {
  const { search, category, level, accessTier } = query;
  return {
    active: true,
    status: 'published',
    publishedAt: { lte: now },
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(category ? { category } : {}),
    ...(level ? { level } : {}),
    ...(accessTier ? { accessTier } : { accessTier: { not: null } }),
  };
}

function accessRequirementFor(
  visibility: 'public' | 'entitled',
  accessTier: 'free' | 'paid' | null,
): ContentAccessRequirement {
  if (visibility === 'public') return 'public';
  return accessTier === 'paid' ? 'purchase' : 'login';
}

type CourseRow = {
  slug: string;
  title: string;
  description: string;
  level: string | null;
  category: string | null;
  accessTier: 'free' | 'paid' | null;
  price: number | null;
  author: { name: string } | null;
  sections: { _count: { lessons: number } }[];
};

function toCourseDto(course: CourseRow): CatalogCourseDto {
  return {
    slug: course.slug,
    title: course.title,
    description: course.description,
    level: course.level,
    category: course.category,
    accessTier: course.accessTier,
    price: course.price,
    author: course.author,
    lessonCount: course.sections.reduce((total, section) => total + section._count.lessons, 0),
  };
}

export async function listPublishedCourses(query: CatalogCoursesQuery, now = new Date()): Promise<{
  data: CatalogCourseDto[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
}> {
  const { page, limit } = query;
  const lessonWhere = { status: 'published' as const, publishedAt: { lte: now } };
  const where = publishedCourseWhere(query, now);
  const [courses, totalItems] = await prisma.$transaction([
    prisma.course.findMany({
      where,
      select: {
        ...publicCourseSelect,
        sections: {
          select: {
            _count: { select: { lessons: { where: lessonWhere } } },
          },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { title: 'asc' }, { slug: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({ where }),
  ]);

  return {
    data: courses.map(toCourseDto),
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
}

export async function findPublishedCourseDetail(
  slug: string,
  now = new Date(),
): Promise<CatalogCourseDetailDto | null> {
  const lessonWhere = { status: 'published' as const, publishedAt: { lte: now } };
  const course = await prisma.course.findFirst({
    where: { slug, ...publishedCourseWhere({ page: 1, limit: 1 }, now) },
    select: {
      ...publicCourseSelect,
      sections: {
        where: { lessons: { some: lessonWhere } },
        select: {
          order: true,
          title: true,
          level: true,
          summary: true,
          _count: { select: { lessons: { where: lessonWhere } } },
          lessons: {
            where: lessonWhere,
            select: {
              slug: true,
              title: true,
              summary: true,
              order: true,
              estimatedMinutes: true,
              visibility: true,
            },
            orderBy: [{ order: 'asc' }, { slug: 'asc' }],
          },
        },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
      },
    },
  });
  if (!course) return null;

  return {
    ...toCourseDto(course),
    sections: course.sections.map((section) => ({
      order: section.order,
      title: section.title,
      level: section.level,
      summary: section.summary,
      lessons: section.lessons.map((lesson) => ({
        ...lesson,
        accessRequirement: accessRequirementFor(lesson.visibility, course.accessTier),
      })),
    })),
  };
}
