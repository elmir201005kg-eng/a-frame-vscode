"use client";

import { useSafeAction } from "@/components/use-safe-action";
import { PendingButton } from "@/components/pending-button";
import { useFormStatus } from "react-dom";
import {
  cancelAdminLoginAction,
  submitAdminAuthAction,
  type AdminAuthState,
} from "@/app/actions/admin-auth";
import type { Locale } from "@/app/i18n/config";
import type { CommonDictionary } from "@/app/i18n/platform";
import type adminLogin from "@/app/i18n/locales/ru/admin-login.json";
import { Icon } from "@/components/icon";
import { Field, PageHeading } from "@/components/product-ui";

export type AdminLoginDictionary = typeof adminLogin;

function CancelButton({
  text,
  disabled,
}: {
  text: AdminLoginDictionary;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <PendingButton className="admin-auth-restart" type="submit" disabled={disabled} pending={pending}>
      <Icon name="arrow-left" size={16} />
      {pending ? text.cancelling : text.cancel}
    </PendingButton>
  );
}

export function AdminLoginForm({
  locale,
  common,
  text,
  initialPending,
}: {
  locale: Locale;
  common: CommonDictionary;
  text: AdminLoginDictionary;
  initialPending: boolean;
}) {
  const initialState: AdminAuthState = initialPending ? { step: "code" } : {};
  const [state, formAction, pending] = useSafeAction(submitAdminAuthAction, initialState);
  const awaitingCode = state.step === "code";

  return (
    <>
      <div className="admin-auth-step">
        <Icon name="shield" size={16} />
        <span>{awaitingCode ? text.codeStep : text.credentialsStep}</span>
      </div>
      <PageHeading text={awaitingCode ? text.code : text} />
      <form action={formAction} className="product-form admin-auth-form" aria-busy={pending}>
        <input type="hidden" name="locale" value={locale} />
        <fieldset disabled={pending}>
          {awaitingCode ? (
            <Field
              key="admin-code"
              className="admin-auth-code"
              label={text.codeLabel}
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              placeholder={text.codePlaceholder}
              required
              autoFocus
              aria-describedby="admin-code-hint"
            />
          ) : (
            <>
              <Field
                key="admin-email"
                label={common.labels.email}
                name="email"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                maxLength={255}
              />
              <Field
                key="admin-password"
                label={common.labels.password}
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength={128}
              />
            </>
          )}
        </fieldset>
        {awaitingCode && <p id="admin-code-hint" className="form-hint">{text.codeHint}</p>}
        {state.code && !pending && (
          <p className="form-message form-error" role="alert">
            {common.errors[state.code as keyof typeof common.errors] || common.errors.serverError}
          </p>
        )}
        <PendingButton className="button button-primary" pending={pending} type="submit">
          {pending
            ? awaitingCode ? text.verifying : text.submitting
            : awaitingCode ? text.verify : text.submit}
          {!pending && <Icon name="arrow-right" size={17} />}
        </PendingButton>
      </form>
      {awaitingCode ? (
        <form action={cancelAdminLoginAction} className="admin-auth-cancel">
          <input type="hidden" name="locale" value={locale} />
          <CancelButton text={text} disabled={pending} />
        </form>
      ) : (
        <p className="admin-auth-access-hint">
          <Icon name="shield" size={15} />
          {text.accessHint}
        </p>
      )}
    </>
  );
}
