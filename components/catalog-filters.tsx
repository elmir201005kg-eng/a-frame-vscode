"use client";

import { useId, useState, type ReactNode } from "react";
import { Icon } from "@/components/icon";

export function CatalogFilters({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false),
    id = useId();
  return (
    <aside className="catalog-filter-card">
      <h2>
        <span className="catalog-filter-desktop-title">{label}</span>
        <button
          type="button"
          className="catalog-filter-toggle"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          {label}
          <Icon name="chevron-down" className={open ? "is-open" : ""} />
        </button>
      </h2>
      <div id={id} className={`catalog-filters-content${open ? " is-open" : ""}`}>
        {children}
      </div>
    </aside>
  );
}
