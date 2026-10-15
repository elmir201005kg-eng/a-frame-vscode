import "server-only";
import path from "node:path";
import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { fail } from "@/lib/validation";

function root() {
  if (process.env.VERCEL && !process.env.UPLOAD_DIR) fail("storageUnavailable");
  return path.resolve(/* turbopackIgnore: true */ process.env.UPLOAD_DIR || ".uploads");
}
export function mediaFile(name: string) {
  if (!/^[a-f0-9-]{36}\.webp$/.test(name)) fail("invalidImage");
  return path.join(/* turbopackIgnore: true */ root(), name);
}
export async function storePhoto(file: File) {
  if (
    file.size < 1 ||
    file.size > 8 * 1024 * 1024 ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type)
  )
    fail("invalidImage");
  const buffer = Buffer.from(await file.arrayBuffer());
  let converted: Buffer;
  try {
    const image = sharp(buffer, { limitInputPixels: 25000000, failOn: "error" });
    const metadata = await image.metadata();
    if (
      !["jpeg", "png", "webp"].includes(metadata.format || "") ||
      (metadata.pages && metadata.pages > 1)
    )
      fail("invalidImage");
    converted = await image
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    fail("invalidImage");
  }
  const filename = randomUUID() + ".webp";
  try {
    await mkdir(root(), { recursive: true });
    await writeFile(mediaFile(filename), converted, { flag: "wx" });
  } catch {
    fail("storageUnavailable");
  }
  return filename;
}
export async function removePhotoFile(name: string) {
  try {
    await unlink(mediaFile(name));
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }
}
export async function photoBytes(name: string) {
  return readFile(/* turbopackIgnore: true */ mediaFile(name));
}
