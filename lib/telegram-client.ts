import { request } from "node:https";

export class TelegramError extends Error {
  constructor(public readonly code: "telegramNotConfigured" | "telegramUnavailable") {
    super(code);
  }
}

function botToken() {
  const token = (process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAMM_KEY || "").trim();
  if (!/^\d+:[a-zA-Z0-9_-]+$/.test(token)) throw new TelegramError("telegramNotConfigured");
  return token;
}

export function telegramAdminChat() {
  botToken();
  const chatId = (process.env.TELEGRAM_ADMIN_CHAT_ID || "").trim();
  if (!/^[1-9]\d{0,15}$/.test(chatId)) throw new TelegramError("telegramNotConfigured");
  return chatId;
}

type Method = "getMe" | "getWebhookInfo" | "getUpdates" | "getChat" | "sendMessage";

// Native HTTPS avoids Next's fetch instrumentation logging the secret-bearing Bot API URL.
export async function telegramRequest<T>(method: Method, parameters: Record<string, unknown> = {}): Promise<T> {
  const token = botToken();
  const body = JSON.stringify(parameters);
  return new Promise<T>((resolve, reject) => {
    const outgoing = request({
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${token}/${method}`,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
      timeout: 10000,
    }, (response) => {
      const chunks: Buffer[] = [];
      let size = 0;
      response.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > 1024 * 1024) outgoing.destroy();
        else chunks.push(chunk);
      });
      response.on("error", () => reject(new TelegramError("telegramUnavailable")));
      response.on("end", () => {
        try {
          const result = JSON.parse(Buffer.concat(chunks).toString("utf8")) as { ok?: boolean; result?: T };
          if (response.statusCode !== 200 || !result.ok || result.result === undefined)
            throw new TelegramError("telegramUnavailable");
          resolve(result.result);
        } catch {
          reject(new TelegramError("telegramUnavailable"));
        }
      });
    });
    outgoing.on("timeout", () => outgoing.destroy());
    outgoing.on("error", () => reject(new TelegramError("telegramUnavailable")));
    outgoing.end(body);
  });
}

export async function sendAdminTelegramMessage(message: string) {
  await telegramRequest("sendMessage", {
    chat_id: telegramAdminChat(),
    text: message,
    protect_content: true,
    link_preview_options: { is_disabled: true },
  });
}
