"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type FormEvent } from "react";
import { CheckCircle2, X, TriangleAlert } from "lucide-react";
import { useSafeAction } from "@/components/use-safe-action";
import { PendingButton } from "@/components/pending-button";
import type { ActionState } from "@/app/actions/auth";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { AdminDictionary } from "@/app/i18n/admin";
import type { Locale } from "@/app/i18n/config";

export function AdminActionForm({ action, locale, common, text, children, submitLabel, confirm = false, danger = false, className = "product-form" }: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>; locale: Locale; common: CommonDictionary;
  text: AdminDictionary["manage"]; children?: ReactNode; submitLabel?: string; confirm?: boolean; danger?: boolean; className?: string;
}) {
  const [state, formAction, pending] = useSafeAction(action, {});
  const [toast, setToast] = useState(false), dialog = useRef<HTMLDialogElement>(null), form = useRef<HTMLFormElement>(null), accepted = useRef(false);
  const titleId = useId(), descriptionId = useId();
  useEffect(() => {
    if (!state.success) return;
    const show = setTimeout(() => setToast(true), 0), hide = setTimeout(() => setToast(false), 4500);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [state]);
  function submit(event: FormEvent<HTMLFormElement>) {
    if (confirm && !accepted.current) { event.preventDefault(); dialog.current?.showModal(); }
    else accepted.current = false;
  }
  return <>
    <form ref={form} action={formAction} onSubmit={submit} className={className} aria-busy={pending}>
      <input type="hidden" name="locale" value={locale} />
      {confirm && <input type="hidden" name="confirm" value="yes" />}
      <fieldset disabled={pending}>{children}</fieldset>
      {state.code && !pending && <p className="form-message form-error" role="alert">{common.errors[state.code as keyof typeof common.errors] || common.errors.serverError}</p>}
      {state.success && !pending && <p className="form-message form-success" role="status">{common.labels.saved}</p>}
      <PendingButton type="submit" className={`admin-button ${danger ? "admin-danger" : "admin-button-gold"}`} pending={pending}>{pending ? common.labels.saving : submitLabel || common.labels.save}</PendingButton>
    </form>
    {confirm && <dialog ref={dialog} className="admin-confirm-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <TriangleAlert size={28} /><h2 id={titleId}>{text.confirmTitle}</h2><p id={descriptionId}>{text.confirmBody}</p>
      <div><button type="button" className="admin-button" onClick={() => dialog.current?.close()}>{text.dismiss}</button><button type="button" className={`admin-button ${danger ? "admin-danger" : "admin-button-gold"}`} onClick={() => { accepted.current = true; dialog.current?.close(); form.current?.requestSubmit(); }}>{text.confirm}</button></div>
    </dialog>}
    {toast && <div className="admin-toast" role="status"><CheckCircle2 size={19} />{common.labels.saved}<button type="button" aria-label={text.dismiss} onClick={() => setToast(false)}><X size={17} /></button></div>}
  </>;
}
