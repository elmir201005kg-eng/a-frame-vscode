import { Suspense, ViewTransition, type ReactNode } from "react";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { Locale } from "@/app/i18n/config";

import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { translated, type CommonDictionary } from "@/app/i18n/platform";
import { getUser } from "@/lib/auth";
import { favoriteIds } from "@/lib/catalog";

export async function PlatformHeader({ locale }: { locale: Locale }) {
  const [dictionary, user, common] = await Promise.all([
    translated<LandingDictionary>(locale, "landing"),
    getUser(),
    translated<CommonDictionary>(locale, "common"),
  ]);
  const favoriteCount = user ? (await favoriteIds(user.id)).length : 0;
  return (
    <SiteHeader
      locale={locale}
      dictionary={{ header: dictionary.header, language: dictionary.language, accessibility: dictionary.accessibility }}
      user={user ? { name: [user.firstName, user.lastName].filter(Boolean).join(" "), role: user.role, avatarUrl: user.avatarUrl } : null}
      favoriteCount={favoriteCount}
      logoutError={common.errors.serverError}
    />
  );
}
export async function PlatformShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dictionary = await translated<LandingDictionary>(locale, "landing");
  return (
    <div id="top">
      <a className="skip-link" href="#main-content">
        {dictionary.accessibility.skipToContent}
      </a>
      <Suspense fallback={<LoadingSkeleton variant="header" />}><PlatformHeader locale={locale} /></Suspense>
      <main id="main-content" className="product-main section-shell">
        <ViewTransition default="route-fade">{children}</ViewTransition>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
