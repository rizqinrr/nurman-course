import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getUser, signUp, findUnique, createUser, prismaCreate, openTestServer, authLookup, accountErrors,
  sessionFindMany, sessionFindUnique,
} from './setup';
import { app } from '../src/index';

function profileFixture() {
  return {
    id: 'profile-user', role: 'wali', active: true, name: 'Profile fixture',
    email: 'profile@example.test', phone: '6281234567890',
    createdAt: new Date('2026-01-01T00:00:00.000Z'), address: 'Fixture address', photoPath: null,
    murids: [{
      id: 'child-one', waliId: 'profile-user', name: 'Child fixture', active: true,
      birthDate: new Date('2018-02-03T00:00:00.000Z'), schoolLevel: 'SD 2',
      createdAt: new Date('2026-01-02T00:00:00.000Z'), avatarUrl: null,
      address: 'Fixture address', registeredAt: new Date('2026-01-02T00:00:00.000Z'), photoPath: null,
    }],
  };
}

function authenticate(id: string, role: string, active = true, metadataRole = role) {
  getUser.mockResolvedValueOnce({
    data: { user: { id, email: 'auth-only@example.test', user_metadata: { role: metadataRole } } },
    error: null,
  });
  findUnique.mockResolvedValueOnce({ id, role, active, email: 'db-only@example.test' });
}

function profileReads(profile: unknown, role = 'wali', error?: Error) {
  getUser.mockResolvedValueOnce({
    data: { user: { id: 'profile-user', email: 'auth-only@example.test', user_metadata: { role } } },
    error: null,
  });
  const read = async (query: unknown) => {
    if (query && typeof query === 'object' && 'select' in query) {
      expect(query).toEqual(authLookup('profile-user'));
      return { id: 'profile-user', role, active: true, email: 'profile@example.test' };
    }
    expect.soft(query).toEqual({ where: { id: 'profile-user' }, include: { murids: true } });
    if (error) throw error;
    return profile;
  };
  findUnique.mockImplementationOnce(read).mockImplementationOnce(read);
}

async function getProfile() {
  return request(await openTestServer(app)).get('/api/users/me')
    .set('Authorization', 'Bearer profile-token').timeout({ response: 1000, deadline: 3000 });
}

function expectProfileLookups(id = 'profile-user') {
  expect(getUser).toHaveBeenCalledExactlyOnceWith('profile-token');
  expect(findUnique.mock.calls).toEqual([
    [authLookup(id)],
    [{ where: { id }, include: { murids: true } }],
  ]);
}

function newUserBody() {
  return {
    role: 'tentor', name: 'New tentor fixture', phone: '6281234567890',
    email: 'new-tentor@example.test', password: 'fixture-password',
  };
}

afterEach(() => {
  expect.soft(createUser).not.toHaveBeenCalled();
  expect.soft(prismaCreate).not.toHaveBeenCalled();
});

describe('GET /api/health', () => {
  it('returns service health and an ISO timestamp without SDK or database calls', async () => {
    const response = await request(await openTestServer(app)).get('/api/health')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'nurman-course-api', timestamp: expect.any(String) });
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
    expect(getUser).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
    expect(sessionFindMany).not.toHaveBeenCalled();
    expect(sessionFindUnique).not.toHaveBeenCalled();
  });
});

describe('GET /api/users/me', () => {
  it('returns the legacy 401 without SDK or database calls when Authorization is missing', async () => {
    const response = await request(await openTestServer(app)).get('/api/users/me')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Missing or invalid token format' });
    expect(getUser).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('preserves the complete profile including murids after two bounded verified-ID lookups', async () => {
    const dbUser = profileFixture();
    profileReads(dbUser);
    const response = await getProfile();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: {
        ...dbUser, createdAt: '2026-01-01T00:00:00.000Z',
        murids: [{
          ...dbUser.murids[0], birthDate: '2018-02-03T00:00:00.000Z',
          createdAt: '2026-01-02T00:00:00.000Z', registeredAt: '2026-01-02T00:00:00.000Z',
        }],
      },
    });
    expectProfileLookups(dbUser.id);
  });

  it('returns a member profile with nullable phone from the DB-backed role', async () => {
    const dbUser = { ...profileFixture(), role: 'member', phone: null, murids: [] };
    profileReads(dbUser, 'member');
    const response = await getProfile();
    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ role: 'member', phone: null, murids: [] });
    expectProfileLookups(dbUser.id);
  });

  it('returns PROFILE_NOT_FOUND in middleware without looking up a matching email', async () => {
    getUser.mockResolvedValueOnce({
      data: { user: { id: 'unmapped-user', email: 'matching@example.test', user_metadata: { role: 'admin' } } },
      error: null,
    });
    findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    const response = await getProfile();
    expect.soft(response.status).toBe(403);
    expect.soft(response.body).toEqual(accountErrors.missing);
    expect(findUnique.mock.calls).toEqual([[authLookup('unmapped-user')]]);
  });

  it('returns PROFILE_NOT_FOUND when the profile disappears between auth and the profile read', async () => {
    profileReads(null);
    const response = await getProfile();
    expect(response.status).toBe(403);
    expect(response.body).toEqual(accountErrors.missing);
    expectProfileLookups();
  });

  it.each(['admin', 'tentor', 'wali', 'member'])('refuses a %s profile that becomes inactive on the second read', async (role) => {
    profileReads({ ...profileFixture(), role, active: false }, role);
    const response = await getProfile();
    expect(response.status).toBe(403);
    expect(response.body).toEqual(accountErrors.inactive);
    expectProfileLookups();
  });

  it.each([null, '', 'unknown-role'])('refuses a profile with invalid role %j on the second read', async (role) => {
    profileReads({ ...profileFixture(), role }, 'admin');
    const response = await getProfile();
    expect(response.status).toBe(403);
    expect(response.body).toEqual(accountErrors.role);
    expectProfileLookups();
  });

  it('prioritizes inactive over invalid role on the second profile read', async () => {
    profileReads({ ...profileFixture(), role: null, active: false }, 'admin');
    const response = await getProfile();
    expect(response.status).toBe(403);
    expect(response.body).toEqual(accountErrors.inactive);
    expectProfileLookups();
  });

  it('returns generic profile 500 and logs no raw DB details if the second read throws', async () => {
    profileReads(null, 'wali', new Error('private DB connection-string profile-token'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const response = await getProfile();
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
      expect(errorSpy.mock.calls).toEqual([[expect.any(String)]]);
      expect(JSON.stringify(errorSpy.mock.calls)).not.toMatch(/private|connection-string|profile-token|profile-user/);
      expectProfileLookups();
    } finally {
      errorSpy.mockRestore();
    }
  });
});

describe('POST /api/auth/signup', () => {
  it('creates a member via Supabase signUp without service-role escalation', async () => {
    signUp.mockResolvedValueOnce({
      data: { user: { id: 'member-1', email: 'new-member@example.test' }, session: null },
      error: null,
    });
    const response = await request(await openTestServer(app)).post('/api/auth/signup')
      .send({ name: 'New Member', email: 'new-member@example.test', password: 'strongpassword1' })
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Jika email valid, cek inbox untuk verifikasi.',
      confirmationRequired: true,
    });
    expect(signUp).toHaveBeenCalledExactlyOnceWith({
      email: 'new-member@example.test',
      password: 'strongpassword1',
      options: { data: { name: 'New Member' } },
    });
    expect(createUser).not.toHaveBeenCalled();
    expect(prismaCreate).not.toHaveBeenCalled();
  });

  it('returns the same neutral response for a duplicate email', async () => {
    signUp.mockResolvedValueOnce({ data: { user: null, session: null }, error: { message: 'User already registered' } });
    const response = await request(await openTestServer(app)).post('/api/auth/signup')
      .send({ name: 'Dup', email: 'dup@example.test', password: 'strongpassword1' })
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(202);
    expect(response.body).toEqual({ message: 'Jika email valid, cek inbox untuk verifikasi.' });
  });

  it('rejects a short password before calling Supabase', async () => {
    const response = await request(await openTestServer(app)).post('/api/auth/signup')
      .send({ name: 'Short', email: 'short@example.test', password: 'short' })
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(400);
    expect(signUp).not.toHaveBeenCalled();
  });
});

describe('member operational isolation', () => {
  it('rejects a member before reading operational sessions', async () => {
    authenticate('member-reader', 'member');
    const response = await request(await openTestServer(app)).get('/api/me/sessions')
      .set('Authorization', 'Bearer member-token')
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Access is not allowed for this role' } });
    expect(sessionFindMany).not.toHaveBeenCalled();
  });
});

describe('POST /api/admin/users', () => {
  it.each(['wali', 'tentor', 'member'])(
    'rejects a valid body from DB role %s without any mutations', async (role) => {
      authenticate(`${role}-caller`, role);
      const response = await request(await openTestServer(app)).post('/api/admin/users')
        .set('Authorization', `Bearer ${role}-token`).send(newUserBody())
        .timeout({ response: 1000, deadline: 3000 });
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
      expect(getUser).toHaveBeenCalledExactlyOnceWith(`${role}-token`);
      expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup(`${role}-caller`));
    },
  );

  it('rejects admin metadata on a DB wali before attempting an Auth user creation', async () => {
    authenticate('spoofed-admin', 'wali', true, 'admin');
    const response = await request(await openTestServer(app)).post('/api/admin/users')
      .set('Authorization', 'Bearer spoofed-admin-token').send(newUserBody())
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
    expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup('spoofed-admin'));
  });

  it.each(['admin', 'tentor', 'wali', 'member'])(
    'rejects a valid body from an inactive %s before any mutation', async (role) => {
      authenticate('inactive-caller', role, false);
      const response = await request(await openTestServer(app)).post('/api/admin/users')
        .set('Authorization', 'Bearer inactive-token').send(newUserBody())
        .timeout({ response: 1000, deadline: 3000 });
      expect(response.status).toBe(403);
      expect(response.body).toEqual(accountErrors.inactive);
      expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup('inactive-caller'));
    },
  );

  it('keeps real Zod validation errors for an active DB admin without mutations', async () => {
    authenticate('admin-caller', 'admin');
    const response = await request(await openTestServer(app)).post('/api/admin/users')
      .set('Authorization', 'Bearer admin-token')
      .send({ role: 'wali', name: '   ', phone: '6281234567890', email: 'invalid-email' })
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_ERROR', message: 'Invalid user data',
        details: {
          formErrors: [], fieldErrors: { name: ['Nama wajib diisi'], email: ['Email tidak valid'] },
        },
      },
    });
    expect(getUser).toHaveBeenCalledExactlyOnceWith('admin-token');
    expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup('admin-caller'));
  });
});

describe('DB-role ownership on existing session routes', () => {
  it.each(['tentor', 'wali', 'admin'])('scopes session reads to the verified DB role %s', async (role) => {
    const id = `${role}-reader`;
    authenticate(id, role, true, role === 'admin' ? 'wali' : 'admin');
    const startsAt = new Date('2026-09-16T08:00:00.000Z');
    const endsAt = new Date('2026-09-16T09:00:00.000Z');
    const session = {
      id: 'owned-session', programId: 'program-one', muridId: 'child-one',
      tentorId: role === 'tentor' ? id : 'assigned-tentor', startsAt, endsAt,
      location: null, status: 'scheduled', dailyReport: null,
      program: { id: 'program-one', name: 'Fixture program' },
      murid: { ...profileFixture().murids[0], waliId: role === 'wali' ? id : 'profile-user' },
      tentor: { id: role === 'tentor' ? id : 'assigned-tentor', name: 'Assigned tentor' },
    };
    sessionFindMany.mockResolvedValueOnce([session]);
    const response = await request(await openTestServer(app)).get('/api/me/sessions')
      .set('Authorization', 'Bearer session-token').timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ sessions: JSON.parse(JSON.stringify([session])) });
    expect(sessionFindMany).toHaveBeenCalledExactlyOnceWith({
      ...(role === 'tentor' ? { where: { tentorId: id } }
        : role === 'wali' ? { where: { murid: { waliId: id } } } : {}),
      include: { program: true, murid: true, dailyReport: true, tentor: { select: { id: true, name: true } } },
      orderBy: { startsAt: 'asc' },
    });
    expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup(id));
    expect(getUser).toHaveBeenCalledExactlyOnceWith('session-token');
    expect(sessionFindUnique).not.toHaveBeenCalled();
  });

  it('preserves an empty session list for a DB wali without broadening ownership', async () => {
    authenticate('empty-wali', 'wali');
    sessionFindMany.mockResolvedValueOnce([]);
    const response = await request(await openTestServer(app)).get('/api/me/sessions')
      .set('Authorization', 'Bearer empty-token').timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ sessions: [] });
    expect(sessionFindMany).toHaveBeenCalledExactlyOnceWith({
      where: { murid: { waliId: 'empty-wali' } },
      include: { program: true, murid: true, dailyReport: true, tentor: { select: { id: true, name: true } } },
      orderBy: { startsAt: 'asc' },
    });
    expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup('empty-wali'));
  });

  it('refuses a tentor report for another tentor session before any write', async () => {
    authenticate('report-tentor', 'tentor');
    sessionFindUnique.mockResolvedValueOnce({
      id: 'foreign-session', tentorId: 'other-tentor', muridId: 'other-child',
      programId: 'program-one', startsAt: new Date('2026-09-16T08:00:00.000Z'),
      endsAt: new Date('2026-09-16T09:00:00.000Z'), location: null, status: 'scheduled',
    });
    const response = await request(await openTestServer(app)).post('/api/daily-reports')
      .set('Authorization', 'Bearer report-token')
      .send({ sessionId: 'foreign-session', activity: 'Belajar membaca', notes: 'Fixture notes' })
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Forbidden: You are not the tentor for this session' });
    expect(sessionFindUnique).toHaveBeenCalledExactlyOnceWith({ where: { id: 'foreign-session' } });
    expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup('report-tentor'));
    expect(sessionFindMany).not.toHaveBeenCalled();
  });

  it('refuses a tentor report when the session has no assigned tentor before any write', async () => {
    authenticate('report-tentor', 'tentor');
    sessionFindUnique.mockResolvedValueOnce({
      id: 'unassigned-session', tentorId: null, muridId: 'child-one',
      programId: 'program-one', startsAt: new Date('2026-09-16T08:00:00.000Z'),
      endsAt: new Date('2026-09-16T09:00:00.000Z'), location: null, status: 'scheduled',
    });
    const response = await request(await openTestServer(app)).post('/api/daily-reports')
      .set('Authorization', 'Bearer report-token')
      .send({ sessionId: 'unassigned-session', activity: 'Belajar membaca', notes: '' })
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Forbidden: You are not the tentor for this session' });
    expect(sessionFindUnique).toHaveBeenCalledExactlyOnceWith({ where: { id: 'unassigned-session' } });
    expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup('report-tentor'));
    expect(getUser).toHaveBeenCalledExactlyOnceWith('report-token');
    expect(sessionFindMany).not.toHaveBeenCalled();
  });

  it('rejects a DB wali claiming tentor metadata before reading a report session', async () => {
    authenticate('report-wali', 'wali', true, 'tentor');
    sessionFindUnique.mockResolvedValueOnce({ id: 'foreign-session', tentorId: 'other-tentor' });
    const response = await request(await openTestServer(app)).post('/api/daily-reports')
      .set('Authorization', 'Bearer spoofed-token')
      .send({ sessionId: 'foreign-session', activity: 'Belajar membaca', notes: '' })
      .timeout({ response: 1000, deadline: 3000 });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Forbidden: Only tentor can write reports' });
    expect(sessionFindUnique).not.toHaveBeenCalled();
    expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup('report-wali'));
  });
});
