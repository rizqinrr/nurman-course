-- CreateTable
CREATE TABLE "lesson_progresses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_progresses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "lesson_progresses_user_id_lesson_id_key" UNIQUE ("user_id", "lesson_id")
);

-- CreateIndex
CREATE INDEX "lesson_progresses_user_id_updated_at_idx" ON "lesson_progresses"("user_id", "updated_at");

-- AddForeignKey
ALTER TABLE "lesson_progresses"
    ADD CONSTRAINT "lesson_progresses_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "lesson_progresses"
    ADD CONSTRAINT "lesson_progresses_lesson_id_fkey"
    FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "lesson_progresses" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "lesson_progresses" FROM anon, authenticated;
