-- Additive migration: existing users, bookings and provider payments are preserved.
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "name_kg" VARCHAR(100),
  "name_en" VARCHAR(100),
  "slug" VARCHAR(100) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE TABLE "cabin_categories" (
  "cabin_id" BIGINT NOT NULL REFERENCES "cabins"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "category_id" INTEGER NOT NULL REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  PRIMARY KEY ("cabin_id", "category_id")
);
CREATE INDEX "cabin_categories_category_id_cabin_id_idx" ON "cabin_categories"("category_id", "cabin_id");
ALTER TABLE "promotions" ADD COLUMN "code" VARCHAR(40);
CREATE UNIQUE INDEX "promotions_code_key" ON "promotions"("code");
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_code_check"
  CHECK ("code" IS NULL OR "code" ~ '^[A-Z0-9][A-Z0-9_-]{2,39}$');
