import { defineConfig, devices } from "@playwright/test";

// Offline tests only read public pages; they do not need database fixtures.
const port = 3108;
export default defineConfig({
  testDir: "./tests/pwa",
  outputDir: "./pwa-test-results",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 15000 },
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://localhost:${port}`,
    channel: process.env.E2E_BROWSER_CHANNEL || "chrome",
    serviceWorkers: "allow",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run start -- --port ${port}`,
    url: `http://localhost:${port}/ru/offline`,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
