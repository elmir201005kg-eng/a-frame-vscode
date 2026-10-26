// All writes go to the runner's fresh random PostgreSQL schema, never site tables.
process.env.QA_SUITE = "admin";
process.env.E2E_PORT = "3127";
process.env.E2E_PRODUCTION_DIR = "dist";
process.env.E2E_DEV_DIR = "dist";
process.env.E2E_OUTPUT_DIR = "test-results-admin";
await import("./performance-qa.mjs");
