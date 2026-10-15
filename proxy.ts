import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isLocale, localeCookie, preferredLocale } from "@/app/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname === "/admin/") {
    const requestedLocale = request.nextUrl.searchParams.get("locale");
    const savedLocale = request.cookies.get(localeCookie)?.value;
    const locale = requestedLocale && isLocale(requestedLocale) ? requestedLocale
      : savedLocale && isLocale(savedLocale) ? savedLocale : preferredLocale(request.headers.get("accept-language"));
    const target = request.nextUrl.clone();
    target.pathname = `/${locale}/admin-login`;
    return NextResponse.rewrite(target);
  }
  if (isLocale(pathname.split("/")[1])) return NextResponse.next();

  const savedLocale = request.cookies.get(localeCookie)?.value;
  const locale = savedLocale && isLocale(savedLocale)
    ? savedLocale
    : preferredLocale(request.headers.get("accept-language"));
  const target = request.nextUrl.clone();
  target.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(target);
}

export const config = {
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|(?:icon|apple-icon)(?:/|$)|.*\\.[^/]+$).*)"],
};
