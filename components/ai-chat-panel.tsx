"use client";

import Link from "@/components/navigation-link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Locale } from "@/app/i18n/config";
import { aiText } from "@/app/i18n/ai";
import { Icon } from "@/components/icon";
import { AI_HISTORY_LIMIT, AI_MESSAGE_LIMIT, redactContacts, safeChatHref, type ChatMessage, type ChatReply } from "@/lib/ai/shared";
import { CabinAssistantMark } from "./ai-mark";

const storagePrefix = "a-frame-ai-v1:";
const savedLimit = 20;
function restore(locale: Locale): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(`${storagePrefix}${locale}`);
    if (!raw || raw.length > 100000) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-savedLimit).flatMap((item): ChatMessage[] => {
      if (!item || (item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string" || item.content.length > 5000) return [];
      return [{ role: item.role, content: item.role === "user" ? redactContacts(item.content) : item.content,
        ...(item.mode === "ai" || item.mode === "faq" || item.mode === "policy" ? { mode: item.mode } : {}),
        links: Array.isArray(item.links) ? item.links.filter((link: unknown): link is { href: string; label: string } => Boolean(link && typeof link === "object" && "href" in link && typeof link.href === "string" && safeChatHref(link.href, locale) && "label" in link && typeof link.label === "string" && link.label.length <= 255)).slice(0, 4) : [],
      }];
    });
  } catch { return []; }
}

export function AiChatPanel({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  // This panel is loaded with ssr:false. Storage is read exactly once, never during server rendering.
  const [messages, setMessages] = useState<ChatMessage[]>(() => restore(locale));
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<"network" | "rate" | "invalid" | null>(null);
  const [lastRequest, setLastRequest] = useState<string | null>(null);
  const [notice, setNotice] = useState<ChatReply["notice"]>();
  const [cooldown, setCooldown] = useState(0);
  const requestRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  const viewport = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const panel = useRef<HTMLElement>(null);
  const t = aiText[locale];

  useEffect(() => {
    try { sessionStorage.setItem(`${storagePrefix}${locale}`, JSON.stringify(messages.slice(-savedLimit))); } catch { /* Restricted storage must not disable chat. */ }
  }, [messages, locale]);
  useEffect(() => { viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: "auto" }); }, [messages, pending, error]);
  useEffect(() => { input.current?.focus(); return () => requestRef.current?.abort(); }, []);
  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  function clear() {
    requestRef.current?.abort();
    requestRef.current = null;
    sendingRef.current = false;
    setPending(false); setMessages([]); setDraft(""); setError(null); setNotice(undefined); setLastRequest(null);
    try { for (const language of ["ru", "kg", "en"]) sessionStorage.removeItem(`${storagePrefix}${language}`); } catch { /* Optional storage. */ }
    input.current?.focus();
  }

  async function send(value: string, retry = false) {
    const content = redactContacts(value.trim());
    if (sendingRef.current || cooldown) return;
    if (!content || content.length > AI_MESSAGE_LIMIT) { setError("invalid"); return; }
    sendingRef.current = true;
    const controller = new AbortController();
    requestRef.current = controller;
    setPending(true); setError(null); setNotice(undefined); setLastRequest(content); setDraft("");
    if (!retry) setMessages(current => [...current, { role: "user" as const, content }].slice(-savedLimit));
    const timeout = window.setTimeout(() => controller.abort("timeout"), 100000);
    try {
      const parts = window.location.pathname.split("/");
      const cabinSlug = parts[2] === "cabins" && /^[a-zA-Z0-9_-]{1,255}$/.test(parts[3] || "") ? parts[3] : undefined;
      const history = messages.filter(item => item.role === "user").slice(-(AI_HISTORY_LIMIT / 2));
      // Retrying keeps the original question as a single message.
      if (retry && history.at(-1)?.content === content) history.pop();
      const response = await fetch("/api/ai/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", cache: "no-store", signal: controller.signal,
        body: JSON.stringify({ locale, message: content, history, ...(cabinSlug ? { cabinSlug } : {}) }),
      });
      if (requestRef.current !== controller) return;
      if (response.status === 429) {
        setCooldown(Math.min(3600, Math.max(1, Number(response.headers.get("retry-after")) || 60)));
        setError("rate"); return;
      }
      if (!response.ok) { setError(response.status === 400 ? "invalid" : "network"); return; }
      const reply = await response.json() as ChatReply;
      if (requestRef.current !== controller) return;
      if (typeof reply.message !== "string" || reply.message.length > 5000 || !["ai", "faq", "policy"].includes(reply.mode) || !Array.isArray(reply.links)) throw new Error("invalidResponse");
      const links = reply.links.filter(link => typeof link.href === "string" && typeof link.label === "string" && safeChatHref(link.href, locale)).slice(0, 4);
      setMessages(current => [...current, { role: "assistant" as const, content: reply.message, mode: reply.mode, links }].slice(-savedLimit));
      setNotice(reply.notice); setLastRequest(null);
    } catch {
      if (requestRef.current === controller) setError("network");
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) { sendingRef.current = false; setPending(false); requestRef.current = null; }
    }
  }

  function submit(event: FormEvent) { event.preventDefault(); void send(draft); }
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
    if (event.key !== "Tab") return;
    const controls = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], textarea:not(:disabled)');
    const first = controls?.[0], last = controls?.[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  const lastMode = [...messages].reverse().find(message => message.role === "assistant")?.mode;
  return <section ref={panel} id="a-frame-ai-chat" className="af-ai-panel" role="dialog" aria-modal="false" aria-labelledby="a-frame-ai-title" onKeyDown={onKeyDown}>
    <header className="af-ai-header">
      <div className="af-ai-avatar"><CabinAssistantMark /></div>
      <div className="af-ai-heading"><span className="af-ai-eyebrow">A-FRAME KG</span><h2 id="a-frame-ai-title">{t.title}</h2><p>{t.subtitle}</p></div>
      <button className="af-ai-iconButton" type="button" onClick={clear} aria-label={t.clear} title={t.clear}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" /></svg></button>
      <button className="af-ai-iconButton" type="button" onClick={onClose} aria-label={t.close} title={t.close}><Icon name="x" size={20} /></button>
    </header>
    <div className="af-ai-status"><span className="af-ai-statusDot" data-offline={lastMode === "faq"} />{lastMode === "faq" ? t.faq : t.ready}<span>RU · KG · ENG</span></div>
    <div className="af-ai-conversation" ref={viewport} role="log" aria-live="polite" aria-relevant="additions" aria-label={t.title}>
      <div className="af-ai-message af-ai-assistant"><span className="af-ai-messageLabel">A-FRAME KG</span><p>{t.greeting}</p></div>
      {messages.length === 0 && <div className="af-ai-quick">{t.quick.map(question => <button key={question} type="button" onClick={() => void send(question)} disabled={pending || cooldown > 0}>{question}</button>)}</div>}
      {messages.map((message, index) => <div key={index} className={`af-ai-message ${message.role === "user" ? "af-ai-user" : "af-ai-assistant"}`}>
        {message.role === "assistant" && <span className="af-ai-messageLabel">{message.mode === "faq" ? t.faq : message.mode === "ai" ? t.ai : t.policy}</span>}
        <p>{message.content}</p>
        {message.links && message.links.length > 0 && <div className="af-ai-links">{message.links.map(link => <Link key={link.href} href={link.href} onClick={onClose}>{link.label}<Icon name="arrow-up-right" size={14} /></Link>)}</div>}
      </div>)}
      {pending && <div className="af-ai-typing" role="status"><span /><span /><span /><small>{t.typing}</small></div>}
      {notice && <p className="af-ai-notice" role="status">{t[notice]}</p>}
      {error && <div className="af-ai-error" role="alert"><p>{t[error]}{cooldown > 0 ? ` (${cooldown})` : ""}</p>{lastRequest && <button type="button" disabled={pending || cooldown > 0} onClick={() => void send(lastRequest, true)}>{t.retry}<Icon name="arrow-right" size={15} /></button>}</div>}
    </div>
    <form onSubmit={submit} className="af-ai-composer">
      <div className="af-ai-inputRow"><textarea ref={input} rows={2} value={draft} onChange={event => setDraft(event.target.value)} maxLength={AI_MESSAGE_LIMIT} placeholder={t.placeholder} aria-label={t.placeholder} disabled={pending}
        onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(draft); } }} />
        <button className="af-ai-send" type="submit" aria-label={t.send} disabled={pending || cooldown > 0 || !draft.trim()}><Icon name="arrow-right" size={21} /></button>
      </div>
      <p className="af-ai-privacy"><Icon name="shield" size={12} /><span>{t.privacy}</span></p>
    </form>
  </section>;
}
