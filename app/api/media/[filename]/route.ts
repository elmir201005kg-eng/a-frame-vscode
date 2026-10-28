import { isAdminRole } from "@/lib/roles";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { photoBytes } from "@/lib/uploads";
import { demoModeEnabled } from "@/lib/demo";

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) return new Response(null, { status: 404 });
    const image = await db.cabinImage.findFirst({
      where: { imageUrl: "/api/media/" + filename },
      include: {
        cabin: {
          select: {
            status: true,
            isDemo: true,
            isBookable: true,
            ownerId: true,
            owner: { select: { verificationStatus: true, user: { select: { isActive: true } } } },
          },
        },
      },
    });
    if (!image) return new Response(null, { status: 404 });
    const publicImage =
      image.cabin.status === "PUBLISHED" &&
      (!image.cabin.isDemo || !image.cabin.isBookable || demoModeEnabled()) &&
      image.cabin.owner.user.isActive &&
      image.cabin.owner.verificationStatus === "VERIFIED";
    if (!publicImage) {
      const user = await getUser();
      if (!user || (!isAdminRole(user.role) && user.ownerProfile?.id !== image.cabin.ownerId))
        return new Response(null, { status: 404 });
    }
    return new Response(new Uint8Array(await photoBytes(filename)), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": publicImage ? "public, max-age=300" : "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
