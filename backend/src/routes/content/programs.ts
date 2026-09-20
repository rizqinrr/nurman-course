import express from 'express';
import { createProgramSchema, updateProgramSchema } from '@nurman-course/shared';
import { prisma } from '../../lib/prisma';
import { requireAdmin, requireAuth } from '../../middleware/auth';
import { publicProgramsRouter } from './programs-public';

export { publicProgramsRouter };
export const adminProgramsRouter = express.Router();

adminProgramsRouter.get('/api/admin/programs', requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const active = req.query.active === undefined
      ? undefined
      : req.query.active === 'true';

    const where = {
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
      ...(category ? { category } : {}),
      ...(active === undefined ? {} : { active }),
    };

    const [programs, total] = await prisma.$transaction([
      prisma.program.findMany({
        where,
        include: {
          _count: {
            select: { roadmapSteps: true, enrollments: true, sessions: true },
          },
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.program.count({ where }),
    ]);

    res.json({
      data: programs,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin programs:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

adminProgramsRouter.get('/api/admin/programs/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: {
        roadmapSteps: { orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true, sessions: true } },
      },
    });

    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
      return;
    }

    res.json({ data: program });
  } catch (error) {
    console.error('Error fetching admin program:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

adminProgramsRouter.post('/api/admin/programs', requireAuth, requireAdmin, async (req, res) => {
  const parsed = createProgramSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid program data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  try {
    const program = await prisma.program.create({ data: parsed.data });
    res.status(201).json({ data: program });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      res.status(409).json({ error: { code: 'CONFLICT', message: 'Program slug already exists' } });
      return;
    }
    console.error('Error creating admin program:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

adminProgramsRouter.patch('/api/admin/programs/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = updateProgramSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid program data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' } });
    return;
  }

  try {
    const program = await prisma.program.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json({ data: program });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
        return;
      }
      if (error.code === 'P2002') {
        res.status(409).json({ error: { code: 'CONFLICT', message: 'Program slug already exists' } });
        return;
      }
    }
    console.error('Error updating admin program:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

adminProgramsRouter.delete('/api/admin/programs/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { enrollments: true, sessions: true } } },
    });

    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
      return;
    }

    if (program._count.enrollments > 0 || program._count.sessions > 0) {
      const updated = await prisma.program.update({
        where: { id: program.id },
        data: { active: false },
      });
      res.json({ data: updated, deactivated: true });
      return;
    }

    await prisma.program.delete({ where: { id: program.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting admin program:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});
