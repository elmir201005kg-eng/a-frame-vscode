"use client";

import * as Select from "@radix-ui/react-select";
import { Children, isValidElement, Fragment, useEffect, useId, useRef, useState, type ReactNode, type OptionHTMLAttributes, type ComponentPropsWithoutRef } from "react";
import { Icon } from "@/components/icon";
import { Spinner } from "@/components/pending-button";
import { useFormDesign } from "@/components/form-design-provider";
import { isFirstInvalidControl } from "@/lib/form-controls";

export type PremiumOption = { value: string; label: string; content?: ReactNode; disabled?: boolean; lang?: string };
export type PremiumSelectProps = Omit<ComponentPropsWithoutRef<typeof Select.Trigger>, "onChange" | "value" | "defaultValue"> & {
  required?: boolean;
  autoComplete?: string;
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string) => void;
  options?: PremiumOption[];
  placeholder?: string;
  loading?: boolean;
  error?: boolean;
  displayValue?: ReactNode;
};
const EMPTY = "__aframe_empty_option__";
function optionText(children: ReactNode): string {
  return Children.toArray(children).map(child => isValidElement<{ children?: ReactNode }>(child) ? optionText(child.props.children) : String(child)).join("");
}
function readOptions(children: ReactNode): PremiumOption[] {
  return Children.toArray(children).flatMap(child => {
    if (!isValidElement<OptionHTMLAttributes<HTMLOptionElement>>(child)) return [];
    if (child.type === Fragment) return readOptions(child.props.children);
    if (child.type !== "option") return [];
    const label = optionText(child.props.children);
    return [{ value: String(child.props.value ?? label), label, disabled: child.props.disabled, lang: child.props.lang }];
  });
}

export function PremiumSelect({
  children, options: supplied, value: controlled, defaultValue, onValueChange, name, id: suppliedId,
  required, disabled, loading, error, placeholder, className = "", displayValue, form, autoComplete,
  ...props
}: PremiumSelectProps) {
  const { text } = useFormDesign();
  const options = supplied ?? readOptions(children);
  const initial = String(defaultValue ?? options[0]?.value ?? "");
  const [local, setLocal] = useState(initial);
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const tabDirection = useRef(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const generated = useId(), id = suppliedId ?? generated;
  const value = String(controlled ?? local);
  const selected = options.find(option => option.value === value);
  useEffect(() => {
    const owner = input.current?.form;
    const reset = () => { setLocal(initial); setOpen(false); };
    owner?.addEventListener("reset", reset);
    return () => owner?.removeEventListener("reset", reset);
  }, [initial]);
  function change(next: string) {
    const actual = next === EMPTY ? "" : next;
    setLocal(actual);
    setInvalid(false);
    onValueChange?.(actual);
  }
  return <div className="premium-select">
    <input ref={input} type="text" className="premium-validation-input" aria-hidden="true" tabIndex={-1}
      name={name} form={form} autoComplete={autoComplete} required={required} disabled={disabled || loading}
      value={value} onChange={event => change(event.target.value)} onInvalid={event => {
        event.preventDefault(); setInvalid(true);
        if (isFirstInvalidControl(input.current)) { trigger.current?.focus(); setOpen(true); }
      }} />
    <Select.Root value={value || EMPTY} onValueChange={change} open={open} onOpenChange={setOpen} disabled={disabled || loading}>
      <Select.Trigger {...props} id={id} ref={trigger} className={`premium-control premium-select-trigger ${className}`}
        aria-invalid={error || invalid || props["aria-invalid"] || undefined} aria-required={required || undefined}
        aria-busy={loading || undefined} data-empty={!value || undefined}>
        <Select.Value>{displayValue ?? selected?.label ?? placeholder ?? text.choose}</Select.Value>
        <Select.Icon className="premium-chevron">{loading ? <Spinner /> : <Icon name="chevron-down" size={18} />}</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="premium-menu premium-select-content" position="popper" sideOffset={7}
          collisionPadding={12} align="start" avoidCollisions
          onKeyDown={event => {
            if (event.key === "Tab") { event.preventDefault(); tabDirection.current = event.shiftKey ? -1 : 1; setOpen(false); }
          }}
          onCloseAutoFocus={event => {
            if (!tabDirection.current) return;
            event.preventDefault();
            const direction = tabDirection.current;
            tabDirection.current = 0;
            const controls = Array.from(document.querySelectorAll<HTMLElement>('a[href], button, input, textarea, select, [tabindex="0"]'))
              .filter(element => element.tabIndex >= 0 && !element.matches(":disabled") && !element.closest('[aria-hidden="true"], .premium-menu') && element.getBoundingClientRect().width > 1 && element.getBoundingClientRect().height > 1 && getComputedStyle(element).visibility !== "hidden");
            const index = controls.indexOf(trigger.current!);
            (controls[index + direction] ?? trigger.current)?.focus();
          }}>
          <Select.ScrollUpButton className="premium-select-scroll"><Icon name="chevron-down" className="rotate-180" size={16} /></Select.ScrollUpButton>
          <Select.Viewport className="premium-select-viewport">
            {options.map(option => <Select.Item key={option.value || EMPTY} value={option.value || EMPTY}
              disabled={option.disabled} textValue={option.label} lang={option.lang} className="premium-option">
              <Select.ItemText>{option.content ?? option.label}</Select.ItemText>
              <Select.ItemIndicator className="premium-option-check"><Icon name="check" size={17} /></Select.ItemIndicator>
            </Select.Item>)}
          </Select.Viewport>
          <Select.ScrollDownButton className="premium-select-scroll"><Icon name="chevron-down" size={16} /></Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>;
}
