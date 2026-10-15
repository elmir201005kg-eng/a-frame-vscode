"use client";

import type { Locale } from "@/app/i18n/config";
import { Icon } from "@/components/icon";
import { pwaText } from "@/lib/pwa";

export function OfflineNotice({ locale }: { locale: Locale }) {
  const text = pwaText[locale];
  return (
    <section className="offline-notice section-shell" aria-labelledby="offline-title" role="status">
      <Icon name="wifi" size={24} />
      <div><h2 id="offline-title">{text.offline}</h2><p>{text.description}</p></div>
      <div className="offline-actions">
        <a className="text-link" href={`/${locale}`}>{text.home}<Icon name="arrow-right" size={17} /></a>
        <button className="button button-outline" type="button" onClick={() => {
          const target = new URL(window.location.href);
          if (/^\/(kg|ru|en)\/offline\/?$/.test(target.pathname)) target.pathname = `/${locale}`;
          window.location.replace(target.href);
        }}>{text.retry}</button>
      </div>
    </section>
  );
}
