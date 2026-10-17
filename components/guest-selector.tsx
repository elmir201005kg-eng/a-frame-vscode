"use client";

import * as Popover from "@radix-ui/react-popover";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { useFormDesign } from "@/components/form-design-provider";
import { formatNumber, interpolate, pluralize } from "@/app/i18n/format";
import { isFirstInvalidControl } from "@/lib/form-controls";
import type { Locale } from "@/app/i18n/config";

export function GuestSelector({
  locale, value: controlled, defaultValue = "", onValueChange, maxGuests = 50, minGuests = 1, name = "guests",
  disabled, required, label, placeholder, className = "",
}: {
  locale: Locale;
  value?: string; defaultValue?: string; onValueChange?: (value: string) => void; maxGuests?: number; minGuests?: number;
  name?: string; disabled?: boolean; required?: boolean; label?: string; placeholder?: string; className?: string;
}) {
  const { common, text } = useFormDesign(locale);
  const [local, setLocal] = useState(defaultValue), [open, setOpen] = useState(false);
  const value = controlled ?? local, count = Number(value);
  const input = useRef<HTMLInputElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const editableCount = useRef<HTMLInputElement>(null);
  const id = useId(), countId = useId();
  const title = label ?? common.labels.guests;
  useEffect(() => {
    const form = input.current?.form;
    const reset = () => { setLocal(defaultValue); setOpen(false); };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [defaultValue]);
  function change(next: string) { setLocal(next); onValueChange?.(next); }
  function step(amount: number) {
    change(String(Math.min(maxGuests, Math.max(minGuests, value ? count + amount : minGuests))));
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const field = editableCount.current;
      field?.getAnimations().forEach(animation => animation.cancel());
      field?.animate([{ opacity: .55, transform: "translateY(2px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 140, easing: "ease-out" });
    }
  }
  return <div className={`product-field guest-selector ${className}`}>
    <label htmlFor={id}>{title}</label>
    <input ref={input} name={name} type="number" className="premium-validation-input" tabIndex={-1} aria-hidden="true"
      min={minGuests} max={maxGuests} step={1} required={required} disabled={disabled} value={value}
      onChange={event => change(event.target.value)} onInvalid={event => {
        event.preventDefault(); if (isFirstInvalidControl(input.current)) { trigger.current?.focus(); setOpen(true); }
      }} />
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button ref={trigger} id={id} type="button" disabled={disabled} className="premium-control premium-guest-trigger" data-empty={!value || undefined}
          aria-label={`${title}${required ? `, ${text.required}` : ""}: ${value ? pluralize(count, locale, text.guestForms) : placeholder || common.labels.anyGuests}`}>
          <span className="premium-guest-value"><Icon name="users" size={18} /><span>{value ? pluralize(count, locale, text.guestForms) : placeholder || common.labels.anyGuests}</span></span>
          <Icon name="chevron-down" size={18} className="premium-chevron" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="premium-menu premium-guest-popover" aria-label={title} sideOffset={8} collisionPadding={12} align="start">
          <div className="premium-popover-heading"><strong>{title}</strong><Popover.Close className="premium-icon-button" aria-label={text.close}><Icon name="x" size={18} /></Popover.Close></div>
          <p className="form-hint">{interpolate(text.capacity, { count: formatNumber(maxGuests, locale) })}</p>
          <div className="premium-guest-stepper">
            <button type="button" className="premium-step-button" aria-label={text.decrease} disabled={!value || count <= minGuests} onClick={() => step(-1)}><Icon name="minus" size={20} /></button>
            <div className="premium-step-value"><label htmlFor={countId} className="sr-only">{text.guestCount}</label>
              <input ref={editableCount} id={countId} type="number" inputMode="numeric" min={minGuests} max={maxGuests} step={1} value={value}
                placeholder={String(minGuests)} onChange={event => {
                  const next = event.target.value;
                  if (!next) { change(""); return; }
                  const numeric = Number(next);
                  if (Number.isInteger(numeric)) change(String(Math.min(maxGuests, Math.max(minGuests, numeric))));
                }} onKeyDown={event => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); step(event.key === "ArrowUp" ? 1 : -1); }
                }} />
              <span aria-live="polite" className="sr-only">{value ? pluralize(count, locale, text.guestForms) : common.labels.anyGuests}</span>
            </div>
            <button type="button" className="premium-step-button" aria-label={text.increase} disabled={count >= maxGuests} onClick={() => step(1)}><Icon name="plus" size={20} /></button>
          </div>
          <div className="premium-popover-footer">
            {!required ? <button type="button" className="premium-clear-button" onClick={() => change("")}>{text.clear}</button> : <span />}
            <Popover.Close className="button button-primary">{text.done}</Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  </div>;
}
