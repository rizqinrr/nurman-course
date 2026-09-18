-- Express/Prisma remains the only content data boundary.
-- This migration is intentionally offline until an approved DB rollout.

-- Indexes for published catalog and reader lookups.
CREATE INDEX "courses_active_status_published_at_idx" ON "courses"("active", "status", "published_at");
CREATE INDEX "lessons_status_published_at_idx" ON "lessons"("status", "published_at");

ALTER TABLE "programs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "roadmap_steps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "material_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lessons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "entitlements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lesson_progresses" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "programs" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "roadmap_steps" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "material_items" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "courses" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "sections" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "lessons" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "entitlements" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "lesson_progresses" FROM PUBLIC, anon, authenticated;
