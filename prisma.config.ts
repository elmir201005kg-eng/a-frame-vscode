import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Schema checks and client generation do not need a database connection.
    // Commands that connect to PostgreSQL require DATABASE_URL in .env.
    url: process.env.DATABASE_URL ?? "",
  },
});
