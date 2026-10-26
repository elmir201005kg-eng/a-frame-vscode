"use client";

import type { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";
import { useRouterState } from "@/client/router";

export function Spinner() {
  return <span className="ui-spinner" aria-hidden="true" />;
}

export function PendingButton({ pending = false, children, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean }) {
  return <button {...props} disabled={disabled || pending} aria-busy={pending}>
    {pending && <Spinner />}
    {children}
  </button>;
}

export function SubmitButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const status = useFormStatus();
  const router = useRouterState();
  return <PendingButton {...props} type="submit" pending={status.pending || router.pending} />;
}
