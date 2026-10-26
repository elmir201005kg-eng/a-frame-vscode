import "dotenv/config";
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const portIndex = process.argv.indexOf("--port");
process.env.NODE_ENV ||= "production";
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 3001);
const dist = path.resolve(process.env.BUILD_DIR || "dist");
const { default: app } = await import(pathToFileURL(path.join(dist, "rsc/index.js")).href);
const types = { ".js": "application/javascript", ".css": "text/css", ".html": "text/html", ".json": "application/json", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ttf": "font/ttf", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
createServer(async (incoming, outgoing) => {
  try {
    // Set APP_URL behind a trusted reverse proxy; do not trust arbitrary forwarded hosts.
    const host = incoming.headers.host || `localhost:${port}`;
    let protocol = "http:";
    if (process.env.APP_URL) {
      const canonical = new URL(process.env.APP_URL);
      if (canonical.host === host) protocol = canonical.protocol;
    }
    const origin = `${protocol}//${host}`;
    const url = new URL(incoming.url || "/", origin);
    if (["GET", "HEAD"].includes(incoming.method)) {
      for (const root of [path.join(dist, "client"), path.resolve("public")]) {
        const filename = /^\/(kg|ru|en)\/offline\/?$/.test(url.pathname) ? `${url.pathname.replace(/\/$/, "")}/index.html` : url.pathname;
        const file = path.resolve(root, `.${decodeURIComponent(filename)}`);
        if (!file.startsWith(root + path.sep)) continue;
        try {
          if (!(await stat(file)).isFile()) continue;
          const isWorker = /^\/sw[\w.-]*\.js$/.test(url.pathname);
          outgoing.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": isWorker ? "no-cache, no-store, must-revalidate" : url.pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "public, max-age=300", "X-Content-Type-Options": "nosniff", ...(isWorker ? { "Service-Worker-Allowed": "/" } : {}) });
          outgoing.end(incoming.method === "HEAD" ? undefined : await readFile(file));
          return;
        } catch (error) { if (!["ENOENT", "ENOTDIR"].includes(error.code)) throw error; }
      }
    }
    const controller = new AbortController();
    incoming.on("aborted", () => controller.abort());
    const request = new Request(url, { method: incoming.method, headers: incoming.headers, signal: controller.signal, ...(incoming.method !== "GET" && incoming.method !== "HEAD" ? { body: Readable.toWeb(incoming), duplex: "half" } : {}) });
    const response = await app.fetch(request);
    outgoing.statusCode = response.status;
    for (const [key, value] of response.headers) if (key !== "set-cookie") outgoing.setHeader(key, value);
    const cookies = response.headers.getSetCookie();
    if (cookies.length) outgoing.setHeader("Set-Cookie", cookies);
    if (!response.body || incoming.method === "HEAD") outgoing.end();
    else Readable.fromWeb(response.body).on("error", () => outgoing.destroy()).pipe(outgoing);
  } catch (error) {
    console.error("[http] Request failed", error);
    if (!outgoing.headersSent) outgoing.writeHead(500, { "Content-Type": "text/plain" });
    outgoing.end("Internal Server Error");
  }
}).listen(port, "0.0.0.0", () => console.log(`A-FRAME KG · React/Vite · http://localhost:${port}`));
