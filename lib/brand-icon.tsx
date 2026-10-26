import "server-only";
import path from "node:path";
import sharp from "sharp";
export async function createBrandIcon(size: { width: number; height: number }) {
  const bytes = await sharp(path.join(process.cwd(), "public/brand/a-frame-logo.png")).resize(size.width, size.height).png().toBuffer();
  return new Response(new Uint8Array(bytes), { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" } });
}
