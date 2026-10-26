import type { Metadata } from "@/server/types";
import { pageDictionaries, translated } from "@/app/i18n/platform";
import { InformationPage } from "@/components/information-page";
import type { InformationDictionary } from "@/components/information-page";
import { routeLocale } from "@/lib/route";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await routeLocale(params);
  const text = await translated<InformationDictionary>(locale, "terms");
  return { title: `${text.title} — A-FRAME KG`, description: text.description };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await routeLocale(params);
  const { common, text } = await pageDictionaries(locale, "terms");

  return <InformationPage locale={locale} common={common} text={text as InformationDictionary} kind="terms" />;
}
