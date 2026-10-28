"use client";

import { useEffect, useRef, useState } from "react";
import { requestAbort } from "@/client/request-abort";

type Quote = { nights: number; total: string };
export function useAvailability() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const current = useRef<AbortController | null>(null);
  useEffect(() => () => { current.current?.abort(); }, []);
  function reset() {
    current.current?.abort();
    current.current = null;
    setChecking(false);
    setQuote(null);
    setCode("");
  }
  async function check(values: { cabinId: string; checkIn: string; checkOut: string; guests: string; promoCode?: string }) {
    if (current.current) return;
    if (!values.checkIn || !values.checkOut || values.checkOut <= values.checkIn) { setCode("invalidDates"); return; }
    if (!Number.isInteger(Number(values.guests)) || Number(values.guests) < 1) { setCode("invalidGuests"); return; }
    const controller = new AbortController();
    const request = requestAbort(20000, controller.signal);
    current.current = controller;
    setChecking(true);
    setQuote(null);
    setCode("");
    try {
      const response = await fetch(`/api/availability?${new URLSearchParams({ ...values, promoCode: values.promoCode || "" })}`, {
        signal: request.signal, cache: "no-store",
      });
      const result = await response.json();
      if (current.current !== controller || controller.signal.aborted) return;
      if (!response.ok) setCode(result.code || "serverError");
      else if (Number.isInteger(result.nights) && result.nights > 0 && typeof result.total === "string" && Number.isFinite(Number(result.total))) setQuote(result);
      else setCode("serverError");
    } catch {
      if (current.current === controller && !controller.signal.aborted) setCode("serverError");
    } finally {
      request.dispose();
      if (current.current === controller) { current.current = null; setChecking(false); }
    }
  }
  return { quote, code, checking, reset, check };
}
