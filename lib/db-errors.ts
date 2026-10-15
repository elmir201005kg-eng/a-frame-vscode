import "server-only";
import { Prisma } from "@/generated/prisma/client";

export function isDatabaseUnavailable(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P1001", "P1002", "P1017", "P2024"].includes(error.code);
}
