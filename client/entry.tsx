import { createFromReadableStream, createFromFetch, setServerCallback, createTemporaryReferenceSet, encodeReply } from "@vitejs/plugin-rsc/browser";
import { Component, use, useCallback, useEffect, useState, useTransition, type ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import type { ReactFormState } from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";
import { RouterProvider, normalizeHref } from "./router";
import type { RscPayload } from "@/server/entry.rsc";

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <html><head><title>A-FRAME KG</title></head><body><main style={{ padding: 40 }}><h1>Не удалось загрузить страницу</h1><button onClick={() => location.reload()}>Попробовать снова</button></main></body></html>;
    return this.props.children;
  }
}
async function main() {
  const initial = createFromReadableStream<RscPayload>(rscStream);
  let commit: (payload: RscPayload) => void;
  let navigate: (href: string, options?: { replace?: boolean; scroll?: boolean; pop?: boolean }) => Promise<void>;
  let sequence = 0;
  let active: AbortController | undefined;
  function BrowserRoot() {
    const initialPayload = use(initial);
    const [payload, setPayload] = useState(initialPayload);
    const [pending, setPending] = useState(false);
    const [failedHref, setFailedHref] = useState<string | null>(null);
    const [rendering, startRender] = useTransition();
    commit = value => startRender(() => setPayload(value));
    const move = useCallback(async (href: string, options: { replace?: boolean; scroll?: boolean; pop?: boolean } = {}) => {
      const target = new URL(normalizeHref(href), location.href);
      if (target.origin !== location.origin) { location.assign(target.href); return; }
      const id = ++sequence;
      active?.abort();
      const controller = new AbortController();
      active = controller;
      let timedOut = false;
      const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
      setPending(true);
      setFailedHref(null);
      try {
        const response = await fetch(target, { headers: { RSC: "1" }, signal: controller.signal, cache: "no-store" });
        if (id !== sequence) return;
        const redirect = response.headers.get("X-Redirect");
        if (redirect) return await move(redirect, { ...options, replace: true });
        if (!response.headers.get("content-type")?.startsWith("text/x-component")) throw new Error("Invalid page response");
        const next = await createFromFetch<RscPayload>(Promise.resolve(response));
        if (id !== sequence) return;
        const address = new URL(response.url || target.href);
        address.hash = target.hash;
        if (!options.pop) history[options.replace ? "replaceState" : "pushState"](null, "", address.href);
        commit({ ...next, url: location.pathname + location.search });
        if (options.scroll !== false) requestAnimationFrame(() => {
          if (target.hash) document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView();
          else window.scrollTo(0, 0);
        });
      } catch (error) {
        // An obsolete request must never reload the document over a newer page.
        if (id !== sequence || (controller.signal.aborted && !timedOut)) return;
        console.error("[navigation]", error);
        if (/\/(?:admin)(?:\/|$)/.test(location.pathname)) setFailedHref(target.href);
        else location.assign(target.href);
      } finally {
        clearTimeout(timeout);
        if (id === sequence) { active = undefined; setPending(false); }
      }
    }, []);
    navigate = move;
    const refresh = useCallback(() => move(location.href, { replace: true, scroll: false }), [move]);
    useEffect(() => {
      const pop = () => { void move(location.href, { pop: true, scroll: false }); };
      window.addEventListener("popstate", pop);
      return () => window.removeEventListener("popstate", pop);
    }, [move]);
    return <RouterProvider url={payload.url} pending={pending || rendering} failedHref={failedHref} navigate={move} refresh={refresh}>{payload.root}</RouterProvider>;
  }
  setServerCallback(async (id, args) => {
    const actionUrl = location.href;
    const navigationSequence = sequence;
    const temporaryReferences = createTemporaryReferenceSet();
    const response = await fetch(location.href, { method: "POST", headers: { RSC: "1", "X-Server-Action": id }, body: await encodeReply(args, { temporaryReferences }) });
    const redirect = response.headers.get("X-Redirect");
    if (redirect) { if (sequence === navigationSequence && location.href === actionUrl) await navigate(redirect); return {}; }
    if (!response.headers.get("content-type")?.startsWith("text/x-component")) throw new Error("Request failed");
    const payload = await createFromFetch<RscPayload>(Promise.resolve(response), { temporaryReferences });
    if (sequence === navigationSequence && location.href === actionUrl) commit(payload);
    if (!payload.returnValue?.ok) throw payload.returnValue?.data;
    return payload.returnValue.data;
  });
  // Attach React's event listeners before waiting for RSC imports, so early
  // interactions can be replayed when their components finish hydrating.
  const formState = (globalThis as { __AFRAME_FORM_STATE__?: ReactFormState }).__AFRAME_FORM_STATE__;
  hydrateRoot(document, <ErrorBoundary><BrowserRoot /></ErrorBoundary>, { formState });
  if (import.meta.hot) import.meta.hot.on("rsc:update", () => { void navigate(location.href, { replace: true, scroll: false }); });
}
void main();
