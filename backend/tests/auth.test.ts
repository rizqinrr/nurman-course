import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getUser, findUnique, createUser, prismaCreate, openTestServer } from './setup';
import { requireAuth, requireAdmin } from '../src/middleware/auth';
import type { AuthenticatedRequest } from '../src/middleware/auth';

const app = express();

app.get('/protected', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

app.get('/admin', requireAuth, requireAdmin, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

app.get('/admin-without-auth', requireAdmin, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

afterEach(() => {
  expect(findUnique).not.toHaveBeenCalled();
  expect(createUser).not.toHaveBeenCalled();
  expect(prismaCreate).not.toHaveBeenCalled();
});

describe('requireAuth characterization', () => {
  it('returns 401 without calling the SDK when Authorization is missing', async () => {
    const response = await request(await openTestServer(app))
      .get('/protected')
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized: Missing or invalid token format',
    });
    expect(getUser).not.toHaveBeenCalled();
  });

  it.each(['Basic test-token', 'bearer test-token', 'Bearer', 'test-token'])(
    'returns 401 without calling the SDK for malformed Authorization %s',
    async (authorization) => {
      const response = await request(await openTestServer(app))
        .get('/protected')
        .set('Authorization', authorization)
        .timeout({ response: 1000, deadline: 3000 });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Unauthorized: Missing or invalid token format',
      });
      expect(getUser).not.toHaveBeenCalled();
    },
  );

  it('returns 401 when the SDK reports an error even if a user is present', async () => {
    getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'rejected-user',
          email: 'rejected@example.test',
          user_metadata: { role: 'admin' },
        },
      },
      error: { message: 'Session expired' },
    });

    const response = await request(await openTestServer(app))
      .get('/protected')
      .set('Authorization', 'Bearer expired-token')
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized: Invalid or expired session token',
    });
    expect(getUser).toHaveBeenCalledExactlyOnceWith('expired-token');
  });

  it('returns 401 when the SDK returns a null user without an error', async () => {
    getUser.mockResolvedValueOnce({ data: { user: null }, error: null });

    const response = await request(await openTestServer(app))
      .get('/protected')
      .set('Authorization', 'Bearer unknown-token')
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized: Invalid or expired session token',
    });
    expect(getUser).toHaveBeenCalledExactlyOnceWith('unknown-token');
  });

  it.each(['admin', 'tentor', 'wali'])(
    'attaches the verified identity and metadata role for %s',
    async (role) => {
      const user = {
        id: `${role}-identity`,
        email: `${role}@example.test`,
        user_metadata: { role, name: `${role} fixture` },
      };
      getUser.mockResolvedValueOnce({ data: { user }, error: null });

      const response = await request(await openTestServer(app))
        .get('/protected')
        .set('Authorization', `Bearer ${role}-token`)
        .timeout({ response: 1000, deadline: 3000 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          id: user.id,
          email: user.email,
          role,
          userMetadata: user.user_metadata,
        },
      });
      expect(getUser).toHaveBeenCalledExactlyOnceWith(`${role}-token`);
    },
  );

  it('returns 500 and logs the error when the SDK throws', async () => {
    const error = new Error('Auth SDK unavailable');
    getUser.mockRejectedValueOnce(error);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const response = await request(await openTestServer(app))
        .get('/protected')
        .set('Authorization', 'Bearer failing-token')
        .timeout({ response: 1000, deadline: 3000 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Internal server error during authentication',
      });
      expect(getUser).toHaveBeenCalledExactlyOnceWith('failing-token');
      expect(errorSpy).toHaveBeenCalledExactlyOnceWith('Auth middleware error:', error);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('characterizes the legacy wali fallback when user metadata is absent', async () => {
    const user = { id: 'legacy-user', email: 'legacy@example.test' };
    getUser.mockResolvedValueOnce({ data: { user }, error: null });

    const response = await request(await openTestServer(app))
      .get('/protected')
      .set('Authorization', 'Bearer legacy-token')
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { id: user.id, email: user.email, role: 'wali' },
    });
    expect(getUser).toHaveBeenCalledExactlyOnceWith('legacy-token');
  });

  it('keeps two successive requests isolated with distinct verified identities', async () => {
    const firstUser = {
      id: 'first-user',
      email: 'first@example.test',
      user_metadata: { role: 'admin', name: 'First fixture' },
    };
    const secondUser = {
      id: 'second-user',
      email: 'second@example.test',
      user_metadata: { role: 'wali', name: 'Second fixture' },
    };
    getUser
      .mockResolvedValueOnce({ data: { user: firstUser }, error: null })
      .mockResolvedValueOnce({ data: { user: secondUser }, error: null });

    const firstResponse = await request(await openTestServer(app))
      .get('/protected')
      .set('Authorization', 'Bearer first-token')
      .timeout({ response: 1000, deadline: 3000 });
    const secondResponse = await request(await openTestServer(app))
      .get('/protected')
      .set('Authorization', 'Bearer second-token')
      .timeout({ response: 1000, deadline: 3000 });

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toEqual({
      user: {
        id: firstUser.id,
        email: firstUser.email,
        role: 'admin',
        userMetadata: firstUser.user_metadata,
      },
    });
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body).toEqual({
      user: {
        id: secondUser.id,
        email: secondUser.email,
        role: 'wali',
        userMetadata: secondUser.user_metadata,
      },
    });
    expect(getUser).toHaveBeenCalledTimes(2);
    expect(getUser).toHaveBeenNthCalledWith(1, 'first-token');
    expect(getUser).toHaveBeenNthCalledWith(2, 'second-token');
  });
});

describe('requireAdmin characterization', () => {
  it.each(['wali', 'tentor', 'unknown-role'])(
    'returns 403 for a verified user with role %s',
    async (role) => {
      getUser.mockResolvedValueOnce({
        data: {
          user: {
            id: 'non-admin-user',
            email: 'non-admin@example.test',
            user_metadata: { role },
          },
        },
        error: null,
      });

      const response = await request(await openTestServer(app))
        .get('/admin')
        .set('Authorization', 'Bearer non-admin-token')
        .timeout({ response: 1000, deadline: 3000 });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        error: { code: 'FORBIDDEN', message: 'Admin access is required' },
      });
      expect(getUser).toHaveBeenCalledExactlyOnceWith('non-admin-token');
    },
  );

  it('allows a verified admin to reach the protected handler', async () => {
    const user = {
      id: 'admin-user',
      email: 'admin@example.test',
      user_metadata: { role: 'admin' },
    };
    getUser.mockResolvedValueOnce({ data: { user }, error: null });

    const response = await request(await openTestServer(app))
      .get('/admin')
      .set('Authorization', 'Bearer admin-token')
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: {
        id: user.id,
        email: user.email,
        role: 'admin',
        userMetadata: user.user_metadata,
      },
    });
    expect(getUser).toHaveBeenCalledExactlyOnceWith('admin-token');
  });

  it('returns 403 when req.user is absent and requireAuth is not mounted', async () => {
    const response = await request(await openTestServer(app))
      .get('/admin-without-auth')
      .timeout({ response: 1000, deadline: 3000 });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: { code: 'FORBIDDEN', message: 'Admin access is required' },
    });
    expect(getUser).not.toHaveBeenCalled();
  });
});
