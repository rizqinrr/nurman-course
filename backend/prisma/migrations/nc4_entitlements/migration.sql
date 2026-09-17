-- CreateEnum
CREATE TYPE "entitlement_source" AS ENUM ('free', 'purchase', 'enrollment');

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

    CONSTRAINT "entitlements_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "entitlements_source_ref_check" CHECK (length(btrim("source_ref")) > 0),
    CONSTRAINT "entitlements_source_ref_format_check" CHECK (
        ("source" = 'free' AND "source_ref" = 'free')
        OR ("source" IN ('purchase', 'enrollment') AND length(btrim("source_ref")) > 0)
    )
);

-- CreateIndex
CREATE UNIQUE INDEX "entitlements_user_id_course_id_source_source_ref_key"
    ON "entitlements"("user_id", "course_id", "source", "source_ref");

-- CreateIndex
CREATE INDEX "entitlements_user_id_course_id_revoked_at_expires_at_idx"
    ON "entitlements"("user_id", "course_id", "revoked_at", "expires_at");

-- CreateIndex
CREATE INDEX "entitlements_course_id_source_idx" ON "entitlements"("course_id", "source");

-- AddForeignKey
ALTER TABLE "entitlements"
    ADD CONSTRAINT "entitlements_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlements"
    ADD CONSTRAINT "entitlements_course_id_fkey"
    FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Security: Express/Prisma is the privileged boundary; Data API stays inaccessible until MTR-8
ALTER TABLE "entitlements" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "entitlements" FROM anon, authenticated;