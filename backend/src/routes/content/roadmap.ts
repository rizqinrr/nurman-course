import express from 'express';
import { createRoadmapStepSchema, updateRoadmapStepSchema } from '@nurman-course/shared';
import { prisma } from '../../lib/prisma';
import { requireAdmin, requireAuth } from '../../middleware/auth';

export const roadmapStepsRouter = express.Router();
roadmapStepsRouter.get('/api/admin/programs/:programId/roadmap', requireAuth, requireAdmin, async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.programId },
    });
    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program tidak ditemukan' } });
      return;
    }
    const steps = await prisma.roadmapStep.findMany({
      where: { programId: req.params.programId },
      orderBy: { order: 'asc' },
    });
    res.json({ data: steps });
  } catch (error) {
    console.error('Error fetching admin roadmap steps:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

roadmapStepsRouter.post('/api/admin/programs/:programId/roadmap', requireAuth, requireAdmin, async (req, res) => {
  const parsed = createRoadmapStepSchema.safeParse({ ...req.body, programId: req.params.programId });
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid roadmap step data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const { programId, order, title, bodyText, level } = parsed.data;

  try {
    const program = await prisma.program.findUnique({
      where: { id: programId },
    });
    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program tidak ditemukan' } });
      return;
    }
    if (!program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    let targetOrder = order;
    if (targetOrder === undefined) {
      const maxStep = await prisma.roadmapStep.findFirst({
        where: { programId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      targetOrder = maxStep ? maxStep.order + 1 : 0;
    }

    const step = await prisma.roadmapStep.create({
      data: {
        programId,
        order: targetOrder,
        title,
        bodyText,
        level,
      },
    });
    res.status(201).json({ data: step });
  } catch (error) {
    console.error('Error creating admin roadmap step:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

roadmapStepsRouter.post('/api/admin/programs/:programId/roadmap/reorder', requireAuth, requireAdmin, async (req, res) => {
  const { stepIds } = req.body;
  if (!Array.isArray(stepIds) || stepIds.some(id => typeof id !== 'string')) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'stepIds harus berupa array string ID' } });
    return;
  }

  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.programId },
      include: { roadmapSteps: { select: { id: true } } }
    });

    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program tidak ditemukan' } });
      return;
    }

    const existingStepIds = new Set(program.roadmapSteps.map(s => s.id));

    for (const id of stepIds) {
      if (!existingStepIds.has(id)) {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `Step ID ${id} tidak valid untuk program ini` } });
        return;
      }
    }

    await prisma.$transaction(
      stepIds.map((id, index) =>
        prisma.roadmapStep.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    const updatedSteps = await prisma.roadmapStep.findMany({
      where: { programId: req.params.programId },
      orderBy: { order: 'asc' },
    });

    res.json({ data: updatedSteps });
  } catch (error) {
    console.error('Error reordering roadmap steps:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

roadmapStepsRouter.patch('/api/admin/roadmap-steps/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = updateRoadmapStepSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid roadmap step data',
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
    const existingStep = await prisma.roadmapStep.findUnique({
      where: { id: req.params.id },
      include: { program: { select: { hasRoadmap: true } } },
    });
    if (!existingStep) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
      return;
    }
    if (!existingStep.program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    const updated = await prisma.roadmapStep.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json({ data: updated });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
      return;
    }
    console.error('Error updating admin roadmap step:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

roadmapStepsRouter.delete('/api/admin/roadmap-steps/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const existingStep = await prisma.roadmapStep.findUnique({
      where: { id: req.params.id },
      include: { program: { select: { hasRoadmap: true } } },
    });
    if (!existingStep) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
      return;
    }
    if (!existingStep.program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    await prisma.roadmapStep.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
      return;
    }
    console.error('Error deleting admin roadmap step:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

