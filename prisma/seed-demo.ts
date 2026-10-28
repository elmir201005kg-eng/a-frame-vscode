import "dotenv/config";
import { access } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { demoCabins } from "./demo-cabins";
import { seedDemoCabins, SeedConflict } from "./seed-demo-data";
import { previewDemoCabins } from "./demo-preflight";

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => !["--dry-run", "--confirm-eight-demo-cabins"].includes(arg)))
    throw new SeedConflict("Supported options: --dry-run or --confirm-eight-demo-cabins");
  if (!args.includes("--dry-run") && !args.includes("--confirm-eight-demo-cabins"))
    throw new SeedConflict("No changes made. Obtain the owner's confirmation, then use --confirm-eight-demo-cabins to add exactly 8 demo cabins. Preview with --dry-run.");
  if (!process.env.DATABASE_URL) throw new SeedConflict("Set DATABASE_URL to the existing migrated database.");
  const connection = new URL(process.env.DATABASE_URL);
  if (["require", "verify-ca", "prefer"].includes(connection.searchParams.get("sslmode") || "")) connection.searchParams.set("sslmode", "verify-full");
  const schema = connection.searchParams.get("schema") || "public";
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) throw new SeedConflict("Invalid database schema.");
  for (const name of new Set(demoCabins.flatMap(cabin => cabin.photos))) {
    await access(path.join(process.cwd(), "public", "images", name));
  }
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: connection.toString(), connectionTimeoutMillis: 10000 }, { schema }) });
  try {
    const preview = await previewDemoCabins(db, schema);
    if (args.includes("--dry-run")) {
      console.log(JSON.stringify(preview, null, 2));
      if (preview.conflicts.length) process.exitCode = 1;
      return;
    }
    if (preview.migrationRequired)
      throw new SeedConflict("No demo data written. After owner approval, apply the additive showcase migration with npm run db:deploy, then repeat the confirmed seed.");
    if (preview.conflicts.length) throw new SeedConflict(preview.conflicts.join(" "));
    const result = await seedDemoCabins(db);
    console.log(JSON.stringify({ ...result, total: demoCabins.length, demo: true, bookable: false }));
  } finally { await db.$disconnect(); }
}
main().catch(error => {
  console.error(error instanceof SeedConflict ? error.message : "Demo seed failed. Check database settings, migrations and local images. All changes were rolled back.");
  process.exitCode = 1;
});
