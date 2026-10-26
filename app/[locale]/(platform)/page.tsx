import type { PageProps } from "@/server/types";
import type { Metadata } from "@/server/types";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { HomeContent } from "@/components/home-content";
import { notFound } from "@/server/navigation";
import { isLocale, localeSettings } from "@/app/i18n/config";
import { getLandingDictionary } from "@/app/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { metadata } = await getLandingDictionary(locale);

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    applicationName: "A-FRAME KG",
    openGraph: {
      title: metadata.openGraphTitle,
      description: metadata.openGraphDescription,
      locale: localeSettings[locale].openGraph,
      type: "website",
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <Suspense
      fallback={<LoadingSkeleton variant="home" />}
    >
      <HomeContent locale={locale} embedded />
    </Suspense>
  );
}

