import type { ReactNode } from "react";
import RootLayout from "@/app/[locale]/layout";
import PlatformLayout from "@/app/[locale]/(platform)/layout";
import AdminLayout, { metadata as adminMetadata } from "@/app/[locale]/(administration)/admin/layout";
import NotFound from "@/app/[locale]/not-found";
import { requireAdmin } from "@/lib/auth";
import { isLocale, localeCookie, preferredLocale } from "@/app/i18n/config";
import { cookies, requestContext } from "./context";
import { NavigationResponse } from "./navigation";
import type { Metadata, PageProps } from "./types";

type PageModule = { default: (props: PageProps) => ReactNode | Promise<ReactNode>; metadata?: Metadata; generateMetadata?: (props: PageProps) => Promise<Metadata> };
type ApiModule = Record<string, (request: Request, context: { params: Promise<Record<string, string>> }) => Response | Promise<Response>>;
const pages = import.meta.glob<PageModule>("/app/**/page.tsx");
const apis = import.meta.glob<ApiModule>("/app/api/**/route.ts");

function routePattern(file: string, suffix: string) {
  const segments = file.replace(/^\/app/, "").replace(suffix, "").split("/").filter(part => part && !part.startsWith("("));
  const names: string[] = [];
  const pattern = segments.map(part => {
    if (part.startsWith("[...")) { names.push(part.slice(4, -1)); return "(.+)"; }
    if (part.startsWith("[")) { names.push(part.slice(1, -1)); return "([^/]+)"; }
    return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("/");
  return { regex: new RegExp(`^/${pattern}/?$`), names, weight: names.length * 100 - segments.length };
}
const pageRoutes = Object.entries(pages).filter(([file]) => !file.includes("[...rest]")).map(([file, load]) => ({ file, load, ...routePattern(file, "/page.tsx") })).sort((a, b) => a.weight - b.weight);
const apiRoutes = Object.entries(apis).map(([file, load]) => ({ load, ...routePattern(file, "/route.ts") })).sort((a, b) => a.weight - b.weight);
export function matchRoute(pathname: string) {
  for (const route of pageRoutes) {
    const match = route.regex.exec(pathname);
    if (match) return { ...route, params: Object.fromEntries(route.names.map((name, index) => [name, decodeURIComponent(match[index + 1])])) };
  }
}
export async function apiResponse(request: Request) {
  const pathname = new URL(request.url).pathname;
  for (const route of apiRoutes) {
    const match = route.regex.exec(pathname);
    if (!match) continue;
    const module = await route.load();
    const handler = module[request.method === "HEAD" ? "GET" : request.method];
    if (!handler) return new Response(null, { status: 405, headers: { Allow: Object.keys(module).filter(key => /^[A-Z]+$/.test(key)).join(", ") } });
    return handler(request, { params: Promise.resolve(Object.fromEntries(route.names.map((name, index) => [name, decodeURIComponent(match[index + 1])])) ) });
  }
  return Response.json({ error: "notFound" }, { status: 404 });
}
export async function localizedUrl(request: Request) {
  const url = new URL(request.url);
  const store = await cookies();
  const saved = store.get(localeCookie)?.value;
  const requested = url.searchParams.get("locale");
  let locale = saved && isLocale(saved) ? saved : preferredLocale(request.headers.get("accept-language"));
  const prefix = url.pathname.split("/")[1];
  if (url.pathname === "/admin" || url.pathname === "/admin/") {
    if (requested && isLocale(requested)) locale = requested;
    url.pathname = import.meta.env.DEV && locale === "kg" ? "/kg/admin" : `/${locale}/admin-login`;
  } else if (isLocale(prefix)) {
    locale = prefix;
    if (import.meta.env.DEV && locale === "kg") {
      url.pathname = url.pathname.replace(/^\/kg(?=\/|$)/, "") || "/";
      store.set(localeCookie, locale, { maxAge: 31536000, sameSite: "lax" });
      return { url, locale, redirect: true };
    }
  } else {
    if (!(import.meta.env.DEV && locale === "kg")) {
      url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
      store.set(localeCookie, locale, { maxAge: 31536000, sameSite: "lax" });
      return { url, locale, redirect: true };
    }
    url.pathname = `/kg${url.pathname === "/" ? "" : url.pathname}`;
  }
  store.set(localeCookie, locale, { maxAge: 31536000, sameSite: "lax" });
  return { url, locale, redirect: false };
}
export async function renderPage(url: URL, locale: string) {
  const route = matchRoute(url.pathname);
  requestContext().params = { ...route?.params, locale };
  const params = Promise.resolve({ ...route?.params, locale });
  const query: Record<string, string | string[]> = {};
  for (const key of new Set(url.searchParams.keys())) { const values = url.searchParams.getAll(key); query[key] = values.length === 1 ? values[0] : values; }
  const props = { params, searchParams: Promise.resolve(query) };
  let content: ReactNode;
  let metadata: Metadata = {};
  let status = 200;
  try {
    if (!route) throw new NavigationResponse(404);
    const module = await route.load();
    if (route.file.includes("(administration)")) await requireAdmin(locale as "kg" | "ru" | "en");
    const pageMetadata = module.generateMetadata ? await module.generateMetadata(props) : module.metadata || {};
    metadata = route.file.includes("(administration)") ? { ...adminMetadata, ...pageMetadata } : pageMetadata;
    content = await module.default(props);
    if (route.file.includes("(administration)")) content = await AdminLayout({ params, children: content });
    else if (route.file.includes("(platform)")) content = await PlatformLayout({ params, children: content });
  } catch (error) {
    if (!(error instanceof NavigationResponse) || error.location) throw error;
    status = 404;
    metadata = { title: "404 · A-FRAME KG", robots: { index: false, follow: false } };
    content = await NotFound();
  }
  return { root: await RootLayout({ params, metadata, children: content }), status };
}
