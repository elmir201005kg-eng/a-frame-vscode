"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icon";
import type { CommonDictionary } from "@/app/i18n/platform";
import { useFormDesign } from "@/components/form-design-provider";
import { addDays, isDateOnly, validStay } from "@/lib/stay-dates";
import type { Locale } from "@/app/i18n/config";

export function AvailabilityCalendar({
  locale, today, months, weekdays, blocked = [], common, onDay, checkIn = "", checkOut = "",
  selectionMode, minDate = today, maxDate,
}: {
  locale: Locale;
  today: string; months: string[]; weekdays: string[]; blocked?: string[];
  common: CommonDictionary; onDay?: (day: string) => void; checkIn?: string; checkOut?: string;
  selectionMode?: "start" | "end" | "single"; minDate?: string; maxDate?: string;
}) {
  const { text } = useFormDesign(locale);
  const mode = selectionMode ?? (checkIn && !checkOut ? "end" : "start");
  const candidate = mode === "end" ? checkOut : checkIn;
  const fallback = today < minDate ? minDate : maxDate && today > maxDate ? maxDate : today;
  const origin = isDateOnly(candidate) ? candidate : (mode === "end" && isDateOnly(checkIn) ? addDays(checkIn, 1) : fallback);
  const [monthValue, setMonthValue] = useState(() => (origin || today).slice(0, 7) + "-01");
  const [focused, setFocused] = useState(origin || today);
  const grid = useRef<HTMLDivElement>(null);
  const headingId = useId(), helpId = useId();
  const occupied = useMemo(() => new Set(blocked), [blocked]);
  const month = new Date(`${monthValue}T00:00:00Z`);
  const padding = (month.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
  const values = Array.from({ length: days }, (_, i) => monthValue.slice(0, 8) + String(i + 1).padStart(2, "0"));
  function unavailable(value: string) {
    if (value < minDate || (maxDate && value > maxDate)) return true;
    if (mode === "end" && isDateOnly(checkIn)) return !validStay(checkIn, value, today, blocked);
    return occupied.has(value);
  }
  const focusDay = values.includes(focused) && !unavailable(focused) ? focused : values.find(value => !unavailable(value));
  const cells = [...Array.from({ length: padding }, () => ""), ...values];
  while (cells.length % 7) cells.push("");
  function monthShift(amount: number, date = monthValue) {
    const source = new Date(`${date}T00:00:00Z`);
    const first = new Date(Date.UTC(source.getUTCFullYear(), source.getUTCMonth() + amount, 1));
    const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    first.setUTCDate(Math.min(source.getUTCDate(), last));
    return first.toISOString().slice(0, 10);
  }
  function moveFocus(next: string, direction: number) {
    for (let attempt = 0; attempt < 366 && unavailable(next); attempt++) {
      if (next < minDate || (maxDate && next > maxDate)) return;
      next = addDays(next, direction);
    }
    if (unavailable(next)) return;
    setFocused(next); setMonthValue(next.slice(0, 7) + "-01");
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>(`button[data-date="${next}"]`)?.focus());
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, value: string) {
    let next = "", direction = 1;
    const weekday = (new Date(`${value}T00:00:00Z`).getUTCDay() + 6) % 7;
    switch (event.key) {
      case "ArrowLeft": next = addDays(value, -1); direction = -1; break;
      case "ArrowRight": next = addDays(value, 1); break;
      case "ArrowUp": next = addDays(value, -7); direction = -1; break;
      case "ArrowDown": next = addDays(value, 7); break;
      case "Home": next = addDays(value, -weekday); break;
      case "End": next = addDays(value, 6 - weekday); direction = -1; break;
      case "PageUp": next = monthShift(event.shiftKey ? -12 : -1, value); direction = -1; break;
      case "PageDown": next = monthShift(event.shiftKey ? 12 : 1, value); break;
      default: return;
    }
    event.preventDefault(); moveFocus(next, direction);
  }
  const previous = monthShift(-1), next = monthShift(1);
  return <div className="availability-calendar">
    <div className="calendar-heading">
      <button type="button" className="calendar-nav" aria-label={common.labels.previous}
        disabled={previous.slice(0, 7) < minDate.slice(0, 7)} onClick={() => setMonthValue(previous)}>
        <Icon name="chevron-left" size={18} />
      </button>
      <strong id={headingId} aria-live="polite">{months[month.getUTCMonth()]} {month.getUTCFullYear()}</strong>
      <button type="button" className="calendar-nav" aria-label={common.labels.next}
        disabled={!!maxDate && next.slice(0, 7) > maxDate.slice(0, 7)} onClick={() => setMonthValue(next)}>
        <Icon name="chevron-right" size={18} />
      </button>
    </div>
    <div ref={grid} className="calendar-grid" role="grid" aria-labelledby={headingId} aria-describedby={helpId}>
      <div className="calendar-week" role="row">
        {weekdays.map(day => <span role="columnheader" className="calendar-weekday" key={day}>{day}</span>)}
      </div>
      {Array.from({ length: cells.length / 7 }, (_, row) => <div className="calendar-week" role="row" key={row}>
        {cells.slice(row * 7, row * 7 + 7).map((value, index) => {
          if (!value) return <span role="gridcell" key={`empty-${index}`} />;
          const selected = value === checkIn || value === checkOut;
          const dayLabel = `${Number(value.slice(8))} ${months[month.getUTCMonth()]} ${month.getUTCFullYear()}`;
          return <span role="gridcell" key={value} aria-selected={selected}>
            <button type="button" data-date={value} tabIndex={value === focusDay ? 0 : -1}
              className={`${occupied.has(value) ? "is-occupied " : ""}${selected ? "is-selected " : ""}${checkIn && checkOut && value > checkIn && value < checkOut ? "in-range " : ""}${value === today ? "is-today" : ""}`}
              disabled={unavailable(value) || !onDay} aria-label={`${dayLabel}: ${occupied.has(value) ? common.labels.occupied : common.labels.available}`}
              aria-current={value === today ? "date" : undefined} aria-pressed={selected}
              onKeyDown={event => keyboard(event, value)} onFocus={() => setFocused(value)} onClick={() => onDay?.(value)}>
              {Number(value.slice(8))}
            </button>
          </span>;
        })}
      </div>)}
    </div>
    {mode !== "single" && <div className="calendar-legend">
      <span><i />{common.labels.available}</span>
      <span><i className="is-occupied" />{common.labels.occupied}</span>
    </div>}
    <p id={helpId} className="sr-only">{text.calendarKeyboard}</p>
    {mode !== "single" && <p className="form-hint">{common.labels.calendarHint}</p>}
  </div>;
}
