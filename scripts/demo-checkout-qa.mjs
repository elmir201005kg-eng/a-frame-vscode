import dotenv from "dotenv";
import { Pool } from "pg";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

dotenv.config({ quiet: true });
const schema = `aframe_demo_qa_${randomBytes(6).toString("hex")}`;
const connection = new URL(process.env.E2E_DATABASE_URL || process.env.DATABASE_URL);
if (connection.hostname.endsWith(".neon.tech")) connection.hostname = connection.hostname.replace("-pooler.", ".");
if (["require", "verify-ca", "prefer"].includes(connection.searchParams.get("sslmode"))) connection.searchParams.set("sslmode", "verify-full");
const pool = new Pool({ connectionString: connection.toString(), connectionTimeoutMillis: 10000 });
let created = false;

try {
  const client = await pool.connect();
  try {
    if (!(await client.query("SELECT 1 FROM pg_extension WHERE extname='btree_gist'")).rowCount) throw new Error("The migrated test database needs btree_gist.");
    await client.query("BEGIN");
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET LOCAL search_path TO "${schema}", public`);
    for (const name of readdirSync("prisma/migrations").filter(name => /^\d/.test(name)).sort()) {
      const sql = readFileSync(`prisma/migrations/${name}/migration.sql`, "utf8")
        .replace('CREATE SCHEMA IF NOT EXISTS "public";', "")
        .replace('CREATE EXTENSION IF NOT EXISTS "btree_gist";', "")
        .replace(/^BEGIN;\r?$/gm, "").replace(/^COMMIT;\r?$/gm, "");
      if ((await client.query("SELECT current_schema() AS schema")).rows[0].schema !== schema) throw new Error("Test schema isolation failed.");
      await client.query(sql);
    }
    const salt = randomBytes(16).toString("hex");
    const key = await promisify(scrypt)("Aframe-demo-qa-2026!", salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
    const hash = `scrypt-v1$${salt}$${key.toString("hex")}`;
    const owner = (await client.query("INSERT INTO users(email,first_name,phone,role,updated_at) VALUES('owner@demo-qa.invalid','Demo Owner','+996555123456','OWNER',NOW()) RETURNING id")).rows[0].id;
    const ownerId = (await client.query("INSERT INTO owner_profiles(user_id,business_name,verification_status,updated_at) VALUES($1,'Demo QA Cabins','VERIFIED',NOW()) RETURNING id", [owner])).rows[0].id;
    const region = (await client.query("INSERT INTO regions(name,slug) VALUES('Demo QA Region','demo-qa-region') RETURNING id")).rows[0].id;
    const location = (await client.query("INSERT INTO locations(region_id,address) VALUES($1,'Demo QA Address') RETURNING id", [region])).rows[0].id;
    await client.query("INSERT INTO cabins(owner_id,location_id,title,slug,description,price_per_night,max_guests,status,is_demo,updated_at) VALUES($1,$2,'Demo Checkout Cabin','demo-checkout-cabin','Isolated test cabin for the direct Finik checkout.',5800,4,'PUBLISHED',true,NOW())", [ownerId, location]);
    await client.query("INSERT INTO users(email,first_name,last_name,phone,password_hash,role,updated_at) VALUES('guest@demo-qa.invalid','Demo','Guest','+996555123456',$1,'USER',NOW())", [hash]);
    await client.query("COMMIT");
    created = true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }

  connection.searchParams.set("schema", schema);
  const artifacts = resolve("test-results-demo-checkout", schema);
  mkdirSync(artifacts, { recursive: true });
  const control = resolve(artifacts, "finik-control.json");
  const journal = resolve(artifacts, "finik-requests.jsonl");
  writeFileSync(control, JSON.stringify({ failNext: false }));
  writeFileSync(journal, "");
  const port = process.env.E2E_PORT || "3112";
  const callbackOrigin = "https://callbacks.demo-checkout.invalid";
  const env = {
    ...process.env, E2E_PORT: port, QA_DEMO_CHECKOUT: "true", QA_SCHEMA: schema,
    DATABASE_URL: connection.toString(), E2E_DATABASE_URL: connection.toString(),
    E2E_OUTPUT_DIR: resolve(artifacts, "browser"), QA_FINIK_CONTROL: control, QA_FINIK_JOURNAL: journal,
    DEMO_MODE: "true", APP_URL: callbackOrigin, NEXTAUTH_URL: "", NEXT_PUBLIC_APP_URL: "",
    FINIK_ENV: "beta", FINIK_API_KEY: "demo-qa-api-key", FINIK_ACCOUNT_ID: "demo-qa-account", FINIK_PRIVATE_KEY: "",
    TELEGRAM_BOT_TOKEN: "", TELEGRAMM_KEY: "", TELEGRAM_ADMIN_CHAT_ID: "",
    GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "", GOOGLE_CLIENT_SECRET_ID: "",
  };
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "--config", "playwright.demo-checkout.config.ts"], { env, stdio: "inherit", windowsHide: true });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`Demo checkout QA failed (${code})`)));
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  // Only the randomly named schema created by this invocation can be removed.
  if (created && /^aframe_demo_qa_[a-f0-9]{12}$/.test(schema)) await pool.query(`DROP SCHEMA "${schema}" CASCADE`);
  await pool.end();
}
