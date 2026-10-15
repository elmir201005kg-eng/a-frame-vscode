ALTER TABLE "sessions" ADD COLUMN "admin_verified_at" TIMESTAMPTZ(3);

CREATE TABLE "admin_login_challenges" (
    "id" VARCHAR(64) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "code_hash" VARCHAR(64) NOT NULL,
    "credential_version" VARCHAR(64) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "delivered_at" TIMESTAMPTZ(3),
    "redirect_to" VARCHAR(1000) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_login_challenges_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "admin_login_challenges_attempts_check" CHECK ("attempts" >= 0 AND "attempts" <= 5)
);
CREATE UNIQUE INDEX "admin_login_challenges_user_id_key" ON "admin_login_challenges"("user_id");
CREATE INDEX "admin_login_challenges_expires_at_idx" ON "admin_login_challenges"("expires_at");
ALTER TABLE "admin_login_challenges" ADD CONSTRAINT "admin_login_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
