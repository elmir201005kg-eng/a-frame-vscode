"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";

type Router = { url: string; pending: boolean; failedHref: string | null; navigate: (href: string, options?: { replace?: boolean; scroll?: boolean }) => Promise<void>; refresh: () => Promise<void> };
const RouterContext = createContext<Router | null>(null);
export function RouterProvider({ children, ...router }: Router & { children: ReactNode }) { return <RouterContext value={router}>{children}</RouterContext>; }
export function useRouterState() {
  const router = useContext(RouterContext);
  if (!router) throw new Error("RouterProvider is missing");
  return router;
}
export function useRouter() {
  const router = useRouterState();
  const { navigate, refresh } = router;
  return useMemo(() => ({
    push: (href: string, options?: { scroll?: boolean }) => navigate(href, options),
    replace: (href: string, options?: { scroll?: boolean }) => navigate(href, { ...options, replace: true }),
    refresh,
    back: () => window.history.back(),
  }), [navigate, refresh]);
}
export function usePathname() { return new URL(useRouterState().url, "http://localhost").pathname; }
export function useParams() { const segments = usePathname().split("/"); return { locale: /^(kg|ru|en)$/.test(segments[1]) ? segments[1] : "kg" }; }
export function normalizeHref(href: string) { return import.meta.env.DEV ? href.replace(/^\/kg(?=\/|[?#]|$)/, "") || "/" : href; }
