import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const output = path.resolve("public/pwa");
const logo = path.resolve("public/brand/a-frame-logo.png");
const background = "#0b120f";
await mkdir(output, { recursive: true });

for (const [file, size, logoSize] of [
  ["icon-192.png", 192, 192],
  ["icon-512.png", 512, 512],
  ["apple-touch-icon.png", 180, 180],
  // Keep the entire circular logo within the central 80% maskable safe zone.
  ["icon-maskable-512.png", 512, 400],
]) {
  const image = await sharp(logo).resize(logoSize, logoSize, { fit: "contain", background }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: image, gravity: "centre" }])
    .flatten({ background })
    .png()
    .toFile(path.join(output, file));
}
console.log("[PWA] Generated app icons from public/brand/a-frame-logo.png.");
