/** Date-only values are always calculated in UTC; today belongs to Kyrgyzstan. */
export function isDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function addDays(value: string, count: number) {
  if (!isDateOnly(value)) return "";
  return new Date(new Date(`${value}T00:00:00Z`).getTime() + count * 86400000).toISOString().slice(0, 10);
}

export function bishkekToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bishkek", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

export function validStay(start: string, end: string, minimum: string, blocked: readonly string[] = []) {
  if (!isDateOnly(start) || !isDateOnly(end) || start < minimum || end <= start || end > addDays(start, 365)) return false;
  // A blocked checkout day is allowed; the night before it must be free.
  return !blocked.some(day => day >= start && day < end);
}
