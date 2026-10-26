"use client";
import { useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import { normalizeHref, useRouterState } from "@/client/router";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; prefetch?: boolean; replace?: boolean; scroll?: boolean; children?: ReactNode };
export default function NavigationLink({ href, children, className = "", prefetch: _prefetch, replace, scroll, onClick, ...props }: LinkProps) {
  const router = useRouterState();
  const [pending, setPending] = useState(false);
  const target = normalizeHref(href);
  return <a {...props} href={target} className={`navigation-link ${className}`} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || props.download || (props.target && props.target !== "_self") || !navigator.onLine) return;
    const url = new URL(target, window.location.href);
    if (url.origin !== window.location.origin || url.pathname.startsWith("/api/")) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    event.preventDefault();
    setPending(true);
    void router.navigate(target, { replace, scroll }).finally(() => setPending(false));
  }}>{children}<span className="link-pending-hint" data-pending={pending || undefined} aria-hidden="true" /></a>;
}
