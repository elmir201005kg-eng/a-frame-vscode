import type { LayoutProps } from "@/server/types";
import { notFound } from "@/server/navigation";
import { Suspense } from "react";

import { PlatformShell } from "@/components/platform-shell";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { isLocale } from "@/app/i18n/config";

export const instant = false;
export default async function PlatformLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <Suspense
      fallback={<><LoadingSkeleton variant="header" /><div className="product-main section-shell"><LoadingSkeleton /></div></>}
    >
      <PlatformShell locale={locale}>{children}</PlatformShell>
    </Suspense>
  );
}
