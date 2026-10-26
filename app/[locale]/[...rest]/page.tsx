import type { Metadata } from "@/server/types";
import { notFound } from "@/server/navigation";
import { locale as getLocale } from "@/server/context";
import { defaultLocale, isLocale } from "@/app/i18n/config";
import { getNotFoundDictionary } from "@/app/i18n/not-found";

// This route always throws notFound(), so it has no page UI to validate as instant.
export const instant = false;

export function generateStaticParams() {
  return [{ rest: ["not-found"] }];
}

export async function generateMetadata(): Promise<Metadata> {
  const routeLocale = await getLocale();
  const locale = isLocale(routeLocale) ? routeLocale : defaultLocale;
  const dictionary = await getNotFoundDictionary(locale);
  return { ...dictionary.metadata, robots: { index: false, follow: false } };
}

export default function MissingPage() {
  notFound();
}
