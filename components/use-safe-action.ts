"use client";

import { useActionState, useCallback } from "react";

// A dropped connection must restore the form and allow a retry.
export function useSafeAction<State extends { code?: string }>(action: (state: State, form: FormData) => Promise<State>, initial: State) {
  const guarded = useCallback(async (state: State, form: FormData) => {
    try { return await action(state, form); }
    catch {

      return { ...state, success: false, code: "serverError" };
    }
  }, [action]);
  return useActionState<State, FormData>(guarded, initial as Awaited<State>);
}
