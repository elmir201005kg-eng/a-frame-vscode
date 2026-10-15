"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PendingButton } from "@/components/pending-button";
import type { Locale } from "@/app/i18n/config";

export function GoogleButton({ locale, label, next, role = "USER", linking = false, disabled = false }: {
  locale: Locale; label: string; next: string; role?: "USER" | "OWNER"; linking?: boolean; disabled?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  // A page restored from the browser's back/forward cache must be usable again.
  useEffect(() => {
    const restore = () => { submitting.current = false; setPending(false); };
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);
  return (
    <form action="/api/auth/google" method="post" className="google-auth-form" aria-busy={pending} onSubmit={(event) => {
      if (submitting.current || disabled) { event.preventDefault(); return; }
      submitting.current = true;
      setPending(true);
    }}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="role" value={role} />
      {linking && <input type="hidden" name="intent" value="link" />}
      <PendingButton className="button google-auth-button" type="submit" disabled={disabled} pending={pending}>
        {!pending && <Image src="/brand/google-g.png" alt="" width={20} height={20} />}
        <span>{label}</span>
      </PendingButton>
    </form>
  );
}
