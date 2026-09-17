import { prisma } from '../../lib/prisma';

export async function assertRoadmapStepHasRoadmap(stepId: string) {
  const step = await prisma.roadmapStep.findUnique({
    where: { id: stepId },
    include: { program: { select: { hasRoadmap: true } } },
  });
  if (!step) {
    return { ok: false as const, status: 404, code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' };
  }
  if (!step.program.hasRoadmap) {
    return { ok: false as const, status: 400, code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' };
  }
  return { ok: true as const, step };
}
