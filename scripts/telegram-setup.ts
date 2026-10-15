import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { telegramRequest, TelegramError } from "../lib/telegram-client";

type Chat = { id: number; type: string; username?: string };
type Update = { message?: { chat: Chat; from?: { id: number }; text?: string; date: number } };

function saveConfiguration(chatId: string) {
  let environment = readFileSync(".env", "utf8");
  function set(name: string, value: string) {
    const line = `${name}="${value}"`;
    const pattern = new RegExp(`^${name}=.*$`, "m");
    environment = pattern.test(environment) ? environment.replace(pattern, line) : environment.trimEnd() + "\n" + line + "\n";
  }
  set("TELEGRAM_ADMIN_CHAT_ID", chatId);
  if (!process.env.ADMIN_OTP_SECRET) set("ADMIN_OTP_SECRET", randomBytes(32).toString("hex"));
  writeFileSync(".env", environment, "utf8");
}

async function main() {
  const bot = await telegramRequest<{ username: string }>("getMe");
  if (bot.username.toLowerCase() !== "a_frame_admin_bot")
    throw new Error("The configured token belongs to a different bot; configuration left unchanged.");
  console.log(`Bot connected: @${bot.username}`);
  let chatId = (process.env.TELEGRAM_ADMIN_CHAT_ID || "").trim();
  if (!chatId) {
    const webhook = await telegramRequest<{ url: string }>("getWebhookInfo");
    if (webhook.url) throw new Error("An existing webhook is active. Set TELEGRAM_ADMIN_CHAT_ID explicitly; webhook left unchanged.");
    // No offset: discovery does not acknowledge or discard pending bot updates.
    const updates = await telegramRequest<Update[]>("getUpdates", { limit: 100, timeout: 0 });
    const candidates = new Map<number, Chat>();
    for (const update of updates) {
      const message = update.message;
      if (message?.chat.type === "private" && message.from?.id === message.chat.id &&
        message.text?.split(" ")[0] === "/start" && message.date > Date.now() / 1000 - 3600)
        candidates.set(message.chat.id, message.chat);
    }
    if (candidates.size === 0) throw new Error("No recent private /start found. Open @a_frame_admin_bot and press Start, then run this command again.");
    if (candidates.size !== 1) {
      console.log(JSON.stringify({ candidates: [...candidates.values()].map(({ id, username }) => ({ id, username })) }));
      throw new Error("Multiple private chats found. Choose your own TELEGRAM_ADMIN_CHAT_ID explicitly; configuration left unchanged.");
    }
    chatId = String([...candidates.keys()][0]);
  }
  if (!/^[1-9]\d{0,15}$/.test(chatId)) throw new Error("TELEGRAM_ADMIN_CHAT_ID must be a private chat ID.");
  const chat = await telegramRequest<Chat>("getChat", { chat_id: chatId });
  if (chat.type !== "private") throw new Error("Administrator codes require a private chat; configuration left unchanged.");
  saveConfiguration(chatId);
  await telegramRequest("sendMessage", {
    chat_id: chatId,
    text: "A-FRAME KG: Telegram подключён. Это тестовое сообщение. После проверки email и пароля администратора сюда будет приходить шестизначный код входа.",
    protect_content: true,
  });
  console.log("Private administrator chat configured; test message delivered. Secrets were not printed.");
}

main().catch((error: unknown) => {
  console.error(error instanceof TelegramError ? `Telegram connection failed (${error.code}).` : error instanceof Error ? error.message : "Telegram setup failed.");
  process.exitCode = 1;
});
