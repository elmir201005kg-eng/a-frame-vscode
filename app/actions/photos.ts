"use server";
import { revalidatePath } from "@/server/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { lockCabin } from "@/lib/booking";
import { removePhotoFile } from "@/lib/uploads";
import type { ActionState } from "./auth";
import { localeFrom, id, fail, InputError } from "@/lib/validation";
import { isAdminRole } from "@/lib/roles";

export async function removePhotoAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    if (!isAdminRole(user.role) && (user.role !== "OWNER" || !user.ownerProfile)) fail("forbidden");
    const ownership = isAdminRole(user.role) ? {} : { ownerId: user.ownerProfile!.id, status: { not: "BLOCKED" as const } };
    const imageId = id(form.get("imageId"));
    const removed = await db.$transaction(async (tx) => {
      let image = await tx.cabinImage.findFirst({
        where: {
          id: imageId,
          cabin: ownership,
        },
      });
      if (!image) fail("notFound");
      await lockCabin(tx, image.cabinId);
      image = await tx.cabinImage.findFirst({
        where: {
          id: imageId,
          cabin: ownership,
        },
      });
      if (!image) fail("notFound");
      if (
        (await tx.cabinImage.count({ where: { cabinId: image.cabinId } })) === 1 &&
        (await tx.cabin.findFirst({ where: { id: image.cabinId, status: "PUBLISHED" } }))
      )
        fail("photosRequired");
      await tx.cabinImage.delete({ where: { id: imageId } });
      if (image.isMain) {
        const next = await tx.cabinImage.findFirst({
          where: { cabinId: image.cabinId },
          orderBy: { sortOrder: "asc" },
        });
        if (next) await tx.cabinImage.update({ where: { id: next.id }, data: { isMain: true } });
      }
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "photo.removed",
          entityType: "cabin",
          entityId: image.cabinId,
        },
      });
      return image;
    });
    if (
      removed.imageUrl.startsWith("/api/media/") &&
      !(await db.cabinImage.count({ where: { imageUrl: removed.imageUrl } }))
    )
      await removePhotoFile(removed.imageUrl.split("/").pop()!).catch(() => {});
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { code: error instanceof InputError ? error.code : "serverError" };
  }
}
