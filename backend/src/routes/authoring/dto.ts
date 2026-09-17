import type { Course, Lesson, Section } from '../../generated/client';

export function toCourseDto(course: Course) {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    level: course.level,
    category: course.category,
    accessTier: course.accessTier,
    price: course.price,
    status: course.status,
    publishedAt: course.publishedAt,
    authorId: course.authorId,
    programId: course.programId,
    active: course.active,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

export function toSectionDto(section: Section) {
  return {
    id: section.id,
    courseId: section.courseId,
    order: section.order,
    title: section.title,
    summary: section.summary,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
}

export function toLessonDto(lesson: Lesson) {
  return {
    id: lesson.id,
    sectionId: lesson.sectionId,
    slug: lesson.slug,
    title: lesson.title,
    summary: lesson.summary,
    bodyText: lesson.bodyText,
    visibility: lesson.visibility,
    status: lesson.status,
    publishedAt: lesson.publishedAt,
    order: lesson.order,
    estimatedMinutes: lesson.estimatedMinutes,
    createdAt: lesson.createdAt,
    updatedAt: lesson.updatedAt,
  };
}
