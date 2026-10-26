import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

if (process.env.QA_DEMO_CHECKOUT !== "true" || !process.env.E2E_DATABASE_URL ||
    !/^aframe_demo_qa_[a-f0-9]{12}$/.test(process.env.QA_SCHEMA || "")) {
  throw new Error("Run node scripts/demo-checkout-qa.mjs to create an isolated demo database.");
}
const port = Number(process.env.E2E_PORT || 3112);
const baseURL = `http://localhost:${port}`;
const callbackOrigin = "https://callbacks.demo-checkout.invalid";
const preload = pathToFileURL(resolve("scripts/demo-checkout-finik-mock.mjs")).href;

export default defineConfig({
  testDir: "./tests",
  testMatch: "demo-checkout.spec.ts",
  outputDir: process.env.E2E_OUTPUT_DIR || "test-results-demo-checkout",
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  expect: { timeout: 15000 },
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    channel: process.env.E2E_BROWSER_CHANNEL || "chrome",
    baseURL,
    trace: "off",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `node node_modules/vite/bin/vite.js --configLoader runner --port ${port}`,
    url: `${baseURL}/ru/login`,
    reuseExistingServer: false,
    timeout: 240000,
    stdout: "pipe",
    env: {
      DATABASE_URL: process.env.E2E_DATABASE_URL,
      DEMO_MODE: "true",
      APP_URL: callbackOrigin,
      NEXTAUTH_URL: "",
      NEXT_PUBLIC_APP_URL: "",
      BUILD_DIR: "dist",
      NODE_OPTIONS: `--import=${preload}`,
    },
  },
});
