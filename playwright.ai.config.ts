import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.AI_QA_PORT || 3127);
export default defineConfig({
  testDir: "./tests/ai-ui", outputDir: "test-results/ai", fullyParallel: false, workers: 1,
  timeout: 60000, expect: { timeout: 15000 }, reporter: "list",
  use: { ...devices["Desktop Chrome"], channel: process.env.E2E_BROWSER_CHANNEL || "chrome", baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  webServer: {
    command: process.env.AI_QA_PRODUCTION === "true" ? `npm run start -- --port ${port}` : `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}/ru`, reuseExistingServer: false, timeout: 120000,
    env: { BUILD_DIR: "dist", AI_PROVIDER: "faq", AI_TRUST_PROXY: "false", APP_URL: `http://localhost:${port}` },
  },
});
