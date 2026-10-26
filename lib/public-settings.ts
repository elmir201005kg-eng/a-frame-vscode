import { cachedPublic } from "@/server/cache";
import "server-only";
import { db } from "@/lib/db";

export async function publicSupportEmail() {
  return cachedPublic("publicSupportEmail", ["public-settings"], async () => {
    const contact = await db.siteSetting.findUnique({ where: { key: "supportEmail" }, select: { value: true } });
    return typeof contact?.value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.value) ? contact.value : null;
  });
}

export async function publicContactSettings() {
  return cachedPublic("publicContactSettings", ["public-settings"], async () => {
    const rows = await db.siteSetting.findMany({ where: { key: { in: ["supportPhone", "address"] } }, select: { key: true, value: true } });
    const value = (key: string) => { const row = rows.find(item => item.key === key); return typeof row?.value === "string" ? row.value : ""; };
    return { phone: value("supportPhone"), address: value("address") };
  });
}
