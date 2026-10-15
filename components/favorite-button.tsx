"use client";

import { Icon } from "@/components/icon";

export function FavoriteButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className={`favorite-button${active ? " is-favorite" : ""}`} type="button" aria-label={label} aria-pressed={active} onClick={onClick}>
      <Icon name="heart" size={19} />
    </button>
  );
}
