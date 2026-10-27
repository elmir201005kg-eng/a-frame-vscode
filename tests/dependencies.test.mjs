import assert from "node:assert/strict";
import { mkdtemp, rm, utimes, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { OAuth2Client } from "google-auth-library";

const require = createRequire(import.meta.url);
const googleRequire = createRequire(require.resolve("google-auth-library"));
const gaxiosRequire = createRequire(googleRequire.resolve("gaxios"));
const fetchRequire = createRequire(gaxiosRequire.resolve("node-fetch"));
const blobPath = fetchRequire.resolve("fetch-blob/from.js");
const blobRequire = createRequire(blobPath);

test("node-jose can generate version 4 key identifiers through CommonJS", () => {
  const joseRequire = createRequire(require.resolve("node-jose"));
  const { v4 } = joseRequire("uuid");
  const first = v4();
  assert.match(first, /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  assert.notEqual(first, v4());
});

test("fetch-blob uses native DOMException when a file changes after opening", async () => {
  assert.equal(blobRequire("node-domexception"), globalThis.DOMException);
  const { blobFrom } = await import(pathToFileURL(blobPath).href);
  const directory = await mkdtemp(path.join(tmpdir(), "a-frame-blob-"));
  try {
    const filename = path.join(directory, "upload.txt");
    await writeFile(filename, "original");
    const blob = await blobFrom(filename);
    assert.equal(await blob.text(), "original");
    const future = new Date(Date.now() + 60_000);
    await utimes(filename, future, future);
    await assert.rejects(blob.text(), error => error instanceof DOMException && error.name === "NotReadableError");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Google OAuth exchanges a PKCE code through its HTTP transport", async () => {
  const redirectUri = "https://example.test/api/auth/callback/google";
  const client = new OAuth2Client({ clientId: "test-client", clientSecret: "test-secret", redirectUri });
  let requests = 0;
  client.transporter.defaults = {
    retry: false,
    fetchImplementation: async (url, options) => {
      requests++;
      assert.equal(new URL(url).origin, "https://oauth2.googleapis.com");
      assert.equal(options.method, "POST");
      const form = new URLSearchParams(options.body);
      assert.equal(form.get("code"), "test-code");
      assert.equal(form.get("code_verifier"), "test-verifier");
      assert.equal(form.get("redirect_uri"), redirectUri);
      assert.equal(form.get("grant_type"), "authorization_code");
      return new Response(JSON.stringify({ access_token: "test-access-token", id_token: "test-id-token", token_type: "Bearer", expires_in: 3600 }), {
        headers: { "content-type": "application/json" },
      });
    },
  };
  const { tokens } = await client.getToken({ code: "test-code", codeVerifier: "test-verifier", redirect_uri: redirectUri });
  assert.equal(requests, 1);
  assert.equal(tokens.access_token, "test-access-token");
  assert.equal(tokens.id_token, "test-id-token");
  assert.ok(tokens.expiry_date > Date.now());
});
