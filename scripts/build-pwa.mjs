import "dotenv/config";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

process.env.NODE_ENV = "production";
const dist = path.resolve(process.env.BUILD_DIR || "dist");
const client = path.join(dist, "client");
const workerPath = process.env.VITE_PWA_WORKER_PATH || "/sw.js";
if (!/^\/[a-zA-Z0-9_.-]+\.js$/.test(workerPath)) throw new Error("PWA worker must be a JavaScript file at the site root.");
const assets = new Set(["/manifest.webmanifest", "/icon", "/apple-icon", "/brand/a-frame-logo.png", "/fonts/manrope-variable.ttf"]);
async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(absolute));
    else result.push(absolute);
  }
  return result;
}
for (const file of await files(path.join(client, "assets"))) {
  if (/\.(?:js|css)$/.test(file)) assets.add("/assets/" + path.relative(path.join(client, "assets"), file).split(path.sep).join("/"));
}
for (const file of await files(path.join(client, "pwa"))) assets.add("/pwa/" + path.basename(file));
const { default: app } = await import(pathToFileURL(path.join(dist, "rsc/index.js")).href);
const hash = createHash("sha256");
for (const locale of ["kg", "ru", "en"]) {
  const response = await app.fetch(new Request("http://localhost/" + locale + "/offline"));
  const html = await response.text();
  if (response.status !== 200 || !html.includes('data-offline-page="true"') || !html.includes('id="hero-title"')) throw new Error("Offline home failed: " + locale);
  const directory = path.join(client, locale, "offline");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
  assets.add("/" + locale + "/offline");
  hash.update(html);
  for (const match of html.matchAll(/(?:src|href)="(\/images\/[^"?#]+)"/g)) assets.add(match[1]);
}
const precache = [...assets].sort();
const template = await readFile(path.resolve("scripts/pwa-worker.js"), "utf8");
hash.update(template).update(JSON.stringify(precache));
for (const asset of precache.filter(asset => /^\/(pwa|images|brand|fonts)\//.test(asset))) hash.update(await readFile(path.join(client, asset)));
const worker = template.replace('"__PWA_VERSION__"', JSON.stringify(hash.digest("hex").slice(0, 16))).replace("/* __PWA_ASSETS__ */ []", JSON.stringify(precache));
await writeFile(path.join(client, workerPath), worker);
console.log("[PWA] Generated Vite worker with " + precache.length + " offline assets and three public home pages.");
