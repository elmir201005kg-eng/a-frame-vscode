import type { Metadata } from "./types";

export function MetadataTags({ metadata = {} }: { metadata?: Metadata }) {
  return <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>{metadata.title || "A-FRAME KG"}</title>
    {metadata.description && <meta name="description" content={metadata.description} />}
    {metadata.keywords && <meta name="keywords" content={Array.isArray(metadata.keywords) ? metadata.keywords.join(", ") : metadata.keywords} />}
    <meta name="application-name" content="A-FRAME KG" />
    <meta name="theme-color" content="#0b120f" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="A-FRAME KG" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    {metadata.robots && <meta name="robots" content={`${metadata.robots.index === false ? "noindex" : "index"},${metadata.robots.follow === false ? "nofollow" : "follow"}`} />}
    {Object.entries(metadata.openGraph || {}).map(([key, value]) => <meta key={key} property={`og:${key}`} content={value} />)}
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" href="/icon" type="image/png" />
    <link rel="apple-touch-icon" href="/pwa/apple-touch-icon.png" />
    <link rel="preload" href="/fonts/manrope-variable.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
  </>;
}
