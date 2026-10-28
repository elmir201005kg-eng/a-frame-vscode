import { defineConfig, devices } from "@playwright/test";

// An explicit, separate database prevents these tests from creating accounts in production.
if (!process.env.E2E_DATABASE_URL) throw new Error("Set E2E_DATABASE_URL to a migrated test PostgreSQL database.");
const port = Number(process.env.E2E_PORT || 3107);
export default defineConfig({
  testDir: "./tests",
  // Offline service-worker checks have their own build and Playwright config.
  testIgnore: ["**/pwa/**", "**/*.test.ts", "**/ai-ui/**", "**/demo-catalog.spec.ts"],
  outputDir: process.env.E2E_OUTPUT_DIR || "test-results",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://localhost:${port}`,
    channel: process.env.E2E_BROWSER_CHANNEL || "chrome",
    trace: process.env.E2E_TRACE === "true" ? "retain-on-failure" : "off",
  },
  webServer: {
    command: process.env.E2E_PRODUCTION === "true" ? `npm run start -- --port ${port}` : `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}/ru/login`,
    reuseExistingServer: false,
    timeout: 120000,
    env: { DATABASE_URL: process.env.E2E_DATABASE_URL, APP_URL: `http://localhost:${port}`, DEMO_MODE: "false", BUILD_DIR: process.env.E2E_PRODUCTION === "true" ? process.env.E2E_PRODUCTION_DIR || "dist" : process.env.E2E_DEV_DIR || "dist" },
  },
});
