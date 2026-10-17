import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "../lib/password";
class SetupError extends Error {}

async function main() {
  const address = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "",
    phone = process.env.ADMIN_PHONE || "",
    firstName = process.env.ADMIN_NAME || "Administrator";
  const role = process.env.ADMIN_ROLE || "ADMIN";
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") throw new SetupError("ADMIN_ROLE must be ADMIN or SUPER_ADMIN.");
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ||
    password.length < 10 ||
    password.length > 128 ||
    Buffer.byteLength(password) > 256 ||
    (phone.length > 0 && !/^\+?[\d\s()-]{7,30}$/.test(phone)) ||
    !firstName.length ||
    firstName.length > 100
  )
    throw new SetupError(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (10–128 characters), optionally ADMIN_PHONE and ADMIN_NAME, in the private environment.",
    );
  const connection = new URL(process.env.DATABASE_URL!);
  if (connection.searchParams.get("sslmode") === "require")
    connection.searchParams.set("sslmode", "verify-full");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: connection.toString() }),
  });
  try {
    if (await db.user.findUnique({ where: { email: address } }))
      throw new SetupError(
        "The email already exists. Existing accounts are never overwritten by this command.",
      );
    await db.user.create({
      data: {
        email: address,
        phone,
        firstName,
        passwordHash: await hashPassword(password),
        role,
        isVerified: true,
      },
    });
    console.log(
      "Administrator created. Sign in with the credentials provided in your private environment.",
    );
  } finally {
    await db.$disconnect();
  }
}
main().catch((error) => {
  console.error(
    error instanceof SetupError
      ? error.message
      : "Administrator creation failed. Check the private database configuration.",
  );
  process.exitCode = 1;
});
