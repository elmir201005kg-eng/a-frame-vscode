"use client";

import type { FormHTMLAttributes } from "react";
import { normalizeHref, useRouter } from "@/client/router";

export function NavigationForm({ children, action, onSubmit, scroll, ...props }: Omit<FormHTMLAttributes<HTMLFormElement>, "action"> & { action: string; scroll?: boolean }) {
  const router = useRouter();
  const target = normalizeHref(action);
  return <form {...props} action={target} method="get" onSubmit={event => {
    onSubmit?.(event);
    if (event.defaultPrevented || !navigator.onLine) return;
    event.preventDefault();
    const form = new FormData(event.currentTarget, (event.nativeEvent as SubmitEvent).submitter);
    const query = new URLSearchParams();
    for (const [key, value] of form) if (typeof value === "string") query.append(key, value);
    void router.push(`${target}${query.size ? `?${query}` : ""}`, { scroll });
  }}>{children}</form>;
}
