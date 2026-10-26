"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "@/client/router";
import type { Locale } from "@/app/i18n/config";
import type { CommonDictionary } from "@/app/i18n/platform";
import { FINIK_PAYMENT_AMOUNT } from "@/lib/finik-config";

export function FinikPayment({ bookingId, locale, common, canPay, awaitingConfirmation, initialError = null }: {
  bookingId: string; locale: Locale; common: CommonDictionary; canPay: boolean; awaitingConfirmation: boolean; initialError?: string | null;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [waitingExpired, setWaitingExpired] = useState(false);
  const inFlight = useRef(false);
  const request = useRef<AbortController | null>(null);
  const refreshPending = useRef(false);
  const [refreshing, startRefresh] = useTransition();
  const router = useRouter();
  useEffect(() => { refreshPending.current = refreshing; }, [refreshing]);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (!awaitingConfirmation) return;
    // A return redirect can arrive before the signed webhook commits.
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible" || refreshPending.current) return;
      refreshPending.current = true;
      startRefresh(() => router.refresh());
    }, 3000);
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      setWaitingExpired(true);
    }, 60000);
    return () => { window.clearInterval(interval); window.clearTimeout(timeout); };
  }, [awaitingConfirmation, router, startRefresh]);

  function refresh() {
    if (refreshPending.current) return;
    refreshPending.current = true;
    startRefresh(() => router.refresh());
  }

  async function pay() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetch("/api/finik/create-payment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, locale }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(20000)]),
      });
      const data = await response.json();
      if (!response.ok || typeof data.paymentUrl !== "string") throw new Error(data.error || "paymentFailed");
      window.location.assign(data.paymentUrl);
    } catch (error) {
      if (controller.signal.aborted) return;
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
      {awaitingConfirmation && <button type="button" className="text-link" disabled={refreshing} aria-busy={refreshing} onClick={refresh}>{common.labels.paymentRefresh}</button>}
    </div>
  );
}
