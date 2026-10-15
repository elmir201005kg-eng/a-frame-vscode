"use client";
import { useSafeAction } from "@/components/use-safe-action";
import { PendingButton } from "@/components/pending-button";
import type { ReactNode } from "react";
import type { ActionState } from "@/app/actions/auth";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { Locale } from "@/app/i18n/config";

export function ActionForm({
  action,
  locale,
  common,
  children,
  submitLabel,
  className = "product-form",
  id,
}: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  locale: Locale;
  common: CommonDictionary;
  children?: ReactNode;
  submitLabel?: string;
  className?: string;
  id?: string;
}) {
  const [state, formAction, pending] = useSafeAction(action, {});
  return (
    <form id={id} action={formAction} className={className} aria-busy={pending}>
      <input type="hidden" name="locale" value={locale} />
      <fieldset disabled={pending}>{children}</fieldset>
      {state.code && !pending && (
        <p className="form-message form-error" role="alert">
          {common.errors[state.code as keyof typeof common.errors] || common.errors.serverError}
        </p>
      )}
      {state.success && !pending && (
        <p className="form-message form-success" role="status">
          {common.labels.saved}
        </p>
      )}
      <PendingButton className="button button-primary" pending={pending} type="submit">
        {pending ? common.labels.saving : submitLabel || common.labels.save}
      </PendingButton>
    </form>
  );
}
