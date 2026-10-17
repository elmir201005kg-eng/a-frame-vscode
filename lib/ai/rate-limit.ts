import "server-only";
import { createHash } from "node:crypto";
import { db, databaseTable } from "@/lib/db";

const state = globalThis as unknown as { aiLimits?: Map<string, { count: number; reset: number }>; aiActive?: number };
const buckets = state.aiLimits ??= new Map();
export function consumeLocalLimit(key: string, limit = 12, now = Date.now()) {
  for (const [id, bucket] of buckets) if (bucket.reset <= now) buckets.delete(id);
  const hashed = createHash("sha256").update(key).digest("hex");
  let bucket = buckets.get(hashed);
  if (!bucket) {
    if (buckets.size >= 2000) return 60;
    bucket = { count: 0, reset: now + 60000 };
    buckets.set(hashed, bucket);
  }
  bucket.count++;
  return bucket.count > limit ? Math.max(1, Math.ceil((bucket.reset - now) / 1000)) : 0;
}
export function acquireModelSlot() {
  if ((state.aiActive || 0) >= 2) return false;
  state.aiActive = (state.aiActive || 0) + 1;
  return true;
}
export function releaseModelSlot() { state.aiActive = Math.max(0, (state.aiActive || 0) - 1); }

export async function consumeSharedLimit(): Promise<"ok" | "busy" | "offline"> {
  try {
    // Atomic shared budget across processes/replicas, using the project's existing throttle table.
    // This stable key adds only one row; no IPs or conversation text are stored in PostgreSQL.
    const key = createHash("sha256").update("a-frame-ai-global-minute").digest("hex");
    const rows = await db.$queryRaw<{ attempts: number }[]>`
      INSERT INTO ${databaseTable("auth_throttles")} AS throttle (key, attempts, expires_at)
      VALUES (${key}, 1, NOW() + INTERVAL '1 minute')
      ON CONFLICT (key) DO UPDATE SET
        attempts = CASE WHEN throttle.expires_at <= NOW() THEN 1 ELSE LEAST(throttle.attempts + 1, 1000) END,
        expires_at = CASE WHEN throttle.expires_at <= NOW() THEN NOW() + INTERVAL '1 minute' ELSE throttle.expires_at END
      RETURNING attempts`;
    return rows[0]?.attempts <= 24 ? "ok" : "busy";
  } catch { return "offline"; }
}
