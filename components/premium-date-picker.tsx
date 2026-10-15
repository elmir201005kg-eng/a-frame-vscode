"use client";

import * as Popover from "@radix-ui/react-popover";
import { useEffect, useId, useRef, useState, type InputHTMLAttributes } from "react";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { Icon } from "@/components/icon";
import { useFormDesign } from "@/components/form-design-provider";
import { addDays, isDateOnly, validStay } from "@/lib/stay-dates";
import { formatNumber } from "@/app/i18n/format";
import { isFirstInvalidControl } from "@/lib/form-controls";

function displayDate(value: string, months: string[], locale: "ru" | "kg" | "en") {
  if (!isDateOnly(value)) return "";
  const date = new Date(`${value}T00:00:00Z`);
  return `${formatNumber(date.getUTCDate(), locale)} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
function focusCalendar(event: Event) {
  event.preventDefault();
  requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('[data-premium-calendar] .calendar-grid button[tabindex="0"]')?.focus());
}

export function PremiumDateInput({
  label, value: controlled, defaultValue, onChange, min, max, id, name, disabled, required, error,
  className = "", ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: boolean }) {
  const { today, common, text, locale } = useFormDesign();
  const initial = String(defaultValue ?? ""), [local, setLocal] = useState(initial);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null), input = useRef<HTMLInputElement>(null);
  const value = String(controlled ?? local), popupId = useId();
  const minimum = String(min || today);
  useEffect(() => {
    const form = input.current?.form;
    const reset = () => { setLocal(initial); setOpen(false); };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [initial]);
  function change(next: string) {
    setLocal(next);
    if (input.current) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input.current, next);
      input.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }
  return <div className="premium-date-input">
    <input {...props} ref={input} type="date" className="premium-validation-input" aria-hidden="true" tabIndex={-1}
      name={name} required={required} disabled={disabled} min={minimum} max={max} value={value}
      onChange={event => { setLocal(event.target.value); onChange?.(event); }} onInvalid={event => {
        event.preventDefault();
        if (isFirstInvalidControl(input.current)) { trigger.current?.focus(); setOpen(true); }
      }} />
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button id={id} ref={trigger} type="button" disabled={disabled} className={`premium-control premium-date-trigger ${className}`}
          aria-label={`${label}${required ? `, ${text.required}` : ""}: ${displayDate(value, common.calendar.months, locale) || text.selectDate}`}
          data-invalid={error || props["aria-invalid"] || undefined}
          aria-describedby={props["aria-describedby"]} data-empty={!value || undefined} aria-controls={open ? popupId : undefined}>
          <span>{displayDate(value, common.calendar.months, locale) || text.selectDate}</span><Icon name="calendar" size={18} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content id={popupId} className="premium-menu premium-calendar-popover" data-premium-calendar
          aria-label={label} align="start" sideOffset={8} collisionPadding={12} onOpenAutoFocus={focusCalendar}>
          <div className="premium-popover-heading"><strong>{label}</strong><Popover.Close className="premium-icon-button" aria-label={text.close}><Icon name="x" size={18} /></Popover.Close></div>
          <AvailabilityCalendar key={open ? value : "closed"} today={today || minimum} minDate={minimum} maxDate={max ? String(max) : undefined}
            months={common.calendar.months} weekdays={common.calendar.weekdays} blocked={[]} common={common} selectionMode="single"
            checkIn={value} onDay={day => { change(day); setOpen(false); }} />
          {!required && <button type="button" className="premium-clear-button" onClick={() => { change(""); setOpen(false); }}>{text.clear}</button>}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  </div>;
}

export type DateRangeValue = { checkIn: string; checkOut: string };
export function PremiumDatePicker({
  value: controlled, defaultValue = { checkIn: "", checkOut: "" }, onValueChange, today: suppliedToday,
  blocked = [], disabled, required, startName = "checkIn", endName = "checkOut", className = "", maxDate,
  labels, error,
}: {
  value?: DateRangeValue; defaultValue?: DateRangeValue; onValueChange?: (value: DateRangeValue) => void;
  today?: string; blocked?: string[]; disabled?: boolean; required?: boolean;
  startName?: string; endName?: string; className?: string; maxDate?: string;
  labels?: { checkIn: string; checkOut: string }; error?: boolean;
}) {
  const design = useFormDesign(), today = suppliedToday || design.today;
  const { common, text, locale } = design;
  const [local, setLocal] = useState(defaultValue);
  const value = controlled ?? local;
  const [open, setOpen] = useState(false), [active, setActive] = useState<"checkIn" | "checkOut">("checkIn");
  const popupId = useId(), startId = useId(), endId = useId();
  const startTrigger = useRef<HTMLButtonElement>(null), endTrigger = useRef<HTMLButtonElement>(null);
  const startInput = useRef<HTMLInputElement>(null), endInput = useRef<HTMLInputElement>(null);
  const fieldLabels = labels ?? { checkIn: common.labels.checkIn, checkOut: common.labels.checkOut };
  const initialStart = defaultValue.checkIn, initialEnd = defaultValue.checkOut;
  useEffect(() => {
    const owner = startInput.current?.form;
    const reset = () => { setLocal({ checkIn: initialStart, checkOut: initialEnd }); setOpen(false); };
    owner?.addEventListener("reset", reset);
    return () => owner?.removeEventListener("reset", reset);
  }, [initialStart, initialEnd]);
  useEffect(() => {
    const invalid = (value.checkIn || value.checkOut) && !validStay(value.checkIn, value.checkOut, today, blocked);
    startInput.current?.setCustomValidity(value.checkIn && (value.checkIn < today || blocked.includes(value.checkIn)) ? common.errors.datesUnavailable : "");
    endInput.current?.setCustomValidity(invalid ? common.errors.invalidDates : "");
  }, [value.checkIn, value.checkOut, today, blocked, common]);
  function change(next: DateRangeValue) { setLocal(next); onValueChange?.(next); }
  function choose(day: string) {
    if (active === "checkIn" || !isDateOnly(value.checkIn)) {
      const end = validStay(day, value.checkOut, today, blocked) ? value.checkOut : "";
      change({ checkIn: day, checkOut: end }); setActive("checkOut");
      requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('[data-premium-calendar] .calendar-grid button[tabindex="0"]')?.focus());
    } else if (validStay(value.checkIn, day, today, blocked)) {
      change({ ...value, checkOut: day }); setOpen(false);
    }
  }
  function show(name: "checkIn" | "checkOut") { setActive(name); setOpen(true); }
  return <Popover.Root open={open} onOpenChange={setOpen}>
    <Popover.Anchor asChild>
      <div className={`premium-date-range ${className}`}>
        {(["checkIn", "checkOut"] as const).map(name => {
          const isStart = name === "checkIn", id = isStart ? startId : endId;
          return <div className="product-field premium-range-field" key={name}>
            <label htmlFor={id}>{fieldLabels[name]}</label>
            <input ref={isStart ? startInput : endInput} name={isStart ? startName : endName} type="date" value={value[name]}
              className="premium-validation-input" aria-hidden="true" tabIndex={-1} disabled={disabled} required={required}
              min={isStart ? today : addDays(value.checkIn, 1) || today} max={maxDate}
              onChange={event => change({ ...value, [name]: event.target.value })} onInvalid={event => {
                event.preventDefault();
                if (isFirstInvalidControl((isStart ? startInput : endInput).current)) { show(name); (isStart ? startTrigger : endTrigger).current?.focus(); }
              }} />
            <button type="button" id={id} ref={isStart ? startTrigger : endTrigger} disabled={disabled}
              className="premium-control premium-date-trigger" data-empty={!value[name] || undefined}
              aria-haspopup="dialog" aria-expanded={open && active === name} aria-controls={open ? popupId : undefined}
              aria-label={`${fieldLabels[name]}${required ? `, ${text.required}` : ""}: ${displayDate(value[name], common.calendar.months, locale) || text.selectDate}`}
              data-invalid={error || undefined} onClick={() => show(name)}>
              <span>{displayDate(value[name], common.calendar.months, locale) || text.selectDate}</span><Icon name="calendar" size={18} />
            </button>
          </div>;
        })}
      </div>
    </Popover.Anchor>
    <Popover.Portal>
      <Popover.Content id={popupId} className="premium-menu premium-calendar-popover" data-premium-calendar
        aria-label={fieldLabels[active]} align="start" sideOffset={8} collisionPadding={12} onOpenAutoFocus={focusCalendar}
        onCloseAutoFocus={event => {
          event.preventDefault();
          const focused = document.activeElement;
          if (!focused || focused === document.body || focused.closest('[data-premium-calendar]')) (active === "checkIn" ? startTrigger : endTrigger).current?.focus();
        }}>
        <div className="premium-popover-heading"><strong>{fieldLabels[active]}</strong><Popover.Close className="premium-icon-button" aria-label={text.close}><Icon name="x" size={18} /></Popover.Close></div>
        <p className="premium-calendar-hint">{text.rangeHint}</p>
        <AvailabilityCalendar key={open ? "open" : "closed"} today={today} months={common.calendar.months} weekdays={common.calendar.weekdays}
          blocked={blocked} common={common} checkIn={value.checkIn} checkOut={value.checkOut} maxDate={maxDate}
          selectionMode={active === "checkOut" && value.checkIn ? "end" : "start"} onDay={choose} />
        <div className="premium-popover-footer">
          <button type="button" className="premium-clear-button" onClick={() => { change({ checkIn: "", checkOut: "" }); setActive("checkIn"); }}>{text.clear}</button>
          <Popover.Close className="button button-primary">{text.done}</Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>;
}
