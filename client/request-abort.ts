// AbortSignal.any/timeout require newer Safari versions than our iOS 15 target.
// The caller disposes the timer and listener when the request finishes.
export function requestAbort(timeoutMs: number, parent?: AbortSignal) {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  function dispose() {
    clearTimeout(timeout);
    parent?.removeEventListener("abort", abort);
  }
  function abort() {
    controller.abort();
    dispose();
  }
  if (parent?.aborted) abort();
  else {
    parent?.addEventListener("abort", abort, { once: true });
    timeout = setTimeout(abort, timeoutMs);
  }
  return { signal: controller.signal, dispose };
}
