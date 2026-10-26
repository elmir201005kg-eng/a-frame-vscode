import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig(({ mode }) => {
  // Environment files are loaded into the server only. Vite exposes only VITE_* to browsers.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  const buildDir = process.env.BUILD_DIR || "dist";
  return {
    plugins: [rsc(), react(), tailwindcss()],
    resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
    server: { host: "127.0.0.1", strictPort: true, watch: { ignored: ["**/.next*/**", "**/.npm-cache/**", "**/test-results*/**", "**/performance-results/**", "**/pwa-test-results/**", "**/dist*/**", "**/tests/**", "**/docs/**", "**/scripts/**", "**/*.md"] } },
    build: { outDir: buildDir },
    environments: {
      rsc: { build: { outDir: `${buildDir}/rsc`, rollupOptions: { input: { index: "./server/entry.rsc.tsx" } } } },
      ssr: { build: { outDir: `${buildDir}/ssr`, rollupOptions: { input: { index: "./server/entry.ssr.tsx" } } } },
      client: { build: { outDir: `${buildDir}/client`, rollupOptions: { input: { index: "./client/entry.tsx" } } } },
    },
  };
});
