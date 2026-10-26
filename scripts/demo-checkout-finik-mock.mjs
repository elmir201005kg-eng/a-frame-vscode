import { appendFile, readFile, writeFile } from "node:fs/promises";

// Loaded only in the isolated QA server, never in application code.
if (process.env.QA_DEMO_CHECKOUT !== "true" ||
    !/^aframe_demo_qa_[a-f0-9]{12}$/.test(process.env.QA_SCHEMA || "") ||
    process.env.FINIK_ENV !== "beta" || process.env.FINIK_API_KEY !== "demo-qa-api-key" ||
    process.env.FINIK_ACCOUNT_ID !== "demo-qa-account") {
  throw new Error("The demo checkout mock requires isolated QA settings and dummy beta credentials.");
}

const originalFetch = globalThis.fetch;
globalThis.fetch = async function mockFinikFetch(input, init) {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  if (url.hostname.endsWith("acquiring.averspay.kg")) {
    if (url.href !== "https://beta.api.acquiring.averspay.kg/v1/payment" || init?.method !== "POST") {
      throw new Error("Unexpected Finik request in the demo checkout test.");
    }
    const body = JSON.parse(String(init.body));
    const state = JSON.parse(await readFile(process.env.QA_FINIK_CONTROL, "utf8"));
    await appendFile(process.env.QA_FINIK_JOURNAL, `${JSON.stringify(body)}\n`);
    if (state.failNext) {
      await writeFile(process.env.QA_FINIK_CONTROL, JSON.stringify({ failNext: false }));
      return new Response("Simulated provider outage", { status: 503 });
    }
    return new Response(null, {
      status: 302,
      headers: { location: `https://checkout.finik.invalid/payment/${body.PaymentId}?amount=${body.Amount}&currency=KGS` },
    });
  }
  return originalFetch(input, init);
};
