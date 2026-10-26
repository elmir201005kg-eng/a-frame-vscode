import { finikWebhookHost, isTimestampValid, parseFinikWebhook, verifyFinikWebhook } from "@/lib/finik";
import { applyFinikWebhook } from "@/lib/finik-payments";
import { InputError } from "@/lib/validation";

export async function POST(request: Request) {
  const signature = request.headers.get("signature");
  const timestamp = request.headers.get("x-api-timestamp");
  if (!signature || !timestamp) return Response.json({ error: "Missing signature or timestamp" }, { status: 400 });
  if (!isTimestampValid(timestamp)) return Response.json({ error: "Invalid timestamp" }, { status: 400 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  let host: string;
  try { host = finikWebhookHost(request); }
  catch { return Response.json({ error: "Webhook configuration unavailable" }, { status: 503 }); }
  const valid = await verifyFinikWebhook(signature, timestamp, body as Record<string, unknown>, { host });
  if (!valid) {
    console.warn("[finik] Invalid webhook signature");
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }
  const event = parseFinikWebhook(body);
  if (!event) return Response.json({ error: "Invalid payment data" }, { status: 400 });
  try {
    const result = await applyFinikWebhook(event);
    console.info(`[finik] ${event.status}: payment ${event.paymentId}, transaction ${event.transactionId}`);
    return Response.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof InputError)
      return Response.json({ error: error.code }, { status: error.code === "notFound" ? 404 : 400 });
    console.error("[finik] Webhook processing failed");
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
