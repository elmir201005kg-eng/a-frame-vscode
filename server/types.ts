import type { ReactNode } from "react";
export type Metadata = {
  title?: string; description?: string; keywords?: string | string[]; applicationName?: string;
  robots?: { index?: boolean; follow?: boolean };
  openGraph?: { title?: string; description?: string; locale?: string; type?: string };
};
export type PageProps = { params: Promise<{ locale: string } & Record<string, string>>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export type LayoutProps = { children: ReactNode; params: Promise<{ locale: string }> };
