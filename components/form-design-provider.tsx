"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { Locale } from "@/app/i18n/config";
import { bishkekToday } from "@/lib/stay-dates";
import ru from "@/app/i18n/locales/ru/common.json";
import kg from "@/app/i18n/locales/kg/common.json";
import en from "@/app/i18n/locales/en/common.json";
import { formMessages } from "@/app/i18n/forms";

const dictionaries = { ru, kg, en };
const FormLocale = createContext<Locale>("ru");
function subscribeToday(notify: () => void) {
  const timer = setInterval(notify, 60000);
  return () => clearInterval(timer);
}
const serverToday = () => "";
const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

export function useHydrated() {
  return useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);
}

export function FormDesignProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <FormLocale.Provider value={locale}>{children}</FormLocale.Provider>;
}

export function useFormDesign(explicitLocale?: Locale) {
  const inheritedLocale = useContext(FormLocale);
  // Controls with a page locale use the same serialized value for SSR and
  // hydration instead of falling back to the provider's default language.
  const locale = explicitLocale ?? inheritedLocale;
  const today = useSyncExternalStore(subscribeToday, bishkekToday, serverToday);
  return { locale, today, text: formMessages[locale], common: dictionaries[locale] };
}
