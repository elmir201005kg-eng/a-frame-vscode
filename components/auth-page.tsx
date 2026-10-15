import Link from "@/components/navigation-link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { AuthForm } from "@/components/auth-form";
import { Icon } from "@/components/icon";
import { PageHeading } from "@/components/product-ui";
import { routeLocale } from "@/lib/route";
import { getUser } from "@/lib/auth";
import { pageDictionaries } from "@/app/i18n/platform";
import { single } from "@/lib/catalog";
import type { SearchParams } from "@/lib/catalog";
import { safeNext } from "@/lib/validation";

export type AuthPageProps = { params: Promise<{ locale: string }>; searchParams: Promise<SearchParams> };
export async function AuthenticationPage({ params, searchParams, mode }: AuthPageProps & { mode: "login" | "register" }) {
  const locale = await routeLocale(params), query = await searchParams;
  const requestedNext = single(query, "next");
  const next = requestedNext ? safeNext(requestedNext, locale) : "";
  if (await getUser()) redirect(next || `/${locale}/account`);
  const { common, text } = await pageDictionaries(locale, mode);
  const role = single(query, "role") === "OWNER" || next.includes("/owner") ? "OWNER" : "USER";
  const tabQuery = new URLSearchParams();
  if (next) tabQuery.set("next", next);
  if (role === "OWNER") tabQuery.set("role", role);
  const suffix = tabQuery.size ? `?${tabQuery}` : "";
  return (
    <div className="auth-layout traveler-auth-layout">
      <div className="auth-photo traveler-auth-photo">
        <Image src="/images/kyrgyzstan-karakol.webp" alt="" fill sizes="(max-width:767px) 0px, 45vw" loading="eager" />
        <div className="traveler-auth-caption">
          <Brand inverse href={`/${locale}`} label={common.nav.home} />
          <p>{common.auth.photoTitle}</p>
          <span>{common.auth.photoDescription}</span>
        </div>
      </div>
      <div className="auth-content traveler-auth-content">
        <Link className="auth-back" href={`/${locale}`}><Icon name="arrow-left" size={17} />{common.auth.back}</Link>
        <nav className="auth-tabs" aria-label={common.auth.tabsLabel}>
          <Link href={`/${locale}/login${suffix}`} aria-current={mode === "login" ? "page" : undefined}>{common.auth.loginTab}</Link>
          <Link href={`/${locale}/register${suffix}`} aria-current={mode === "register" ? "page" : undefined}>{common.auth.registerTab}</Link>
        </nav>
        <PageHeading text={text} />
        <AuthForm key={`${mode}:${role}:${next}`} mode={mode} locale={locale} common={common} next={next} initialRole={role} oauthError={single(query, "error")} />
      </div>
    </div>
  );
}
