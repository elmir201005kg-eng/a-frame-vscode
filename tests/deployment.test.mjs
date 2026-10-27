import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { encodeReply } from "react-server-dom-webpack/client.node";

// This suite exercises the actual production entry, with no database writes or
// calls to payment/OAuth providers. Run npm run build before this suite.
process.env.NODE_ENV = "production";
const { default: app } = await import("../api/index.mjs");
const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
const origin = "https://deployment.example";
const request = (pathname, init) => app.fetch(new Request(origin + pathname, init));

test("Vercel publishes only the client build and sends dynamic paths to the RSC function", async () => {
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, "dist/client");
  const filesystem = config.routes.findIndex(route => route.handle === "filesystem");
  assert.ok(filesystem >= 0);
  assert.deepEqual(config.routes[filesystem + 1], { src: "/(.*)", dest: "/api/index" });
  assert.equal(typeof app.fetch, "function");
  for (const file of ["rsc/index.js", "ssr/index.js", "rsc/__vite_rsc_assets_manifest.js", "ssr/__vite_rsc_assets_manifest.js"])
    assert.ok((await stat(path.join("dist", file))).isFile());
  assert.ok((await readdir("dist/client/assets")).some(file => file.endsWith(".js")));
});

test("production localization preserves query strings, cookies and the three languages", async () => {
  for (const locale of ["kg", "ru", "en"]) {
    const response = await request("/?next=%2Fru%2Faccount", { headers: { "accept-language": locale } });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), `/${locale}?next=%2Fru%2Faccount`);
    assert.ok(response.headers.getSetCookie().some(cookie => cookie.includes(`=${locale};`)));
  }
  const saved = await request("/", { headers: { cookie: "a-frame-kg-locale=en", "accept-language": "ru" } });
  assert.equal(saved.headers.get("location"), "/en");
});

test("SSR, hydration assets and streamed RSC render all languages without a static fallback", async () => {
  for (const locale of ["kg", "ru", "en"]) {
    const response = await request(`/${locale}/offline`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^text\/html/);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    const html = await response.text();
    assert.ok(html.includes(`lang="${locale === "kg" ? "ky" : locale}"`));
    assert.ok(html.includes('data-offline-page="true"'));
    assert.ok(html.includes('id="hero-title"'));
    const scripts = [...html.matchAll(/src="(\/assets\/[^"?#]+\.js)"/g)];
    assert.ok(scripts.length > 0);
    for (const [, src] of scripts) assert.ok((await stat(path.join("dist/client", src))).isFile());

    const rsc = await request(`/${locale}/offline?probe=1`, { headers: { RSC: "1" } });
    assert.equal(rsc.status, 200);
    assert.match(rsc.headers.get("content-type"), /^text\/x-component/);
    assert.match(rsc.headers.get("vary"), /RSC/);
    assert.ok((await rsc.text()).includes(`/${locale}/offline?probe=1`));
    const offline = await readFile(`dist/client/${locale}/offline/index.html`, "utf8");
    assert.ok(offline.includes('data-offline-page="true"'));
  }
});

test("protected routes still redirect anonymous visitors to login", async () => {
  for (const locale of ["kg", "ru", "en"]) {
    const response = await request(`/${locale}/account`);
    assert.equal(response.status, 303);
    assert.ok(response.headers.get("location").startsWith(`/${locale}/login?next=`));
  }
});

test("API routing, methods, same-origin protection and multipart bodies reach the server", async () => {
  const missing = await request("/api/deployment-probe?value=1");
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: "notFound" });
  const method = await request("/api/auth/google");
  assert.equal(method.status, 405);
  assert.equal(method.headers.get("allow"), "POST");
  const blocked = await request("/api/deployment-probe", { method: "POST", headers: { origin: "https://other.example" }, body: "probe" });
  assert.equal(blocked.status, 403);
  const allowed = await request("/api/deployment-probe", { method: "POST", headers: { origin }, body: "probe" });
  assert.equal(allowed.status, 404);
  const form = new FormData();
  form.set("locale", "ru");
  const action = await request("/ru/offline", { method: "POST", headers: { origin }, body: form });
  assert.equal(action.status, 400);
  assert.equal(await action.text(), "Invalid action");
});

test("server actions preserve multipart arguments, redirects and separate session/locale cookies", async () => {
  const sources = await Promise.all((await readdir("dist/rsc/assets"))
    .filter(file => file.startsWith("auth-") && file.endsWith(".js"))
    .map(file => readFile(path.join("dist/rsc/assets", file), "utf8")));
  const id = sources.map(source => /registerServerReference\(logoutAction,\s*"([^"]+)",\s*"logoutAction"\)/.exec(source)?.[1]).find(Boolean);
  assert.ok(id, "The production build must retain the logout server reference");
  const actionId = `${id}#logoutAction`;
  const checkCookies = response => {
    const cookies = response.headers.getSetCookie();
    assert.equal(cookies.length, 2);
    assert.ok(cookies.some(cookie => cookie.startsWith("a-frame-session=;") && cookie.includes("Max-Age=0") && cookie.includes("HttpOnly")));
    assert.ok(cookies.some(cookie => cookie.startsWith("a-frame-kg-locale=en;")));
    assert.equal(response.headers.get("cache-control"), "no-store");
  };

  const progressiveForm = new FormData();
  progressiveForm.set(`$ACTION_ID_${actionId}`, "");
  progressiveForm.set("locale", "en");
  const html = await request("/en/offline", { method: "POST", headers: { origin }, body: progressiveForm });
  assert.equal(html.status, 303);
  assert.equal(html.headers.get("location"), "/en");
  checkCookies(html);

  const form = new FormData();
  form.set("locale", "en");
  const rsc = await request("/en/offline", {
    method: "POST",
    headers: { origin, RSC: "1", "X-Server-Action": actionId },
    body: await encodeReply([form]),
  });
  assert.equal(rsc.status, 200);
  assert.equal(rsc.headers.get("x-redirect"), "/en");
  assert.deepEqual(await rsc.json(), { redirect: "/en" });
  checkCookies(rsc);
});

test("Sharp endpoints retain their server-side source files", async () => {
  for (const pathname of ["/icon", "/apple-icon", "/api/image?src=%2Fimages%2Fhero.webp&w=640&q=75"]) {
    const response = await request(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^image\//);
    assert.ok((await response.arrayBuffer()).byteLength > 0);
  }
  const manifest = await request("/manifest.webmanifest");
  assert.equal(manifest.status, 200);
  assert.ok((await manifest.json()).name.includes("A-FRAME"));
});
