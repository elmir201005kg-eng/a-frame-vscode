import { renderToReadableStream, createTemporaryReferenceSet, decodeReply, loadServerAction, decodeAction, decodeFormState } from "@vitejs/plugin-rsc/rsc/server";
import type { ReactFormState } from "react-dom/client";
import type { ReactNode } from "react";
import { withRequest } from "./context";
import { NavigationResponse } from "./navigation";
import { localizedUrl, renderPage, apiResponse, matchRoute } from "./routes";
import { imageResponse } from "./image";
import manifest from "@/app/manifest";
import { createBrandIcon } from "@/lib/brand-icon";
import { readLimitedBody, PayloadTooLarge } from "./body";

export type RscPayload = { root: ReactNode; url: string; returnValue?: { ok: boolean; data: unknown }; formState?: ReactFormState };
export default { fetch: handler };

function handler(request: Request): Promise<Response> {
  return withRequest(request, async context => {
    const finish = (response: Response) => {
      for (const cookie of context.responseHeaders.getSetCookie()) response.headers.append("Set-Cookie", cookie);
      response.headers.set("X-Content-Type-Options", "nosniff");
      return response;
    };
    try {
      const url = new URL(request.url);
      const isRsc = request.headers.get("RSC") === "1";
      const isAction = request.method === "POST";
      // Mutations require the browser's same-origin Origin header, including API routes.
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && !["/api/finik/webhook", "/api/auth/google"].includes(url.pathname)) {
        if (request.headers.get("origin") !== url.origin) return finish(new Response("Forbidden", { status: 403 }));
      }
      if (!["GET", "HEAD"].includes(request.method) && request.body) {
        const body = await readLimitedBody(request, url.pathname === "/api/uploads" ? 25 * 1024 * 1024 : 1024 * 1024);
        // Vite's development adapter can supply a Request proxy; reconstruct from
        // public fields so native Request never reads private state from that proxy.
        request = new Request(request.url, { method: request.method, headers: request.headers, signal: request.signal, body });
        context.request = request;
      }
      if (url.pathname === "/api/image") return finish(await imageResponse(request));
      if (url.pathname.startsWith("/api/")) return finish(await apiResponse(request));
      if (url.pathname === "/manifest.webmanifest") return finish(Response.json(manifest(), { headers: { "Content-Type": "application/manifest+json" } }));
      if (["/icon", "/favicon.ico", "/apple-icon"].includes(url.pathname)) return finish(await createBrandIcon({ width: url.pathname === "/apple-icon" ? 180 : 64, height: url.pathname === "/apple-icon" ? 180 : 64 }));
      if (!["GET", "HEAD", "POST"].includes(request.method)) return finish(new Response(null, { status: 405 }));
      const localized = await localizedUrl(request);
      if (localized.redirect) return finish(new Response(null, { status: 302, headers: { Location: localized.url.pathname + localized.url.search } }));
      context.params = { ...matchRoute(localized.url.pathname)?.params, locale: localized.locale };
      let returnValue: RscPayload["returnValue"], formState: ReactFormState | undefined, temporaryReferences: unknown;
      if (isAction) {
        const actionId = request.headers.get("X-Server-Action");
        if (actionId) {
          const body = request.headers.get("content-type")?.startsWith("multipart/form-data") ? await request.formData() : await request.text();
          temporaryReferences = createTemporaryReferenceSet();
          const args = await decodeReply(body, { temporaryReferences });
          const action = await loadServerAction(actionId);
          try { returnValue = { ok: true, data: await action(...args) }; }
          catch (error) {
            if (error instanceof NavigationResponse) throw error;
            console.error("[action] Request failed", error instanceof Error ? error.name : "Error");
            returnValue = { ok: false, data: new Error("Request failed") };
          }
        } else {
          const data = await request.formData();
          const action = await decodeAction(data);
          if (!action) return finish(new Response("Invalid action", { status: 400 }));
          formState = await decodeFormState(await action(), data);
        }
      }
      const page = await renderPage(localized.url, localized.locale);
      const payload: RscPayload = { root: page.root, url: url.pathname + url.search, returnValue, formState };
      const stream = renderToReadableStream<RscPayload>(payload, { temporaryReferences });
      const headers = { "Cache-Control": "private, no-store", Vary: "RSC, Cookie" };
      if (isRsc) return finish(new Response(stream, { status: page.status, headers: { ...headers, "Content-Type": "text/x-component; charset=utf-8" } }));
      const ssr = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");
      const html = await ssr.renderHTML(stream, { formState });
      return finish(new Response(html.stream, { status: page.status, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } }));
    } catch (error) {
      if (error instanceof PayloadTooLarge) return finish(new Response("Payload too large", { status: 413 }));
      if (error instanceof NavigationResponse && error.location) {
        if (request.headers.get("RSC") === "1") return finish(Response.json({ redirect: error.location }, { headers: { "X-Redirect": error.location, "Cache-Control": "no-store" } }));
        return finish(new Response(null, { status: error.status, headers: { Location: error.location, "Cache-Control": "no-store" } }));
      }
      console.error("[server] Request failed", error);
      return finish(new Response("Internal Server Error", { status: 500, headers: { "Cache-Control": "no-store" } }));
    }
  });
}
if (import.meta.hot) import.meta.hot.accept();
