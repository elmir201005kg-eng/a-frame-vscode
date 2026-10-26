import "server-only";

// Only explicitly public data uses this process cache. Sessions, prices and bookings never do.
const entries = new Map<string, { promise: Promise<unknown>; expires: number; tags: string[] }>();
export function cachedPublic<T>(key: string, tags: string[], load: () => Promise<T>, ttl = 300_000): Promise<T> {
  const existing = entries.get(key);
  if (existing && existing.expires > Date.now()) return existing.promise as Promise<T>;
  if (entries.size >= 128) entries.delete(entries.keys().next().value!);
  const entry = { promise: Promise.resolve().then(load), expires: Date.now() + ttl, tags };
  entries.set(key, entry);
  entry.promise.catch(() => { if (entries.get(key) === entry) entries.delete(key); });
  return entry.promise;
}
export function updateTag(tag: string) { for (const [key, entry] of entries) if (entry.tags.includes(tag)) entries.delete(key); }
export function revalidatePath(_path: string, _type?: "layout" | "page") {
  // Every action renders fresh request data; clear public lookups after mutations too.
  entries.clear();
}
