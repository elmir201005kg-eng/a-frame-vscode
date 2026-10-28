import { defineConfig, devices } from "@playwright/test";

if (process.env.QA_DEMO_CATALOG !== "true" || !/^aframe_showcase_qa_[a-f0-9]{12}$/.test(process.env.QA_SCHEMA || ""))
  throw new Error("Run npm run test:demo-catalog for an isolated database.");
const port = Number(process.env.E2E_PORT || 3138);
export default defineConfig({
  testDir: "./tests", testMatch: "demo-catalog.spec.ts", outputDir: "test-results-demo-catalog",
  workers: 1, fullyParallel: false, timeout: 90000, expect: { timeout: 15000 }, reporter: "list",
  use: { ...devices["Desktop Chrome"], channel: process.env.E2E_BROWSER_CHANNEL || "chrome", baseURL: `http://localhost:${port}`, screenshot: "only-on-failure" },
  webServer: {
    command: process.env.E2E_PRODUCTION === "true" ? `npm run start -- --port ${port}` : `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}/ru/catalog`, reuseExistingServer: false, timeout: 180000,
    env: { DATABASE_URL: process.env.E2E_DATABASE_URL!, DEMO_MODE: "false", BUILD_DIR: process.env.E2E_PRODUCTION_DIR || "dist-demo-catalog-qa" },
  },
});
