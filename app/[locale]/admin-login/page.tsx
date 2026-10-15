import { isAdminRole } from "@/lib/roles";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation-link";
import { Suspense } from "react";
import { LogoutForm } from "@/components/logout-form";
import { locales, localeSettings } from "@/app/i18n/config";
import { translated, type CommonDictionary } from "@/app/i18n/platform";
import { AdminLoginForm, type AdminLoginDictionary } from "@/components/admin-login-form";
import { Brand } from "@/components/brand";
import { Icon } from "@/components/icon";
import { PageHeading } from "@/components/product-ui";
import { getPendingAdminLogin } from "@/lib/admin-two-factor";
import { getUser } from "@/lib/auth";
import { routeLocale } from "@/lib/route";
import { redirect } from "next/navigation";

export const instant = false;
export const metadata: Metadata = {
  title: "A-FRAME KG · ADMIN",
  robots: { index: false, follow: false },
};

type AdminLoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ restart?: string | string[] }>;
};

async function AdminLoginContent({ params, searchParams }: AdminLoginPageProps) {
  const locale = await routeLocale(params);
  const query = await searchParams;
  const restart = typeof query.restart === "string" && query.restart.length <= 32
    ? query.restart || "initial"
    : "initial";
  const [common, text, user, initialPending] = await Promise.all([
    translated<CommonDictionary>(locale, "common"),
    translated<AdminLoginDictionary>(locale, "admin-login"),
    getUser(),
    getPendingAdminLogin(),
  ]);
  if (user && isAdminRole(user.role)) redirect(`/${locale}/admin`);

  return (
    <div className="admin-auth-page" lang={localeSettings[locale].htmlLang}>
      <a className="skip-link" href="#admin-auth-content">{text.skipContent}</a>
      <header className="admin-auth-header">
        <Brand href={`/${locale}`} label={common.nav.home} inverse />
        <nav className="admin-auth-languages" aria-label={text.languageLabel}>
          <Icon name="globe" size={16} />
          {locales.map((language) => (
            <Link
              key={language}
              href={`/admin?locale=${language}`}
              lang={localeSettings[language].htmlLang}
              aria-label={text.languages[language]}
              aria-current={language === locale ? "page" : undefined}
            >
              {language.toUpperCase()}
            </Link>
          ))}
        </nav>
      </header>
      <main id="admin-auth-content" className="auth-layout admin-auth-layout">
        <div className="auth-photo admin-auth-photo" aria-hidden="true">
          <Image
            src="/images/kyrgyzstan-karakol.webp"
            alt=""
            fill
            sizes="(max-width: 767px) 0px, (max-width: 1196px) 45vw, 495px"
            loading="eager"
          />
          <div className="admin-auth-photo-caption">
            <p className="eyebrow">A-FRAME KG</p>
            <p className="admin-auth-photo-title">{text.photoTitle}</p>
            <span>{text.photoCaption}</span>
          </div>
        </div>
        <div className="auth-content admin-auth-content">
          {isAdminRole(user?.role) ? (
            <>
              <div className="admin-auth-confirmed"><Icon name="shield" size={27} /></div>
              <PageHeading text={text.success} />
              <div className="admin-auth-session" role="status">
                <span>{text.sessionLabel}</span>
                <strong>{user.firstName}</strong>
                <p>{user.email}</p>
              </div>
              <LogoutForm locale={locale} label={common.nav.logout} errorLabel={common.errors.serverError} className="admin-auth-logout" buttonClassName="button button-outline" />
            </>
          ) : (
            <AdminLoginForm
              key={`${locale}:${restart}`}
              locale={locale}
              common={common}
              text={text}
              initialPending={initialPending}
            />
          )}
        </div>
      </main>
      <footer className="admin-auth-footer">
        <Link className="text-link" href={`/${locale}`}>
          <Icon name="arrow-left" size={16} />
          {text.backSite}
        </Link>
      </footer>
    </div>
  );
}

export default function AdminLoginPage(props: AdminLoginPageProps) {
  return (
    <Suspense fallback={
      <div className="admin-auth-loading product-loading" aria-busy="true">
        <span className="loading-line" />
        <span className="loading-line" />
      </div>
    }>
      <AdminLoginContent {...props} />
    </Suspense>
  );
}
