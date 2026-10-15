import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

async function logoDataUrl() {
  "use cache";
  const image = await readFile(path.join(process.cwd(), "public/brand/a-frame-logo.png"));
  return `data:image/png;base64,${image.toString("base64")}`;
}

export async function createBrandIcon(size: { width: number; height: number }) {
  return new ImageResponse(
    // ImageResponse renders the PNG into the requested icon size at build time.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={await logoDataUrl()} alt="" width={size.width} height={size.height} />,
    size,
  );
}
