"use client";

import * as Popover from "@radix-ui/react-popover";
import { useEffect, useRef, useState } from "react";
import { PremiumCheckbox } from "@/components/premium-fields";
import { Icon } from "@/components/icon";
import { useFormDesign } from "@/components/form-design-provider";

export function FilterDropdown({ label, options, defaultValue = [], name = "amenity" }: {
  label: string; options: { value: string; label: string }[]; defaultValue?: string[]; name?: string;
}) {
  const { text } = useFormDesign();
  const [selected, setSelected] = useState(defaultValue);
  const root = useRef<HTMLDivElement>(null);
  const initialKey = JSON.stringify(defaultValue);
  useEffect(() => {
    const form = root.current?.closest("form");
    const reset = () => setSelected(JSON.parse(initialKey));
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [initialKey]);
  return <div ref={root} className="product-field filter-dropdown">
    {selected.map(value => <input key={value} type="hidden" name={name} value={value} />)}
    <Popover.Root>
      <Popover.Trigger className="premium-control premium-filter-trigger" type="button">
        <span>{label}</span>{selected.length > 0 && <span className="premium-filter-count">{selected.length}</span>}<Icon name="chevron-down" className="premium-chevron" size={18} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="premium-menu premium-filter-popover" aria-label={label} align="start" sideOffset={8} collisionPadding={12}>
          <div className="premium-popover-heading"><strong>{label}</strong><Popover.Close className="premium-icon-button" aria-label={text.close}><Icon name="x" size={18} /></Popover.Close></div>
          <div className="premium-filter-options">
            {options.map(option => <label className="premium-filter-option" key={option.value}>
              <PremiumCheckbox value={option.value} checked={selected.includes(option.value)} onChange={event => {
                setSelected(previous => event.target.checked ? [...previous, option.value] : previous.filter(value => value !== option.value));
              }} />{option.label}
            </label>)}
          </div>
          <div className="premium-popover-footer"><button type="button" className="premium-clear-button" onClick={() => setSelected([])}>{text.clear}</button><Popover.Close className="button button-primary">{text.done}</Popover.Close></div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  </div>;
}
