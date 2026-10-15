"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/app/i18n/config";
import type { CommonDictionary } from "@/app/i18n/platform";
import { FINIK_PAYMENT_AMOUNT } from "@/lib/finik-config";

export function FinikPayment({ bookingId, locale, common, canPay, awaitingConfirmation }: {
  bookingId: string; locale: Locale; common: CommonDictionary; canPay: boolean; awaitingConfirmation: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitingExpired, setWaitingExpired] = useState(false);
  const inFlight = useRef(false);
  const router = useRouter();
  useEffect(() => {
    if (!awaitingConfirmation) return;
    // A return redirect can arrive before the signed webhook commits.
    const interval = window.setInterval(() => router.refresh(), 3000);
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      setWaitingExpired(true);
    }, 60000);
    return () => { window.clearInterval(interval); window.clearTimeout(timeout); };
  }, [awaitingConfirmation, router]);

  async function pay() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/finik/create-payment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, locale }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.paymentUrl !== "string") throw new Error(data.error || "paymentFailed");
      window.location.assign(data.paymentUrl);
    } catch (error) {
      const code = error instanceof Error ? error.message : "paymentFailed";
      setError(common.errors[code as keyof typeof common.errors] || common.errors.paymentFailed);
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <div className="product-form">
      {awaitingConfirmation && <p className="form-hint" role="status">{common.labels.paymentConfirming}</p>}
      {canPay && (!awaitingConfirmation || waitingExpired) && <button type="button" className="button button-primary" disabled={pending} onClick={pay}>
        {pending ? common.labels.paymentCreating : `${common.labels.pay} ${FINIK_PAYMENT_AMOUNT} ${common.labels.currency}`}
      </button>}
      {error && <p className="form-message form-error" role="alert">{error}</p>}
      {awaitingConfirmation && <button type="button" className="text-link" onClick={() => router.refresh()}>{common.labels.paymentRefresh}</button>}
    </div>
  );
}
