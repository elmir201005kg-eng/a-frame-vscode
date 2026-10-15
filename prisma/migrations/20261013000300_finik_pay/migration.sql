ALTER TABLE "payments"
  ADD COLUMN "provider_payment_id" VARCHAR(36),
  ADD COLUMN "payment_url" TEXT;

CREATE UNIQUE INDEX "payments_provider_payment_id_key" ON "payments"("provider_payment_id");

-- Replace unpaid configuration placeholders with the fixed Finik charge.
-- Historical received payments are preserved.
UPDATE "payments" AS p SET "amount" = 5, "payment_method" = 'FINIK_QR'
FROM "bookings" AS b JOIN "cabins" AS c ON c.id = b.cabin_id
WHERE p.booking_id = b.id AND p.status = 'PENDING'
  AND p.payment_method = 'AWAITING_CONFIGURATION'
  AND b.status IN ('PENDING', 'CONFIRMED')
  AND b.booking_number NOT LIKE 'DEMO-%' AND c.is_demo = false;
