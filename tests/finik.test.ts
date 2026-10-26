import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { generateKeyPairSync } from "node:crypto";
import { Signer } from "@mancho.devs/authorizer";
import { createFinikPayment, finikConfiguration, finikRequestUrl, finikWebhookHost, isTimestampValid, parseFinikWebhook, verifyFinikWebhook } from "@/lib/finik";
import { createFinikSigner } from "@/lib/finik-signer";
import { applyFinikWebhook, prepareFinikPayment, startFinikPayment } from "@/lib/finik-payments";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { POST as webhookPost } from "@/app/api/finik/webhook/route";

const paymentId = "11111111-1111-4111-8111-111111111111";
const envNames = ["FINIK_ENV", "FINIK_API_KEY", "FINIK_ACCOUNT_ID", "FINIK_PRIVATE_KEY", "NEXTAUTH_URL", "NEXT_PUBLIC_APP_URL", "APP_URL"];
let savedEnv: Record<string, string | undefined>;
let savedDatabase: Pick<typeof db, "$transaction" | "$queryRaw" | "payment">;
beforeEach(() => {
  savedDatabase = { $transaction: db.$transaction, $queryRaw: db.$queryRaw, payment: db.payment };
  savedEnv = Object.fromEntries(envNames.map((key) => [key, process.env[key]]));
  for (const key of envNames) delete process.env[key];
  Object.assign(process.env, { FINIK_ENV: "beta", FINIK_API_KEY: "test-api-key", FINIK_ACCOUNT_ID: "test-account" });
});
afterEach(() => {
  mock.restoreAll();
  Object.assign(db, savedDatabase);
  for (const key of envNames) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

const paymentData = { paymentId, bookingId: "20", bookingNumber: "AF-TEST", userId: "10", locale: "ru" as const, requestUrl: "https://example.test/ru/bookings/20" };
function webhook() {
  return {
    id: "provider-id", transactionId: "transaction-1", status: "SUCCEEDED", amount: 5,
    transactionDate: Date.now(), clientId: "test-client",
    fields: { paymentId, amount: 5, transactionType: "FINIK_QR" },
    data: { accountId: "test-account", metadata: JSON.stringify({ paymentId, bookingId: "20", userId: "10" }) },
  };
}

test("beta always sends 5 KGS and preserves the documented 302 payment URL", async () => {
  const fetch = mock.method(globalThis, "fetch", async (_url: unknown, init: RequestInit) => {
    assert.equal(_url, "https://beta.api.acquiring.averspay.kg/v1/payment");
    const body = JSON.parse(init.body as string);
    assert.equal(body.Amount, 5);
    assert.equal(body.CardType, "FINIK_QR");
    assert.equal(body.PaymentId, paymentId);
    assert.equal(body.RedirectUrl, "https://example.test/ru/bookings/20?payment=success");
    assert.equal(body.Data.webhookUrl, "https://example.test/api/finik/webhook");
    assert.deepEqual(JSON.parse(body.Data.metadata), { userId: "10", bookingId: "20", paymentId });
    assert.equal(init.redirect, "manual");
    assert.equal((init.headers as Record<string, string>).signature, undefined);
    return new Response(null, { status: 302, headers: { location: "https://pay.example.test/qr" } });
  });
  assert.equal(await createFinikPayment({ ...paymentData, amount: 999 } as typeof paymentData), "https://pay.example.test/qr");
  assert.equal(fetch.mock.callCount(), 1);
});

test("prod sends a signature compatible with the documented authorizer", async () => {
  const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
  process.env.FINIK_ENV = "prod";
  process.env.FINIK_PRIVATE_KEY = keys.privateKey.export({ type: "pkcs8", format: "pem" }).toString().replace(/\n/g, "\\n");
  const logs: string[] = [];
  mock.method(console, "log", (...args: unknown[]) => { logs.push(JSON.stringify(args)); });
  mock.method(globalThis, "fetch", async (_url: unknown, init: RequestInit) => {
    assert.equal(_url, "https://api.acquiring.averspay.kg/v1/payment");
    const headers = init.headers as Record<string, string>;
    const verifier = new Signer({
      httpMethod: "POST", path: "/v1/payment", queryStringParameters: null,
      headers: { Host: "api.acquiring.averspay.kg", "x-api-key": headers["x-api-key"], "x-api-timestamp": headers["x-api-timestamp"] },
      body: JSON.parse(init.body as string),
    });
    assert.ok(await verifier.verify(keys.publicKey.export({ type: "spki", format: "pem" }).toString(), headers.signature));
    return new Response(null, { status: 302, headers: { location: "https://pay.example.test/qr" } });
  });
  await createFinikPayment(paymentData);
  // Only the first log belongs to our adapter; subsequent logs are the test verifier.
  assert.ok(!logs[0].includes("test-api-key"));
});

test("canonical webhook signature verifies and rejects changed amount, timestamp, or host", async () => {
  mock.method(console, "log", () => {});
  const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const privateKey = keys.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const publicKey = keys.publicKey.export({ type: "spki", format: "pem" }).toString();
  const body = webhook();
  const data = { httpMethod: "POST", path: "/api/finik/webhook", queryStringParameters: null,
    headers: { Host: "example.test", "x-api-timestamp": Date.now().toString() }, body };
  const signature = await new Signer(data).sign(privateKey);
  assert.ok(await createFinikSigner(data).verify(publicKey, signature));
  assert.equal(await createFinikSigner({ ...data, body: { ...body, amount: 1 } }).verify(publicKey, signature), false);
  assert.equal(await createFinikSigner({ ...data, body: { ...body, status: "success" } }).verify(publicKey, signature), false);
  assert.equal(await createFinikSigner({ ...data, headers: { ...data.headers, Host: "attacker.test" } }).verify(publicKey, signature), false);
  assert.equal(await createFinikSigner({ ...data, headers: { ...data.headers, "x-api-timestamp": "1" } }).verify(publicKey, signature), false);
  assert.equal(await verifyFinikWebhook(signature, data.headers["x-api-timestamp"], body, { host: "example.test" }), false);
});

test("timestamps reject malformed, expired, and far-future inputs", () => {
  const now = Date.now();
  assert.ok(isTimestampValid(String(now)));
  for (const timestamp of ["", "NaN", `${now}junk`, "1e12", String(now - 300001), String(now + 600000)])
    assert.equal(isTimestampValid(timestamp), false);
});

test("configuration selects canonical URLs and requires production credentials and HTTPS", () => {
  process.env.NEXT_PUBLIC_APP_URL = "https://public.example.test/";
  assert.equal(finikConfiguration(paymentData.requestUrl).appUrl, "https://public.example.test");
  process.env.NEXTAUTH_URL = "https://canonical.example.test";
  assert.equal(finikConfiguration(paymentData.requestUrl).appUrl, "https://canonical.example.test");
  process.env.FINIK_ENV = "prod";
  assert.throws(() => finikConfiguration(paymentData.requestUrl));
  process.env.FINIK_PRIVATE_KEY = "configured";
  process.env.NEXTAUTH_URL = "http://example.test";
  assert.throws(() => finikConfiguration(paymentData.requestUrl));
});

test("public origins work behind a reverse proxy while foreign origins are rejected", () => {
  const request = (origin: string, host = "example.test") => new Request("http://localhost:3001/api/finik/create-payment", { headers: { origin, host } });
  assert.equal(finikRequestUrl(request("https://example.test")), "https://example.test/api/finik/create-payment");
  assert.equal(finikRequestUrl(request("https://attacker.test")), null);
  assert.equal(finikRequestUrl(request("null")), null);
  assert.equal(finikRequestUrl(new Request("https://example.test/api/finik/create-payment")), null);
  process.env.APP_URL = "https://canonical.test";
  assert.equal(finikRequestUrl(request("https://canonical.test", "localhost:3001")), "https://canonical.test/api/finik/create-payment");
  assert.equal(finikRequestUrl(request("https://example.test")), "https://example.test/api/finik/create-payment");
  assert.equal(finikWebhookHost(request("https://canonical.test", "localhost:3001")), "canonical.test");
});

test("local checkout accepts its own origin with separate public Finik callbacks and rejects foreign requests", async () => {
  process.env.APP_URL = "https://callbacks.example.test";
  const request = (origin: string, extra: Record<string, string> = {}) => new Request("http://localhost:3001/api/finik/create-payment", {
    headers: { host: "localhost:3001", origin, ...extra },
  });
  const requestUrl = finikRequestUrl(request("http://localhost:3001", { "sec-fetch-site": "same-origin" }));
  assert.equal(requestUrl, "http://localhost:3001/api/finik/create-payment");
  for (const origin of ["http://localhost:3000", "https://attacker.test", "null", "https://callbacks.example.test/path", "https://user:password@callbacks.example.test", "file://localhost"])
    assert.equal(finikRequestUrl(request(origin)), null);
  assert.equal(finikRequestUrl(request("https://attacker.test", { "x-forwarded-host": "attacker.test" })), null);
  assert.equal(finikRequestUrl(request("http://localhost:3001", { "sec-fetch-site": "cross-site" })), null);
  assert.equal(finikRequestUrl(request("https://callbacks.example.test", { "sec-fetch-site": "cross-site" })), null);

  mock.method(globalThis, "fetch", async (_url: unknown, init: RequestInit) => {
    const body = JSON.parse(init.body as string);
    assert.equal(body.Amount, 5);
    assert.equal(body.RedirectUrl, "https://callbacks.example.test/ru/bookings/20?payment=success");
    assert.equal(body.Data.webhookUrl, "https://callbacks.example.test/api/finik/webhook");
    return new Response(null, { status: 302, headers: { location: "https://pay.example.test/qr" } });
  });
  assert.equal(await createFinikPayment({ ...paymentData, requestUrl: requestUrl! }), "https://pay.example.test/qr");
});

test("provider errors and invalid redirect URLs fail without exposing response bodies", async () => {
  for (const response of [
    new Response("secret-provider-data", { status: 401 }), new Response(null, { status: 302 }),
    new Response(null, { status: 302, headers: { location: "http://pay.example.test/qr" } }),
    new Response(null, { status: 302, headers: { location: "https://user:password@pay.example.test/qr" } }),
    new Response(null, { status: 302, headers: { location: "javascript:alert(1)" } }),
  ]) {
    const fetch = mock.method(globalThis, "fetch", async () => response);
    await assert.rejects(createFinikPayment(paymentData), (error: Error) => !error.message.includes("secret-provider-data"));
    fetch.mock.restore();
  }
});

test("webhook validates amount, account, payment ID, metadata, and documented status casing", () => {
  const body = webhook();
  assert.equal(parseFinikWebhook(body)?.status, "SUCCEEDED");
  assert.equal(parseFinikWebhook({ ...body, status: "failed" })?.status, "FAILED");
  assert.equal(parseFinikWebhook({ ...body, data: { ...body.data, metadata: JSON.parse(body.data.metadata) } })?.bookingId, BigInt(20));
  for (const invalid of [
    { ...body, amount: 500 }, { ...body, status: "pending" }, { ...body, transactionDate: "invalid" },
    { ...body, fields: { ...body.fields, paymentId: "different" } },
    { ...body, data: { ...body.data, accountId: "different" } },
    { ...body, data: { ...body.data, metadata: "invalid" } },
    { ...body, data: { ...body.data, metadata: JSON.stringify({ paymentId, bookingId: "20", userId: "-1" }) } },
  ]) assert.equal(parseFinikWebhook(invalid), null);
});

test("success and succeeded receipts normalize to the same paid event without bypassing payment validation", async () => {
  const body = webhook();
  const expected = parseFinikWebhook(body)!;
  for (const status of ["success", "SUCCESS", "Success", "succeeded", "SUCCEEDED", "Succeeded"]) {
    const receipt = { ...body, status };
    const event = parseFinikWebhook(receipt);
    assert.deepEqual(event, expected);
    assert.equal(parseFinikWebhook({ ...receipt, amount: 500 }), null);
    assert.equal(parseFinikWebhook({ ...receipt, data: { ...body.data, accountId: "another-account" } }), null);
    assert.equal(parseFinikWebhook({ ...receipt, fields: { ...body.fields, paymentId: "another-payment" } }), null);
    assert.equal(parseFinikWebhook({ ...receipt, data: { ...body.data, metadata: "invalid" } }), null);
    const fake = databaseDouble();
    assert.deepEqual(await applyFinikWebhook(event!, fake.client), { duplicate: false });
    assert.equal(fake.payments[0].status, "PAID");
    assert.equal(fake.payments[0].transactionId, body.transactionId);
    assert.deepEqual(await applyFinikWebhook(event!, fake.client), { duplicate: true });
    assert.equal(fake.audits.length, 1);
  }
  for (const status of ["pending", "paid", "successfully", "", null]) {
    assert.equal(parseFinikWebhook({ ...body, status }), null);
  }
});

test("webhook endpoint rejects missing signatures, stale timestamps, malformed JSON, and invalid signatures before DB writes", async () => {
  mock.method(console, "log", () => {});
  mock.method(console, "warn", () => {});
  const requests = [
    { headers: {}, body: JSON.stringify(webhook()), status: 400 },
    { headers: { signature: "invalid", "x-api-timestamp": "1" }, body: JSON.stringify(webhook()), status: 400 },
    { headers: { signature: "invalid", "x-api-timestamp": Date.now().toString() }, body: "invalid", status: 400 },
    { headers: { signature: "invalid", "x-api-timestamp": Date.now().toString() }, body: JSON.stringify(webhook()), status: 401 },
  ];
  for (const sample of requests) {
    const response = await webhookPost(new Request("https://example.test/api/finik/webhook", {
      method: "POST", headers: sample.headers as Record<string, string>, body: sample.body,
    }));
    assert.equal(response.status, sample.status);
  }
});

function databaseDouble(options: { status?: string; demo?: boolean; noPayments?: boolean; paymentStatus?: string; url?: string; providerId?: string | null; method?: string; amount?: number } = {}) {
  const booking = {
    id: BigInt(20), userId: BigInt(10), cabinId: BigInt(30), bookingNumber: options.demo ? "DEMO-TEST" : "AF-TEST", status: options.status || "PENDING",
    cabin: { isDemo: options.demo || false, owner: { userId: BigInt(40) } },
  };
  const initialPayment = { id: BigInt(1), bookingId: booking.id, userId: booking.userId, currency: "KGS", amount: new Prisma.Decimal(options.amount ?? 5),
    paymentMethod: options.method || "FINIK_QR", providerPaymentId: options.providerId === undefined ? paymentId : options.providerId,
    paymentUrl: options.url || null, createdAt: new Date(Date.now() - 60000), status: options.paymentStatus || "PENDING", transactionId: null as string | null, paidAt: null as Date | null };
  const payments = options.noPayments ? [] : [initialPayment];
  const notifications: unknown[] = [], audits: unknown[] = [];
  const tx = {
    siteSetting: { findUnique: async () => null },
    user: { findMany: async () => [] },
    $queryRaw: async () => [],
    booking: {
      findFirst: async ({ where }: { where: { id: bigint; userId: bigint } }) => where.id === booking.id && where.userId === booking.userId ? booking : null,
      findUniqueOrThrow: async () => ({ ...booking, payments }),
    },
    payment: {
      findUnique: async ({ where }: { where: { providerPaymentId: string } }) => payments.some((row) => row.providerPaymentId === where.providerPaymentId) ? { booking } : null,
      findUniqueOrThrow: async ({ where }: { where: { providerPaymentId: string } }) => ({ ...payments.find((row) => row.providerPaymentId === where.providerPaymentId)!, booking }),
      update: async ({ where, data }: { where: { id: bigint }; data: Record<string, unknown> }) => {
        const payment = payments.find((row) => row.id === where.id)!;
        Object.assign(payment, data);
        if (typeof data.amount === "number") payment.amount = new Prisma.Decimal(data.amount);
        return payment;
      },
      create: async ({ data }: { data: Record<string, unknown> }) => {
        const payment = { ...initialPayment, ...data, amount: new Prisma.Decimal(data.amount as number), id: BigInt(payments.length + 1), status: "PENDING", paymentUrl: null, transactionId: null, paidAt: null };
        payments.push(payment);
        return payment;
      },
    },
    notification: { createMany: async ({ data }: { data: unknown[] }) => notifications.push(...data) },
    auditLog: { create: async ({ data }: { data: unknown }) => audits.push(data) },
  };
  const client = { $transaction: async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx) } as unknown as Pick<typeof db, "$transaction">;
  return { booking, payments, notifications, audits, client, tx };
}

test("successful webhooks persist receipt once and delayed failures cannot downgrade it", async () => {
  const fake = databaseDouble();
  const event = parseFinikWebhook(webhook())!;
  assert.deepEqual(await applyFinikWebhook(event, fake.client), { duplicate: false });
  assert.equal(fake.payments[0].status, "PAID");
  assert.equal(fake.payments[0].transactionId, "transaction-1");
  assert.equal(fake.payments[0].paidAt?.getTime(), event.paidAt.getTime());
  assert.deepEqual(await applyFinikWebhook(event, fake.client), { duplicate: true });
  assert.deepEqual(await applyFinikWebhook({ ...event, status: "FAILED" }, fake.client), { duplicate: true });
  assert.equal(fake.notifications.length, 2);
  assert.equal(fake.audits.length, 1);
  await assert.rejects(applyFinikWebhook({ ...event, transactionId: "different" }, fake.client), /invalidPayment/);
});

test("signed receipt must belong to the stored guest and booking", async () => {
  const fake = databaseDouble();
  const event = parseFinikWebhook(webhook())!;
  await assert.rejects(applyFinikWebhook({ ...event, userId: BigInt(99) }, fake.client), /invalidPayment/);
  await assert.rejects(applyFinikWebhook({ ...event, bookingId: BigInt(99) }, fake.client), /invalidPayment/);
  assert.equal(fake.payments[0].status, "PENDING");
  assert.equal(fake.notifications.length, 0);
});

test("late receipt after cancellation is recorded and requests refund reconciliation", async () => {
  const fake = databaseDouble({ status: "CANCELLED", paymentStatus: "FAILED" });
  await applyFinikWebhook(parseFinikWebhook(webhook())!, fake.client);
  assert.equal(fake.payments[0].status, "PAID");
  assert.equal(fake.booking.status, "CANCELLED");
  assert.ok(fake.notifications.every((row) => (row as { type: string }).type === "payment.refundRequired"));
});

test("payment attempts reject other guests, cancelled, and already paid bookings", async () => {
  const fake = databaseDouble();
  await assert.rejects(prepareFinikPayment(BigInt(99), BigInt(20), fake.client), /notFound/);
  for (const options of [{ status: "CANCELLED" }, { status: "REJECTED" }, { paymentStatus: "PAID" }, { paymentStatus: "REFUNDED" }]) {
    const sample = databaseDouble(options);
    await assert.rejects(prepareFinikPayment(BigInt(10), BigInt(20), sample.client), /paymentUnavailable/);
  }
});

test("a fresh demo booking gets one 5 KGS payment, keeps guest authorization, and reuses its checkout", async () => {
  const fake = databaseDouble({ demo: true, noPayments: true });
  await assert.rejects(prepareFinikPayment(BigInt(99), BigInt(20), fake.client), /notFound/);
  assert.equal(fake.payments.length, 0);
  const first = await prepareFinikPayment(BigInt(10), BigInt(20), fake.client);
  assert.equal(first.bookingNumber, "DEMO-TEST");
  assert.ok(first.payment.providerPaymentId);
  assert.ok(first.payment.amount.equals(5));
  assert.equal(first.payment.currency, "KGS");
  assert.equal(first.payment.paymentMethod, "FINIK_QR");
  assert.equal(fake.payments.length, 1);
  await assert.rejects(prepareFinikPayment(BigInt(10), BigInt(20), fake.client), /paymentProcessing/);
  fake.payments[0].paymentUrl = "https://pay.example.test/demo";
  assert.equal((await prepareFinikPayment(BigInt(10), BigInt(20), fake.client)).payment.paymentUrl, "https://pay.example.test/demo");
  assert.equal(fake.payments.length, 1);
});

test("a signed demo receipt persists 5 KGS once and prevents a second charge", async () => {
  mock.method(console, "log", () => {});
  const fake = databaseDouble({ demo: true });
  const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const body = webhook();
  const signed = { httpMethod: "POST", path: "/api/finik/webhook", queryStringParameters: null,
    headers: { Host: "example.test", "x-api-timestamp": Date.now().toString() }, body };
  const signature = await createFinikSigner(signed).sign(keys.privateKey.export({ type: "pkcs8", format: "pem" }).toString());
  assert.ok(await createFinikSigner(signed).verify(keys.publicKey.export({ type: "spki", format: "pem" }).toString(), signature));
  const event = parseFinikWebhook(body)!;
  await assert.rejects(applyFinikWebhook({ ...event, userId: BigInt(99) }, fake.client), /invalidPayment/);
  assert.deepEqual(await applyFinikWebhook(event, fake.client), { duplicate: false });
  assert.equal(fake.payments[0].status, "PAID");
  assert.ok(fake.payments[0].amount.equals(5));
  assert.equal(fake.payments[0].transactionId, "transaction-1");
  assert.equal(fake.booking.status, "PENDING");
  assert.deepEqual(await applyFinikWebhook(event, fake.client), { duplicate: true });
  await assert.rejects(prepareFinikPayment(BigInt(10), BigInt(20), fake.client), /paymentUnavailable/);
  assert.equal(fake.payments.length, 1);
  assert.equal(fake.audits.length, 1);
});

test("shared checkout creates and persists a demo payment URL once", async () => {
  const fake = databaseDouble({ demo: true, noPayments: true });
  const checkoutUrl = `https://qr.finik.kg/11111111-1111-4111-8111-111111111112?type=t&paymentId=${paymentId}&failure_redirect_url=https%3A%2F%2Fexample.test%2Fpayment-failed&status=failed`;
  Object.assign(db, { $transaction: fake.client.$transaction, $queryRaw: async () => [{ attempts: 1 }], payment: fake.tx.payment });
  mock.method(console, "info", () => {});
  const fetch = mock.method(globalThis, "fetch", async (_url: unknown, init: RequestInit) => {
    const body = JSON.parse(init.body as string);
    assert.equal(body.Amount, 5);
    assert.equal(body.Data.description, "Booking DEMO-TEST");
    assert.equal(JSON.parse(body.Data.metadata).bookingId, "20");
    return new Response(null, { status: 302, headers: { location: checkoutUrl } });
  });
  const input = { userId: BigInt(10), bookingId: BigInt(20), locale: "ru" as const, requestUrl: paymentData.requestUrl };
  assert.equal(await startFinikPayment(input), checkoutUrl);
  assert.equal(await startFinikPayment(input), checkoutUrl);
  assert.equal(fake.payments[0].paymentUrl, checkoutUrl);
  assert.equal(fake.payments[0].status, "PENDING");
  assert.equal(fake.payments[0].transactionId, null);
  assert.equal(fake.payments.length, 1);
  assert.equal(fetch.mock.callCount(), 1);
});

test("shared checkout rejects missing configuration before throttling or reserving a payment", async () => {
  delete process.env.FINIK_API_KEY;
  const transaction = mock.fn(async () => { throw new Error("Unexpected database write"); });
  const throttleQuery = mock.fn(async () => { throw new Error("Unexpected throttle write"); });
  Object.assign(db, { $transaction: transaction, $queryRaw: throttleQuery });
  await assert.rejects(startFinikPayment({
    userId: BigInt(10), bookingId: BigInt(20), locale: "ru", requestUrl: paymentData.requestUrl,
  }), /credentials are not configured/);
  assert.equal(transaction.mock.callCount(), 0);
  assert.equal(throttleQuery.mock.callCount(), 0);
});

test("existing placeholder price is replaced with 5, ready links are reused, and in-flight attempts are rejected", async () => {
  const fake = databaseDouble({ providerId: null, method: "AWAITING_CONFIGURATION", amount: 5000 });
  const first = await prepareFinikPayment(BigInt(10), BigInt(20), fake.client);
  assert.ok(first.payment.providerPaymentId);
  assert.ok(fake.payments[0].amount.equals(5));
  await assert.rejects(prepareFinikPayment(BigInt(10), BigInt(20), fake.client), /paymentProcessing/);
  fake.payments[0].paymentUrl = "https://pay.example.test/qr";
  assert.equal((await prepareFinikPayment(BigInt(10), BigInt(20), fake.client)).payment.paymentUrl, "https://pay.example.test/qr");
  assert.equal(fake.payments.length, 1);
});

test("failed payments can be retried with a new persistent UUID", async () => {
  const fake = databaseDouble();
  const event = { ...parseFinikWebhook(webhook())!, status: "FAILED" as const };
  await applyFinikWebhook(event, fake.client);
  assert.equal(fake.payments[0].status, "FAILED");
  assert.deepEqual(await applyFinikWebhook(event, fake.client), { duplicate: true });
  const next = await prepareFinikPayment(BigInt(10), BigInt(20), fake.client);
  assert.notEqual(next.payment.providerPaymentId, paymentId);
  assert.equal(fake.payments.length, 2);
});
