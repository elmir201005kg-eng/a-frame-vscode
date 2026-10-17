import "server-only";

export class ProviderError extends Error {
  constructor(public reason: "unavailable" | "busy", public retryAfter?: number) { super(reason); }
}
export type ModelMessage = { role: "system" | "user"; content: string };
export const modelReplySchema = {
  type: "object", additionalProperties: false,
  properties: { inScope: { type: "boolean" }, answer: { type: "string" }, sourceIds: { type: "array", items: { type: "string" }, maxItems: 4 } },
  required: ["inScope", "answer", "sourceIds"],
};

export function providerConfig() {
  const provider = process.env.AI_PROVIDER || "ollama";
  if (provider === "faq") throw new ProviderError("unavailable");
  const timeout = Number(process.env.AI_TIMEOUT_MS || 45000);
  const timeoutMs = Number.isFinite(timeout) ? Math.min(90000, Math.max(1000, timeout)) : 45000;
  if (provider === "groq") {
    if (!process.env.GROQ_API_KEY?.trim()) throw new ProviderError("unavailable");
    return { provider, url: "https://api.groq.com/openai/v1/chat/completions", model: process.env.GROQ_MODEL || "llama-3.1-8b-instant", timeoutMs, key: process.env.GROQ_API_KEY };
  }
  if (provider !== "ollama") throw new ProviderError("unavailable");
  const url = new URL(process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434");
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new ProviderError("unavailable");
  return { provider, url: `${url.href.replace(/\/$/, "")}/api/chat`, model: process.env.OLLAMA_MODEL || "qwen2.5:3b", timeoutMs, key: undefined };
}

export async function generateAnswer(messages: ModelMessage[], signal?: AbortSignal): Promise<unknown> {
  try {
    const config = providerConfig();
    const response = await fetch(config.url, {
      method: "POST", cache: "no-store", redirect: "error",
      headers: { "Content-Type": "application/json", ...(config.key ? { Authorization: `Bearer ${config.key}` } : {}) },
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(config.timeoutMs)]) : AbortSignal.timeout(config.timeoutMs),
      body: JSON.stringify(config.provider === "ollama" ? {
        model: config.model, messages, stream: false, format: modelReplySchema,
        options: { temperature: 0, num_predict: 700, num_ctx: 8192 }, keep_alive: "5m",
      } : {
        model: config.model, messages, stream: false, temperature: 0, max_completion_tokens: 700,
        response_format: { type: "json_object" },
      }),
    });
    if (!response.ok) {
      const retry = Number(response.headers.get("retry-after"));
      throw new ProviderError(response.status === 429 || response.status === 503 ? "busy" : "unavailable", Number.isFinite(retry) && retry > 0 ? Math.min(3600, Math.ceil(retry)) : undefined);
    }
    // Bound even a misconfigured local provider's response; do not log its content or credentials.
    const reader = response.body?.getReader();
    if (!reader) throw new ProviderError("unavailable");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 64000) { await reader.cancel(); throw new ProviderError("unavailable"); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const content = config.provider === "ollama" ? data.message?.content : data.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.length > 8000) throw new ProviderError("unavailable");
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof ProviderError) throw error;
    throw new ProviderError("unavailable");
  }
}
