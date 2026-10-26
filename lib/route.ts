import "server-only";
import { notFound } from "@/server/navigation";
import { isLocale } from "@/app/i18n/config";
export async function routeLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
