-- Additive only: existing listings retain their booking behavior and all history.
ALTER TABLE "cabins" ADD COLUMN "is_bookable" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "locations"
  ADD COLUMN "city_kg" VARCHAR(150),
  ADD COLUMN "city_en" VARCHAR(150),
  ADD COLUMN "village_kg" VARCHAR(150),
  ADD COLUMN "village_en" VARCHAR(150),
  ADD COLUMN "address_kg" TEXT,
  ADD COLUMN "address_en" TEXT;
ALTER TABLE "cabin_rules"
  ADD COLUMN "title_kg" VARCHAR(255),
  ADD COLUMN "title_en" VARCHAR(255),
  ADD COLUMN "description_kg" TEXT,
  ADD COLUMN "description_en" TEXT;
