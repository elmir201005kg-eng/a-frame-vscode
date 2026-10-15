import type { Locale } from "@/app/i18n/config";
import { isLocale } from "@/app/i18n/config";

export class InputError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
export function fail(code: string): never {
  throw new InputError(code);
}
export function text(form: FormData, key: string, min = 0, max = 255) {
  const value = form.get(key);
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max)
    fail("invalidFields");
  return value.trim();
}
export function localeFrom(form: FormData): Locale {
  const locale = form.get("locale");
  if (typeof locale !== "string" || !isLocale(locale)) fail("invalidFields");
  return locale;
}
export function id(value: unknown) {
  if (typeof value !== "string" || !/^[1-9]\d{0,17}$/.test(value)) fail("invalidFields");
  return BigInt(value);
}
export function numberField(form: FormData, key: string, min: number, max: number, integer = true) {
  const raw = text(form, key, 1, 30);
  const value = Number(raw);
  if (
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isInteger(value))
  )
    fail("invalidFields");
  return value;
}
export function email(value: string) {
  if (value.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fail("invalidEmail");
  return value.toLowerCase();
}
export function phone(value: string) {
  if (!/^\+?[\d\s()-]{7,30}$/.test(value) || value.replace(/\D/g, "").length < 7)
    fail("invalidPhone");
  return value;
}
export function password(value: unknown) {
  if (
    typeof value !== "string" ||
    value.length < 10 ||
    value.length > 128 ||
    Buffer.byteLength(value, "utf8") > 256
  )
    fail("passwordLength");
  return value;
}
export function date(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail("invalidDates");
  const parsed = new Date(value + "T00:00:00Z");
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value)
    fail("invalidDates");
  return parsed;
}
export function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bishkek",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function stay(checkIn: string, checkOut: string, guests: string | number) {
  const start = date(checkIn),
    end = date(checkOut);
  const nights = (end.getTime() - start.getTime()) / 86400000;
  if (checkIn < today() || nights < 1 || nights > 365) fail("invalidDates");
  const count = Number(guests);
  if (!Number.isInteger(count) || count < 1 || count > 50) fail("invalidGuests");
  return { start, end, nights, guests: count };
}
export function safeNext(value: unknown, locale: Locale) {
  const fallback = `/${locale}/account`;
  if (typeof value !== "string" || value.length > 1000 || value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) return fallback;
  try {
    const origin = "https://aframe.invalid";
    const target = new URL(value, origin);
    const path = decodeURIComponent(target.pathname);
    if (!value.startsWith(`/${locale}/`) || target.origin !== origin ||
      !path.startsWith(`/${locale}/`) || path.includes("\\") ||
      /[\u0000-\u001f\u007f]/.test(path) ||
      /^\/(kg|ru|en)\/(login|register)(\/|$)/.test(path)) return fallback;
    return target.pathname + target.search + target.hash;
  } catch { return fallback; }
}
