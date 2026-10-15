import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export async function publicSupportEmail() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("public-settings");
  const contact = await db.siteSetting.findUnique({ where: { key: "supportEmail" }, select: { value: true } });
  return typeof contact?.value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.value) ? contact.value : null;
}
