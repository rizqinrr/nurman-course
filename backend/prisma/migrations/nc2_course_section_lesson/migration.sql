-- CreateEnum
CREATE TYPE "course_access_tier" AS ENUM ('free', 'paid');

-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "lesson_visibility" AS ENUM ('public', 'entitled');

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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "courses_program_id_key" ON "courses"("program_id");

-- CreateIndex
CREATE INDEX "courses_author_id_status_idx" ON "courses"("author_id", "status");

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
CREATE UNIQUE INDEX "lessons_section_id_order_key" ON "lessons"("section_id", "order");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "lessons" ENABLE ROW LEVEL SECURITY;
