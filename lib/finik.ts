import "server-only";
import { createFinikSigner } from "@/lib/finik-signer";
import type { Locale } from "@/app/i18n/config";
import { FINIK_PAYMENT_AMOUNT, FINIK_PAYMENT_METHOD } from "@/lib/finik-config";

const publicKeys = {
  prod: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuF/PUmhMPPidcMxhZBPb
BSGJoSphmCI+h6ru8fG8guAlcPMVlhs+ThTjw2LHABvciwtpj51ebJ4EqhlySPyT
hqSfXI6Jp5dPGJNDguxfocohaz98wvT+WAF86DEglZ8dEsfoumojFUy5sTOBdHEu
g94B4BbrJvjmBa1YIx9Azse4HFlWhzZoYPgyQpArhokeHOHIN2QFzJqeriANO+wV
aUMta2AhRVZHbfyJ36XPhGO6A5FYQWgjzkI65cxZs5LaNFmRx6pjnhjIeVKKgF99
4OoYCzhuR9QmWkPl7tL4Kd68qa/xHLz0Psnuhm0CStWOYUu3J7ZpzRK8GoEXRcr8
tQIDAQAB
-----END PUBLIC KEY-----`,
  beta: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwlrlKz/8gLWd1ARWGA/8
o3a3Qy8G+hPifyqiPosiTY6nCHovANMIJXk6DH4qAqqZeLu8pLGxudkPbv8dSyG7
F9PZEAryMPzjoB/9P/F6g0W46K/FHDtwTM3YIVvstbEbL19m8yddv/xCT9JPPJTb
LsSTVZq5zCqvKzpupwlGS3Q3oPyLAYe+ZUn4Bx2J1WQrBu3b08fNaR3E8pAkCK27
JqFnP0eFfa817VCtyVKcFHb5ij/D0eUP519Qr/pgn+gsoG63W4pPHN/pKwQUUiAy
uLSHqL5S2yu1dffyMcMVi9E/Q2HCTcez5OvOllgOtkNYHSv9pnrMRuws3u87+hNT
ZwIDAQAB
-----END PUBLIC KEY-----`,
};

function environment() {
  const env = process.env.FINIK_ENV || "beta";
  if (env !== "beta" && env !== "prod") throw new Error("Invalid FINIK_ENV");
  return env;
}

function configuredAppUrl() {
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
}

export function finikRequestUrl(request: Request): string | null {
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site") return null;
    const rawOrigin = request.headers.get("origin");
    if (!rawOrigin) return null;
    const origin = new URL(rawOrigin);
    if (!["http:", "https:"].includes(origin.protocol) || origin.origin !== rawOrigin) return null;
    const canonical = configuredAppUrl();
    if (canonical ? new URL(canonical).origin !== origin.origin
      : origin.host !== (request.headers.get("host") || new URL(request.url).host)) return null;
    // Next.js may construct request.url using its internal host behind a reverse proxy.
    return new URL(new URL(request.url).pathname, origin).toString();
  } catch { return null; }
}

export function finikWebhookHost(request: Request) {
  const canonical = configuredAppUrl();
  return canonical ? new URL(canonical).host : request.headers.get("host") || new URL(request.url).host;
}

export function finikConfiguration(requestUrl: string) {
  const env = environment();
  const apiKey = process.env.FINIK_API_KEY?.trim();
  const accountId = process.env.FINIK_ACCOUNT_ID?.trim();
  const privateKey = process.env.FINIK_PRIVATE_KEY?.trim().replace(/\\n/g, "\n");
  if (!apiKey || !accountId || (env === "prod" && !privateKey))
    throw new Error("Finik credentials are not configured");
  const base = new URL(configuredAppUrl() || requestUrl);
  if (!["http:", "https:"].includes(base.protocol) || base.username || base.password ||
      (env === "prod" && base.protocol !== "https:"))
    throw new Error("Invalid Finik application URL");
  const host = env === "prod" ? "api.acquiring.averspay.kg" : "beta.api.acquiring.averspay.kg";
  return { env, apiKey, accountId, privateKey, host, appUrl: base.origin };
}

export function finikConfigured() {
  // A deployed HTTPS request can supply the origin when a canonical URL is absent.
  try {
    const env = environment();
    return Boolean(process.env.FINIK_API_KEY?.trim() && process.env.FINIK_ACCOUNT_ID?.trim() &&
      (env === "beta" || process.env.FINIK_PRIVATE_KEY?.trim()));
  }
  catch { return false; }
}

export async function createFinikPayment(data: {
  paymentId: string;
  bookingId: string;
  bookingNumber: string;
  userId: string;
  locale: Locale;
  requestUrl: string;
}): Promise<string> {
  const config = finikConfiguration(data.requestUrl);
  const timestamp = Date.now().toString();
  const body = {
    Amount: FINIK_PAYMENT_AMOUNT,
    CardType: FINIK_PAYMENT_METHOD,
    PaymentId: data.paymentId,
    RedirectUrl: `${config.appUrl}/${data.locale}/bookings/${data.bookingId}?payment=success`,
    Data: {
      accountId: config.accountId,
      merchantCategoryCode: "0742",
      name_en: "A-FRAME KG",
      description: `Booking ${data.bookingNumber}`,
      webhookUrl: `${config.appUrl}/api/finik/webhook`,
      metadata: JSON.stringify({ userId: data.userId, bookingId: data.bookingId, paymentId: data.paymentId }),
    },
  };
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-api-key": config.apiKey,
    "x-api-timestamp": timestamp,
  };
  if (config.env === "prod") {
    headers.signature = await createFinikSigner({
      httpMethod: "POST", path: "/v1/payment",
      headers: { Host: config.host, "x-api-key": config.apiKey, "x-api-timestamp": timestamp },
      queryStringParameters: null, body,
    }).sign(config.privateKey!);
  }
  const response = await fetch(`https://${config.host}/v1/payment`, {
    method: "POST", headers, body: JSON.stringify(body), redirect: "manual",
    cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (response.status !== 302) throw new Error(`Finik payment creation failed (${response.status})`);
  const location = response.headers.get("location");
  if (!location) throw new Error("Finik payment URL is missing");
  const paymentUrl = new URL(location, `https://${config.host}`);
  if (paymentUrl.protocol !== "https:" || paymentUrl.username || paymentUrl.password ||
      paymentUrl.searchParams.get("status")?.toLowerCase() === "failed")
    throw new Error("Finik returned an invalid payment URL");
  return paymentUrl.toString();
}

export function isTimestampValid(timestamp: string, maxAgeMinutes = 5) {
  if (!/^\d+$/.test(timestamp)) return false;
  const time = Number(timestamp);
  return Number.isSafeInteger(time) && Math.abs(Date.now() - time) <= maxAgeMinutes * 60000;
}

export async function verifyFinikWebhook(
  signature: string, timestamp: string, body: Record<string, unknown>,
  headers: Record<string, string>, webhookPath = "/api/finik/webhook",
) {
  try {
    return await createFinikSigner({
      httpMethod: "POST", path: webhookPath,
      headers: { Host: headers.host || headers.Host || "", "x-api-timestamp": timestamp },
      queryStringParameters: null, body,
    }).verify(publicKeys[environment()], signature);
  } catch {
    return false;
  }
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export type FinikWebhookEvent = {
  paymentId: string;
  bookingId: bigint;
  userId: bigint;
  transactionId: string;
  status: "SUCCEEDED" | "FAILED";
  paidAt: Date;
};

export function parseFinikWebhook(body: unknown): FinikWebhookEvent | null {
  if (!record(body) || !record(body.data) || !record(body.fields)) return null;
  const accountId = process.env.FINIK_ACCOUNT_ID?.trim();
  if (!accountId) return null;
  let metadata = body.data.metadata;
  try { if (typeof metadata === "string") metadata = JSON.parse(metadata); } catch { return null; }
  if (!record(metadata) || typeof metadata.bookingId !== "string" || !/^[1-9]\d{0,17}$/.test(metadata.bookingId) ||
      typeof metadata.userId !== "string" || !/^[1-9]\d{0,17}$/.test(metadata.userId) ||
      typeof metadata.paymentId !== "string" || !/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(metadata.paymentId)) return null;
  const status = typeof body.status === "string" ? body.status.toUpperCase() : "";
  if ((status !== "SUCCEEDED" && status !== "FAILED") || body.amount !== FINIK_PAYMENT_AMOUNT ||
      body.data.accountId !== accountId ||
      (body.fields.paymentId !== undefined && body.fields.paymentId !== metadata.paymentId) ||
      (body.fields.amount !== undefined && body.fields.amount !== FINIK_PAYMENT_AMOUNT) ||
      (body.fields.transactionType !== undefined && body.fields.transactionType !== FINIK_PAYMENT_METHOD) ||
      typeof body.transactionId !== "string" || !body.transactionId.trim() || body.transactionId.length > 255 ||
      typeof body.transactionDate !== "number" || !Number.isSafeInteger(body.transactionDate) ||
      body.transactionDate <= 0 || !Number.isFinite(new Date(body.transactionDate).getTime())) return null;
  return {
    paymentId: metadata.paymentId, bookingId: BigInt(metadata.bookingId), userId: BigInt(metadata.userId),
    transactionId: body.transactionId, status, paidAt: new Date(body.transactionDate),
  };
}
