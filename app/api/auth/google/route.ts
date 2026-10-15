import { NextResponse } from "next/server";
import { isLocale, defaultLocale } from "@/app/i18n/config";
import { clearGoogleFlow, googleErrorCode, startGoogleLogin } from "@/lib/google-auth";
import { safeNext } from "@/lib/validation";

export async function POST(request: Request) {
  const form = await request.formData();
  const rawLocale = form.get("locale");
  const locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : defaultLocale;
  try {
    const target = await startGoogleLogin(request, form);
    const response = NextResponse.redirect(new URL(target, request.url), 303);
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch (error) {
    await clearGoogleFlow();
    const path = form.get("intent") === "link" ? `/${locale}/account?tab=settings&` : `/${locale}/login?next=${encodeURIComponent(safeNext(form.get("next"), locale))}&`;
    const target = new URL(path + "error=" + encodeURIComponent(googleErrorCode(error)), request.url);
    const response = NextResponse.redirect(target, 303);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
