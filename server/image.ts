import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const cache = new Map<string, Uint8Array>();
export async function imageResponse(request: Request) {
  const url = new URL(request.url), src = url.searchParams.get("src") || "";
  const width = Number(url.searchParams.get("w")), quality = Number(url.searchParams.get("q"));
  if (!/^\/(images|brand)\/[\w/.-]+\.(webp|png|jpe?g)$/i.test(src) || !Number.isInteger(width) || width < 16 || width > 1920 || ![60, 75].includes(quality)) return new Response(null, { status: 400 });
  const root = path.resolve("public"), file = path.resolve(root, `.${src}`);
  if (!file.startsWith(root + path.sep)) return new Response(null, { status: 400 });
  try {
    const key = `${src}:${width}:${quality}`;
    let bytes = cache.get(key);
    if (!bytes) {
      bytes = new Uint8Array(await sharp(await readFile(file)).resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer());
      if (cache.size >= 64) cache.delete(cache.keys().next().value!);
      cache.set(key, bytes);
    }
    return new Response(new Uint8Array(bytes), { headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response(null, { status: 404 }); }
}
