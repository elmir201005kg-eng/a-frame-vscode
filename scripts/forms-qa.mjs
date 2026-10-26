// Keep form verification independent of other builds and browser test sessions.
process.env.QA_SUITE = "forms";
process.env.E2E_PORT = "3119";
process.env.E2E_PRODUCTION_DIR = "dist";
process.env.E2E_DEV_DIR = "dist";
process.env.E2E_OUTPUT_DIR = "test-results-forms";
await import("./performance-qa.mjs");
