"use client";
import Link from "@/components/navigation-link";
import { Brand } from "@/components/brand";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { PendingButton } from "@/components/pending-button";
import { isLocale } from "@/app/i18n/config";
import ru from "@/app/i18n/locales/ru/common.json";
import kg from "@/app/i18n/locales/kg/common.json";
import en from "@/app/i18n/locales/en/common.json";

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const params = useParams(),
    locale = typeof params.locale === "string" && isLocale(params.locale) ? params.locale : "ru",
    dictionary = { ru, kg, en }[locale];
  return (
    <main className="product-error section-shell">
      <Brand href={`/${locale}`} label={dictionary.labels.backHome} />
      <h1>{dictionary.errors.serverError}</h1>
      <div className="not-found-actions">
        <PendingButton className="button button-primary" type="button" pending={pending} onClick={() => startTransition(retry)}>
          {dictionary.labels.retry}
        </PendingButton>
        <Link className="button button-outline" href={`/${locale}`}>
          {dictionary.labels.backHome}
        </Link>
      </div>
    </main>
  );
}
