"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter, useRouterState } from "@/client/router";
import * as Popover from "@radix-ui/react-popover";
import { LayoutDashboard, House, CalendarDays, CreditCard, Users, BriefcaseBusiness, Bell, Settings, PanelLeftClose, PanelLeftOpen, Menu, X, Search, ChevronDown, ChevronRight, ArrowUpRight, LogOut, UserRound, RefreshCw, type LucideIcon } from "lucide-react";
import Link from "@/components/navigation-link";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoutForm } from "@/components/logout-form";
import { PremiumInput } from "@/components/premium-fields";
import type { Locale } from "@/app/i18n/config";
import type { AdminDictionary } from "@/app/i18n/admin";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { adminNavigation, adminParentSection, adminSectionFromPathname, adminSectionHref, type AdminPrimarySection } from "@/lib/admin-navigation";

const navigationIcons: Record<AdminPrimarySection, LucideIcon> = {
  dashboard: LayoutDashboard, cabins: House, bookings: CalendarDays,
  payments: CreditCard, users: Users, owners: BriefcaseBusiness, settings: Settings,
};
type SearchResult = { id: string; type: "cabins" | "bookings" | "users"; title: string; href: string };

function AdminSearch({ locale, text, nav }: { locale: Locale; text: AdminDictionary["shell"]; nav: CommonDictionary["nav"] }) {
  const [open, setOpen] = useState(false), [q, setQ] = useState("");
  const [result, setResult] = useState<{ query: string; rows: SearchResult[]; error: boolean } | null>(null);
  useEffect(() => {
    if (!open || q.trim().length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/admin/search?locale=${locale}&q=${encodeURIComponent(q.trim())}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("searchFailed");
        const data = await response.json();
        if (!controller.signal.aborted) setResult({ query: q, rows: data.results, error: false });
      } catch {
        if (!controller.signal.aborted) setResult({ query: q, rows: [], error: true });
      }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [locale, q, open]);
  const waiting = q.trim().length >= 2 && result?.query !== q;
  return <Popover.Root open={open} onOpenChange={setOpen}>
    <Popover.Trigger asChild><button className="admin-search-trigger" aria-label={text.search}><Search size={18} /><span>{text.search}</span><kbd>/</kbd></button></Popover.Trigger>
    <Popover.Portal><Popover.Content className="admin-popover admin-search-popover" sideOffset={10} collisionPadding={12} align="start" aria-label={text.search}>
      <div className="admin-search-input"><Search size={18} /><PremiumInput aria-label={text.search} value={q} onChange={event => setQ(event.target.value)} maxLength={100} placeholder={text.search} type="search" /><Popover.Close className="admin-icon-button" aria-label={text.close}><X size={17} /></Popover.Close></div>
      <div className="admin-search-results" aria-live="polite" aria-busy={waiting}>
        {q.trim().length < 2 ? <p>{text.searchHint}</p> : waiting ? <div className="admin-search-wait"><span className="ui-spinner" /></div> : result?.error ? <p role="alert">{text.searchError}</p> : !result?.rows.length ? <p>{text.searchEmpty}</p> : result.rows.map(row => <Link key={row.id} href={row.href} onClick={() => setOpen(false)}><span><small>{nav[row.type]}</small>{row.title}</span><ArrowUpRight size={16} /></Link>)}
      </div>
    </Popover.Content></Popover.Portal>
  </Popover.Root>;
}

export function AdminShell({ locale, text, common, language, name, notifications, unread, children }: {
  locale: Locale; text: AdminDictionary; common: CommonDictionary; language: LandingDictionary["language"];
  name: string; notifications: { id: string; title: string; message: string; href: string }[]; unread: number; children: ReactNode;
}) {
  const pathname = usePathname(), router = useRouter();
  const navigation = useRouterState();
  const [collapsed, setCollapsed] = useState(false), [refreshing, startRefresh] = useTransition();
  const drawer = useRef<HTMLDialogElement>(null), searchButton = useRef<HTMLDivElement>(null);
  const section = adminSectionFromPathname(pathname), activeSection = adminParentSection(section);
  const label = (key: string) => key === "dashboard" ? common.nav.home : key === "cabins" ? common.nav.catalog : common.nav[key as keyof typeof common.nav];
  const title = label(section) || common.nav.admin;
  const publicRoot = process.env.NODE_ENV !== "production" && locale === "kg" ? "" : `/${locale}`;
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "/" && !(event.target instanceof Element && event.target.closest("input,textarea,[contenteditable]"))) {
        event.preventDefault(); searchButton.current?.querySelector<HTMLButtonElement>("button")?.click();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  function sidebar(mobile = false) {
    return <>
      <div className="admin-sidebar-brand"><Brand /><span>{text.shell.workspace}</span></div>
      {mobile ? <button className="admin-drawer-close admin-icon-button" aria-label={text.shell.close} onClick={() => drawer.current?.close()}><X size={20} /></button> : <button className="admin-collapse admin-icon-button" aria-label={collapsed ? text.shell.expand : text.shell.collapse} aria-expanded={!collapsed} onClick={() => setCollapsed(value => !value)}>{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button>}
      <nav aria-label={common.nav.admin} className="admin-nav">
        {adminNavigation.map(({ section: key }) => {
          const Icon = navigationIcons[key];
          return <Link key={key} className="admin-nav-link" href={adminSectionHref(locale, key)} aria-current={activeSection === key ? "page" : undefined} aria-label={label(key)} title={collapsed && !mobile ? label(key) : undefined} onClick={() => drawer.current?.close()}><Icon size={19} /><span>{label(key)}</span></Link>;
        })}
      </nav>
      <div className="admin-sidebar-bottom"><a className="admin-nav-link" href={publicRoot || "/"} aria-label={text.shell.website} title={text.shell.website}><ArrowUpRight size={19} /><span>{text.shell.website}</span></a></div>
    </>;
  }
  return <div className="admin-shell" data-collapsed={collapsed || undefined}>
    <a className="skip-link" href="#admin-main">{text.shell.skip}</a>
    <aside className="admin-sidebar">{sidebar()}</aside>
    <dialog ref={drawer} className="admin-drawer" aria-label={common.nav.admin} onClick={event => { if (event.target === event.currentTarget) drawer.current?.close(); }}>{sidebar(true)}</dialog>
    <div className="admin-workspace">
      <header className="admin-topbar">
        <button className="admin-mobile-menu admin-icon-button" aria-label={text.shell.menu} onClick={() => drawer.current?.showModal()}><Menu size={21} /></button>
        <div className="admin-breadcrumb"><Link href={`/${locale}/admin`}>A-FRAME KG</Link><ChevronRight size={13} /><span>{title}</span></div>
        <div className="admin-topbar-actions">
          <div ref={searchButton}><AdminSearch locale={locale} text={text.shell} nav={common.nav} /></div>
          <button className="admin-icon-button admin-refresh" aria-label={text.shell.refresh} title={text.shell.refresh} aria-busy={refreshing} disabled={refreshing} onClick={() => startRefresh(() => router.refresh())}><RefreshCw size={18} className={refreshing ? "admin-spinning" : ""} /></button>
          <LanguageSwitcher locale={locale} labels={language} />
          <Popover.Root><Popover.Trigger asChild><button className="admin-icon-button admin-notification-trigger" aria-label={`${text.shell.notifications}: ${unread}`}><Bell size={19} />{unread > 0 && <span className="admin-unread-dot" />}</button></Popover.Trigger><Popover.Portal><Popover.Content className="admin-popover admin-notifications-popover" aria-label={text.shell.notifications} sideOffset={12} collisionPadding={12} align="end"><div className="admin-popover-heading"><strong>{text.shell.notifications}</strong><span>{unread}</span></div>{notifications.length ? notifications.map(row => <Popover.Close key={row.id} asChild><Link className="admin-notification" href={row.href}><Bell size={16} /><span><strong>{row.title}</strong><small>{row.message}</small></span></Link></Popover.Close>) : <p className="admin-popover-empty">{text.shell.noNotifications}</p>}<Popover.Close asChild><Link className="admin-popover-footer" href={`/${locale}/admin/notifications`}>{text.shell.allNotifications}<ChevronRight size={16} /></Link></Popover.Close></Popover.Content></Popover.Portal></Popover.Root>
          <Popover.Root><Popover.Trigger asChild><button className="admin-profile-trigger" aria-label={`${text.shell.profile}: ${name}`}><span className="admin-avatar">{name.slice(0, 1).toUpperCase()}</span><span className="admin-profile-name"><strong>{name}</strong><small>{text.shell.administrator}</small></span><ChevronDown size={14} /></button></Popover.Trigger><Popover.Portal><Popover.Content className="admin-popover admin-profile-popover" sideOffset={12} collisionPadding={12} align="end" aria-label={text.shell.profile}><div className="admin-popover-heading"><strong>{name}</strong></div><Popover.Close asChild><Link href={`/${locale}/admin/settings?profile=1#profile`}><UserRound size={17} />{text.shell.profile}</Link></Popover.Close><Popover.Close asChild><Link href={`/${locale}/admin/settings`}><Settings size={17} />{common.nav.settings}</Link></Popover.Close><LogoutForm locale={locale} label={text.shell.logout} errorLabel={common.errors.serverError} buttonClassName="admin-logout"><LogOut size={17} /></LogoutForm></Popover.Content></Popover.Portal></Popover.Root>
        </div>
      </header>
      <main id="admin-main" className="admin-content" aria-busy={navigation.pending}>
        {navigation.pending && <div className="admin-navigation-progress" role="status" aria-label={text.shell.refresh}><span className="ui-spinner" /></div>}
        {navigation.failedHref && <div className="admin-navigation-error" role="alert"><p>{common.errors.serverError}</p><button type="button" className="admin-button" onClick={() => { void navigation.navigate(navigation.failedHref!, { scroll: false }); }}>{text.shell.refresh}</button></div>}
        {children}
      </main>
    </div>
  </div>;
}
