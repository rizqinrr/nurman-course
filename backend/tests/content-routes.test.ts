import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import {
  getUser, findUnique, openTestServer, authLookup,
  programFindMany, programFindUnique, programCreate, programUpdate, programDelete, programCount,
  roadmapStepFindMany, roadmapStepFindFirst, roadmapStepFindUnique, roadmapStepCreate,
  roadmapStepUpdate, roadmapStepDelete,
  materialFindMany, materialFindFirst, materialFindUnique, materialCreate, materialUpdate, materialDelete, transaction,
} from './setup';
import { app } from '../src/index';

const TIMEOUT = { response: 1000, deadline: 3000 };

function authenticate(id: string, role: string, active = true, metadataRole = role) {
  getUser.mockResolvedValueOnce({
    data: { user: { id, email: 'auth-only@example.test', user_metadata: { role: metadataRole } } },
    error: null,
  });
  findUnique.mockResolvedValueOnce({ id, role, active, email: 'db-only@example.test' });
}

function asAdmin(id = 'admin-caller') {
  authenticate(id, 'admin');
}

async function adminAgent() {
  const server = await openTestServer(app);
  const withAuth = (test: request.Test) =>
    test.set('Authorization', 'Bearer admin-token').timeout(TIMEOUT);
  return {
    get: (url: string) => withAuth(request(server).get(url)),
    post: (url: string) => withAuth(request(server).post(url)),
    patch: (url: string) => withAuth(request(server).patch(url)),
    delete: (url: string) => withAuth(request(server).delete(url)),
  };
}

function anonAgent() {
  return openTestServer(app).then((server) => ({
    get: (url: string) => request(server).get(url).timeout(TIMEOUT),
    post: (url: string) => request(server).post(url).timeout(TIMEOUT),
    patch: (url: string) => request(server).patch(url).timeout(TIMEOUT),
    delete: (url: string) => request(server).delete(url).timeout(TIMEOUT),
  }));
}

const programFixture = {
  id: 'program-one', slug: 'komputer-dasar', name: 'Komputer Dasar', description: 'Deskripsi program',
  category: 'materi', basePrice: 35000, sessionsPerBlock: 12, active: true, hasRoadmap: true,
};

const stepFixture = {
  id: 'step-one', programId: 'program-one', order: 0, title: 'Langkah pertama',
  bodyText: 'Konten langkah', level: 'L1',
};

const materialFixture = {
  id: 'material-one', roadmapStepId: 'step-one', order: 0,
  title: 'Materi pertama', bodyText: 'Konten materi', sessionId: null,
};

function validationFailure(message: string) {
  return {
    error: {
      code: 'VALIDATION_ERROR',
      message,
      details: { formErrors: expect.any(Array), fieldErrors: expect.any(Object) },
    },
  };
}

describe('public program catalog contract', () => {
  it('lists only active programs with ordered roadmap steps', async () => {
    programFindMany.mockResolvedValueOnce([programFixture]);
    const anon = await anonAgent();
    const response = await anon.get('/api/programs');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ programs: [programFixture] });
    expect(programFindMany).toHaveBeenCalledExactlyOnceWith({
      where: { active: true },
      include: { roadmapSteps: { orderBy: { order: 'asc' } } },
    });
    expect(getUser).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('keeps the legacy { program } envelope on the public detail route', async () => {
    programFindUnique.mockResolvedValueOnce({ ...programFixture, roadmapSteps: [stepFixture] });
    const anon = await anonAgent();
    const response = await anon.get('/api/programs/program-one');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ program: { ...programFixture, roadmapSteps: [stepFixture] } });
    expect(programFindUnique).toHaveBeenCalledExactlyOnceWith({
      where: { id: 'program-one' },
      include: { roadmapSteps: { orderBy: { order: 'asc' } } },
    });
  });

  it('returns the legacy 404 body for an unknown public program', async () => {
    programFindUnique.mockResolvedValueOnce(null);
    const anon = await anonAgent();
    const response = await anon.get('/api/programs/missing');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Program not found' });
  });

  it('returns a generic public 500 without leaking database details', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      programFindMany.mockRejectedValueOnce(new Error('secret connection-string'));
      const anon = await anonAgent();
      const response = await anon.get('/api/programs');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
      expect(JSON.stringify(errorSpy.mock.calls)).not.toMatch(/secret|connection-string/);
    } finally {
      errorSpy.mockRestore();
    }
  });
});

describe('admin content guard', () => {
  it.each([
    ['get', '/api/admin/programs'],
    ['post', '/api/admin/programs'],
    ['get', '/api/admin/programs/program-one/roadmap'],
    ['get', '/api/admin/roadmap-steps/step-one/materials'],
    ['patch', '/api/admin/roadmap-steps/step-one'],
    ['delete', '/api/admin/material-items/material-one'],
  ] as const)('rejects %s %s without a token and without touching the SDK', async (method, url) => {
    const anon = await anonAgent();
    const response = await anon[method](url);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized: Missing or invalid token format' });
    expect(getUser).not.toHaveBeenCalled();
    expect(findUnique).not.toHaveBeenCalled();
    expect(programFindMany).not.toHaveBeenCalled();
    expect(roadmapStepFindMany).not.toHaveBeenCalled();
    expect(materialFindMany).not.toHaveBeenCalled();
  });

  it.each(['tentor', 'wali'])('refuses DB role %s on a content mutation path', async (role) => {
    authenticate(`${role}-caller`, role);
    const admin = await adminAgent();
    const response = await admin.post('/api/admin/programs').send(programFixture);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
    expect(findUnique).toHaveBeenCalledExactlyOnceWith(authLookup(`${role}-caller`));
    expect(programCreate).not.toHaveBeenCalled();
  });

  it('refuses metadata admin when the DB role is wali before any content query', async () => {
    authenticate('spoofed-admin', 'wali', true, 'admin');
    const admin = await adminAgent();
    const response = await admin.get('/api/admin/programs');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN', message: 'Admin access is required' } });
    expect(programFindMany).not.toHaveBeenCalled();
    expect(programCount).not.toHaveBeenCalled();
  });
});

describe('admin program CRUD contract', () => {
  it('paginates admin programs with the existing filter mapping', async () => {
    asAdmin();
    programFindMany.mockResolvedValueOnce([programFixture]);
    programCount.mockResolvedValueOnce(11);
    const admin = await adminAgent();
    const response = await admin.get('/api/admin/programs?page=2&limit=5&search=dasar&category=materi&active=false');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [programFixture],
      pagination: { page: 2, limit: 5, totalItems: 11, totalPages: 3 },
    });
    const where = {
      OR: [
        { name: { contains: 'dasar', mode: 'insensitive' } },
        { slug: { contains: 'dasar', mode: 'insensitive' } },
      ],
      category: 'materi',
      active: false,
    };
    expect(programFindMany).toHaveBeenCalledExactlyOnceWith({
      where,
      include: { _count: { select: { roadmapSteps: true, enrollments: true, sessions: true } } },
      orderBy: { name: 'asc' },
      skip: 5,
      take: 5,
    });
    expect(programCount).toHaveBeenCalledExactlyOnceWith({ where });
    expect(transaction).toHaveBeenCalledTimes(1);
  });

  it('clamps pagination bounds and treats any non-true active filter as inactive', async () => {
    asAdmin();
    programFindMany.mockResolvedValueOnce([]);
    programCount.mockResolvedValueOnce(0);
    const admin = await adminAgent();
    const response = await admin.get('/api/admin/programs?page=-3&limit=999&active=anything');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [], pagination: { page: 1, limit: 100, totalItems: 0, totalPages: 0 },
    });
    expect(programFindMany).toHaveBeenCalledExactlyOnceWith({
      where: { active: false },
      include: { _count: { select: { roadmapSteps: true, enrollments: true, sessions: true } } },
      orderBy: { name: 'asc' },
      skip: 0,
      take: 100,
    });
  });

  it('keeps the admin detail envelope', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce({
      ...programFixture, roadmapSteps: [stepFixture], _count: { enrollments: 1, sessions: 2 },
    });
    const admin = await adminAgent();
    const found = await admin.get('/api/admin/programs/program-one');
    expect(found.status).toBe(200);
    expect(found.body.data).toMatchObject({ id: 'program-one' });
    expect(programFindUnique).toHaveBeenCalledExactlyOnceWith({
      where: { id: 'program-one' },
      include: {
        roadmapSteps: { orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true, sessions: true } },
      },
    });
  });

  it('returns the admin 404 envelope for an unknown program', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce(null);
    const admin = await adminAgent();
    const missing = await admin.get('/api/admin/programs/missing');
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
  });

  it('creates an admin program with schema defaults', async () => {
    asAdmin();
    programCreate.mockResolvedValueOnce(programFixture);
    const admin = await adminAgent();
    const created = await admin.post('/api/admin/programs').send({
      slug: 'komputer-dasar', name: 'Komputer Dasar', description: 'Deskripsi program', category: 'materi',
    });
    expect(created.status).toBe(201);
    expect(created.body).toEqual({ data: programFixture });
    expect(programCreate).toHaveBeenCalledExactlyOnceWith({
      data: {
        slug: 'komputer-dasar', name: 'Komputer Dasar', description: 'Deskripsi program', category: 'materi',
        sessionsPerBlock: 12, active: true, hasRoadmap: false,
      },
    });
  });

  it('maps a duplicate program slug to 409', async () => {
    asAdmin();
    programCreate.mockRejectedValueOnce(Object.assign(new Error('unique'), { code: 'P2002' }));
    const admin = await adminAgent();
    const conflict = await admin.post('/api/admin/programs').send({
      slug: 'komputer-dasar', name: 'Komputer Dasar', description: 'Deskripsi program', category: 'materi',
    });
    expect(conflict.status).toBe(409);
    expect(conflict.body).toEqual({ error: { code: 'CONFLICT', message: 'Program slug already exists' } });
  });

  it('rejects an invalid admin program body before touching the database', async () => {
    asAdmin();
    const admin = await adminAgent();
    const response = await admin.post('/api/admin/programs').send({ slug: 'Bad Slug' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(validationFailure('Invalid program data'));
    expect(programCreate).not.toHaveBeenCalled();
  });

  it('requires at least one field on admin PATCH', async () => {
    asAdmin();
    const admin = await adminAgent();
    const empty = await admin.patch('/api/admin/programs/program-one').send({});
    expect(empty.status).toBe(400);
    expect(empty.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' },
    });
    expect(programUpdate).not.toHaveBeenCalled();
  });

  it('maps missing and duplicate program updates to 404 and 409', async () => {
    asAdmin();
    programUpdate.mockRejectedValueOnce(Object.assign(new Error('missing'), { code: 'P2025' }));
    const admin = await adminAgent();
    const missing = await admin.patch('/api/admin/programs/missing').send({ name: 'Baru' });
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Program not found' } });

    asAdmin();
    programUpdate.mockRejectedValueOnce(Object.assign(new Error('unique'), { code: 'P2002' }));
    const conflict = await admin.patch('/api/admin/programs/program-one').send({ slug: 'other' });
    expect(conflict.status).toBe(409);
    expect(conflict.body).toEqual({ error: { code: 'CONFLICT', message: 'Program slug already exists' } });
  });

  it('hard-deletes a program without related records', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce({ ...programFixture, _count: { enrollments: 0, sessions: 0 } });
    programDelete.mockResolvedValueOnce(programFixture);
    const admin = await adminAgent();
    const hard = await admin.delete('/api/admin/programs/program-one');
    expect(hard.status).toBe(204);
    expect(programDelete).toHaveBeenCalledExactlyOnceWith({ where: { id: 'program-one' } });
    expect(programUpdate).not.toHaveBeenCalled();
  });

  it('soft-deactivates a program that still has relations', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce({ ...programFixture, _count: { enrollments: 1, sessions: 0 } });
    programUpdate.mockResolvedValueOnce({ ...programFixture, active: false });
    const admin = await adminAgent();
    const soft = await admin.delete('/api/admin/programs/program-one');
    expect(soft.status).toBe(200);
    expect(soft.body).toEqual({ data: { ...programFixture, active: false }, deactivated: true });
    expect(programUpdate).toHaveBeenCalledExactlyOnceWith({
      where: { id: 'program-one' },
      data: { active: false },
    });
    expect(programDelete).not.toHaveBeenCalled();
  });
});

describe('admin roadmap step contract', () => {
  it('lists ordered steps of an existing program', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce(programFixture);
    roadmapStepFindMany.mockResolvedValueOnce([stepFixture]);
    const admin = await adminAgent();
    const found = await admin.get('/api/admin/programs/program-one/roadmap');
    expect(found.status).toBe(200);
    expect(found.body).toEqual({ data: [stepFixture] });
    expect(roadmapStepFindMany).toHaveBeenCalledExactlyOnceWith({
      where: { programId: 'program-one' },
      orderBy: { order: 'asc' },
    });
  });

  it('404s a roadmap list for an unknown program without reading steps', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce(null);
    const admin = await adminAgent();
    const missing = await admin.get('/api/admin/programs/missing/roadmap');
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Program tidak ditemukan' } });
    expect(roadmapStepFindMany).not.toHaveBeenCalled();
  });

  it('creates a step with order after the current maximum when order is omitted', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce(programFixture);
    roadmapStepFindFirst.mockResolvedValueOnce(null);
    roadmapStepCreate.mockResolvedValueOnce(stepFixture);
    const admin = await adminAgent();
    const first = await admin.post('/api/admin/programs/program-one/roadmap')
      .send({ title: 'Langkah pertama', bodyText: 'Konten langkah' });
    expect(first.status).toBe(201);
    expect(first.body).toEqual({ data: stepFixture });
    expect(roadmapStepFindFirst).toHaveBeenCalledExactlyOnceWith({
      where: { programId: 'program-one' },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    expect(roadmapStepCreate).toHaveBeenCalledExactlyOnceWith({
      data: {
        programId: 'program-one', order: 0, title: 'Langkah pertama',
        bodyText: 'Konten langkah', level: undefined,
      },
    });
  });

  it('appends after the existing maximum order and keeps an explicit level', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce(programFixture);
    roadmapStepFindFirst.mockResolvedValueOnce({ order: 4 });
    roadmapStepCreate.mockResolvedValueOnce({ ...stepFixture, order: 5 });
    const admin = await adminAgent();
    const next = await admin.post('/api/admin/programs/program-one/roadmap')
      .send({ title: 'Langkah berikutnya', bodyText: 'Konten langkah', level: 'L2' });
    expect(next.status).toBe(201);
    expect(roadmapStepCreate).toHaveBeenCalledExactlyOnceWith({
      data: {
        programId: 'program-one', order: 5, title: 'Langkah berikutnya',
        bodyText: 'Konten langkah', level: 'L2',
      },
    });
  });

  it('refuses a roadmap step for a program without a roadmap', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce({ ...programFixture, hasRoadmap: false });
    const admin = await adminAgent();
    const response = await admin.post('/api/admin/programs/program-one/roadmap')
      .send({ title: 'Langkah', bodyText: 'Konten' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' },
    });
    expect(roadmapStepCreate).not.toHaveBeenCalled();
  });

  it('404s a roadmap step creation for an unknown program', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce(null);
    const admin = await adminAgent();
    const response = await admin.post('/api/admin/programs/missing/roadmap')
      .send({ title: 'Langkah', bodyText: 'Konten' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Program tidak ditemukan' } });
    expect(roadmapStepCreate).not.toHaveBeenCalled();
  });

  it('reorders step IDs in the requested order through one transaction', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce({
      ...programFixture, roadmapSteps: [{ id: 'step-a' }, { id: 'step-b' }],
    });
    roadmapStepUpdate.mockResolvedValue({});
    roadmapStepFindMany.mockResolvedValueOnce([
      { ...stepFixture, id: 'step-b', order: 0 },
      { ...stepFixture, id: 'step-a', order: 1 },
    ]);
    const admin = await adminAgent();
    const reordered = await admin.post('/api/admin/programs/program-one/roadmap/reorder')
      .send({ stepIds: ['step-b', 'step-a'] });
    expect(reordered.status).toBe(200);
    expect(reordered.body.data.map((step: { id: string }) => step.id)).toEqual(['step-b', 'step-a']);
    expect(roadmapStepUpdate.mock.calls).toEqual([
      [{ where: { id: 'step-b' }, data: { order: 0 } }],
      [{ where: { id: 'step-a' }, data: { order: 1 } }],
    ]);
    expect(transaction).toHaveBeenCalledTimes(1);
  });

  it('rejects a malformed step reorder payload without any update', async () => {
    asAdmin();
    const admin = await adminAgent();
    const badInput = await admin.post('/api/admin/programs/program-one/roadmap/reorder')
      .send({ stepIds: 'step-a' });
    expect(badInput.status).toBe(400);
    expect(badInput.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'stepIds harus berupa array string ID' },
    });
    expect(roadmapStepUpdate).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
  });

  it('rejects a step reorder with IDs that belong to another program', async () => {
    asAdmin();
    programFindUnique.mockResolvedValueOnce({ ...programFixture, roadmapSteps: [{ id: 'step-a' }] });
    const admin = await adminAgent();
    const foreign = await admin.post('/api/admin/programs/program-one/roadmap/reorder')
      .send({ stepIds: ['step-foreign'] });
    expect(foreign.status).toBe(400);
    expect(foreign.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'Step ID step-foreign tidak valid untuk program ini' },
    });
    expect(roadmapStepUpdate).not.toHaveBeenCalled();
    expect(roadmapStepFindMany).not.toHaveBeenCalled();
  });
});

describe('admin roadmap step update and delete', () => {
  it('updates a step inside a program that uses a roadmap', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce({ ...stepFixture, program: { hasRoadmap: true } });
    roadmapStepUpdate.mockResolvedValueOnce({ ...stepFixture, title: 'Diperbarui' });
    const admin = await adminAgent();
    const updated = await admin.patch('/api/admin/roadmap-steps/step-one').send({ title: 'Diperbarui' });
    expect(updated.status).toBe(200);
    expect(updated.body).toEqual({ data: { ...stepFixture, title: 'Diperbarui' } });
    expect(roadmapStepUpdate).toHaveBeenCalledExactlyOnceWith({
      where: { id: 'step-one' },
      data: { title: 'Diperbarui' },
    });
  });

  it('requires at least one field on step PATCH', async () => {
    asAdmin();
    const admin = await adminAgent();
    const empty = await admin.patch('/api/admin/roadmap-steps/step-one').send({});
    expect(empty.status).toBe(400);
    expect(empty.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' },
    });
    expect(roadmapStepUpdate).not.toHaveBeenCalled();
  });

  it('refuses a step PATCH when the program has no roadmap', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce({ ...stepFixture, program: { hasRoadmap: false } });
    const admin = await adminAgent();
    const response = await admin.patch('/api/admin/roadmap-steps/step-one').send({ title: 'Baru' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' },
    });
    expect(roadmapStepUpdate).not.toHaveBeenCalled();
  });

  it('404s a step PATCH when the step does not exist', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce(null);
    const admin = await adminAgent();
    const response = await admin.patch('/api/admin/roadmap-steps/missing').send({ title: 'Baru' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
    expect(roadmapStepUpdate).not.toHaveBeenCalled();
  });

  it('deletes a step inside a program that uses a roadmap', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce({ ...stepFixture, program: { hasRoadmap: true } });
    roadmapStepDelete.mockResolvedValueOnce(stepFixture);
    const admin = await adminAgent();
    const deleted = await admin.delete('/api/admin/roadmap-steps/step-one');
    expect(deleted.status).toBe(204);
    expect(roadmapStepDelete).toHaveBeenCalledExactlyOnceWith({ where: { id: 'step-one' } });
    expect(roadmapStepUpdate).not.toHaveBeenCalled();
  });
});

describe('admin material item contract', () => {
  it('lists materials of a roadmap step in order', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce({ ...stepFixture, program: { hasRoadmap: true } });
    materialFindMany.mockResolvedValueOnce([materialFixture]);
    const admin = await adminAgent();
    const found = await admin.get('/api/admin/roadmap-steps/step-one/materials');
    expect(found.status).toBe(200);
    expect(found.body).toEqual({ data: [materialFixture] });
    expect(materialFindMany).toHaveBeenCalledExactlyOnceWith({
      where: { roadmapStepId: 'step-one' },
      orderBy: { order: 'asc' },
    });
  });

  it('404s the material list for an unknown roadmap step', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce(null);
    const admin = await adminAgent();
    const missingStep = await admin.get('/api/admin/roadmap-steps/missing/materials');
    expect(missingStep.status).toBe(404);
    expect(missingStep.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
    expect(materialFindMany).not.toHaveBeenCalled();
  });

  it('refuses the material list when the parent program has no roadmap', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce({ ...stepFixture, program: { hasRoadmap: false } });
    const admin = await adminAgent();
    const response = await admin.get('/api/admin/roadmap-steps/step-one/materials');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' },
    });
    expect(materialFindMany).not.toHaveBeenCalled();
  });

  it('validates the material body before the roadmap step lookup', async () => {
    asAdmin();
    const admin = await adminAgent();
    const response = await admin.post('/api/admin/roadmap-steps/step-one/materials').send({ title: '   ' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual(validationFailure('Invalid material item data'));
    expect(roadmapStepFindUnique).not.toHaveBeenCalled();
    expect(materialCreate).not.toHaveBeenCalled();
  });

  it('creates a material item with the next order inside an existing step', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce({ ...stepFixture, program: { hasRoadmap: true } });
    materialFindFirst.mockResolvedValueOnce({ order: 2 });
    materialCreate.mockResolvedValueOnce({ ...materialFixture, order: 3 });
    const admin = await adminAgent();
    const response = await admin.post('/api/admin/roadmap-steps/step-one/materials')
      .send({ title: 'Materi baru', bodyText: 'Konten materi' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ data: { ...materialFixture, order: 3 } });
    expect(materialFindFirst).toHaveBeenCalledExactlyOnceWith({
      where: { roadmapStepId: 'step-one' },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    expect(materialCreate).toHaveBeenCalledExactlyOnceWith({
      data: { roadmapStepId: 'step-one', order: 3, title: 'Materi baru', bodyText: 'Konten materi' },
    });
  });

  it('starts material ordering at zero when the step has no materials', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce({ ...stepFixture, program: { hasRoadmap: true } });
    materialFindFirst.mockResolvedValueOnce(null);
    materialCreate.mockResolvedValueOnce(materialFixture);
    const admin = await adminAgent();
    const response = await admin.post('/api/admin/roadmap-steps/step-one/materials')
      .send({ title: 'Materi pertama', bodyText: 'Konten materi' });
    expect(response.status).toBe(201);
    expect(materialCreate).toHaveBeenCalledExactlyOnceWith({
      data: { roadmapStepId: 'step-one', order: 0, title: 'Materi pertama', bodyText: 'Konten materi' },
    });
  });

  it('updates a material item through its parent roadmap program', async () => {
    asAdmin();
    materialFindUnique.mockResolvedValueOnce({
      ...materialFixture, roadmapStep: { ...stepFixture, program: { hasRoadmap: true } },
    });
    materialUpdate.mockResolvedValueOnce({ ...materialFixture, title: 'Diperbarui' });
    const admin = await adminAgent();
    const updated = await admin.patch('/api/admin/material-items/material-one').send({ title: 'Diperbarui' });
    expect(updated.status).toBe(200);
    expect(updated.body).toEqual({ data: { ...materialFixture, title: 'Diperbarui' } });
    expect(materialUpdate).toHaveBeenCalledExactlyOnceWith({
      where: { id: 'material-one' },
      data: { title: 'Diperbarui' },
    });
  });

  it('refuses a material PATCH when the parent roadmap is missing or orphaned', async () => {
    asAdmin();
    materialFindUnique.mockResolvedValueOnce({ ...materialFixture, roadmapStep: null });
    const admin = await adminAgent();
    const orphan = await admin.patch('/api/admin/material-items/material-one').send({ title: 'Baru' });
    expect(orphan.status).toBe(400);
    expect(orphan.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' },
    });
    expect(materialUpdate).not.toHaveBeenCalled();
  });

  it('404s a material PATCH when the item does not exist', async () => {
    asAdmin();
    materialFindUnique.mockResolvedValueOnce(null);
    const admin = await adminAgent();
    const missing = await admin.patch('/api/admin/material-items/missing').send({ title: 'Baru' });
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Material item tidak ditemukan' } });
    expect(materialUpdate).not.toHaveBeenCalled();
  });

  it('deletes a material item and 404s an unknown item', async () => {
    asAdmin();
    materialFindUnique.mockResolvedValueOnce({
      ...materialFixture, roadmapStep: { ...stepFixture, program: { hasRoadmap: true } },
    });
    materialDelete.mockResolvedValueOnce(materialFixture);
    const admin = await adminAgent();
    const deleted = await admin.delete('/api/admin/material-items/material-one');
    expect(deleted.status).toBe(204);
    expect(materialDelete).toHaveBeenCalledExactlyOnceWith({ where: { id: 'material-one' } });
    expect(materialUpdate).not.toHaveBeenCalled();
  });

  it('reorders materials inside their own step in the requested order', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce({ ...stepFixture, program: { hasRoadmap: true } });
    materialUpdate.mockResolvedValue({});
    materialFindMany
      .mockResolvedValueOnce([{ id: 'material-a' }, { id: 'material-b' }])
      .mockResolvedValueOnce([
        { ...materialFixture, id: 'material-b', order: 0 },
        { ...materialFixture, id: 'material-a', order: 1 },
      ]);
    const admin = await adminAgent();
    const reordered = await admin.post('/api/admin/roadmap-steps/step-one/materials/reorder')
      .send({ materialIds: ['material-b', 'material-a'] });
    expect(reordered.status).toBe(200);
    expect(reordered.body.data.map((item: { id: string }) => item.id)).toEqual(['material-b', 'material-a']);
    expect(materialUpdate.mock.calls).toEqual([
      [{ where: { id: 'material-b' }, data: { order: 0 } }],
      [{ where: { id: 'material-a' }, data: { order: 1 } }],
    ]);
    expect(transaction).toHaveBeenCalledTimes(1);
  });

  it('rejects a malformed material reorder payload without any update', async () => {
    asAdmin();
    const admin = await adminAgent();
    const badInput = await admin.post('/api/admin/roadmap-steps/step-one/materials/reorder')
      .send({ materialIds: [1, 2] });
    expect(badInput.status).toBe(400);
    expect(badInput.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'materialIds harus berupa array string ID' },
    });
    expect(materialUpdate).not.toHaveBeenCalled();
  });

  it('rejects a material reorder with IDs that belong to another step', async () => {
    asAdmin();
    roadmapStepFindUnique.mockResolvedValueOnce({ ...stepFixture, program: { hasRoadmap: true } });
    materialFindMany.mockResolvedValueOnce([{ id: 'material-a' }]);
    const admin = await adminAgent();
    const foreign = await admin.post('/api/admin/roadmap-steps/step-one/materials/reorder')
      .send({ materialIds: ['material-foreign'] });
    expect(foreign.status).toBe(400);
    expect(foreign.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'Material ID material-foreign tidak valid untuk step ini' },
    });
    expect(materialUpdate).not.toHaveBeenCalled();
  });
});
