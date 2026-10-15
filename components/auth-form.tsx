"use client";
import Link from "@/components/navigation-link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useSafeAction } from "@/components/use-safe-action";
import { PendingButton } from "@/components/pending-button";
import type { FormEvent, InputHTMLAttributes } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { Locale } from "@/app/i18n/config";
import { Field } from "@/components/product-ui";
import { Icon } from "@/components/icon";
import { GoogleButton } from "@/components/google-button";
import { PremiumInput, PremiumRadio } from "@/components/premium-fields";

const subscribe = () => () => {};
const browserReady = () => true;
const serverReady = () => false;

export function PasswordField({ label, showLabel, hideLabel, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & {
  label: string; showLabel: string; hideLabel: string; hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = props.id || generatedId;
  return (
    <div className="product-field auth-password-field">
      <label htmlFor={inputId}>{label}</label>
      <span className="auth-password-input">
        <PremiumInput {...props} id={inputId} aria-describedby={hint ? `${inputId}-hint` : props["aria-describedby"]} type={visible ? "text" : "password"} />
        <button type="button" aria-label={visible ? hideLabel : showLabel} aria-pressed={visible} onClick={() => setVisible(!visible)}>
          <Icon name={visible ? "eye-off" : "eye"} size={19} />
        </button>
      </span>
      {hint && <small id={`${inputId}-hint`}>{hint}</small>}
    </div>
  );
}

export function AuthForm({ mode, locale, common, next, initialRole, oauthError }: {
  mode: "login" | "register"; locale: Locale; common: CommonDictionary;
  next: string; initialRole: "USER" | "OWNER"; oauthError: string;
}) {
  const registering = mode === "register";
  // Keep controlled fields disabled until React can capture input events.
  const ready = useSyncExternalStore(subscribe, browserReady, serverReady);
  const [state, action, pending] = useSafeAction(registering ? registerAction : loginAction, {});
  const [role, setRole] = useState(initialRole);
  const [address, setAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  const error = state.code || oauthError;
  useEffect(() => { if (state.code) errorRef.current?.focus(); }, [state]);
  const passwordProps = { showLabel: common.auth.showPassword, hideLabel: common.auth.hidePassword };
  function validate(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const confirm = form.elements.namedItem("confirmPassword") as HTMLInputElement | null;
    const secret = form.elements.namedItem("password") as HTMLInputElement;
    if (confirm) confirm.setCustomValidity(confirm.value === secret.value ? "" : common.errors.passwordMismatch);
    if (!form.reportValidity()) event.preventDefault();
  }
  return (
    <>
      <form action={action} onSubmit={validate} className="product-form auth-form" aria-busy={pending || !ready}>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="next" value={next} />
        <fieldset disabled={pending || !ready}>
          {registering && <Field label={common.labels.name} name="firstName" autoComplete="given-name" required maxLength={100} value={firstName} onChange={(event) => setFirstName(event.target.value)} />}
          <Field label={common.labels.email} name="email" type="email" autoComplete="email" required maxLength={255} placeholder="you@example.com" value={address} onChange={(event) => setAddress(event.target.value)} />
          {registering && <>
            <Field label={common.labels.phone} name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} pattern={"\\+?[0-9\\s\\(\\)\\-]{7,30}"} placeholder="+996" value={contact} onChange={(event) => setContact(event.target.value)} />
            <fieldset className="premium-radio-group">
              <legend>{common.labels.role}</legend>
              <div className="premium-radio-options">
                {(["USER", "OWNER"] as const).map(value => <label key={value} className="premium-radio-card">
                  <PremiumRadio name="role" value={value} checked={role === value} onChange={() => setRole(value)} />
                  <span>{value === "OWNER" ? common.labels.ownerRole : common.labels.traveler}</span>
                </label>)}
              </div>
            </fieldset>
            {role === "OWNER" && <p className="form-hint">{common.labels.ownerRegistration}</p>}
          </>}
          <PasswordField {...passwordProps} label={common.labels.password} name="password" autoComplete={registering ? "new-password" : "current-password"}
            required minLength={registering ? 10 : undefined} maxLength={128} hint={registering ? common.auth.passwordHint : undefined}
            onChange={(event) => {
              const confirm = event.currentTarget.form?.elements.namedItem("confirmPassword") as HTMLInputElement | null;
              confirm?.setCustomValidity("");
            }} />
          {registering && <PasswordField {...passwordProps} label={common.labels.confirmPassword} name="confirmPassword" autoComplete="new-password" required minLength={10} maxLength={128}
            onChange={(event) => event.currentTarget.setCustomValidity("")} />}
        </fieldset>
        {error && !pending && <p ref={errorRef} tabIndex={-1} className="form-message form-error" role="alert">
          {Object.hasOwn(common.errors, error) ? common.errors[error as keyof typeof common.errors] : common.errors.serverError}
        </p>}
        <PendingButton className="button button-primary" type="submit" disabled={!ready} pending={pending}>
          {pending ? common.auth.pending : registering ? common.nav.register : common.nav.login}
          {!pending && <Icon name="arrow-right" size={18} />}
        </PendingButton>
      </form>
      <div className="auth-divider"><span>{common.auth.or}</span></div>
      <GoogleButton locale={locale} label={common.auth.google} next={next} role={role} disabled={pending} />
      <p className="auth-legal">
        {common.auth.legal}{" "}<Link href={`/${locale}/terms`}>{common.auth.terms}</Link>{" "}
        {common.auth.and}{" "}<Link href={`/${locale}/privacy`}>{common.auth.privacy}</Link>.
      </p>
    </>
  );
}
