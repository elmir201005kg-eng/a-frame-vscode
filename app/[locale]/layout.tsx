import type { ReactNode } from "react";
import { notFound } from "@/server/navigation";
import { isLocale, localeSettings } from "@/app/i18n/config";
import { FormDesignProvider } from "@/components/form-design-provider";
import { PwaManager } from "@/components/pwa-manager";
import { MetadataTags } from "@/server/metadata";
import type { LayoutProps, Metadata } from "@/server/types";
import "../globals.css";
import "../forms.css";
import "../ai-widget.css";
import "../gallery.css";

export default async function RootLayout({ children, params, metadata, navigation }: LayoutProps & { metadata?: Metadata; navigation?: ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={localeSettings[locale].htmlLang} data-scroll-behavior="smooth">
    <head><MetadataTags metadata={metadata} /></head>
    <body>{navigation}<FormDesignProvider locale={locale}>{children}</FormDesignProvider><PwaManager locale={locale} /></body>
  </html>;
}
