import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, localeSettings } from "@/app/i18n/config";
import { FormDesignProvider } from "@/components/form-design-provider";
import { PwaManager } from "@/components/pwa-manager";
import { pwaThemeColor } from "@/lib/pwa";
import "../globals.css";
import "../forms.css";

export const metadata: Metadata = {
  applicationName: "A-FRAME KG",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "A-FRAME KG", statusBarStyle: "black-translucent" },
  icons: { apple: [{ url: "/pwa/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
};

export const viewport: Viewport = { themeColor: pwaThemeColor, width: "device-width", initialScale: 1, viewportFit: "cover" };

const manrope = localFont({
  src: "../../public/fonts/manrope-variable.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={localeSettings[locale].htmlLang} className={manrope.variable} data-scroll-behavior="smooth">
      <body><FormDesignProvider locale={locale}>{children}</FormDesignProvider><PwaManager locale={locale} /></body>
    </html>
  );
}
