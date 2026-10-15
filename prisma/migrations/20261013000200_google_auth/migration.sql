ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;

CREATE TABLE "google_accounts" (
    "id" BIGSERIAL NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "google_accounts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "google_accounts_subject_key" ON "google_accounts"("subject");
CREATE UNIQUE INDEX "google_accounts_user_id_key" ON "google_accounts"("user_id");
ALTER TABLE "google_accounts" ADD CONSTRAINT "google_accounts_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
