import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { getUser, findUnique, createUser, prismaCreate, openTestServer } from './setup';
import { app } from '../src/index';

afterEach(() => {
  expect(createUser).not.toHaveBeenCalled();
  expect(prismaCreate).not.toHaveBeenCalled();
});

describe('GET /api/health', () => {
  it('returns service health and an ISO timestamp without SDK or database calls', async () => {
    const response = await request(await openTestServer(app))
      .get('/api/health')
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'nurman-course-api',
      timestamp: expect.any(String),
    });
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
    expect(getUser).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
  });
});

describe('GET /api/users/me', () => {
  it('returns 401 without touching the SDK or database when Authorization is missing', async () => {
    const response = await request(await openTestServer(app))
      .get('/api/users/me')
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized: Missing or invalid token format',
    });
    expect(getUser).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('returns the application profile fixture for the verified identity', async () => {
    const dbUser = {
      id: 'profile-user',
      role: 'wali',
      name: 'Profile fixture',
      email: 'profile@example.test',
      phone: '6281234567890',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      murids: [],
    };
    getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          user_metadata: { role: 'wali', name: 'Auth metadata fixture' },
        },
      },
      error: null,
    });
    findUnique.mockResolvedValueOnce(dbUser);

    const response = await request(await openTestServer(app))
      .get('/api/users/me')
      .set('Authorization', 'Bearer profile-token')
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { ...dbUser, createdAt: dbUser.createdAt.toISOString() },
    });
    expect(getUser).toHaveBeenCalledExactlyOnceWith('profile-token');
    expect(findUnique).toHaveBeenCalledExactlyOnceWith({
      where: { id: dbUser.id },
      include: { murids: true },
    });
  });
});

describe('POST /api/admin/users', () => {
  it.each(['wali', 'tentor'])(
    'returns 403 for a valid body submitted by a %s without database or auth mutations',
    async (role) => {
      getUser.mockResolvedValueOnce({
        data: {
          user: {
            id: `${role}-caller`,
            email: `${role}@example.test`,
            user_metadata: { role },
          },
        },
        error: null,
      });

      const response = await request(await openTestServer(app))
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${role}-token`)
        .send({
          role: 'tentor',
          name: 'New tentor fixture',
          phone: '6281234567890',
          email: 'new-tentor@example.test',
          password: 'fixture-password',
        })
        .timeout({ response: 1000, deadline: 3000 });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        error: { code: 'FORBIDDEN', message: 'Admin access is required' },
      });
      expect(getUser).toHaveBeenCalledExactlyOnceWith(`${role}-token`);
      expect(findUnique).not.toHaveBeenCalled();
    },
  );

  it('returns 400 with real Zod validation details for an admin before database or auth mutations', async () => {
    getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'admin-caller',
          email: 'admin@example.test',
          user_metadata: { role: 'admin' },
        },
      },
      error: null,
    });

    const response = await request(await openTestServer(app))
      .post('/api/admin/users')
      .set('Authorization', 'Bearer admin-token')
      .send({
        role: 'wali',
        name: '   ',
        phone: '6281234567890',
        email: 'invalid-email',
      })
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid user data',
        details: {
          formErrors: [],
          fieldErrors: {
            name: ['Nama wajib diisi'],
            email: ['Email tidak valid'],
          },
        },
      },
    });
    expect(getUser).toHaveBeenCalledExactlyOnceWith('admin-token');
    expect(findUnique).not.toHaveBeenCalled();
  });
});
