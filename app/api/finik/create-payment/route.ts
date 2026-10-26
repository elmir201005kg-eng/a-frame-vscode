import { getUser } from "@/lib/auth";
import { finikRequestUrl } from "@/lib/finik";
import { startFinikPayment } from "@/lib/finik-payments";
import { FINIK_PAYMENT_AMOUNT } from "@/lib/finik-config";
import { id, InputError } from "@/lib/validation";
import { isLocale } from "@/app/i18n/config";

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    const requestUrl = finikRequestUrl(request);
    if (!requestUrl) return json({ error: "forbidden" }, 403);
    const user = await getUser();
    if (!user) return json({ error: "unauthorized" }, 401);
    let body: unknown;
    try { body = await request.json(); } catch { return json({ error: "invalidFields" }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "invalidFields" }, 400);
    const input = body as Record<string, unknown>;
    const bookingId = id(input.bookingId);
    if (typeof input.locale !== "string" || !isLocale(input.locale)) return json({ error: "invalidFields" }, 400);
    const paymentUrl = await startFinikPayment({
      userId: user.id, bookingId, locale: input.locale, requestUrl,
    });
    return json({ success: true, paymentUrl, amount: FINIK_PAYMENT_AMOUNT });
  } catch (error) {
    if (error instanceof InputError) {
      const status = error.code === "notFound" ? 404 : error.code === "tooManyAttempts" ? 429
        : ["paymentUnavailable", "paymentProcessing"].includes(error.code) ? 409 : 400;
      return json({ error: error.code }, status);
    }
    // Provider response bodies and credentials must not reach the browser or logs.
    console.error("[finik] Payment creation failed");
    return json({ error: "paymentFailed" }, 502);
  }
}
