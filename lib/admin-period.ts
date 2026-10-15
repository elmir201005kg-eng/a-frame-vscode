import { addDays, bishkekToday, isDateOnly } from "@/lib/stay-dates";

export type AdminQuery = Record<string, string | string[] | undefined>;
export function adminPeriod(query: AdminQuery, now = new Date()) {
  const today = bishkekToday(now);
  const requested = typeof query.period === "string" ? query.period : "30";
  const period = ["1", "7", "30", "90", "365", "custom"].includes(requested) ? requested : "30";
  let end = today, start = addDays(end, 1 - Number(period === "custom" ? "30" : period));
  let invalid = false;
  if (period === "custom") {
    if (typeof query.from === "string" && typeof query.to === "string" &&
      isDateOnly(query.from) && isDateOnly(query.to) && query.from <= query.to &&
      query.to <= today && query.to <= addDays(query.from, 365)) {
      start = query.from; end = query.to;
    } else invalid = true;
  }
  return { period, start, end, today, invalid,
    from: new Date(`${start}T00:00:00+06:00`), until: new Date(`${addDays(end, 1)}T00:00:00+06:00`) };
}

export function adminPage(query: AdminQuery) {
  const raw = Number(typeof query.page === "string" ? query.page : 1);
  return Number.isSafeInteger(raw) && raw > 0 && raw <= 100000 ? raw : 1;
}
