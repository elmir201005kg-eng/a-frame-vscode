import assert from "node:assert/strict";
import { test } from "node:test";
import { cookies, withRequest } from "@/server/context";
import { cachedPublic, updateTag } from "@/server/cache";
import { redirect, redirectExternal } from "@/server/navigation";
import { readLimitedBody, PayloadTooLarge } from "@/server/body";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import { Prisma } from "@/generated/prisma/client";

test("database availability recognizes pg pool timeouts and Prisma connection errors", () => {
  const timeout = new Error("Connection terminated due to connection timeout", {
    cause: new Error("Connection terminated unexpectedly"),
  });
  Object.assign(timeout, { clientVersion: "7.10.0" });
  assert.equal(isDatabaseUnavailable(timeout), true);
  assert.equal(isDatabaseUnavailable(new Error("timeout exceeded when trying to connect")), true);
  assert.equal(isDatabaseUnavailable(timeout.cause), true);
  for (const code of ["ENOTFOUND", "EAI_AGAIN"])
    assert.equal(isDatabaseUnavailable(Object.assign(new Error(`getaddrinfo ${code} db.invalid`), { code, syscall: "getaddrinfo" })), true);
  for (const code of ["P1001", "P1002", "P1008", "P1017", "P2024"])
    assert.equal(isDatabaseUnavailable(new Prisma.PrismaClientKnownRequestError("Connection unavailable", { code, clientVersion: "7.10.0" })), true);
});

test("database availability leaves schema, validation and programming errors visible", () => {
  for (const code of ["P1000", "P1011", "P2002", "P2021", "P2022"])
    assert.equal(isDatabaseUnavailable(new Prisma.PrismaClientKnownRequestError("Connection terminated unexpectedly", { code, clientVersion: "7.10.0" })), false);
  assert.equal(isDatabaseUnavailable(new Prisma.PrismaClientValidationError("Invalid query", { clientVersion: "7.10.0" })), false);
  assert.equal(isDatabaseUnavailable(new TypeError("Cannot read properties of undefined")), false);
  assert.equal(isDatabaseUnavailable(new Error("Query failed: connection timeout")), false);
  assert.equal(isDatabaseUnavailable({ code: "P1001", message: "Connection unavailable" }), false);
  assert.equal(isDatabaseUnavailable(Object.assign(new Error("query failed"), { code: "42P01" })), false);
  assert.equal(isDatabaseUnavailable({ code: "ENOTFOUND", message: "getaddrinfo ENOTFOUND db.invalid" }), false);
  assert.equal(isDatabaseUnavailable(null), false);
});

test("concurrent requests keep session cookies isolated and preserve multiple Set-Cookie headers", async () => {
  let release!: () => void;
  const barrier = new Promise<void>(resolve => { release = resolve; });
  const first = withRequest(new Request("http://localhost", { headers: { cookie: "session=first" } }), async context => {
    await barrier;
    const store = await cookies();
    assert.equal(store.get("session")?.value, "first");
    store.set("session", "rotated", { httpOnly: true, sameSite: "lax", expires: new Date("2030-01-01") });
    store.set("locale", "ru", { maxAge: 300 });
    assert.equal(context.responseHeaders.getSetCookie().length, 2);
    assert.match(context.responseHeaders.getSetCookie()[0], /HttpOnly; SameSite=lax; Expires=/);
  });
  await withRequest(new Request("http://localhost", { headers: { cookie: "session=second" } }), async context => {
    assert.equal((await cookies()).get("session")?.value, "second");
    (await cookies()).delete("session");
    assert.equal((await cookies()).get("session"), undefined);
    assert.match(context.responseHeaders.getSetCookie()[0], /Max-Age=0/);
    release();
  });
  await first;
});
test("public cache coalesces requests, invalidates tags and retries failed reads", async () => {
  let reads = 0;
  const load = () => Promise.resolve(++reads);
  assert.deepEqual(await Promise.all([cachedPublic("qa-public", ["qa"], load), cachedPublic("qa-public", ["qa"], load)]), [1, 1]);
  updateTag("qa");
  assert.equal(await cachedPublic("qa-public", ["qa"], load), 2);
  await assert.rejects(cachedPublic("qa-failure", [], async () => { throw new Error("offline"); }));
  assert.equal(await cachedPublic("qa-failure", [], async () => 3), 3);
});
test("redirects reject external origins, backslashes and header injection", () => {
  for (const target of ["https://evil.invalid", "//evil.invalid", "/\\evil.invalid", "/\r\nX-Test: 1"]) assert.throws(() => redirect(target), /Invalid redirect/);
  assert.throws(() => redirect("/ru/account"), error => typeof error === "object" && error !== null && "location" in error && error.location === "/ru/account");
  assert.throws(() => redirectExternal("http://checkout.invalid"), /Invalid redirect/);
  assert.throws(() => redirectExternal("https://user:pass@checkout.invalid"), /Invalid redirect/);
  assert.throws(() => redirectExternal("https://checkout.invalid/payment/123"), error => typeof error === "object" && error !== null && "location" in error && error.location === "https://checkout.invalid/payment/123");
});
test("body limits reject oversized streams even without Content-Length", async () => {
  const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(6)); controller.enqueue(new Uint8Array(6)); controller.close(); } });
  const request = new Request("http://localhost", { method: "POST", body, duplex: "half" } as RequestInit);
  await assert.rejects(readLimitedBody(request, 10), PayloadTooLarge);
  assert.equal(new TextDecoder().decode(await readLimitedBody(new Request("http://localhost", { method: "POST", body: "hello" }), 10)), "hello");
});
