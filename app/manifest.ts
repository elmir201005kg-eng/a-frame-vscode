import type { MetadataRoute } from "next";
import { pwaThemeColor } from "@/lib/pwa";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "A-FRAME KG",
    short_name: "A-FRAME KG",
    description: "Поиск и бронирование A-frame домиков в Кыргызстане",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: pwaThemeColor,
    theme_color: pwaThemeColor,
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
