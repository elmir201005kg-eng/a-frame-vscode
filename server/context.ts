import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";

type CookieOptions = { httpOnly?: boolean; secure?: boolean; sameSite?: "lax" | "strict" | "none"; path?: string; expires?: Date; maxAge?: number };
export type RequestContext = { request: Request; params: Record<string, string>; responseHeaders: Headers; cookies: Map<string, string> };
// Keep the request store across Vite HMR module generations. Existing async
// renders and freshly reloaded handlers must share the same request boundary.
const runtime = globalThis as typeof globalThis & { aframeRequestStorage?: AsyncLocalStorage<RequestContext> };
const storage = runtime.aframeRequestStorage ??= new AsyncLocalStorage<RequestContext>();
export function requestContext() {
  const context = storage.getStore();
  if (!context) throw new Error("This operation requires an HTTP request");
  return context;
}
export function withRequest<T>(request: Request, work: (context: RequestContext) => T) {
  const values = new Map<string, string>();
  for (const pair of (request.headers.get("cookie") || "").split(";")) {
    const separator = pair.indexOf("=");
    if (separator > 0) {
      try { values.set(pair.slice(0, separator).trim(), decodeURIComponent(pair.slice(separator + 1).trim())); } catch { /* Ignore malformed cookies. */ }
    }
  }
  const context = { request, params: {}, responseHeaders: new Headers(), cookies: values };
  return storage.run(context, () => work(context));
}
export async function headers() { return requestContext().request.headers; }
export async function cookies() {
  const context = requestContext();
  return {
    get(name: string) { const value = context.cookies.get(name); return value === undefined ? undefined : { name, value }; },
    set(name: string, value: string, options: CookieOptions = {}) {
      if (!/^[\w-]+$/.test(name)) throw new Error("Invalid cookie name");
      const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path || "/"}`];
      if (options.httpOnly) parts.push("HttpOnly");
      if (options.secure) parts.push("Secure");
      if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
      if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
      if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
      context.cookies.set(name, value);
      context.responseHeaders.append("Set-Cookie", parts.join("; "));
    },
    delete(name: string) { this.set(name, "", { maxAge: 0, httpOnly: true, sameSite: "lax" }); context.cookies.delete(name); },
  };
}
export async function locale() { return requestContext().params.locale; }
