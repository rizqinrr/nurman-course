import express from 'express';
import type { Prisma } from '../../generated/client';
import { prisma } from '../../lib/prisma';
import { optionalAuth, type AuthenticatedRequest } from '../../middleware/auth';

export const publicProgramsRouter = express.Router();

const roadmapMetadataSelect = {
  id: true,
  programId: true,
  order: true,
  title: true,
  level: true,
} as const;

const roadmapBodySelect = {
  ...roadmapMetadataSelect,
  bodyText: true,
} as const;

const publicProgramSelect: Prisma.ProgramSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  category: true,
  basePrice: true,
  sessionsPerBlock: true,
  active: true,
  hasRoadmap: true,
  roadmapSteps: {
    select: roadmapMetadataSelect,
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  },
};

function readableProgramWhere(user: NonNullable<AuthenticatedRequest['user']>): Prisma.ProgramWhereInput {
  if (user.role === 'admin') return {};
  if (user.role === 'tentor') {
    return { enrollments: { some: { tentorId: user.id, status: 'active' } } };
  }
  return { enrollments: { some: { murid: { waliId: user.id }, status: 'active' } } };
}

async function findReadableRoadmapSteps(
  programIds: string[],
  user: AuthenticatedRequest['user'],
) {
  if (!user || programIds.length === 0) return [];
  return prisma.roadmapStep.findMany({
    where: {
      programId: { in: programIds },
      program: readableProgramWhere(user),
    },
    select: roadmapBodySelect,
    orderBy: [{ programId: 'asc' }, { order: 'asc' }, { id: 'asc' }],
  });
}

publicProgramsRouter.get('/api/programs', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { active: true },
      select: publicProgramSelect,
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    const readableSteps = await findReadableRoadmapSteps(programs.map((program) => program.id), req.user);
    const readableById = new Map(readableSteps.map((step) => [step.id, step]));

    res.set('Cache-Control', 'private, no-store');
    res.json({
      programs: programs.map((program) => ({
        ...program,
        roadmapSteps: program.roadmapSteps.map((step) => readableById.get(step.id) ?? step),
      })),
    });
  } catch {
    console.error('Error fetching programs');
    res.status(500).json({ error: 'Internal server error' });
  }
});

publicProgramsRouter.get('/api/programs/:id', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      select: publicProgramSelect,
    });
    if (!program) {
      res.status(404).json({ error: 'Program not found' });
      return;
    }
    const readableSteps = await findReadableRoadmapSteps([program.id], req.user);
    const readableById = new Map(readableSteps.map((step) => [step.id, step]));

    res.set('Cache-Control', 'private, no-store');
    res.json({
      program: {
        ...program,
        roadmapSteps: program.roadmapSteps.map((step) => readableById.get(step.id) ?? step),
      },
    });
  } catch {
    console.error('Error fetching program detail');
    res.status(500).json({ error: 'Internal server error' });
  }
});
