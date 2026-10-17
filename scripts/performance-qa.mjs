import dotenv from "dotenv";
import { Pool } from "pg";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { readdirSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

dotenv.config({ quiet: true });
const port = Number(process.env.E2E_PORT || 3107);
const productionDir = process.env.E2E_PRODUCTION_DIR || ".next-e2e-production";
// A new schema keeps every write, account and booking separate from site data.
const schema = `aframe_qa_${randomBytes(6).toString("hex")}`;
const connection = new URL(process.env.E2E_DATABASE_URL || process.env.DATABASE_URL);
if (connection.hostname.endsWith(".neon.tech")) connection.hostname = connection.hostname.replace("-pooler.", ".");
if (["require", "verify-ca", "prefer"].includes(connection.searchParams.get("sslmode"))) connection.searchParams.set("sslmode", "verify-full");
const pool = new Pool({ connectionString: connection.toString(), connectionTimeoutMillis: 10000 });
let created = false;

function run(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { env, stdio: "inherit", windowsHide: true });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`QA command failed (${code})`)));
  });
}

async function fixtures() {
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
    const key = await promisify(scrypt)("Aframe-qa-2026!", salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
    const hash = `scrypt-v1$${salt}$${key.toString("hex")}`;
    const owner = (await client.query("INSERT INTO users(email,first_name,phone,password_hash,role,updated_at) VALUES('owner@qa.invalid','QA Owner','+996555123456',$1,'OWNER',NOW()) RETURNING id", [hash])).rows[0].id;
    const admin = (await client.query("INSERT INTO users(email,first_name,phone,password_hash,role,updated_at) VALUES('admin@qa.invalid','QA Admin','+996555123456',$1,'ADMIN',NOW()) RETURNING id", [hash])).rows[0].id;
    const ownerId = (await client.query("INSERT INTO owner_profiles(user_id,business_name,verification_status,updated_at) VALUES($1,'QA Cabins','VERIFIED',NOW()) RETURNING id", [owner])).rows[0].id;
    const region = (await client.query("INSERT INTO regions(name,slug,name_kg,name_en) VALUES('Иссык-Куль','issyk-kul','Ысык-Көл','Issyk-Kul') RETURNING id")).rows[0].id;
    const location = (await client.query("INSERT INTO locations(region_id,address) VALUES($1,'QA Address') RETURNING id", [region])).rows[0].id;
    const amenity = (await client.query("INSERT INTO amenities(name,slug,name_kg,name_en) VALUES('Wi-Fi','wifi','Wi-Fi','Wi-Fi') RETURNING id")).rows[0].id;
    for (let i = 1; i <= 8; i++) {
      const cabin = (await client.query("INSERT INTO cabins(owner_id,location_id,title,slug,description,title_en,title_kg,price_per_night,max_guests,status,updated_at) VALUES($1,$2,$3,$4,'QA cabin description',$3,$3,$5,4,'PUBLISHED',NOW()) RETURNING id", [ownerId, location, `QA Cabin ${i}`, `qa-cabin-${i}`, 1000 + i * 100])).rows[0].id;
      await client.query("INSERT INTO cabin_images(cabin_id,image_url,is_main) VALUES($1,'/images/hero.webp',true)", [cabin]);
      await client.query("INSERT INTO cabin_amenities(cabin_id,amenity_id) VALUES($1,$2)", [cabin, amenity]);
    }
    await client.query("COMMIT");
    created = true;
    return { owner, admin };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}

try {
  const ids = await fixtures();
  connection.searchParams.set("schema", schema);
  const env = { ...process.env, DATABASE_URL: connection.toString(), E2E_DATABASE_URL: connection.toString(),
    QA_SCHEMA: schema, QA_ADMIN_ID: ids.admin, QA_OWNER_ID: ids.owner, DEMO_MODE: "false", APP_URL: `http://localhost:${port}`,
    TELEGRAM_BOT_TOKEN: "", TELEGRAMM_KEY: "", TELEGRAM_ADMIN_CHAT_ID: "", ADMIN_OTP_SECRET: randomBytes(32).toString("hex"),
    GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "", GOOGLE_CLIENT_SECRET_ID: "",
    FINIK_API_KEY: "", FINIK_ACCOUNT_ID: "", FINIK_PRIVATE_KEY: "", FINIK_ENV: "beta",
    UPLOAD_DIR: resolve("test-results-admin", schema, "uploads") };
  const production = process.env.QA_MODE !== "development";
  if (production && process.env.QA_REUSE_BUILD !== "true")
    await run(["node_modules/next/dist/bin/next", "build"], { ...env, NEXT_DIST_DIR: productionDir });
  const files = process.env.QA_SUITE === "forms" ? ["tests/auth.spec.ts", "tests/responsiveness.spec.ts", "tests/premium-forms.spec.ts"]
    : process.env.QA_SUITE === "admin" ? ["tests/admin-period.spec.ts", "tests/admin.spec.ts", "tests/admin-workspace.spec.ts"] : [];
  const filter = process.env.QA_GREP ? ["--grep", process.env.QA_GREP] : ["--grep-invert", "Google OAuth"];
  await run(["node_modules/@playwright/test/cli.js", "test", ...files, ...filter], { ...env, E2E_PRODUCTION: String(production) });
  if (process.env.QA_SUITE !== "admin" && !process.env.QA_GREP)
    await run(["node_modules/@playwright/test/cli.js", "test", "tests/auth.spec.ts", "--grep", "Google OAuth"], {
      ...env, E2E_PRODUCTION: "false", GOOGLE_CLIENT_ID: "qa-client.apps.googleusercontent.com", GOOGLE_CLIENT_SECRET: "qa-protocol-only",
    });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  // Only this invocation's randomly generated schema is eligible for cleanup.
  if (created && /^aframe_qa_[a-f0-9]{12}$/.test(schema)) await pool.query(`DROP SCHEMA "${schema}" CASCADE`);
  await pool.end();
}
