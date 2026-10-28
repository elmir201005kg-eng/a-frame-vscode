import "server-only";
import type { Locale } from "@/app/i18n/config";
import { aiText } from "@/app/i18n/ai";
import { db } from "@/lib/db";
import { localizedName, localizedSettlement, publicCabinWhere } from "@/lib/catalog";
import { quoteStay } from "@/lib/booking";
import { InputError } from "@/lib/validation";
import { FINIK_PAYMENT_AMOUNT } from "@/lib/finik-config";
import { siteContact } from "@/lib/site-contact";
import type { ChatInput, ChatLink } from "./shared";
import { requestedStay, type StayRequest } from "./policy";

export type Fact = { id: string; text: string; link: ChatLink; kind: "site" | "cabin" | "availability" };
export type Knowledge = { facts: Fact[]; dataAvailable: boolean; stay: StayRequest | null };
export type Intent = "booking" | "payment" | "cancel" | "account" | "support" | "availability" | "cabins";
export function questionIntent(message: string): Intent {
  if (/отмен|возврат|cancel|refund|кайтар|жокко чыгар/iu.test(message)) return "cancel";
  if (/оплат|плат[её]ж|pay|finik|төлөм|төлөө/iu.test(message)) return "payment";
  if (/поддерж|контакт|support|contact|колдоо|байланыш/iu.test(message)) return "support";
  if (/регист|авторизац|войти|кабинет|избран|register|account|sign|log.?in|favorite|каттал|кабинет|тандалган/iu.test(message)) return "account";
  if (/как.{0,20}(?:брон|заброн)|how.{0,20}book|кантип.{0,20}брон/iu.test(message)) return "booking";
  if (/свобод|доступн|завтра|сегодня|дат[аыу]|availab|tomorrow|today|dates?|эртең|бүгүн|бош|жеткиликт|\d{4}-\d{2}-\d{2}/iu.test(message)) return "availability";
  return "cabins";
}
export function siteFacts(locale: Locale): Fact[] {
  const t = aiText[locale];
  const fact = (id: string, text: string, label: string, path: string): Fact => ({ id, text, link: { label, href: `/${locale}${path}` }, kind: "site" });
  return [
    fact("booking", t.booking, t.catalog, "/catalog"),
    fact("payment", t.payment.replace("{amount}", String(FINIK_PAYMENT_AMOUNT)), t.account, "/account"),
    fact("cancel", t.cancellation, t.account, "/account"),
    fact("account", t.registration, t.account, "/account"),
    fact("support", `${t.support}: ${siteContact.email}, ${siteContact.phone}.`, t.support, ""),
    fact("find", t.find, t.catalog, "/catalog"),
  ];
}

export async function loadKnowledge(input: ChatInput): Promise<Knowledge> {
  const { locale } = input, t = aiText[locale];
  const facts = siteFacts(locale);
  const stay = requestedStay(input.message, input.history);
  try {
    // Exact allowlist: never load owner contacts, users, booking records or admin settings.
    const contacts = await db.siteSetting.findMany({ where: { key: { in: ["supportEmail", "supportPhone"] } }, select: { key: true, value: true }, take: 2 });
    const email = contacts.find(row => row.key === "supportEmail")?.value;
    const phone = contacts.find(row => row.key === "supportPhone")?.value;
    facts.find(fact => fact.id === "support")!.text = `${t.support}: ${typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : siteContact.email}, ${typeof phone === "string" && /^\+?[\d ()-]{7,30}$/.test(phone) ? phone : siteContact.phone}.`;
    const intent = questionIntent(input.message);
    if (!["cabins", "availability"].includes(intent)) return { facts, stay, dataAvailable: true };
    const text = [...input.history.slice(-3).map(item => item.content), input.message].join(" ");
    const terms = text.split(/[^\p{L}\p{N}-]+/u).filter(term => term.length > 3).slice(-16);
    const matching = terms.length ? { OR: terms.flatMap(term => [
      { title: { contains: term, mode: "insensitive" as const } },
      { titleKg: { contains: term, mode: "insensitive" as const } },
      { titleEn: { contains: term, mode: "insensitive" as const } },
      { location: { region: { OR: ["name", "nameKg", "nameEn"].map(key => ({ [key]: { contains: term, mode: "insensitive" as const } })) } } },
    ]) } : {};
    const select = {
      id: true, slug: true, title: true, titleKg: true, titleEn: true,
      description: true, descriptionKg: true, descriptionEn: true,
      pricePerNight: true, maxGuests: true, checkInTime: true, checkOutTime: true, cancellationHours: true, isDemo: true,
      location: { select: { address: true, addressKg: true, addressEn: true, city: true, cityKg: true, cityEn: true, village: true, villageKg: true, villageEn: true, region: { select: { name: true, nameKg: true, nameEn: true } } } },
      amenities: { where: { amenity: { isActive: true } }, select: { amenity: { select: { name: true, nameKg: true, nameEn: true } } }, take: 12 },
      rules: { where: { isActive: true }, select: { title: true, titleKg: true, titleEn: true, description: true, descriptionKg: true, descriptionEn: true }, take: 6 },
    } as const;
    let rows = await db.cabin.findMany({ where: publicCabinWhere(input.cabinSlug ? { slug: input.cabinSlug } : matching), select, take: 4, orderBy: { id: "desc" } });
    // An explicit cabin context must never silently turn into a different cabin.
    if (!rows.length && !input.cabinSlug) rows = await db.cabin.findMany({ where: publicCabinWhere(), select, take: 4, orderBy: { id: "desc" } });
    if (!rows.length) facts.push({ id: "empty", text: t.noCabins, kind: "cabin", link: { label: t.catalog, href: `/${locale}/catalog` } });
    for (const row of rows) {
      const title = (locale === "kg" ? row.titleKg : locale === "en" ? row.titleEn : null) || row.title;
      const link = { label: title, href: `/${locale}/cabins/${row.slug}` };
      const description = ((locale === "kg" ? row.descriptionKg : locale === "en" ? row.descriptionEn : null) || row.description).slice(0, 500);
      facts.push({ id: `cabin-${row.id}`, kind: "cabin", link, text: [
        title, ...(row.isDemo ? [t.demo] : []), description,
        `${row.pricePerNight.toFixed(2)} KGS — ${t.price}`,
        `${t.location}: ${[localizedName(row.location.region, locale), localizedSettlement(row.location, locale), (locale === "kg" ? row.location.addressKg : locale === "en" ? row.location.addressEn : null) || row.location.address].filter(Boolean).join(", ")}`,
        `${t.guests}: ${row.maxGuests}`,
        `${t.amenities}: ${row.amenities.map(item => localizedName(item.amenity, locale)).join(", ") || "—"}`,
        `${t.checkIn}: ${row.checkInTime}; ${t.checkOut}: ${row.checkOutTime}; ${t.cancelHours}: ${row.cancellationHours}`,
        `${t.rules}: ${row.rules.map(rule => [
          (locale === "kg" ? rule.titleKg : locale === "en" ? rule.titleEn : null) || rule.title,
          ((locale === "kg" ? rule.descriptionKg : locale === "en" ? rule.descriptionEn : null) || rule.description)?.slice(0, 180),
        ].filter(Boolean).join(": ")).join("; ") || "—"}`,
      ].join("\n") });
      if (!stay) continue;
      let result: string;
      try {
        // Reuse the exact business function behind GET /api/availability, including calendar prices/promotions.
        const quote = await quoteStay(row.id, stay.checkIn, stay.checkOut, stay.guests);
        result = `${t.available}. ${t.total}: ${quote.total.toFixed(2)} KGS.`;
      } catch (error) {
        result = error instanceof InputError && ["datesUnavailable", "invalidGuests", "cabinUnavailable", "demoUnavailable", "cabinNotBookable"].includes(error.code) ? t.notAvailable : t.availabilityUnknown;
      }
      facts.push({ id: `availability-${row.id}`, kind: "availability", link, text: `${title}\n${t.stay}: ${stay.checkIn} → ${stay.checkOut}; ${t.guestCount}: ${stay.guests}.\n${result}\n${row.isDemo ? `${t.demo}\n` : ""}${t.availabilityNote}\n${t.stayDefaults}` });
    }
    return { facts, dataAvailable: true, stay };
  } catch {
    // Never substitute demo listings or stale availability if the actual database is unavailable.
    return { facts: siteFacts(locale), dataAvailable: false, stay };
  }
}

export function relevantFacts(knowledge: Knowledge, intent: Intent) {
  if (intent === "cabins" || intent === "availability") {
    const matches = knowledge.facts.filter(fact => fact.kind === (knowledge.stay ? "availability" : "cabin"));
    return matches.length ? matches.slice(0, 3) : knowledge.facts.filter(fact => fact.id === "find");
  }
  return knowledge.facts.filter(fact => fact.id === intent);
}
