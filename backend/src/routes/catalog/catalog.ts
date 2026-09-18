import express from 'express';
import { catalogCoursesQuerySchema } from '@nurman-course/shared';
import { findPublishedCourseDetail, listPublishedCourses } from './catalog-mapping';

export const catalogRouter = express.Router();

catalogRouter.get('/api/catalog/courses', async (req, res) => {
  const parsed = catalogCoursesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Query katalog tidak valid',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  try {
    const result = await listPublishedCourses(parsed.data);
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=60');
    res.json(result);
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

catalogRouter.get('/api/catalog/courses/:slug', async (req, res) => {
  try {
    const course = await findPublishedCourseDetail(req.params.slug);
    if (!course) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Course tidak ditemukan' } });
      return;
    }
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=60');
    res.json({ data: course });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});
