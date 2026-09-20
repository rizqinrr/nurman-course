import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getUser, findUnique, createUser, prismaCreate, openTestServer, authLookup, accountErrors,
} from './setup';
import { requireAuth, requireAdmin, requireRole } from '../src/middleware/auth';
import type { AuthenticatedRequest } from '../src/middleware/auth';
import type { UserRole } from '@nurman-course/shared';

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

async function get(path = '/protected', token = 'test-token') {
  return request(await openTestServer(app)).get(path)
    .set('Authorization', `Bearer ${token}`)
    .timeout({ response: 1000, deadline: 3000 });
}

function verifiedUser(id: string, metadataRole?: string) {
  return {
    id,
    email: 'auth-email@example.test',
    user_metadata: metadataRole === undefined ? undefined : { role: metadataRole, privateNote: 'metadata-only' },
    app_metadata: { role: 'admin' },
  };
}

function account(id: string, role: string | null = 'wali', active = true) {
  return { id, email: `${id}@example.test`, role, active };
}

function authenticate(dbUser: ReturnType<typeof account> | null, metadataRole?: string, id = dbUser?.id ?? 'missing-user') {
  getUser.mockResolvedValueOnce({ data: { user: verifiedUser(id, metadataRole) }, error: null });
  findUnique.mockResolvedValueOnce(dbUser);
}

function expectLookup(id: string) {
  expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup(id));
}

afterEach(() => {
  expect.soft(createUser).not.toHaveBeenCalled();
  expect.soft(prismaCreate).not.toHaveBeenCalled();
});

describe('requireAuth token validation and dependency failures', () => {
  it.each(['Bearer ', 'Bearer  token', 'Bearer token extra', 'Bearer token\textra', 'Bearer \ttoken'])(
    'rejects non-single-token Authorization %j before SDK verification', async (authorization) => {
      getUser.mockResolvedValueOnce({ data: { user: null }, error: { status: 401 } });
      const response = await request(await openTestServer(app)).get('/protected')
        .set('Authorization', authorization).timeout({ response: 1000, deadline: 3000 });
      expect.soft(response.status).toBe(401);
      expect.soft(response.body).toEqual({ error: 'Unauthorized: Missing or invalid token format' });
      expect(getUser).not.toHaveBeenCalled();
      expect(findUnique).not.toHaveBeenCalled();
    },
  );

  it.each([400, 401, 403])('returns the legacy 401 for SDK credential status %s even with a user', async (status) => {
    getUser.mockResolvedValueOnce({
      data: { user: verifiedUser('rejected-user', 'admin') },
      error: { status, message: 'private SDK credential detail' },
    });
    const response = await get('/admin', 'expired-token');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Invalid or expired session token' });
    expect(getUser).toHaveBeenCalledExactlyOnceWith('expired-token');
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('returns the legacy 401 when the SDK returns no user and no error', async () => {
    getUser.mockResolvedValueOnce({ data: { user: null }, error: null });
    const response = await get();
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Invalid or expired session token' });
    expect(getUser).toHaveBeenCalledExactlyOnceWith('test-token');
    expect(findUnique).not.toHaveBeenCalled();
  });

  it.each([429, 500, 503, 0, undefined])('returns generic 500 for SDK upstream status %s even with a user', async (status) => {
    getUser.mockResolvedValueOnce({
      data: { user: verifiedUser('upstream-user', 'admin') },
      error: { ...(status === undefined ? {} : { status }), message: 'private upstream detail' },
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const response = await get();
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error during authentication' });
      expect(errorSpy.mock.calls).toEqual([[expect.any(String)]]);
      expect(JSON.stringify(errorSpy.mock.calls)).not.toMatch(/private|upstream-user|test-token|auth-email/);
      expect(getUser).toHaveBeenCalledExactlyOnceWith('test-token');
      expect(findUnique).not.toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('returns generic 500 without raw details when SDK verification throws', async () => {
    getUser.mockRejectedValueOnce(Object.assign(new Error('private SDK exception test-token'), { status: 401 }));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const response = await get();
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error during authentication' });
      expect(errorSpy.mock.calls).toEqual([[expect.any(String)]]);
      expect(JSON.stringify(errorSpy.mock.calls)).not.toMatch(/private|test-token/);
      expect(findUnique).not.toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('returns generic 500 without identity or raw details when the auth DB lookup throws', async () => {
    getUser.mockResolvedValueOnce({ data: { user: verifiedUser('db-error-user', 'admin') }, error: null });
    findUnique.mockRejectedValueOnce(new Error('private database credential connection-string'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const response = await get('/admin');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error during authentication' });
      expect(errorSpy.mock.calls).toEqual([[expect.any(String)]]);
      expect(JSON.stringify(errorSpy.mock.calls)).not.toMatch(/private|connection-string|db-error-user/);
      expectLookup('db-error-user');
    } finally {
      errorSpy.mockRestore();
    }
  });
});

describe('requireAuth DB identity', () => {
  it('returns the legacy 401 without SDK or DB calls when Authorization is absent', async () => {
    const response = await request(await openTestServer(app)).get('/protected')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Missing or invalid token format' });
    expect(getUser).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it.each(['Basic test-token', 'bearer test-token', 'Bearer', 'test-token'])(
    'rejects malformed Authorization %s before calling the SDK', async (authorization) => {
      const response = await request(await openTestServer(app)).get('/protected')
        .set('Authorization', authorization).timeout({ response: 1000, deadline: 3000 });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized: Missing or invalid token format' });
      expect(getUser).not.toHaveBeenCalled();
      expect(findUnique).not.toHaveBeenCalled();
    },
  );

  it.each(['admin', 'tentor', 'wali'])(
    'attaches only the verified ID and DB email and role for %s without metadata', async (role) => {
      const dbUser = account(`${role}-identity`, role);
      authenticate(dbUser);
      const response = await get();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: { id: dbUser.id, email: dbUser.email, role } });
      expect(getUser).toHaveBeenCalledExactlyOnceWith('test-token');
      expectLookup(dbUser.id);
    },
  );

  it.each([null, ''])('omits an empty DB email %j rather than falling back to the Auth email', async (email) => {
    const dbUser = { ...account('empty-email'), email };
    getUser.mockResolvedValueOnce({ data: { user: verifiedUser(dbUser.id, 'wali') }, error: null });
    findUnique.mockResolvedValueOnce(dbUser);
    const response = await get();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { id: dbUser.id, role: 'wali' } });
    expectLookup(dbUser.id);
  });

  it('strips metadata and DB-only fields from the request identity', async () => {
    const dbUser = account('minimal-identity', 'admin');
    authenticate(dbUser, 'admin');
    const response = await get();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { id: dbUser.id, email: dbUser.email, role: 'admin' } });
    expectLookup(dbUser.id);
  });

  it('returns PROFILE_NOT_FOUND before other account checks without creating a fallback wali', async () => {
    authenticate(null);
    const response = await get();
    expect(response.status).toBe(403);
    expect(response.body).toEqual(accountErrors.missing);
    expectLookup('missing-user');
  });

  it.each(['admin', 'tentor', 'wali'])('rejects inactive %s accounts before reaching the handler', async (role) => {
    authenticate(account('inactive-user', role, false), role);
    const response = await get();
    expect(response.status).toBe(403);
    expect(response.body).toEqual(accountErrors.inactive);
    expectLookup('inactive-user');
  });

  it('prioritizes inactive over invalid role when both checks fail', async () => {
    authenticate(account('inactive-invalid', null, false), 'admin');
    const response = await get();
    expect(response.status).toBe(403);
    expect(response.body).toEqual(accountErrors.inactive);
    expectLookup('inactive-invalid');
  });

  it.each([null, '', 'unknown-role', 'ADMIN', ' admin ', undefined])('rejects invalid DB role %j without a wali fallback', async (role) => {
    const dbUser = { ...account('invalid-role'), role };
    getUser.mockResolvedValueOnce({ data: { user: verifiedUser(dbUser.id, 'admin') }, error: null });
    findUnique.mockResolvedValueOnce(dbUser);
    const response = await get();
    expect(response.status).toBe(403);
    expect(response.body).toEqual(accountErrors.role);
    expectLookup(dbUser.id);
  });

  it('refuses metadata admin when the DB role is wali', async () => {
    authenticate(account('db-wali', 'wali'), 'admin');
    const response = await get('/admin');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
    expectLookup('db-wali');
  });

  it('allows metadata wali when the DB role is admin', async () => {
    const dbUser = account('db-admin', 'admin');
    authenticate(dbUser, 'wali');
    const response = await get('/admin');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { id: dbUser.id, email: dbUser.email, role: 'admin' } });
    expectLookup(dbUser.id);
  });
});

describe('requireAuth request isolation', () => {
  it.each([
    { firstRole: 'admin', secondRole: 'wali', firstStatus: 200, secondStatus: 403 },
    { firstRole: 'wali', secondRole: 'admin', firstStatus: 403, secondStatus: 200 },
  ])(
    'uses a changed DB role from $firstRole to $secondRole with the SAME token', async ({ firstRole, secondRole, firstStatus, secondStatus }) => {
      const id = 'changing-role';
      authenticate(account(id, firstRole), firstRole);
      authenticate(account(id, secondRole), firstRole);
      const first = await get('/admin', 'same-token');
      const second = await get('/admin', 'same-token');
      expect(first.status).toBe(firstStatus);
      expect(second.status).toBe(secondStatus);
      const denied = firstStatus === 403 ? first : second;
      expect(denied.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
      expect(getUser.mock.calls).toEqual([['same-token'], ['same-token']]);
      expect(findUnique.mock.calls).toEqual([[authLookup(id)], [authLookup(id)]]);
    },
  );

  it('denies the second request when active changes despite using the SAME token', async () => {
    authenticate(account('deactivated-user', 'admin'), 'admin');
    authenticate(account('deactivated-user', 'admin', false), 'admin');
    const first = await get('/admin', 'same-token');
    const second = await get('/admin', 'same-token');
    expect(first.status).toBe(200);
    expect(second.status).toBe(403);
    expect(second.body).toEqual(accountErrors.inactive);
    expect(getUser.mock.calls).toEqual([['same-token'], ['same-token']]);
    expect(findUnique.mock.calls).toEqual([[authLookup('deactivated-user')], [authLookup('deactivated-user')]]);
  });

  it('keeps successive verified users isolated even when metadata is identical', async () => {
    authenticate(account('first-user', 'admin'), 'admin');
    authenticate(account('second-user', 'tentor'), 'admin');
    const first = await get('/protected', 'first-token');
    const second = await get('/protected', 'second-token');
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.body).toEqual({ user: { id: 'first-user', email: 'first-user@example.test', role: 'admin' } });
    expect(second.body).toEqual({ user: { id: 'second-user', email: 'second-user@example.test', role: 'tentor' } });
    expect(getUser.mock.calls).toEqual([['first-token'], ['second-token']]);
    expect(findUnique.mock.calls).toEqual([[authLookup('first-user')], [authLookup('second-user')]]);
  });

  it('does not reuse a previous admin identity after SDK verification fails', async () => {
    authenticate(account('previous-admin', 'admin'), 'admin');
    getUser.mockResolvedValueOnce({ data: { user: null }, error: { status: 401 } });
    const first = await get('/admin', 'first-token');
    const second = await get('/admin', 'second-token');
    expect(first.status).toBe(200);
    expect(second.status).toBe(401);
    expect(second.body).toEqual({ error: 'Unauthorized: Invalid or expired session token' });
    expectLookup('previous-admin');
  });

  it('does not mix identities when SDK responses complete out of order', async () => {
    const firstUser = verifiedUser('slow-user', 'admin');
    let resolveFirst!: (value: { data: { user: typeof firstUser }; error: null }) => void;
    let started!: () => void;
    const startedPromise = new Promise<void>((resolve) => { started = resolve; });
    const firstResult = new Promise<{ data: { user: typeof firstUser }; error: null }>((resolve) => { resolveFirst = resolve; });
    getUser.mockImplementationOnce(async () => { started(); return firstResult; });
    getUser.mockResolvedValueOnce({ data: { user: verifiedUser('fast-user', 'admin') }, error: null });
    findUnique.mockResolvedValueOnce(account('fast-user', 'wali'))
      .mockResolvedValueOnce(account('slow-user', 'admin'));
    const firstPromise = get('/protected', 'slow-token');
    await startedPromise;
    const second = await get('/protected', 'fast-token');
    resolveFirst({ data: { user: firstUser }, error: null });
    const first = await firstPromise;
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.body).toEqual({ user: { id: 'slow-user', email: 'slow-user@example.test', role: 'admin' } });
    expect(second.body).toEqual({ user: { id: 'fast-user', email: 'fast-user@example.test', role: 'wali' } });
    expect(findUnique.mock.calls).toEqual([[authLookup('fast-user')], [authLookup('slow-user')]]);
  });
});

async function requestWithRole(roles: UserRole[], role?: UserRole) {
  const guard: express.RequestHandler = requireRole(...roles);
  const roleApp = express();
  roleApp.get('/role', (req: AuthenticatedRequest, _res, next) => {
    if (role !== undefined) req.user = { id: 'role-user', email: 'role@example.test', role };
    next();
  }, guard, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });
  const response = await request(await openTestServer(roleApp)).get('/role')
    .timeout({ response: 1000, deadline: 3000 });
  expect(getUser).not.toHaveBeenCalled();
  expect(findUnique).not.toHaveBeenCalled();
  return response;
}

describe('requireRole allowlist', () => {
  it.each<{ roles: UserRole[]; role: UserRole }>([
    { roles: ['admin'], role: 'admin' },
    { roles: ['admin', 'tentor'], role: 'admin' },
    { roles: ['admin', 'tentor'], role: 'tentor' },
    { roles: ['tentor'], role: 'tentor' },
  ])('allows $role in $roles without altering the identity', async ({ roles, role }) => {
    const response = await requestWithRole(roles, role);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: { id: 'role-user', email: 'role@example.test', role } });
  });

  it.each<UserRole>(['wali', 'tentor'])('preserves the legacy admin-only denial for %s', async (role) => {
    const response = await requestWithRole(['admin'], role);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
  });

  it('denies wali access to the admin and tentor allowlist', async () => {
    const response = await requestWithRole(['admin', 'tentor'], 'wali');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Access is not allowed for this role' } });
  });

  it('denies wali access to a tentor-only allowlist', async () => {
    const response = await requestWithRole(['tentor'], 'wali');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Access is not allowed for this role' } });
  });

  it('does not grant admins an implicit bypass of a tentor-only allowlist', async () => {
    const response = await requestWithRole(['tentor'], 'admin');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Access is not allowed for this role' } });
  });

  it.each<{ roles: UserRole[]; message: string }>([
    { roles: ['admin'], message: 'Admin access is required' },
    { roles: ['admin', 'tentor'], message: 'Access is not allowed for this role' },
  ])('denies an absent req.user for $roles', async ({ roles, message }) => {
    const response = await requestWithRole(roles);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message } });
  });

  it.each<UserRole | undefined>(['admin', 'tentor', 'wali', undefined])(
    'denies %s when the allowlist is empty', async (role) => {
      const response = await requestWithRole([], role);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Access is not allowed for this role' } });
    },
  );
});

describe('requireAdmin compatibility', () => {
  it.each(['wali', 'tentor'])('preserves FORBIDDEN for DB role %s', async (role) => {
    authenticate(account('non-admin', role), role);
    const response = await get('/admin');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
    expectLookup('non-admin');
  });

  it('refuses a request with no user when requireAuth is not mounted', async () => {
    const response = await request(await openTestServer(app)).get('/admin-without-auth')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
    expect(getUser).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
  });
});
