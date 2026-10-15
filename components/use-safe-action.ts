"use client";

import { useActionState, useCallback } from "react";

// A dropped connection must restore the form and allow a retry. Keep redirects
// intact: they are how successful authentication/booking completes in Next.js.
export function useSafeAction<State extends { code?: string }>(action: (state: State, form: FormData) => Promise<State>, initial: State) {
  const guarded = useCallback(async (state: State, form: FormData) => {
    try { return await action(state, form); }
    catch (error) {
      if (typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) throw error;
      return { ...state, success: false, code: "serverError" };
    }
  }, [action]);
  return useActionState<State, FormData>(guarded, initial as Awaited<State>);
}
