// Reuse the existing runner: every account, session and booking lives in a
// randomly named test schema, which the runner removes when it finishes.
process.env.E2E_PORT ||= "3123";
process.env.E2E_PRODUCTION_DIR ||= "dist";
process.env.E2E_DEV_DIR ||= "dist";
process.env.E2E_OUTPUT_DIR ||= "test-results-spacing";
process.env.QA_GREP ||= "spacing audit|search, pagination, cabin|availability cancels|favorite persists, booking";
process.env.QA_FILES ||= "spacing.spec.ts,responsiveness.spec.ts";
await import("./performance-qa.mjs");
