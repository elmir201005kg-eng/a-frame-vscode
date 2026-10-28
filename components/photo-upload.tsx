"use client";
import { useRef, useState, useTransition } from "react";
import { PendingButton } from "@/components/pending-button";
import { useRouter } from "@/client/router";
import type { FormEvent } from "react";
import type { CommonDictionary } from "@/app/i18n/platform";
import { Field } from "@/components/premium-fields";
import { requestAbort } from "@/client/request-abort";

export function PhotoUpload({ cabinId, common }: { cabinId: string; common: CommonDictionary }) {
  const [pending, setPending] = useState(false),
    [code, setCode] = useState(""),
    router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const submitting = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || refreshing) return;
    const form = event.currentTarget;
    const body = new FormData(form);
    submitting.current = true;
    setPending(true);
    setCode("");
    const abort = requestAbort(60000);
    try {
      const response = await fetch("/api/uploads", { method: "POST", body, signal: abort.signal });
      const result = await response.json();
      if (!response.ok) setCode(result.code || "uploadFailed");
      else {
        form.reset();
        startTransition(() => router.refresh());
      }
    } catch {
      setCode("uploadFailed");
    } finally {
      abort.dispose();
      setPending(false);
      submitting.current = false;
    }
  }
  return (
    <form className="product-form photo-upload" onSubmit={submit} aria-busy={pending || refreshing}>
      <input name="cabinId" value={cabinId} type="hidden" />
      <Field label={common.labels.photos} hint={common.labels.uploadHint}
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          disabled={pending || refreshing}
        />
      {code && (
        <p className="form-message form-error" role="alert">
          {common.errors[code as keyof typeof common.errors] || common.errors.uploadFailed}
        </p>
      )}
      <PendingButton className="button button-outline" type="submit" pending={pending || refreshing}>
        {pending || refreshing ? common.labels.saving : common.labels.upload}
      </PendingButton>
    </form>
  );
}
