"use client";
import Link from "@/components/navigation-link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { Icon } from "@/components/icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/app/i18n/config";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { formatNumber } from "@/app/i18n/format";
import { LogoutForm } from "@/components/logout-form";

export function SiteHeader({
  locale,
  dictionary,
  user = null,
  favoriteCount = 0,
  logoutError,
}: {
  locale: Locale;
  dictionary: Pick<LandingDictionary, "header" | "language" | "accessibility">;
  user?: { name: string; role: string; avatarUrl: string | null } | null;
  favoriteCount?: number;
  logoutError: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null), accountButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null),
    menuButtonRef = useRef<HTMLButtonElement>(null);
  const text = dictionary.header;
  const links = [
    { href: `/${locale}`, label: text.home },
    { href: `/${locale}/catalog`, label: text.cabins },
    { href: `/${locale}#destinations`, label: text.destinations },
    { href: `/${locale}#how-it-works`, label: text.howItWorks },
  ];
  const accountHref = `/${locale}/${user?.role === "ADMIN" ? "admin" : user?.role === "OWNER" ? "owner" : "account"}`;
  const accountLinks = [
    { href: `/${locale}/account?tab=profile`, label: text.myProfile, icon: "user" as const },
    { href: `/${locale}/account?tab=bookings`, label: text.myBookings, icon: "calendar" as const },
    { href: `/${locale}/account?tab=settings`, label: text.settings, icon: "settings" as const },
  ];
  useEffect(() => {
    if (!accountOpen) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setAccountOpen(false); accountButtonRef.current?.focus(); }
    };
    window.addEventListener("pointerdown", outside);
    window.addEventListener("keydown", escape);
    return () => { window.removeEventListener("pointerdown", outside); window.removeEventListener("keydown", escape); };
  }, [accountOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target))
        setMenuOpen(false);
    };
    window.addEventListener("keydown", escape);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("pointerdown", outside);
    };
  }, [menuOpen]);
  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-inner section-shell">
        <Brand label={dictionary.accessibility.brandHome} href={`/${locale}`} />
        <nav className="desktop-nav" aria-label={text.navigation}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="owner-link" href={`/${locale}/owner`}>
            {text.owners}
            <Icon name="arrow-up-right" size={16} />
          </Link>
          <LanguageSwitcher locale={locale} labels={dictionary.language} />
          <Link
            className="header-icon-button header-favorites"
            href={`/${locale}/account?tab=favorites`}
            aria-label={text.favorites}
            title={text.favorites}
          >
            <Icon name="heart" size={20} />
            {favoriteCount > 0 && (
              <span className="header-favorites-count">{formatNumber(favoriteCount, locale)}</span>
            )}
          </Link>
          <Link className="button button-primary header-book" href={`/${locale}/catalog`}>
            {text.findCabin}
            <Icon name="arrow-up-right" size={17} />
          </Link>
          {user ? <div className="header-account" ref={accountRef} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setAccountOpen(false);
          }}>
            <button ref={accountButtonRef} type="button" className="header-account-button" aria-label={`${text.accountTitle}: ${user.name}`}
              aria-expanded={accountOpen} aria-controls="header-account-dropdown" onClick={() => { setAccountOpen(!accountOpen); setMenuOpen(false); }}>
              <UserAvatar key={user.avatarUrl || user.name} name={user.name} url={user.avatarUrl} />
              <Icon name="chevron-down" size={15} />
            </button>
            {accountOpen && <div className="header-account-dropdown" id="header-account-dropdown">
              <Link className="header-account-name" href={accountHref} onClick={() => setAccountOpen(false)}>{user.name}</Link>
              {accountLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setAccountOpen(false)}>
                <Icon name={link.icon} size={18} /><span>{link.label}</span>
              </Link>)}
              <LogoutForm locale={locale} label={text.logout} errorLabel={logoutError}><Icon name="logout" size={18} /></LogoutForm>
            </div>}
          </div> : <Link
            className="header-sign-in"
            href={`/${locale}/login`}
          >
            <Icon name="user" size={19} />
            <span>{text.signIn}</span>
          </Link>}
          <button
            ref={menuButtonRef}
            type="button"
            className="mobile-menu-button"
            aria-label={menuOpen ? text.closeMenu : text.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => { setMenuOpen(!menuOpen); setAccountOpen(false); }}
          >
            <Icon name={menuOpen ? "x" : "menu"} size={24} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label={text.mobileNavigation}
        >
          {[
            ...links,
            { href: `/${locale}/owner`, label: text.ownersMobile },
            {
              href: user ? accountHref : `/${locale}/login`,
              label: user ? user.name : text.signIn,
            },
            ...(user ? accountLinks : []),
          ].map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
              <Icon name="arrow-up-right" size={18} />
            </Link>
          ))}
          {user && (
            <LogoutForm locale={locale} label={text.logout} errorLabel={logoutError} buttonClassName="mobile-account-link" />
          )}
          <Link
            className="button button-primary"
            href={`/${locale}/catalog`}
            onClick={() => setMenuOpen(false)}
          >
            {text.findYourCabin}
            <Icon name="search" size={18} />
          </Link>
        </nav>
      )}
    </header>
  );
}

function UserAvatar({ name, url }: { name: string; url: string | null }) {
  const [failed, setFailed] = useState(false);
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <span className="header-user-avatar" aria-hidden="true">
    {url && !failed ? <Image src={url} alt="" width={34} height={34} unoptimized referrerPolicy="no-referrer" onError={() => setFailed(true)} /> : initials}
  </span>;
}
