"use client";

import Link, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";

function NavigationHint() {
  const { pending } = useLinkStatus();
  return <span className="link-pending-hint" data-pending={pending || undefined} aria-hidden="true" />;
}

export default function NavigationLink({ children, className = "", ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={`navigation-link ${className}`}>
    {children}<NavigationHint />
  </Link>;
}
