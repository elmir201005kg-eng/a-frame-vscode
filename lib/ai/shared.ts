import type { Locale } from "@/app/i18n/config";

export const AI_MESSAGE_LIMIT = 1200;
export const AI_HISTORY_LIMIT = 12;
export const AI_BODY_LIMIT = 24000;
export type ChatMode = "ai" | "faq" | "policy";
export type ChatLink = { label: string; href: string };
export type ChatMessage = { role: "user" | "assistant"; content: string; mode?: ChatMode; links?: ChatLink[] };
export type ChatInput = { locale: Locale; message: string; history: ChatMessage[]; cabinSlug?: string };
export type ChatReply = { message: string; mode: ChatMode; links: ChatLink[]; notice?: "unavailable" | "busy"; retryAfter?: number };

// Chat is for public questions. Remove common contact details before transmission/storage.
export function redactContacts(value: string) {
  return value.split(/(\b\d{4}-\d{2}-\d{2}\b)/g).map(part => /^\d{4}-\d{2}-\d{2}$/.test(part) ? part : part
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/(?:\+?\d[\d ()-]{6,}\d)/g, "[phone]")).join("");
}

export function safeChatHref(href: string, locale: Locale) {
  // Only routes actually exposed by the public application. No model-generated URLs.
  return new RegExp(`^/${locale}(?:#(?:faq|how-it-works)|/(?:catalog|account|login|register)(?:\\?tab=favorites)?|/cabins/[a-zA-Z0-9_-]+)?$`).test(href);
}
