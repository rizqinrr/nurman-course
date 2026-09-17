import { Prisma, PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();
const apply = process.env.NC_CONTENT_BACKFILL_APPLY === 'true';
const stagingRef = 'akjzhktsdkbykjknkwwo';

type MappingStats = {
  courses: number;
  sections: number;
  lessons: number;
  sessionOnly: number;
  ambiguous: number;
  conflicts: number;
  orphans: number;
};

type LessonSource = {
  legacyRoadmapStepId: string | null;
  legacyMaterialItemId: string | null;
  order: number;
  title: string;
  bodyText: string;
};

type PlannedSessionItem = {
  item: { id: string; title: string; bodyText: string };
  stepId: string;
  programId: string;
};

function slugify(value: string, fallback: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}

function nextSlug(base: string, used: Set<string>): string {
  const normalized = slugify(base, 'content');
  let candidate = normalized;
  let suffix = 2;
  while (used.has(candidate)) {
    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }
  used.add(candidate);
  return candidate;
}

function assertApplyAllowed(): void {
  if (!apply) return;
  const confirmed = process.env.NC_CONTENT_BACKFILL_CONFIRM === 'APPLY_NC2_STAGING';
  const stagingTarget = process.env.NC_CONTENT_BACKFILL_TARGET === 'staging';
  const databaseUrl = process.env.DATABASE_URL ?? '';
  if (!confirmed || !stagingTarget || !databaseUrl.includes(stagingRef) || process.env.NODE_ENV === 'production') {
    throw new Error('Content backfill apply requires explicit approved staging confirmation');
  }
}

async function run(): Promise<MappingStats> {
  assertApplyAllowed();
  const programs = await prisma.program.findMany({
    where: { hasRoadmap: true },
    include: { roadmapSteps: { include: { materialItems: true }, orderBy: { order: 'asc' } } },
    orderBy: { id: 'asc' },
  });
  const sessions = await prisma.session.findMany({
    include: { program: { include: { roadmapSteps: { select: { id: true } } } } },
    orderBy: { id: 'asc' },
  });
  const [existingCourses, existingLessons, sessionOnlyItems, conflicts, orphans] = await Promise.all([
    prisma.course.findMany({ select: { id: true, slug: true, programId: true } }),
    prisma.lesson.findMany({ select: { slug: true, legacyRoadmapStepId: true, legacyMaterialItemId: true } }),
    prisma.materialItem.findMany({
      where: { roadmapStepId: null, sessionId: { not: null } },
      select: { id: true, sessionId: true, title: true, bodyText: true },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    }),
    prisma.materialItem.count({ where: { roadmapStepId: { not: null }, sessionId: { not: null } } }),
    prisma.materialItem.count({ where: { roadmapStepId: null, sessionId: null } }),
  ]);
  const sessionById = new Map(sessions.map((session) => [session.id, session]));
  const plannedSessionItems: PlannedSessionItem[] = [];
  let ambiguous = 0;
  for (const item of sessionOnlyItems) {
    const session = item.sessionId ? sessionById.get(item.sessionId) : undefined;
    const stepIds = session?.program.roadmapSteps.map((step) => step.id) ?? [];
    if (!session || stepIds.length !== 1) {
      ambiguous += 1;
      continue;
    }
    plannedSessionItems.push({ item, stepId: stepIds[0], programId: session.programId });
  }
  const stats: MappingStats = {
    courses: programs.length,
    sections: programs.reduce((total, program) => total + program.roadmapSteps.length, 0),
    lessons: programs.reduce(
      (total, program) => total + program.roadmapSteps.reduce((stepTotal, step) => stepTotal + 1 + step.materialItems.length, 0),
      0,
    ) + plannedSessionItems.length,
    sessionOnly: plannedSessionItems.length,
    ambiguous,
    conflicts,
    orphans,
  };
  if (!apply) return stats;
  if (stats.ambiguous > 0 || stats.conflicts > 0 || stats.orphans > 0) {
    throw new Error('Content backfill preflight found unresolved material mappings');
  }

  const courseByProgramId = new Map(existingCourses.filter((course) => course.programId).map((course) => [course.programId as string, course]));
  const lessonSlugByStepId = new Map(existingLessons.filter((lesson) => lesson.legacyRoadmapStepId).map((lesson) => [lesson.legacyRoadmapStepId as string, lesson.slug]));
  const lessonSlugByMaterialId = new Map(existingLessons.filter((lesson) => lesson.legacyMaterialItemId).map((lesson) => [lesson.legacyMaterialItemId as string, lesson.slug]));
  const usedCourseSlugs = new Set(existingCourses.map((course) => course.slug));
  const usedLessonSlugs = new Set(existingLessons.map((lesson) => lesson.slug));

  await prisma.$transaction(async (tx) => {
    const sectionIds = new Map<string, string>();
    const courseSlugs = new Map<string, string>();
    const nextOrderBySectionId = new Map<string, number>();

    const upsertLesson = async (sectionId: string, courseSlug: string, source: LessonSource) => {
      const existingSlug = source.legacyMaterialItemId
        ? lessonSlugByMaterialId.get(source.legacyMaterialItemId)
        : source.legacyRoadmapStepId
          ? lessonSlugByStepId.get(source.legacyRoadmapStepId)
          : undefined;
      const slug = existingSlug ?? nextSlug(`${courseSlug}-${source.order}-${source.title}`, usedLessonSlugs);
      const where: Prisma.LessonWhereUniqueInput = source.legacyMaterialItemId
        ? { legacyMaterialItemId: source.legacyMaterialItemId }
        : { legacyRoadmapStepId: source.legacyRoadmapStepId as string };
      await tx.lesson.upsert({
        where,
        update: { sectionId, slug, order: source.order, title: source.title, bodyText: source.bodyText, status: 'draft', visibility: 'entitled', publishedAt: null },
        create: {
          sectionId,
          legacyRoadmapStepId: source.legacyRoadmapStepId,
          legacyMaterialItemId: source.legacyMaterialItemId,
          slug,
          order: source.order,
          title: source.title,
          bodyText: source.bodyText,
          status: 'draft',
          visibility: 'entitled',
        },
      });
    };

    for (const program of programs) {
      const existingCourse = courseByProgramId.get(program.id);
      const courseSlug = existingCourse?.slug ?? nextSlug(program.slug, usedCourseSlugs);
      const course = await tx.course.upsert({
        where: { programId: program.id },
        update: { slug: courseSlug, title: program.name, description: program.description, category: program.category, authorId: null, accessTier: null, price: null, status: 'draft', publishedAt: null },
        create: { slug: courseSlug, title: program.name, description: program.description, category: program.category, programId: program.id, status: 'draft' },
        select: { id: true },
      });
      courseSlugs.set(program.id, courseSlug);

      for (const step of program.roadmapSteps) {
        const section = await tx.section.upsert({
          where: { legacyRoadmapStepId: step.id },
          update: { courseId: course.id, order: step.order, title: step.title, level: step.level },
          create: { legacyRoadmapStepId: step.id, courseId: course.id, order: step.order, title: step.title, level: step.level },
          select: { id: true },
        });
        sectionIds.set(step.id, section.id);
        const sources: LessonSource[] = [
          { legacyRoadmapStepId: step.id, legacyMaterialItemId: null, order: 0, title: step.title, bodyText: step.bodyText },
          ...step.materialItems
            .filter((item) => item.roadmapStepId === step.id)
            .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
            .map((item, index) => ({
              legacyRoadmapStepId: null,
              legacyMaterialItemId: item.id,
              order: index + 1,
              title: item.title,
              bodyText: item.bodyText,
            })),
        ];
        for (const source of sources) await upsertLesson(section.id, courseSlug, source);
        nextOrderBySectionId.set(section.id, sources.length);
      }
    }

    for (const planned of plannedSessionItems) {
      const sectionId = sectionIds.get(planned.stepId);
      if (!sectionId) throw new Error('Mapped roadmap section was not created');
      const order = nextOrderBySectionId.get(sectionId) ?? 1;
      await upsertLesson(sectionId, courseSlugs.get(planned.programId) ?? 'legacy', {
        legacyRoadmapStepId: null,
        legacyMaterialItemId: planned.item.id,
        order,
        title: planned.item.title,
        bodyText: planned.item.bodyText,
      });
      nextOrderBySectionId.set(sectionId, order + 1);
    }
  }, { timeout: 120_000 });

  return stats;
}

run()
  .then((stats) => {
    console.log(JSON.stringify({ dryRun: !apply, ...stats }));
  })
  .catch(() => {
    console.error('Content backfill failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
