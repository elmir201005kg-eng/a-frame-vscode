"use client";

import { useMemo, useSyncExternalStore } from "react";
import { cabins } from "@/lib/landing-data";

const storageKey = "a-frame-kg:favorites";
const changedEvent = "a-frame-kg:favorites-changed";
export const favoritesViewEvent = "a-frame-kg:show-favorites";
let memoryFavorites = "[]";
let useMemoryFavorites = false;

function readFavorites() {
  if (useMemoryFavorites) return memoryFavorites;
  try {
    return window.localStorage.getItem(storageKey) ?? memoryFavorites;
  } catch {
    return memoryFavorites;
  }
}

function subscribeFavorites(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changedEvent, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(changedEvent, callback);
  };
}

function parseFavorites(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string" && cabins.some((cabin) => cabin.id === id))
      : [];
  } catch {
    return [];
  }
}

export function useCabinFavorites() {
  const snapshot = useSyncExternalStore(subscribeFavorites, readFavorites, () => "[]");
  return useMemo(() => parseFavorites(snapshot), [snapshot]);
}

export function toggleFavorite(id: string) {
  const existing = parseFavorites(readFavorites());
  const next = existing.includes(id) ? existing.filter((item) => item !== id) : [...existing, id];
  memoryFavorites = JSON.stringify(next);
  try {
    window.localStorage.setItem(storageKey, memoryFavorites);
  } catch {
    useMemoryFavorites = true;
  }
  window.dispatchEvent(new Event(changedEvent));
}

export function requestFavoritesView() {
  window.dispatchEvent(new Event(favoritesViewEvent));
}
