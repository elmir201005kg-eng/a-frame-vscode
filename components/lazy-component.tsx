"use client";
import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from "react";

export default function lazyComponent<P extends object>(load: () => Promise<ComponentType<P>>, options: { ssr?: boolean; loading?: () => ReactNode } = {}) {
  const Component = lazy(async () => ({ default: await load() }));
  return function LazyComponent(props: P) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const fallback = options.loading?.() ?? null;
    if (options.ssr === false && !mounted) return fallback;
    return <Suspense fallback={fallback}><Component {...props} /></Suspense>;
  };
}
