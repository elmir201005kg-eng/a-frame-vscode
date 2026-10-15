import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { lockCabin } from "@/lib/booking";
import { id, fail, InputError } from "@/lib/validation";
import { removePhotoFile, storePhoto } from "@/lib/uploads";
import { isAdminRole } from "@/lib/roles";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  let filename: string | undefined;
  try {
    const user = await getUser();
    if (!user || (!isAdminRole(user.role) && (user.role !== "OWNER" || !user.ownerProfile))) fail("forbidden");
    const ownership = isAdminRole(user.role) ? {} : { ownerId: user.ownerProfile!.id, status: { not: "BLOCKED" as const } };
    // Next may normalize request.url to localhost behind its server or a proxy.
    // Match the browser's Origin to the incoming Host, as Server Actions do.
    const origin = request.headers.get("origin");
    if (
      !origin ||
      new URL(origin).host !== request.headers.get("host") ||
      !["http:", "https:"].includes(new URL(origin).protocol)
    )
      fail("forbidden");
    const reader = request.body?.getReader();
    if (!reader) fail("invalidImage");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 9 * 1024 * 1024) {
        await reader.cancel();
        fail("invalidImage");
      }
      chunks.push(part.value);
    }
    const form = await new Response(new Uint8Array(Buffer.concat(chunks)), {
      headers: { "Content-Type": request.headers.get("content-type") || "" },
    }).formData();
    const cabinId = id(form.get("cabinId")),
      file = form.get("file");
    if (!(file instanceof File)) fail("invalidImage");
    if (
      !(await db.cabin.findFirst({
        where: { id: cabinId, ...ownership },
      }))
    )
      fail("forbidden");
    filename = await storePhoto(file);
    const mediaUrl = "/api/media/" + filename;
    await db.$transaction(
      async (tx) => {
        await lockCabin(tx, cabinId);
        const cabin = await tx.cabin.findFirst({
          where: { id: cabinId, ...ownership },
          select: { title: true, images: { select: { id: true, sortOrder: true } } },
        });
        if (!cabin) fail("forbidden");
        if (cabin.images.length >= 12) fail("galleryFull");
        await tx.cabinImage.create({
          data: {
            cabinId,
            imageUrl: mediaUrl,
            altText: cabin.title,
            isMain: cabin.images.length === 0,
            sortOrder: Math.max(-1, ...cabin.images.map((row) => row.sortOrder)) + 1,
          },
        });
        await tx.auditLog.create({
          data: {
            userId: user.id,
            action: "photo.uploaded",
            entityType: "cabin",
            entityId: cabinId,
          },
        });
      },
      { maxWait: 10000, timeout: 20000 },
    );
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (filename) await removePhotoFile(filename).catch(() => {});
    return NextResponse.json(
      { code: error instanceof InputError ? error.code : "uploadFailed" },
      { status: error instanceof InputError && error.code === "forbidden" ? 403 : 400 },
    );
  }
}
