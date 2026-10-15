import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/app/i18n/config";
import { getLandingDictionary } from "@/app/i18n/dictionaries";
import { HomeContent } from "@/components/home-content";

export async function generateMetadata({ params }: PageProps<"/[locale]/offline">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { metadata } = await getLandingDictionary(locale);
  return { title: metadata.title, description: metadata.description, robots: { index: false, follow: false } };
}

export default async function OfflinePage({ params }: PageProps<"/[locale]/offline">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomeContent locale={locale} offline />;
}
