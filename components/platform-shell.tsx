import { Suspense, type ReactNode } from "react";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PlatformMain } from "@/components/platform-main";
import { AiConsultant } from "@/components/ai-consultant";
import { aiText } from "@/app/i18n/ai";
import type { Locale } from "@/app/i18n/config";

import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { translated, type CommonDictionary } from "@/app/i18n/platform";
import { getUser } from "@/lib/auth";
import { favoriteIds } from "@/lib/catalog";
import { isDatabaseUnavailable } from "@/lib/db-errors";

async function headerAccount() {
  try {
    const user = await getUser();
    return { user, favoriteCount: user ? (await favoriteIds(user.id)).length : 0 };
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;
    console.warn(`[header] Account unavailable (${error.code ?? error.message}); showing the public navigation.`);
    return { user: null, favoriteCount: 0 };
  }
}

export async function PlatformHeader({ locale }: { locale: Locale }) {
  const [dictionary, account, common] = await Promise.all([
    translated<LandingDictionary>(locale, "landing"),
    headerAccount(),
    translated<CommonDictionary>(locale, "common"),
  ]);
  const { user, favoriteCount } = account;
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
      <PlatformMain>
        {children}
      </PlatformMain>
      <SiteFooter locale={locale} dictionary={dictionary} />
      <Suspense fallback={null}><AiConsultant locale={locale} labels={{ open: aiText[locale].open, close: aiText[locale].close }} /></Suspense>
    </div>
  );
}
