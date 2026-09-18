import request from 'supertest';
import { describe, expect, it } from 'vitest';
import {
  getUser, findUnique, openTestServer, trackingCreate, accountErrors,
  lessonFindUnique, lessonFindFirst, lessonUpdate,
  courseFindMany, lessonProgressFindMany,
} from './setup';
import { app } from '../src/index';

function authenticate(id: string, role: string, active = true) {
  getUser.mockResolvedValueOnce({
    data: { user: { id, email: `${id}@test`, user_metadata: { role } } },
    error: null,
  });
  findUnique.mockResolvedValueOnce({ id, role, active, email: `${id}@test` });
}

describe('Tracking endpoints', () => {
  it('POST /api/track/login creates a login event after authentication', async () => {
    authenticate('login-user', 'wali');
    trackingCreate.mockResolvedValueOnce({ id: 'tracking-1' });
    const response = await request(await openTestServer(app))
      .post('/api/track/login')
      .set('Authorization', 'Bearer login-token')
      .set('User-Agent', 'tracking-test')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ data: { id: 'tracking-1' } });
    expect(trackingCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ eventType: 'login', userId: 'login-user', userAgent: 'tracking-test' }),
      select: { id: true },
    }));
  });

  it('POST /api/track/login rejects anonymous requests', async () => {
    const response = await request(await openTestServer(app))
      .post('/api/track/login')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Missing or invalid token format' });
  });

  it('GET /api/admin/tracking rejects non-admin DB roles', async () => {
    authenticate('wali-tracking', 'wali');
    const response = await request(await openTestServer(app))
      .get('/api/admin/tracking')
      .set('Authorization', 'Bearer wali-tracking-token')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
    expect(response.body).not.toEqual(accountErrors.missing);
  });
});

describe('Catalog paths and progress', () => {
  it('GET /api/catalog/paths returns published course outlines', async () => {
    courseFindMany.mockResolvedValueOnce([]);
    const response = await request(await openTestServer(app))
      .get('/api/catalog/paths')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [] });
  });

  it('GET /api/me/lesson-progress returns only the authenticated user progress', async () => {
    authenticate('progress-user', 'wali');
    lessonProgressFindMany.mockResolvedValueOnce([{ lesson: { slug: 'lesson-one' } }]);
    const response = await request(await openTestServer(app))
      .get('/api/me/lesson-progress')
      .set('Authorization', 'Bearer progress-token')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { completedLessonSlugs: ['lesson-one'] } });
    expect(lessonProgressFindMany).toHaveBeenCalledWith({
      where: { userId: 'progress-user', completed: true },
      select: { lesson: { select: { slug: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  });
});

describe('Reader read count', () => {
  const published = new Date('2026-01-01T00:00:00.000Z');
  const lessonFixtures = {
    notFound: null,
    publicLesson: {
      id: 'lesson-one', sectionId: 'section-one', slug: 'public-lesson', title: 'Public lesson',
      summary: null, bodyText: 'Body public', visibility: 'public', status: 'published',
      publishedAt: published, order: 1, estimatedMinutes: 10,
      section: { title: 'Section', order: 1, course: { id: 'course-one', slug: 'course-one', title: 'Course one', price: null, accessTier: 'free', status: 'published', publishedAt: published, active: true } },
    },
  } as const;

  it('records a lesson_read event and increments readCount on a successful reader access', async () => {
    lessonFindUnique.mockResolvedValueOnce(lessonFixtures.publicLesson);
    lessonFindFirst.mockResolvedValue(null);
    lessonUpdate.mockResolvedValueOnce({ readCount: 5 });
    trackingCreate.mockResolvedValueOnce({ id: 'read-1' });
    const response = await request(await openTestServer(app))
      .get('/api/reader/lessons/public-lesson')
      .set('User-Agent', 'reader-test')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.body.data.readCount).toBe(5);
    expect(lessonUpdate).toHaveBeenCalledWith({
      where: { id: 'lesson-one' },
      data: { readCount: { increment: 1 } },
      select: { readCount: true },
    });
    expect(trackingCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ eventType: 'lesson_read', lessonId: 'lesson-one', userId: null }),
    }));
  });

  it('does not increment readCount or record an event when the lesson is missing', async () => {
    lessonFindUnique.mockResolvedValueOnce(lessonFixtures.notFound);
    const response = await request(await openTestServer(app))
      .get('/api/reader/lessons/public-lesson')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(404);
    expect(lessonUpdate).not.toHaveBeenCalled();
    expect(trackingCreate).not.toHaveBeenCalled();
  });
});
