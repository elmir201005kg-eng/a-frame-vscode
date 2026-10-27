import "server-only";
import { Prisma } from "@/generated/prisma/client";

const connectionMessages = new Set([
  "Connection terminated due to connection timeout",
  "timeout exceeded when trying to connect",
  "Connection terminated unexpectedly",
]);

export function isDatabaseUnavailable(error: unknown): error is Error & { code?: string } {
  if (error instanceof Prisma.PrismaClientKnownRequestError)
    return ["P1001", "P1002", "P1008", "P1017", "P2024"].includes(error.code);

  if (!(error instanceof Error)) return false;
  const code = "code" in error ? error.code : undefined;
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") return true;

  // Prisma's pg adapter passes pool timeouts through as ordinary Errors without
  // a Prisma code. Match pg's exact connection messages, not arbitrary query errors.
  return connectionMessages.has(error.message);
}
