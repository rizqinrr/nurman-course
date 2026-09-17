import express from 'express';
import {
  contentStatusSchema,
  createCourseSchema,
  createLessonSchema,
  createSectionSchema,
  lessonVisibilitySchema,
  reorderContentSchema,
  updateCourseSchema,
  updateLessonSchema,
  updateSectionSchema,
} from '@nurman-course/shared';
import { prisma } from '../../lib/prisma';
import type { Prisma } from '../../generated/client';
import { AuthenticatedRequest, requireAuth, requireRole } from '../../middleware/auth';
import { validateInternalLinks } from './links';
import { toCourseDto, toLessonDto, toSectionDto } from './dto';
import {
  isPrismaError,
  sendConflict,
  sendForbidden,
  sendInternalError,
  sendNotFound,
  sendValidationError,
} from './responses';

export const authoringRouter = express.Router();
const authoringAuth = [requireAuth, requireRole('admin', 'tentor')];

function parsePagination(req: express.Request) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  return { page, limit };
}

function validateAccessTier(
  accessTier: string | null | undefined,
  price: number | null | undefined,
  requireTier = false,
): string | null {
  if (requireTier && !accessTier) return 'Access tier wajib ditentukan sebelum publish';
  if (!accessTier && price !== null && price !== undefined) return 'Harga tidak boleh diisi sebelum access tier ditentukan';
  if (accessTier === 'paid' && (!price || price <= 0)) return 'Course berbayar wajib memiliki harga lebih dari 0';
  if (accessTier === 'free' && price !== null && price !== undefined) return 'Course gratis tidak boleh memiliki harga';
  return null;
}

async function resolveAuthorId(req: AuthenticatedRequest, requestedAuthorId?: string): Promise<string | null> {
  if (!requestedAuthorId) return req.user?.id ?? null;
  if (req.user?.role === 'tentor') return requestedAuthorId === req.user.id ? req.user.id : null;
  const author = await prisma.user.findUnique({ where: { id: requestedAuthorId }, select: { id: true, role: true, active: true } });
  if (!author || !author.active || !['admin', 'tentor'].includes(author.role)) return null;
  return author.id;
}

async function getCourseAccess(id: string, req: AuthenticatedRequest) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return { course: null, visible: false, writable: false };
  const visible = req.user?.role === 'admin' || (req.user?.role === 'tentor' && course.authorId === req.user.id);
  return { course, visible, writable: visible && course.programId === null };
}

async function getSectionAccess(id: string, req: AuthenticatedRequest) {
  const section = await prisma.section.findUnique({
    where: { id },
    include: { course: { select: { id: true, authorId: true, programId: true } } },
  });
  if (!section) return { section: null, visible: false, writable: false };
  const visible = req.user?.role === 'admin' || (req.user?.role === 'tentor' && section.course.authorId === req.user.id);
  return { section, visible, writable: visible && section.course.programId === null };
}

async function getLessonAccess(id: string, req: AuthenticatedRequest) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { section: { include: { course: { select: { id: true, authorId: true, programId: true } } } } },
  });
  if (!lesson) return { lesson: null, visible: false, writable: false };
  const visible = req.user?.role === 'admin' || (req.user?.role === 'tentor' && lesson.section.course.authorId === req.user.id);
  return { lesson, visible, writable: visible && lesson.section.course.programId === null };
}

authoringRouter.get('/api/authoring/courses', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { page, limit } = parsePagination(req);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const rawStatus = typeof req.query.status === 'string' ? req.query.status : undefined;
    const parsedStatus = rawStatus === undefined ? null : contentStatusSchema.safeParse(rawStatus);
    if (parsedStatus && !parsedStatus.success) return sendValidationError(res, 'Status course tidak valid');
    const status = parsedStatus && parsedStatus.success ? parsedStatus.data : undefined;
    const where: Prisma.CourseWhereInput = {
      ...(req.user?.role === 'tentor' ? { authorId: req.user.id, programId: null } : {}),
      ...(status ? { status } : {}),
      ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' as const } }, { slug: { contains: search, mode: 'insensitive' as const } }] } : {}),
    };
    const [data, totalItems] = await prisma.$transaction([
      prisma.course.findMany({ where, include: { _count: { select: { sections: true } } }, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.course.count({ where }),
    ]);
    res.json({
      data: data.map((course) => ({ ...toCourseDto(course), _count: course._count })),
      pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
    });
  } catch {
    sendInternalError(res, 'Error listing authoring courses');
  }
});

authoringRouter.post('/api/authoring/courses', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = createCourseSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, 'Invalid course data', parsed.error.flatten());
  const tierError = validateAccessTier(parsed.data.accessTier, parsed.data.price);
  if (tierError) return sendValidationError(res, tierError);
  try {
    const authorId = await resolveAuthorId(req, parsed.data.authorId);
    if (parsed.data.authorId && !authorId) return sendForbidden(res, 'Author tidak valid atau tidak aktif');
    const course = await prisma.course.create({ data: { ...parsed.data, authorId } });
    res.status(201).json({ data: toCourseDto(course) });
  } catch (error) {
    if (isPrismaError(error, 'P2002')) return sendConflict(res, 'Slug course sudah digunakan');
    sendInternalError(res, 'Error creating authoring course');
  }
});

authoringRouter.get('/api/authoring/courses/:id', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await getCourseAccess(req.params.id, req);
    if (!result.course) return sendNotFound(res, 'Course tidak ditemukan');
    if (!result.visible) return sendForbidden(res);
    const course = await prisma.course.findUnique({ where: { id: req.params.id }, include: { sections: { include: { lessons: true }, orderBy: { order: 'asc' } } } });
    if (!course) return sendNotFound(res, 'Course tidak ditemukan');
    res.json({
      data: {
        ...toCourseDto(course),
        sections: course.sections.map((section) => ({
          ...toSectionDto(section),
          lessons: section.lessons.map(toLessonDto),
        })),
      },
    });
  } catch {
    sendInternalError(res, 'Error fetching authoring course');
  }
});

authoringRouter.patch('/api/authoring/courses/:id', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = updateCourseSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, 'Invalid course data', parsed.error.flatten());
  if (Object.keys(parsed.data).length === 0) return sendValidationError(res, 'Minimal satu field wajib diisi');
  try {
    const result = await getCourseAccess(req.params.id, req);
    if (!result.course) return sendNotFound(res, 'Course tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    const nextTier = Object.prototype.hasOwnProperty.call(parsed.data, 'accessTier')
      ? parsed.data.accessTier
      : result.course.accessTier;
    const nextPrice = Object.prototype.hasOwnProperty.call(parsed.data, 'price')
      ? parsed.data.price
      : result.course.price;
    const tierError = validateAccessTier(nextTier, nextPrice);
    if (tierError) return sendValidationError(res, tierError);
    const course = await prisma.course.update({ where: { id: req.params.id }, data: parsed.data });
    res.json({ data: toCourseDto(course) });
  } catch (error) {
    if (isPrismaError(error, 'P2002')) return sendConflict(res, 'Slug course sudah digunakan');
    if (isPrismaError(error, 'P2025')) return sendNotFound(res, 'Course tidak ditemukan');
    sendInternalError(res, 'Error updating authoring course');
  }
});

authoringRouter.delete('/api/authoring/courses/:id', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await getCourseAccess(req.params.id, req);
    if (!result.course) return sendNotFound(res, 'Course tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    if (result.course.status !== 'draft') return sendValidationError(res, 'Hanya course draft yang dapat dihapus');
    await prisma.course.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (isPrismaError(error, 'P2025')) return sendNotFound(res, 'Course tidak ditemukan');
    sendInternalError(res, 'Error deleting authoring course');
  }
});

authoringRouter.post('/api/authoring/courses/:id/publish', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await getCourseAccess(req.params.id, req);
    if (!result.course) return sendNotFound(res, 'Course tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    const tierError = validateAccessTier(result.course.accessTier, result.course.price, true);
    if (tierError) return sendValidationError(res, tierError);
    const course = await prisma.course.update({ where: { id: req.params.id }, data: { status: 'published', publishedAt: new Date() } });
    res.json({ data: toCourseDto(course) });
  } catch (error) {
    if (isPrismaError(error, 'P2025')) return sendNotFound(res, 'Course tidak ditemukan');
    sendInternalError(res, 'Error publishing authoring course');
  }
});

authoringRouter.post('/api/authoring/courses/:id/draft', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await getCourseAccess(req.params.id, req);
    if (!result.course) return sendNotFound(res, 'Course tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    const course = await prisma.course.update({ where: { id: req.params.id }, data: { status: 'draft', publishedAt: null } });
    res.json({ data: toCourseDto(course) });
  } catch (error) {
    if (isPrismaError(error, 'P2025')) return sendNotFound(res, 'Course tidak ditemukan');
    sendInternalError(res, 'Error drafting authoring course');
  }
});

async function assertSectionParent(res: express.Response, req: AuthenticatedRequest, courseId: string, write = false) {
  const result = await getCourseAccess(courseId, req);
  if (!result.course) { sendNotFound(res, 'Course tidak ditemukan'); return null; }
  if (!(write ? result.writable : result.visible)) { sendForbidden(res); return null; }
  return result.course;
}

async function assertLessonParent(res: express.Response, req: AuthenticatedRequest, sectionId: string, write = false) {
  const result = await getSectionAccess(sectionId, req);
  if (!result.section) { sendNotFound(res, 'Section tidak ditemukan'); return null; }
  if (!(write ? result.writable : result.visible)) { sendForbidden(res); return null; }
  return result.section;
}

authoringRouter.get('/api/authoring/courses/:courseId/sections', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!await assertSectionParent(res, req, req.params.courseId)) return;
    const sections = await prisma.section.findMany({ where: { courseId: req.params.courseId }, include: { _count: { select: { lessons: true } } }, orderBy: { order: 'asc' } });
    res.json({ data: sections.map((section) => ({ ...toSectionDto(section), _count: section._count })) });
  } catch { sendInternalError(res, 'Error listing sections'); }
});

authoringRouter.post('/api/authoring/courses/:courseId/sections', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = createSectionSchema.safeParse({ ...req.body, courseId: req.params.courseId });
  if (!parsed.success) return sendValidationError(res, 'Invalid section data', parsed.error.flatten());
  try {
    if (!await assertSectionParent(res, req, req.params.courseId, true)) return;
    let order = parsed.data.order;
    if (order === undefined) {
      const last = await prisma.section.findFirst({ where: { courseId: req.params.courseId }, orderBy: { order: 'desc' }, select: { order: true } });
      order = last ? last.order + 1 : 0;
    }
    const section = await prisma.section.create({ data: { ...parsed.data, order } });
    res.status(201).json({ data: toSectionDto(section) });
  } catch (error) {
    if (isPrismaError(error, 'P2002')) return sendConflict(res, 'Urutan section sudah digunakan');
    sendInternalError(res, 'Error creating section');
  }
});

authoringRouter.patch('/api/authoring/sections/:id', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = updateSectionSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, 'Invalid section data', parsed.error.flatten());
  if (Object.keys(parsed.data).length === 0) return sendValidationError(res, 'Minimal satu field wajib diisi');
  try {
    const result = await getSectionAccess(req.params.id, req);
    if (!result.section) return sendNotFound(res, 'Section tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    const section = await prisma.section.update({ where: { id: req.params.id }, data: parsed.data });
    res.json({ data: toSectionDto(section) });
  } catch (error) {
    if (isPrismaError(error, 'P2002')) return sendConflict(res, 'Urutan section sudah digunakan');
    sendInternalError(res, 'Error updating section');
  }
});

authoringRouter.delete('/api/authoring/sections/:id', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await getSectionAccess(req.params.id, req);
    if (!result.section) return sendNotFound(res, 'Section tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    await prisma.section.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch { sendInternalError(res, 'Error deleting section'); }
});

type ContentTransaction = Pick<typeof prisma, 'section' | 'lesson'>;

async function reorderChildren(
  res: express.Response,
  ids: string[],
  existingIds: string[],
  update: (client: ContentTransaction, id: string, order: number) => Promise<unknown>,
): Promise<boolean> {
  if (ids.length !== existingIds.length || ids.some((id) => !existingIds.includes(id))) {
    sendValidationError(res, 'Reorder harus memuat seluruh ID sibling tepat satu kali');
    return false;
  }
  await prisma.$transaction(async (tx) => {
    for (const [index, id] of ids.entries()) await update(tx, id, -(index + 1));
    for (const [index, id] of ids.entries()) await update(tx, id, index);
  });
  return true;
}

authoringRouter.post('/api/authoring/courses/:courseId/sections/reorder', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = reorderContentSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, 'Invalid reorder data', parsed.error.flatten());
  try {
    if (!await assertSectionParent(res, req, req.params.courseId, true)) return;
    const existing = await prisma.section.findMany({ where: { courseId: req.params.courseId }, select: { id: true } });
    if (!await reorderChildren(res, parsed.data.ids, existing.map((item) => item.id), (client, id, order) => client.section.update({ where: { id }, data: { order } }))) return;
    const sections = await prisma.section.findMany({ where: { courseId: req.params.courseId }, orderBy: { order: 'asc' } });
    res.json({ data: sections.map(toSectionDto) });
  } catch { sendInternalError(res, 'Error reordering sections'); }
});

authoringRouter.get('/api/authoring/sections/:sectionId/lessons', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!await assertLessonParent(res, req, req.params.sectionId)) return;
    const lessons = await prisma.lesson.findMany({ where: { sectionId: req.params.sectionId }, orderBy: { order: 'asc' } });
    res.json({ data: lessons.map(toLessonDto) });
  } catch { sendInternalError(res, 'Error listing lessons'); }
});

authoringRouter.post('/api/authoring/sections/:sectionId/lessons', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = createLessonSchema.safeParse({ ...req.body, sectionId: req.params.sectionId });
  if (!parsed.success) return sendValidationError(res, 'Invalid lesson data', parsed.error.flatten());
  try {
    if (!await assertLessonParent(res, req, req.params.sectionId, true)) return;
     let order = parsed.data.order;

    if (order === undefined) {
      const last = await prisma.lesson.findFirst({ where: { sectionId: req.params.sectionId }, orderBy: { order: 'desc' }, select: { order: true } });
      order = last ? last.order + 1 : 0;
    }
    const linkError = await validateInternalLinks(parsed.data.bodyText, parsed.data.slug);
    if (linkError) return sendValidationError(res, linkError);
    const lesson = await prisma.lesson.create({ data: { ...parsed.data, order } });
    res.status(201).json({ data: toLessonDto(lesson) });
  } catch (error) {
    if (isPrismaError(error, 'P2002')) return sendConflict(res, 'Slug atau urutan lesson sudah digunakan');
    sendInternalError(res, 'Error creating lesson');
  }
});

authoringRouter.patch('/api/authoring/lessons/:id', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = updateLessonSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, 'Invalid lesson data', parsed.error.flatten());
  if (Object.keys(parsed.data).length === 0) return sendValidationError(res, 'Minimal satu field wajib diisi');
  try {
    const result = await getLessonAccess(req.params.id, req);
    if (!result.lesson) return sendNotFound(res, 'Lesson tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    if (parsed.data.bodyText !== undefined || parsed.data.slug !== undefined) {
      const linkError = await validateInternalLinks(
        parsed.data.bodyText ?? result.lesson.bodyText,
        parsed.data.slug ?? result.lesson.slug,
      );
      if (linkError) return sendValidationError(res, linkError);
    }
    const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: parsed.data });
    res.json({ data: toLessonDto(lesson) });
  } catch (error) {
    if (isPrismaError(error, 'P2002')) return sendConflict(res, 'Slug atau urutan lesson sudah digunakan');
    sendInternalError(res, 'Error updating lesson');
  }
});

authoringRouter.delete('/api/authoring/lessons/:id', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await getLessonAccess(req.params.id, req);
    if (!result.lesson) return sendNotFound(res, 'Lesson tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch { sendInternalError(res, 'Error deleting lesson'); }
});

authoringRouter.post('/api/authoring/lessons/:id/publish', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await getLessonAccess(req.params.id, req);
    if (!result.lesson) return sendNotFound(res, 'Lesson tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    const visibility = lessonVisibilitySchema.parse(result.lesson.visibility);
    const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: { status: 'published', visibility, publishedAt: new Date() } });
    res.json({ data: toLessonDto(lesson) });
  } catch (error) {
    if (isPrismaError(error, 'P2025')) return sendNotFound(res, 'Lesson tidak ditemukan');
    sendInternalError(res, 'Error publishing lesson');
  }
});

authoringRouter.post('/api/authoring/lessons/:id/draft', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await getLessonAccess(req.params.id, req);
    if (!result.lesson) return sendNotFound(res, 'Lesson tidak ditemukan');
    if (!result.writable) return sendForbidden(res);
    const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: { status: 'draft', publishedAt: null } });
    res.json({ data: toLessonDto(lesson) });
  } catch (error) {
    if (isPrismaError(error, 'P2025')) return sendNotFound(res, 'Lesson tidak ditemukan');
    sendInternalError(res, 'Error drafting lesson');
  }
});

authoringRouter.post('/api/authoring/sections/:sectionId/lessons/reorder', ...authoringAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = reorderContentSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, 'Invalid reorder data', parsed.error.flatten());
  try {
    if (!await assertLessonParent(res, req, req.params.sectionId, true)) return;
    const existing = await prisma.lesson.findMany({ where: { sectionId: req.params.sectionId }, select: { id: true } });
    if (!await reorderChildren(res, parsed.data.ids, existing.map((item) => item.id), (client, id, order) => client.lesson.update({ where: { id }, data: { order } }))) return;
    const lessons = await prisma.lesson.findMany({ where: { sectionId: req.params.sectionId }, orderBy: { order: 'asc' } });
    res.json({ data: lessons.map(toLessonDto) });
  } catch { sendInternalError(res, 'Error reordering lessons'); }
});
