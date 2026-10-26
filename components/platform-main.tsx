"use client";

import { usePathname } from "@/client/router";
import type { ReactNode } from "react";

// The homepage keeps its full-width sections inside the shared public layout.
export function PlatformMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const home = pathname === "/" || /^\/(kg|ru|en)\/?$/.test(pathname);
  return <main id="main-content" className={home ? undefined : "product-main section-shell"}>{children}</main>;
}
