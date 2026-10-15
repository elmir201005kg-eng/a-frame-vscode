import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@/generated/prisma/client";

const globalDb = globalThis as unknown as { prisma?: PrismaClient };
const connection = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : null;
if (
  connection &&
  ["require", "verify-ca", "prefer"].includes(connection.searchParams.get("sslmode") || "")
)
  connection.searchParams.set("sslmode", "verify-full");
const schema = connection?.searchParams.get("schema") || "public";
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) throw new Error("Invalid database schema");
export const db =
  globalDb.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(
      {
        connectionString: connection?.toString(),
        max: 8,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        // Bound a stalled SQL query without shortening booking transactions.
        statement_timeout: 15000,
      },
      { schema },
    ),
    log: [],
  });
globalDb.prisma = db;
export function databaseTable(name: "cabins" | "bookings" | "payments" | "locations" | "regions" | "auth_throttles" | "users" | "admin_login_challenges") {
  return Prisma.raw(`"${schema}"."${name}"`);
}
