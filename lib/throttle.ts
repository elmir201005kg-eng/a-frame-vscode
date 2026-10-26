import "server-only";
import { createHash } from "node:crypto";
import { db, databaseTable } from "@/lib/db";
import { fail } from "@/lib/validation";

export async function throttle(key: string, limit = 10) {
  const hashed = createHash("sha256").update(key).digest("hex");
  const rows = await db.$queryRaw<{ attempts: number }[]>`
    INSERT INTO ${databaseTable("auth_throttles")} AS auth_throttles (key, attempts, expires_at) VALUES (${hashed}, 1, NOW() + INTERVAL '15 minutes')
    ON CONFLICT (key) DO UPDATE SET attempts = CASE WHEN auth_throttles.expires_at < NOW() THEN 1 ELSE auth_throttles.attempts + 1 END,
    expires_at = CASE WHEN auth_throttles.expires_at < NOW() THEN NOW() + INTERVAL '15 minutes' ELSE auth_throttles.expires_at END RETURNING attempts
  `;
  if (rows[0].attempts > limit) fail("tooManyAttempts");
}
