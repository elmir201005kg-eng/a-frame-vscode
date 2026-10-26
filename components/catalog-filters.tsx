"use client";

import { useId, useState, type ReactNode } from "react";
import { Icon } from "@/components/icon";

export function CatalogFilters({ label, activeCount = 0, children }: { label: string; activeCount?: number; children: ReactNode }) {
  const [open, setOpen] = useState(false),
    id = useId();
  return (
    <aside className="catalog-filter-card">
      <h2>
        <span className="catalog-filter-desktop-title">{label}{activeCount > 0 && <span className="catalog-filter-count">{activeCount}</span>}</span>
        <button
          type="button"
          className="catalog-filter-toggle"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{label}{activeCount > 0 && <span className="catalog-filter-count">{activeCount}</span>}</span>
          <Icon name="chevron-down" className={open ? "is-open" : ""} />
        </button>
      </h2>
      <div id={id} className={`catalog-filters-content${open ? " is-open" : ""}`}>
        {children}
      </div>
    </aside>
  );
}
