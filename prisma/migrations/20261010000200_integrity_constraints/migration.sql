-- Business constraints not expressible in the Prisma schema.
-- Keep these in migration history; prisma db push cannot recreate them.
-- This migration assumes the PostgreSQL btree_gist extension is available.
BEGIN;

CREATE EXTENSION IF NOT EXISTS "btree_gist";

ALTER TABLE "locations"
  ADD CONSTRAINT "locations_coordinates_check" CHECK (
    ("latitude" IS NULL AND "longitude" IS NULL)
    OR ("latitude" IS NOT NULL AND "longitude" IS NOT NULL
        AND "latitude" BETWEEN -90 AND 90
        AND "longitude" BETWEEN -180 AND 180)
  );

ALTER TABLE "cabins"
  ADD CONSTRAINT "cabins_price_check" CHECK ("price_per_night" >= 0),
  ADD CONSTRAINT "cabins_capacity_check" CHECK (
    "max_guests" > 0 AND "bedrooms" >= 0 AND "beds" >= 0 AND "bathrooms" >= 0
  ),
  ADD CONSTRAINT "cabins_rating_check" CHECK (
    "rating" BETWEEN 0 AND 5 AND "reviews_count" >= 0
  );

ALTER TABLE "cabin_images"
  ADD CONSTRAINT "cabin_images_sort_order_check" CHECK ("sort_order" >= 0);

-- Multiple gallery images may be non-main, but at most one may be main.
CREATE UNIQUE INDEX "cabin_images_one_main_per_cabin"
  ON "cabin_images" ("cabin_id") WHERE "is_main" = true;

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_dates_check" CHECK ("check_out" > "check_in"),
  ADD CONSTRAINT "bookings_nights_check" CHECK (
    "nights" > 0 AND "nights" = "check_out" - "check_in"
  ),
  ADD CONSTRAINT "bookings_guests_count_check" CHECK ("guests_count" > 0),
  ADD CONSTRAINT "bookings_amounts_check" CHECK (
    "price_per_night" >= 0 AND "subtotal" >= 0
    AND "discount_amount" >= 0 AND "discount_amount" <= "subtotal"
    AND "service_fee" >= 0 AND "total_amount" >= 0
    AND "total_amount" = "subtotal" - "discount_amount" + "service_fee"
  );

-- Checkout day is not an occupied night: a new stay may start that day.
-- PENDING holds dates until explicitly cancelled/rejected; COMPLETED keeps
-- historical stays protected. The DB checks this even for concurrent writes.
ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_no_overlapping_stays"
  EXCLUDE USING GIST (
    "cabin_id" WITH =,
    daterange("check_in", "check_out", '[)') WITH &&
  ) WHERE ("status" IN ('PENDING', 'CONFIRMED', 'COMPLETED'));

ALTER TABLE "cabin_availability"
  ADD CONSTRAINT "cabin_availability_price_check" CHECK (
    "price" IS NULL OR "price" >= 0
  );

ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_rating_check" CHECK ("rating" BETWEEN 1 AND 5);

ALTER TABLE "search_history"
  ADD CONSTRAINT "search_history_dates_check" CHECK (
    "check_in" IS NULL OR "check_out" IS NULL OR "check_out" > "check_in"
  ),
  ADD CONSTRAINT "search_history_guests_check" CHECK (
    "guests_count" IS NULL OR "guests_count" > 0
  ),
  ADD CONSTRAINT "search_history_prices_check" CHECK (
    ("min_price" IS NULL OR "min_price" >= 0)
    AND ("max_price" IS NULL OR "max_price" >= 0)
    AND ("min_price" IS NULL OR "max_price" IS NULL OR "min_price" <= "max_price")
  );

ALTER TABLE "promotions"
  ADD CONSTRAINT "promotions_dates_check" CHECK ("end_date" >= "start_date"),
  ADD CONSTRAINT "promotions_discount_check" CHECK (
    "discount_value" > 0
    AND ("discount_type" <> 'PERCENT' OR "discount_value" <= 100)
  );

ALTER TABLE "payments"
  ADD CONSTRAINT "payments_amount_check" CHECK ("amount" > 0),
  ADD CONSTRAINT "payments_paid_at_check" CHECK (
    "status" NOT IN ('PAID', 'REFUNDED') OR "paid_at" IS NOT NULL
  );

ALTER TABLE "owner_payouts"
  ADD CONSTRAINT "owner_payouts_amounts_check" CHECK (
    "gross_amount" >= 0 AND "commission_amount" >= 0 AND "net_amount" >= 0
    AND "commission_amount" <= "gross_amount"
    AND "net_amount" = "gross_amount" - "commission_amount"
  ),
  ADD CONSTRAINT "owner_payouts_paid_at_check" CHECK (
    "status" <> 'PAID' OR "paid_at" IS NOT NULL
  );

-- The current model pays a stay in full. A cancelled attempt may be retried.
-- Only one outstanding or successful payout per booking prevents duplicates.
CREATE UNIQUE INDEX "owner_payouts_one_active_per_booking"
  ON "owner_payouts" ("booking_id") WHERE "status" IN ('PENDING', 'PAID');

COMMIT;
