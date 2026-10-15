// Reuse the existing runner: every account, session and booking lives in a
// randomly named test schema, which the runner removes when it finishes.
process.env.E2E_PORT ||= "3123";
process.env.E2E_PRODUCTION_DIR ||= ".next/spacing-qa/production";
process.env.E2E_DEV_DIR ||= ".next/spacing-qa/dev";
process.env.E2E_OUTPUT_DIR ||= ".next/spacing-qa/test-results";
process.env.QA_GREP ||= "spacing audit|search, pagination, cabin|availability cancels|favorite persists, booking";
await import("./performance-qa.mjs");
