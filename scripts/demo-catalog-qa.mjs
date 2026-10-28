import dotenv from "dotenv";
import { Pool } from "pg";
import { randomBytes } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";

dotenv.config({ quiet: true });
const schema = `aframe_showcase_qa_${randomBytes(6).toString("hex")}`;
const connection = new URL(process.env.E2E_DATABASE_URL || process.env.DATABASE_URL);
if (["require", "verify-ca", "prefer"].includes(connection.searchParams.get("sslmode"))) connection.searchParams.set("sslmode", "verify-full");
const pool = new Pool({ connectionString: connection.toString(), connectionTimeoutMillis: 10000 });
let created = false;
function run(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { env, stdio: "inherit", windowsHide: true });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`Demo catalog QA failed (${code}).`)));
  });
}
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
    await client.query("COMMIT");
    created = true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
  connection.searchParams.set("schema", schema);
  const env = { ...process.env, QA_DEMO_CATALOG: "true", QA_SCHEMA: schema,
    DATABASE_URL: connection.toString(), E2E_DATABASE_URL: connection.toString(),
    DEMO_MODE: "false", E2E_PORT: process.env.E2E_PORT || "3138",
    TELEGRAM_BOT_TOKEN: "", TELEGRAMM_KEY: "", TELEGRAM_ADMIN_CHAT_ID: "",
    FINIK_API_KEY: "", FINIK_ACCOUNT_ID: "", FINIK_PRIVATE_KEY: "",
    GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "", GOOGLE_CLIENT_SECRET_ID: "" };
  await run(["--conditions=react-server", "--import", "tsx", "--test", "tests/demo-seed.test.ts"], env);
  if (!process.argv.includes("--database-only"))
    await run(["node_modules/@playwright/test/cli.js", "test", "--config", "playwright.demo-catalog.config.ts"], env);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  // Only the randomly named schema created by this invocation can be removed.
  if (created && /^aframe_showcase_qa_[a-f0-9]{12}$/.test(schema)) await pool.query(`DROP SCHEMA "${schema}" CASCADE`);
  await pool.end();
}
