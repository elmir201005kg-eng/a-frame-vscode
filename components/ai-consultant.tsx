"use client";

import dynamic from "@/components/lazy-component";
import { usePathname } from "@/client/router";
import { useRef, useState } from "react";
import type { Locale } from "@/app/i18n/config";
import type { aiText } from "@/app/i18n/ai";
import { Icon } from "@/components/icon";
import { CabinAssistantMark } from "./ai-mark";

const ChatPanel = dynamic(() => import("./ai-chat-panel").then(module => module.AiChatPanel), { ssr: false });

export function AiConsultant({ locale, labels }: { locale: Locale; labels: Pick<(typeof aiText)[Locale], "open" | "close"> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const t = labels;
  if (/\/(?:admin(?:\/|-|$)|owner(?:\/|$)|offline(?:\/|$))/.test(pathname)) return null;
  function close() { setOpen(false); launcher.current?.focus(); }
  return <div className="af-ai-widget" data-ai-widget data-open={open}>
    {open && <ChatPanel key={locale} locale={locale} onClose={close} />}
    <button ref={launcher} className="af-ai-launcher" onClick={() => open ? close() : setOpen(true)} aria-label={open ? t.close : t.open} aria-expanded={open} aria-controls={open ? "a-frame-ai-chat" : undefined}>
      <span className="af-ai-launcherIcon">{open ? <Icon name="x" size={24} /> : <CabinAssistantMark />}</span>
      <span className="af-ai-launcherLabel">AI<span>A-FRAME KG</span></span>
      {!open && <span className="af-ai-launcherDot" aria-hidden="true" />}
    </button>
  </div>;
}
