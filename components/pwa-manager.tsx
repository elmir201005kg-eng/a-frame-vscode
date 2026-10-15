"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/app/i18n/config";
import { Icon } from "@/components/icon";
import { pwaText } from "@/lib/pwa";

type InstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaManager({ locale }: { locale: Locale }) {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const text = pwaText[locale];

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator) || !window.isSecureContext) return;

    let disposed = false;
    const rememberLocale = () => navigator.serviceWorker.controller?.postMessage({ type: "SET_LOCALE", locale });
    const register = () => {
      void navigator.serviceWorker.register(process.env.NEXT_PUBLIC_PWA_WORKER_PATH || "/sw.js", { scope: "/", updateViaCache: "none" })
        .then(() => navigator.serviceWorker.ready)
        .then(() => { if (!disposed) rememberLocale(); })
        .catch((error: unknown) => console.warn("[PWA] Service worker registration failed:", error));
    };
    // Let the initial page and its images load before downloading the offline bundle.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    window.addEventListener("online", register);
    navigator.serviceWorker.addEventListener("controllerchange", rememberLocale);
    rememberLocale();
    return () => {
      disposed = true;
      window.removeEventListener("load", register);
      window.removeEventListener("online", register);
      navigator.serviceWorker.removeEventListener("controllerchange", rememberLocale);
    };
  }, [locale]);

  useEffect(() => {
    const offerInstall = (event: Event) => {
      event.preventDefault();
      if (!window.matchMedia("(display-mode: standalone)").matches) setInstallPrompt(event as InstallPromptEvent);
    };
    const installed = () => setInstallPrompt(null);
    window.addEventListener("beforeinstallprompt", offerInstall);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", offerInstall);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  useEffect(() => {
    // Next's client navigation requests RSC, not HTML. Offline links must use a
    // document navigation so the worker can return the complete offline home.
    const navigateOffline = (event: MouseEvent) => {
      if (navigator.onLine && !document.querySelector("[data-offline-page]")) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const target = new URL(anchor.href);
      if (target.origin !== window.location.origin) return;
      event.preventDefault();
      // Keep the component's click handler (for example, closing the mobile
      // menu). Next Link sees defaultPrevented and skips its own navigation.
      if (target.hash && (target.pathname === window.location.pathname || /^\/(kg|ru|en)\/?$/.test(target.pathname))) {
        const section = document.getElementById(decodeURIComponent(target.hash.slice(1)));
        if (section) { window.location.hash = target.hash; section.scrollIntoView(); return; }
      }
      window.location.assign(target.href);
    };
    document.addEventListener("click", navigateOffline, true);
    return () => document.removeEventListener("click", navigateOffline, true);
  }, []);

  async function install() {
    if (!installPrompt) return;
    setInstalling(true);
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch (error) {
      console.warn("[PWA] Installation prompt failed:", error);
    } finally {
      setInstallPrompt(null);
      setInstalling(false);
    }
  }

  if (!installPrompt) return null;
  return (
    <aside className="pwa-install" aria-label={text.install}>
      <button className="button button-primary" type="button" disabled={installing} onClick={() => void install()}>
        <Icon name="home" size={19} />{text.install}
      </button>
      <button className="pwa-dismiss" type="button" aria-label={text.dismiss} onClick={() => setInstallPrompt(null)}><Icon name="x" size={20} /></button>
    </aside>
  );
}
