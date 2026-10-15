-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "owner_verification_status" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "cabin_status" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'BLOCKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "availability_status" AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "review_status" AS ENUM ('PENDING', 'PUBLISHED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "discount_type" AS ENUM ('PERCENT', 'FIXED');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "payout_status" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'USER',
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owner_profiles" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "business_name" VARCHAR(255),
    "description" TEXT,
    "contact_phone" VARCHAR(30),
    "verification_status" "owner_verification_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "owner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" BIGSERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "city" VARCHAR(150),
    "village" VARCHAR(150),
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cabins" (
    "id" BIGSERIAL NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "location_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "beds" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 0,
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "status" "cabin_status" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cabins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cabin_images" (
    "id" BIGSERIAL NOT NULL,
    "cabin_id" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "alt_text" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cabin_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cabin_amenities" (
    "cabin_id" BIGINT NOT NULL,
    "amenity_id" INTEGER NOT NULL,

    CONSTRAINT "cabin_amenities_pkey" PRIMARY KEY ("cabin_id","amenity_id")
);

-- CreateTable
CREATE TABLE "cabin_rules" (
    "id" BIGSERIAL NOT NULL,
    "cabin_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cabin_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "cabin_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" BIGSERIAL NOT NULL,
    "booking_number" VARCHAR(30) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "cabin_id" BIGINT NOT NULL,
    "check_in" DATE NOT NULL,
    "check_out" DATE NOT NULL,
    "guests_count" INTEGER NOT NULL,
    "guest_name" VARCHAR(200) NOT NULL,
    "guest_phone" VARCHAR(30) NOT NULL,
    "guest_email" VARCHAR(255),
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "nights" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "service_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "booking_status" NOT NULL DEFAULT 'PENDING',
    "cancellation_reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cabin_availability" (
    "id" BIGSERIAL NOT NULL,
    "cabin_id" BIGINT NOT NULL,
    "date" DATE NOT NULL,
    "status" "availability_status" NOT NULL DEFAULT 'AVAILABLE',
    "price" DECIMAL(10,2),
    "note" TEXT,

    CONSTRAINT "cabin_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "cabin_id" BIGINT NOT NULL,
    "booking_id" BIGINT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "status" "review_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_images" (
    "id" BIGSERIAL NOT NULL,
    "review_id" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "booking_id" BIGINT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "region_id" INTEGER,
    "check_in" DATE,
    "check_out" DATE,
    "guests_count" INTEGER,
    "min_price" DECIMAL(10,2),
    "max_price" DECIMAL(10,2),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" BIGSERIAL NOT NULL,
    "cabin_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "discount_type" "discount_type" NOT NULL,
    "discount_value" DECIMAL(10,2) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" BIGSERIAL NOT NULL,
    "booking_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'KGS',
    "payment_method" VARCHAR(50) NOT NULL,
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "transaction_id" VARCHAR(255),
    "paid_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cabin_views" (
    "id" BIGSERIAL NOT NULL,
    "cabin_id" BIGINT NOT NULL,
    "user_id" BIGINT,
    "viewed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cabin_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owner_payouts" (
    "id" BIGSERIAL NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "booking_id" BIGINT NOT NULL,
    "gross_amount" DECIMAL(10,2) NOT NULL,
    "commission_amount" DECIMAL(10,2) NOT NULL,
    "net_amount" DECIMAL(10,2) NOT NULL,
    "status" "payout_status" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "owner_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" BIGINT NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "owner_profiles_user_id_key" ON "owner_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_key" ON "regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "regions_slug_key" ON "regions"("slug");

-- CreateIndex
CREATE INDEX "locations_region_id_idx" ON "locations"("region_id");

-- CreateIndex
CREATE UNIQUE INDEX "cabins_slug_key" ON "cabins"("slug");

-- CreateIndex
CREATE INDEX "cabins_owner_id_status_idx" ON "cabins"("owner_id", "status");

-- CreateIndex
CREATE INDEX "cabins_location_id_status_idx" ON "cabins"("location_id", "status");

-- CreateIndex
CREATE INDEX "cabins_status_price_per_night_idx" ON "cabins"("status", "price_per_night");

-- CreateIndex
CREATE INDEX "cabins_status_max_guests_idx" ON "cabins"("status", "max_guests");

-- CreateIndex
CREATE INDEX "cabins_status_rating_idx" ON "cabins"("status", "rating");

-- CreateIndex
CREATE INDEX "cabin_images_cabin_id_sort_order_idx" ON "cabin_images"("cabin_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_name_key" ON "amenities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_slug_key" ON "amenities"("slug");

-- CreateIndex
CREATE INDEX "cabin_amenities_amenity_id_cabin_id_idx" ON "cabin_amenities"("amenity_id", "cabin_id");

-- CreateIndex
CREATE INDEX "cabin_rules_cabin_id_is_active_idx" ON "cabin_rules"("cabin_id", "is_active");

-- CreateIndex
CREATE INDEX "favorites_user_id_created_at_idx" ON "favorites"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "favorites_cabin_id_idx" ON "favorites"("cabin_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_cabin_id_key" ON "favorites"("user_id", "cabin_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_number_key" ON "bookings"("booking_number");

-- CreateIndex
CREATE INDEX "bookings_user_id_created_at_idx" ON "bookings"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "bookings_cabin_id_status_check_in_check_out_idx" ON "bookings"("cabin_id", "status", "check_in", "check_out");

-- CreateIndex
CREATE INDEX "bookings_status_check_out_idx" ON "bookings"("status", "check_out");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_id_user_id_key" ON "bookings"("id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_id_user_id_cabin_id_key" ON "bookings"("id", "user_id", "cabin_id");

-- CreateIndex
CREATE INDEX "cabin_availability_date_status_idx" ON "cabin_availability"("date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "cabin_availability_cabin_id_date_key" ON "cabin_availability"("cabin_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_booking_id_key" ON "reviews"("booking_id");

-- CreateIndex
CREATE INDEX "reviews_user_id_created_at_idx" ON "reviews"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "reviews_cabin_id_status_created_at_idx" ON "reviews"("cabin_id", "status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_booking_id_user_id_cabin_id_key" ON "reviews"("booking_id", "user_id", "cabin_id");

-- CreateIndex
CREATE INDEX "review_images_review_id_idx" ON "review_images"("review_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_created_at_idx" ON "notifications"("user_id", "is_read", "created_at");

-- CreateIndex
CREATE INDEX "notifications_booking_id_idx" ON "notifications"("booking_id");

-- CreateIndex
CREATE INDEX "search_history_user_id_created_at_idx" ON "search_history"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "search_history_region_id_idx" ON "search_history"("region_id");

-- CreateIndex
CREATE INDEX "promotions_cabin_id_is_active_start_date_end_date_idx" ON "promotions"("cabin_id", "is_active", "start_date", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

-- CreateIndex
CREATE INDEX "payments_booking_id_status_idx" ON "payments"("booking_id", "status");

-- CreateIndex
CREATE INDEX "payments_user_id_created_at_idx" ON "payments"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "cabin_views_cabin_id_viewed_at_idx" ON "cabin_views"("cabin_id", "viewed_at");

-- CreateIndex
CREATE INDEX "cabin_views_user_id_viewed_at_idx" ON "cabin_views"("user_id", "viewed_at");

-- CreateIndex
CREATE INDEX "owner_payouts_owner_id_status_created_at_idx" ON "owner_payouts"("owner_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "owner_payouts_booking_id_idx" ON "owner_payouts"("booking_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_created_at_idx" ON "audit_logs"("entity_type", "entity_id", "created_at");

-- AddForeignKey
ALTER TABLE "owner_profiles" ADD CONSTRAINT "owner_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabins" ADD CONSTRAINT "cabins_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabins" ADD CONSTRAINT "cabins_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabin_images" ADD CONSTRAINT "cabin_images_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabin_amenities" ADD CONSTRAINT "cabin_amenities_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabin_amenities" ADD CONSTRAINT "cabin_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabin_rules" ADD CONSTRAINT "cabin_rules_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabin_availability" ADD CONSTRAINT "cabin_availability_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_user_id_cabin_id_fkey" FOREIGN KEY ("booking_id", "user_id", "cabin_id") REFERENCES "bookings"("id", "user_id", "cabin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_images" ADD CONSTRAINT "review_images_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_user_id_fkey" FOREIGN KEY ("booking_id", "user_id") REFERENCES "bookings"("id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabin_views" ADD CONSTRAINT "cabin_views_cabin_id_fkey" FOREIGN KEY ("cabin_id") REFERENCES "cabins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cabin_views" ADD CONSTRAINT "cabin_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner_payouts" ADD CONSTRAINT "owner_payouts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner_payouts" ADD CONSTRAINT "owner_payouts_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
