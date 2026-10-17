import { isLocale } from "@/app/i18n/config";
import { aiText } from "@/app/i18n/ai";
import { answerChat } from "@/lib/ai/chat";
import { parseChatInput, topicAllowed, privateQuestion } from "@/lib/ai/policy";
import { acquireModelSlot, consumeLocalLimit, consumeSharedLimit, releaseModelSlot } from "@/lib/ai/rate-limit";
import { AI_BODY_LIMIT } from "@/lib/ai/shared";

const headers = { "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" };

async function readBody(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new Error("invalid");
  if (Number(request.headers.get("content-length")) > AI_BODY_LIMIT) throw new Error("invalid");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid");
  let length = 0;
  const chunks: Uint8Array[] = [];
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 5000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > AI_BODY_LIMIT) { await reader.cancel(); throw new Error("invalid"); }
      chunks.push(value);
    }
  } finally { clearTimeout(timer); reader.releaseLock(); }
  if (timedOut) throw new Error("invalid");
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export async function POST(request: Request) {
  let locale: "ru" | "kg" | "en" = "ru";
  try {
    const origin = request.headers.get("origin");
    if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin && origin !== process.env.APP_URL?.replace(/\/$/, ""))) {
      return Response.json({ code: "forbidden" }, { status: 403, headers });
    }
    // Trust proxy IP headers only when the deployment explicitly strips/replaces client values.
    const key = process.env.AI_TRUST_PROXY === "true" ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 100) || "shared" : "shared";
    const retryAfter = consumeLocalLimit(key, key === "shared" ? 24 : 12);
    if (retryAfter) return Response.json({ code: "rateLimited", retryAfter }, { status: 429, headers: { ...headers, "Retry-After": String(retryAfter) } });
    const raw = await readBody(request);
    if (typeof raw?.locale === "string" && isLocale(raw.locale)) locale = raw.locale;
    const input = parseChatInput(raw);
    // Refusals and private-account guidance do not call the database or model.
    if (!topicAllowed(input.message, input.history) || privateQuestion(input.message)) return Response.json(await answerChat(input, request.signal), { headers });
    const budget = await consumeSharedLimit();
    if (budget === "busy") return Response.json({ code: "rateLimited", retryAfter: 60 }, { status: 429, headers: { ...headers, "Retry-After": "60" } });
    const acquired = acquireModelSlot();
    try {
      const reply = await answerChat(input, request.signal, acquired && budget === "ok");
      if (!acquired) { reply.notice = "busy"; reply.retryAfter = 10; }
      return Response.json(reply, { headers: { ...headers, ...(reply.retryAfter ? { "Retry-After": String(reply.retryAfter) } : {}) } });
    } finally { if (acquired) releaseModelSlot(); }
  } catch {
    return Response.json({ code: "invalidRequest", message: aiText[locale].invalid }, { status: 400, headers });
  }
}
