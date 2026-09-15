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

CREATE TABLE "roadmap_steps" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body_text" TEXT NOT NULL,
    "level" TEXT,

    CONSTRAINT "roadmap_steps_pkey" PRIMARY KEY ("id")
);

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

CREATE TABLE "material_items" (
    "id" TEXT NOT NULL,
    "roadmap_step_id" TEXT,
    "session_id" TEXT,
    "title" TEXT NOT NULL,
    "body_text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "material_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "murid_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tentor_id" TEXT,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

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

CREATE TABLE "progresses" (
    "id" TEXT NOT NULL,
    "murid_id" TEXT NOT NULL,
    "roadmap_step_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progresses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE UNIQUE INDEX "programs_slug_key" ON "programs"("slug");

CREATE UNIQUE INDEX "daily_reports_session_id_key" ON "daily_reports"("session_id");

ALTER TABLE "murids" ADD CONSTRAINT "murids_wali_id_fkey" FOREIGN KEY ("wali_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "roadmap_steps" ADD CONSTRAINT "roadmap_steps_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_tentor_id_fkey" FOREIGN KEY ("tentor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "material_items" ADD CONSTRAINT "material_items_roadmap_step_id_fkey" FOREIGN KEY ("roadmap_step_id") REFERENCES "roadmap_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "material_items" ADD CONSTRAINT "material_items_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_tentor_id_fkey" FOREIGN KEY ("tentor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "invoices" ADD CONSTRAINT "invoices_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "prepayments" ADD CONSTRAINT "prepayments_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "progress_reports" ADD CONSTRAINT "progress_reports_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "progress_reports" ADD CONSTRAINT "progress_reports_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "progresses" ADD CONSTRAINT "progresses_murid_id_fkey" FOREIGN KEY ("murid_id") REFERENCES "murids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "progresses" ADD CONSTRAINT "progresses_roadmap_step_id_fkey" FOREIGN KEY ("roadmap_step_id") REFERENCES "roadmap_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
