import dotenv from "dotenv";
import { Pool } from "pg";
import { randomBytes } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

dotenv.config({ quiet: true });
const databaseUrl = process.env.E2E_DATABASE_URL || process.env.DATABASE_URL;
const schema = `aframe_deploy_qa_${randomBytes(6).toString("hex")}`;
let created = false;
let pool;

function run(env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--test", "tests/deployment.test.mjs"], { env, stdio: "inherit", windowsHide: true });
    child.once("error", reject);
    child.once("exit", code => code === 0 ? resolve() : reject(new Error(`Deployment checks failed (${code}).`)));
  });
}

try {
  const env = { ...process.env, NODE_ENV: "production", DEPLOYMENT_TEST_WITH_DATABASE: "false" };
  if (databaseUrl) {
    const connection = new URL(databaseUrl);
    if (connection.hostname.endsWith(".neon.tech")) connection.hostname = connection.hostname.replace("-pooler.", ".");
    if (["require", "verify-ca", "prefer"].includes(connection.searchParams.get("sslmode"))) connection.searchParams.set("sslmode", "verify-full");
    pool = new Pool({ connectionString: connection.toString(), max: 1, connectionTimeoutMillis: 10000 });
    const client = await pool.connect();
    try {
      if (!(await client.query("SELECT 1 FROM pg_extension WHERE extname='btree_gist'")).rowCount)
        throw new Error("The migrated test database needs btree_gist (see the database QA instructions).");
      await client.query("BEGIN");
      await client.query(`CREATE SCHEMA "${schema}"`);
      await client.query(`SET LOCAL search_path TO "${schema}", public`);
      for (const name of (await readdir("prisma/migrations")).filter(name => /^\d/.test(name)).sort()) {
        const sql = (await readFile(`prisma/migrations/${name}/migration.sql`, "utf8"))
          .replace('CREATE SCHEMA IF NOT EXISTS "public";', "")
          .replace('CREATE EXTENSION IF NOT EXISTS "btree_gist";', "")
          .replace(/^BEGIN;\r?$/gm, "").replace(/^COMMIT;\r?$/gm, "");
        if ((await client.query("SELECT current_schema() AS schema")).rows[0].schema !== schema)
          throw new Error("Deployment test schema isolation failed.");
        await client.query(sql);
      }
      const owner = (await client.query("INSERT INTO users(email,first_name,password_hash,role,updated_at) VALUES('owner@deployment-qa.invalid','Deployment QA',$1,'OWNER',NOW()) RETURNING id", [randomBytes(64).toString("hex")])).rows[0].id;
      const profile = (await client.query("INSERT INTO owner_profiles(user_id,business_name,verification_status,updated_at) VALUES($1,'Deployment QA','VERIFIED',NOW()) RETURNING id", [owner])).rows[0].id;
      const region = (await client.query("INSERT INTO regions(name,slug,name_kg,name_en) VALUES('Иссык-Куль','deployment-qa','Ысык-Көл','Issyk-Kul') RETURNING id")).rows[0].id;
      const location = (await client.query("INSERT INTO locations(region_id,address) VALUES($1,'Deployment QA') RETURNING id", [region])).rows[0].id;
      const cabin = (await client.query("INSERT INTO cabins(owner_id,location_id,title,slug,description,price_per_night,max_guests,status,updated_at) VALUES($1,$2,'Deployment QA Cabin','deployment-qa-cabin','Production routing fixture',1500,4,'PUBLISHED',NOW()) RETURNING id", [profile, location])).rows[0].id;
      await client.query("INSERT INTO cabin_images(cabin_id,image_url,is_main) VALUES($1,'/images/hero.webp',true)", [cabin]);
      await client.query("COMMIT");
      created = true;
      connection.searchParams.set("schema", schema);
      Object.assign(env, {
        DATABASE_URL: connection.toString(), DEPLOYMENT_TEST_WITH_DATABASE: "true", QA_DEPLOYMENT_CABIN_ID: String(cabin),
        DEMO_MODE: "false", APP_URL: "https://deployment.example",
        GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "", GOOGLE_CLIENT_SECRET_ID: "",
        FINIK_API_KEY: "", FINIK_ACCOUNT_ID: "", FINIK_PRIVATE_KEY: "",
        TELEGRAM_BOT_TOKEN: "", TELEGRAMM_KEY: "", TELEGRAM_ADMIN_CHAT_ID: "",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
    console.log("[deployment] Database page checks use a fresh isolated QA schema.");
  } else {
    console.log("[deployment] Set E2E_DATABASE_URL or DATABASE_URL to include database-backed page checks.");
  }
  await run(env);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  try {
    // Only this invocation's freshly created schema is eligible for cleanup.
    if (created && /^aframe_deploy_qa_[a-f0-9]{12}$/.test(schema)) await pool.query(`DROP SCHEMA "${schema}" CASCADE`);
  } finally { await pool?.end(); }
}
