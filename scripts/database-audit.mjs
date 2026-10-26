import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { cabinCardSelect, cabinInclude } from "../lib/catalog.ts";
import { mkdirSync, writeFileSync } from "node:fs";

// Run with: node --conditions=react-server --import tsx scripts/database-audit.mjs
// This probe performs SELECTs only and never writes data or logs credentials/parameters.
dotenv.config({ quiet: true });
const connection = new URL(process.env.E2E_DATABASE_URL || process.env.DATABASE_URL);
if (["require", "verify-ca", "prefer"].includes(connection.searchParams.get("sslmode"))) connection.searchParams.set("sslmode", "verify-full");
const schema = connection.searchParams.get("schema") || "public";
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) throw new Error("Invalid database schema");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: connection.toString(), max: 8, connectionTimeoutMillis: 10000 }, { schema }), log: [{ emit: "event", level: "query" }] });
const queries = [];
db.$on("query", event => queries.push({ ms: event.duration, table: event.query.match(/FROM\s+"[^"]+"\."([^"]+)"/)?.[1] }));
const results = [];
try {
  const cabin = await db.cabin.findFirst({ where: { status: "PUBLISHED" }, select: { id: true } });
  if (!cabin) throw new Error("No published cabin to measure.");
  for (const [name, shape] of [["summary", { select: cabinCardSelect }], ["details", { include: cabinInclude }]]) {
    let reference;
    for (const relationLoadStrategy of ["query", "join"]) {
      for (let attempt = 1; attempt <= 3; attempt++) {
        queries.length = 0;
        const start = performance.now();
        const value = await db.cabin.findUnique({ where: { id: cabin.id }, relationLoadStrategy, ...shape });
        const serialized = JSON.stringify(value, (_, entry) => typeof entry === "bigint" ? entry.toString() : entry);
        if (reference && reference !== serialized) throw new Error(`Read results differ for ${name}`);
        reference = serialized;
        results.push({ name, relationLoadStrategy, attempt, ms: Math.round(performance.now() - start), queries: [...queries] });
      }
    }
  }
  mkdirSync("performance-results", { recursive: true });
  writeFileSync("performance-results/database.json", JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({ queries, ...result }) => ({ ...result, queryCount: queries.length })), null, 2));
} finally {
  await db.$disconnect();
}
