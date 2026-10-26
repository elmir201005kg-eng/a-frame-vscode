import type { PageProps } from "@/server/types";
import type { Metadata } from "@/server/types";
import { notFound } from "@/server/navigation";
import { isLocale } from "@/app/i18n/config";
import { getLandingDictionary } from "@/app/i18n/dictionaries";
import { HomeContent } from "@/components/home-content";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { metadata } = await getLandingDictionary(locale);
  return { title: metadata.title, description: metadata.description, robots: { index: false, follow: false } };
}

export default async function OfflinePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomeContent locale={locale} offline />;
}
