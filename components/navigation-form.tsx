"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition, type ComponentProps } from "react";

const NavigationPending = createContext(false);
export const useNavigationPending = () => useContext(NavigationPending);

export function NavigationForm({ children, action, onSubmit, ...props }: Omit<ComponentProps<typeof Form>, "action"> & { action: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <NavigationPending.Provider value={pending}>
    <Form {...props} action={action} aria-busy={pending} onSubmit={(event) => {
      onSubmit?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      if (pending) return;
      // Capture successful controls before a pending UI can disable them.
      const target = new URL(action, window.location.href);
      target.search = "";
      for (const [name, value] of new FormData(event.currentTarget)) {
        if (typeof value === "string" && value) target.searchParams.append(name, value);
      }
      startTransition(() => router.push(`${target.pathname}${target.search}`, { scroll: props.scroll ?? true }));
    }}>{children}</Form>
  </NavigationPending.Provider>;
}
