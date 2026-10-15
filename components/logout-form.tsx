"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/app/i18n/config";
import { logoutFormAction } from "@/app/actions/auth";
import { useSafeAction } from "@/components/use-safe-action";
import { PendingButton } from "@/components/pending-button";

export function LogoutForm({ locale, label, errorLabel, className, buttonClassName, children }: { locale: Locale; label: string; errorLabel: string; className?: string; buttonClassName?: string; children?: ReactNode }) {
  const [state, action, pending] = useSafeAction(logoutFormAction, {});
  return <form action={action} className={className} aria-busy={pending}>
    <input type="hidden" name="locale" value={locale} />
    <PendingButton type="submit" className={buttonClassName} pending={pending}>{children}<span>{label}</span></PendingButton>
    {state.code && !pending && <p className="form-message form-error" role="alert">{errorLabel}</p>}
  </form>;
}
