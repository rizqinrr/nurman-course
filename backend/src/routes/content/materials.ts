import express from 'express';
import { createMaterialItemSchema, updateMaterialItemSchema } from '@nurman-course/shared';
import { prisma } from '../../lib/prisma';
import { requireAdmin, requireAuth } from '../../middleware/auth';
import { assertRoadmapStepHasRoadmap } from './guards';

export const materialsRouter = express.Router();
materialsRouter.get('/api/admin/roadmap-steps/:stepId/materials', requireAuth, requireAdmin, async (req, res) => {
  const result = await assertRoadmapStepHasRoadmap(req.params.stepId);
  if (!result.ok) {
    res.status(result.status).json({ error: { code: result.code, message: result.message } });
    return;
  }
  try {
    const materials = await prisma.materialItem.findMany({
      where: { roadmapStepId: req.params.stepId },
      orderBy: { order: 'asc' },
    });
    res.json({ data: materials });
  } catch (error) {
    console.error('Error fetching admin material items:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

materialsRouter.post('/api/admin/roadmap-steps/:stepId/materials', requireAuth, requireAdmin, async (req, res) => {
  const parsed = createMaterialItemSchema.safeParse({ ...req.body, roadmapStepId: req.params.stepId });
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid material item data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const result = await assertRoadmapStepHasRoadmap(req.params.stepId);
  if (!result.ok) {
    res.status(result.status).json({ error: { code: result.code, message: result.message } });
    return;
  }

  const { roadmapStepId, order, title, bodyText } = parsed.data;

  try {
    let targetOrder = order;
    if (targetOrder === undefined) {
      const maxItem = await prisma.materialItem.findFirst({
        where: { roadmapStepId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      targetOrder = maxItem ? maxItem.order + 1 : 0;
    }

    const material = await prisma.materialItem.create({
      data: {
        roadmapStepId,
        order: targetOrder,
        title,
        bodyText,
      },
    });
    res.status(201).json({ data: material });
  } catch (error) {
    console.error('Error creating admin material item:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

materialsRouter.patch('/api/admin/material-items/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = updateMaterialItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid material item data',
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
    const existing = await prisma.materialItem.findUnique({
      where: { id: req.params.id },
      include: { roadmapStep: { include: { program: { select: { hasRoadmap: true } } } } },
    });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Material item tidak ditemukan' } });
      return;
    }
    if (!existing.roadmapStep?.program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    const updated = await prisma.materialItem.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json({ data: updated });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Material item tidak ditemukan' } });
      return;
    }
    console.error('Error updating admin material item:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

materialsRouter.delete('/api/admin/material-items/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.materialItem.findUnique({
      where: { id: req.params.id },
      include: { roadmapStep: { include: { program: { select: { hasRoadmap: true } } } } },
    });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Material item tidak ditemukan' } });
      return;
    }
    if (!existing.roadmapStep?.program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    await prisma.materialItem.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Material item tidak ditemukan' } });
      return;
    }
    console.error('Error deleting admin material item:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

materialsRouter.post('/api/admin/roadmap-steps/:stepId/materials/reorder', requireAuth, requireAdmin, async (req, res) => {
  const { materialIds } = req.body;
  if (!Array.isArray(materialIds) || materialIds.some(id => typeof id !== 'string')) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'materialIds harus berupa array string ID' } });
    return;
  }

  const result = await assertRoadmapStepHasRoadmap(req.params.stepId);
  if (!result.ok) {
    res.status(result.status).json({ error: { code: result.code, message: result.message } });
    return;
  }

  try {
    const existingMaterials = await prisma.materialItem.findMany({
      where: { roadmapStepId: req.params.stepId },
      select: { id: true },
    });
    const existingIds = new Set(existingMaterials.map(m => m.id));

    for (const id of materialIds) {
      if (!existingIds.has(id)) {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `Material ID ${id} tidak valid untuk step ini` } });
        return;
      }
    }

    await prisma.$transaction(
      materialIds.map((id, index) =>
        prisma.materialItem.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    const updatedMaterials = await prisma.materialItem.findMany({
      where: { roadmapStepId: req.params.stepId },
      orderBy: { order: 'asc' },
    });

    res.json({ data: updatedMaterials });
  } catch (error) {
    console.error('Error reordering material items:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});
