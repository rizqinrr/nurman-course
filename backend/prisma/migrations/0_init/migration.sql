-- CreateEnum
CREATE TYPE "course_access_tier" AS ENUM ('free', 'paid');

-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "lesson_visibility" AS ENUM ('public', 'entitled');

-- CreateEnum
CREATE TYPE "entitlement_source" AS ENUM ('free', 'purchase', 'enrollment');

-- CreateEnum
CREATE TYPE "tracking_event_type" AS ENUM ('login', 'lesson_read');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT,
    "photo_path" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "murids" (
    "id" TEXT NOT NULL,
    "wali_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "school_level" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT,
    "registered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photo_path" TEXT,

    CONSTRAINT "murids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "base_price" DOUBLE PRECISION,
    "sessions_per_block" INTEGER NOT NULL DEFAULT 12,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "has_roadmap" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_steps" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body_text" TEXT NOT NULL,
    "level" TEXT,

    CONSTRAINT "roadmap_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "tentor_id" TEXT NOT NULL,
    "murid_id" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_items" (
    "id" TEXT NOT NULL,
    "roadmap_step_id" TEXT,
    "session_id" TEXT,
    "title" TEXT NOT NULL,
    "body_text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "material_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "murid_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tentor_id" TEXT,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "note" TEXT,
    "payment_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_proof" TEXT,
    "payment_proof_name" TEXT,
    "paid_amount" DOUBLE PRECISION,
    "submitted_at" TIMESTAMP(3),

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prepayments" (
    "id" TEXT NOT NULL,
    "murid_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_proof" TEXT,
    "payment_proof_name" TEXT,
    "submitted_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "prepayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_accounts" (
    "id" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_reports" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "murid_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_reports" (
    "id" TEXT NOT NULL,
    "murid_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "achievements" TEXT[],
    "mastered_materials" TEXT[],
    "weak_materials" TEXT[],

    CONSTRAINT "progress_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresses" (
    "id" TEXT NOT NULL,
    "murid_id" TEXT NOT NULL,
    "roadmap_step_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" TEXT,
    "category" TEXT,
    "access_tier" "course_access_tier",
    "price" DOUBLE PRECISION,
    "status" "content_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "author_id" TEXT,
    "program_id" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progresses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entitlements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "source" "entitlement_source" NOT NULL,
    "source_ref" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entitlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "legacy_roadmap_step_id" TEXT,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT,
    "summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "legacy_material_item_id" TEXT,
    "legacy_roadmap_step_id" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "body_text" TEXT NOT NULL,
    "visibility" "lesson_visibility" NOT NULL DEFAULT 'entitled',
    "status" "content_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "order" INTEGER NOT NULL,
    "estimated_minutes" INTEGER,
    "read_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_events" (
    "id" TEXT NOT NULL,
    "event_type" "tracking_event_type" NOT NULL,
    "user_id" TEXT,
    "lesson_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slug_key" ON "programs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "daily_reports_session_id_key" ON "daily_reports"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "courses_program_id_key" ON "courses"("program_id");

-- CreateIndex
CREATE INDEX "courses_author_id_status_idx" ON "courses"("author_id", "status");

-- CreateIndex
CREATE INDEX "courses_active_status_published_at_idx" ON "courses"("active", "status", "published_at");

-- CreateIndex
CREATE INDEX "lesson_progresses_user_id_updated_at_idx" ON "lesson_progresses"("user_id", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progresses_user_id_lesson_id_key" ON "lesson_progresses"("user_id", "lesson_id");

-- CreateIndex
CREATE INDEX "entitlements_user_id_course_id_revoked_at_expires_at_idx" ON "entitlements"("user_id", "course_id", "revoked_at", "expires_at");

-- CreateIndex
CREATE INDEX "entitlements_course_id_source_idx" ON "entitlements"("course_id", "source");

-- CreateIndex
CREATE UNIQUE INDEX "entitlements_user_id_course_id_source_source_ref_key" ON "entitlements"("user_id", "course_id", "source", "source_ref");

-- CreateIndex
CREATE UNIQUE INDEX "sections_legacy_roadmap_step_id_key" ON "sections"("legacy_roadmap_step_id");

-- CreateIndex
CREATE INDEX "sections_course_id_idx" ON "sections"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "sections_course_id_order_key" ON "sections"("course_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_legacy_material_item_id_key" ON "lessons"("legacy_material_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_legacy_roadmap_step_id_key" ON "lessons"("legacy_roadmap_step_id");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_slug_key" ON "lessons"("slug");

-- CreateIndex
CREATE INDEX "lessons_section_id_idx" ON "lessons"("section_id");

-- CreateIndex
CREATE INDEX "lessons_status_published_at_idx" ON "lessons"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_section_id_order_key" ON "lessons"("section_id", "order");

-- CreateIndex
CREATE INDEX "tracking_events_event_type_created_at_idx" ON "tracking_events"("event_type", "created_at");

-- CreateIndex
CREATE INDEX "tracking_events_user_id_created_at_idx" ON "tracking_events"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "tracking_events_lesson_id_created_at_idx" ON "tracking_events"("lesson_id", "created_at");

-- AddForeignKey
ALTER TABLE "murids" ADD CONSTRAINT "murids_wali_id_fkey" FOREIGN KEY ("wali_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_steps" ADD CONSTRAINT "roadmap_steps_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_tentor_id_fkey" FOREIGN KEY ("tentor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_items" ADD CONSTRAINT "material_items_roadmap_step_id_fkey" FOREIGN KEY ("roadmap_step_id") REFERENCES "roadmap_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_items" ADD CONSTRAINT "material_items_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_tentor_id_fkey" FOREIGN KEY ("tentor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prepayments" ADD CONSTRAINT "prepayments_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_reports" ADD CONSTRAINT "progress_reports_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_reports" ADD CONSTRAINT "progress_reports_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresses" ADD CONSTRAINT "progresses_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progresses" ADD CONSTRAINT "progresses_roadmap_step_id_fkey" FOREIGN KEY ("roadmap_step_id") REFERENCES "roadmap_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progresses" ADD CONSTRAINT "lesson_progresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progresses" ADD CONSTRAINT "lesson_progresses_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Domain constraints not represented by Prisma schema.
ALTER TABLE "lessons"
    ADD CONSTRAINT "lessons_read_count_nonnegative_check" CHECK ("read_count" >= 0);

ALTER TABLE "entitlements"
    ADD CONSTRAINT "entitlements_source_ref_check" CHECK (length(btrim("source_ref")) > 0),
    ADD CONSTRAINT "entitlements_source_ref_format_check" CHECK (
        ("source" = 'free' AND "source_ref" = 'free')
        OR ("source" IN ('purchase', 'enrollment') AND length(btrim("source_ref")) > 0)
    );

ALTER TABLE "tracking_events"
    ADD CONSTRAINT "tracking_events_target_check" CHECK (
        ("event_type" = 'login' AND "user_id" IS NOT NULL AND "lesson_id" IS NULL)
        OR ("event_type" = 'lesson_read' AND "lesson_id" IS NOT NULL)
    );

-- Express/Prisma is the only content and tracking data boundary.
ALTER TABLE "programs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "roadmap_steps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "material_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lessons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "entitlements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lesson_progresses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tracking_events" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "programs" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "roadmap_steps" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "material_items" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "courses" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "sections" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "lessons" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "entitlements" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "lesson_progresses" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE "tracking_events" FROM PUBLIC, anon, authenticated;
