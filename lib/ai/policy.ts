import { isLocale } from "@/app/i18n/config";
import { addDays, bishkekToday, isDateOnly } from "@/lib/stay-dates";
import { AI_HISTORY_LIMIT, AI_MESSAGE_LIMIT, redactContacts, type ChatInput, type ChatMessage } from "./shared";

const normalize = (text: string) => text.normalize("NFKC").toLowerCase().replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "");
const injection = /(?:ignore|forget|override|bypass|disregard).{0,60}(?:instructions?|rules?|prompts?|previous)|(?:system|developer)\s*(?:prompt|message|:)|(?:act|behave)\s+as|roleplay|jailbreak|(?:забудь|игнорируй|обойди|отмени|раскрой|покажи).{0,45}(?:правил|инструкц|промпт|системн)|(?:смени|измени).{0,20}роль|(?:эреже|көрсөтмө).{0,40}(?:унут|эске алба|өзгөрт)|(?:унут|эске алба).{0,40}(?:эреже|көрсөтмө)|(?:api.?key|парол[ьи]|password|токен|secret|сырсөз)|<\/?(?:system|assistant|developer)|\[inst\]/iu;
const offTopic = /\b(?:python|javascript|typescript|president|politics|bitcoin|crypto|recipe|homework|essay|poem|sql|programming)\b|президент|политик|криптовалют|биткоин|напиши.{0,20}(?:код|стих|сочинен)|рецепт|теорем|программир|ыр жаз|код жаз|саясат|президент/iu;
const topic = /a[\s-]?frame|домик|коттедж|кабин|аренд|брон|заброн|стоимост|цен[аыуе]|оплат|отмен|возврат|удобств|проживан|заезд|выезд|гост[ьея]|скид|акци[яию]|поддерж|регистрац|авторизац|кабинет|избран|сайт|отоплен|питомц|wi[ -]?fi|finik|cabin|cottages?|book(?:ing|ed)?|rent|accommodat|pric|cost|pay(?:ment)?|refund|cancel|amenit|check[ -]?(?:in|out)|guests?|discount|support|register|sign[ -]?in|log[ -]?in|account|favorites?|website|pets?|үй|үйлөр|баа|брон|ижара|төл[өо]|конок|жайгаш|каттал|колдоо|ыңгай|жокко чыгар|кайтар|тандалган|эс алуу/iu;
const followUp = /^(?:[\s?.,!\d-]*(?:а |и |and |what about |ал эми )?)(?:сколько|где|когда|на |завтра|сегодня|да|нет|можно|есть|how much|where|when|tomorrow|today|yes|no|for |эртең|бүгүн|канча|кайда|качан|ооба|жок|болобу|[0-9]).{0,100}$/iu;
export function isUnsafe(text: string) { return injection.test(normalize(text)) || offTopic.test(normalize(text)); }
export function topicAllowed(message: string, history: ChatMessage[] = []) {
  const text = normalize(message);
  if (isUnsafe(text)) return false;
  if (topic.test(text) || /^(?:hi|hello|hey|привет|здравствуйте|салам|саламатсызбы|спасибо|рахмат|thanks)[! .👋]*$/u.test(text)) return true;
  return text.length <= 120 && followUp.test(text) && history.some(item => item.role === "user" && !isUnsafe(item.content) && topic.test(normalize(item.content)));
}
export function privateQuestion(text: string) {
  return /(?:мо[яюиё]|my|менин).{0,30}(?:брон|book|payment|оплат|төлөм)|(?:статус|status).{0,30}(?:брон|book|оплат|payment)|(?:чуж|других|other|башка).{0,30}(?:пользоват|гост|user|guest|конок)/iu.test(text);
}

export function parseChatInput(value: unknown): ChatInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid");
  const body = value as Record<string, unknown>;
  if (typeof body.locale !== "string" || !isLocale(body.locale) || typeof body.message !== "string" || !body.message.trim() || body.message.length > AI_MESSAGE_LIMIT) throw new Error("invalid");
  if (body.history !== undefined && (!Array.isArray(body.history) || body.history.length > AI_HISTORY_LIMIT)) throw new Error("invalid");
  const history: ChatMessage[] = [];
  for (const item of (body.history || []) as unknown[]) {
    if (!item || typeof item !== "object") throw new Error("invalid");
    const entry = item as Record<string, unknown>;
    if ((entry.role !== "user" && entry.role !== "assistant") || typeof entry.content !== "string" || entry.content.length > 5000) throw new Error("invalid");
    // Assistant messages supplied by a browser are never trusted as model instructions or facts.
    if (entry.role === "user" && entry.content.length <= AI_MESSAGE_LIMIT && topicAllowed(entry.content, history)) history.push({ role: "user", content: redactContacts(entry.content) });
  }
  if (body.cabinSlug !== undefined && (typeof body.cabinSlug !== "string" || !/^[a-zA-Z0-9_-]{1,255}$/.test(body.cabinSlug))) throw new Error("invalid");
  return { locale: body.locale, message: redactContacts(body.message.trim()), history, ...(body.cabinSlug ? { cabinSlug: body.cabinSlug as string } : {}) };
}

export type StayRequest = { checkIn: string; checkOut: string; guests: number };
export function requestedStay(message: string, history: ChatMessage[], now = new Date()): StayRequest | null {
  const questions = [...history.filter(item => item.role === "user").slice(-3).map(item => normalize(item.content)), normalize(message)];
  const text = questions.join("\n");
  // New dates replace old dates; follow-up questions retain the last explicit stay.
  const datedQuestion = [...questions].reverse().find(question => /\d{4}-\d{2}-\d{2}|завтра|сегодня|tomorrow|today|эртең|бүгүн/u.test(question)) || "";
  const dates = datedQuestion.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [];
  const relative = /завтра|tomorrow|эртең/u.test(datedQuestion) ? 1 : /сегодня|today|бүгүн/u.test(datedQuestion) ? 0 : null;
  const checkIn = relative !== null ? addDays(bishkekToday(now), relative) : dates.at(-2) || dates.at(-1);
  const nights = [...text.matchAll(/(?:на\s+|for\s+)?(\d{1,3})\s*(?:ноч[ьи]|ноче[йи]|nights?|түн)/gu)].at(-1)?.[1];
  const checkOut = relative !== null || (dates.length === 1 && nights) ? checkIn && addDays(checkIn, Number(nights || 1)) : dates.length >= 2 ? dates.at(-1) : undefined;
  const guests = Number([...text.matchAll(/(\d{1,2})\s*(?:гост[ьяе]|человек|guests?|people|конок|киши)/gu)].at(-1)?.[1] || 1);
  if (!checkIn || !checkOut || !isDateOnly(checkIn) || !isDateOnly(checkOut) || checkIn < bishkekToday(now) || checkOut <= checkIn || checkOut > addDays(checkIn, 30) || guests < 1 || guests > 50) return null;
  return { checkIn, checkOut, guests };
}
