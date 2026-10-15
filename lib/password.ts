import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const parameters = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
function derive(value: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(value, salt, 64, parameters, (error, key) => (error ? reject(error) : resolve(key))),
  );
}
export async function hashPassword(value: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt-v1$${salt}$${(await derive(value, salt)).toString("hex")}`;
}
export async function verifyPassword(value: string, hash: string | null) {
  if (!hash) return false;
  const [version, salt, expected] = hash.split("$");
  if (
    version !== "scrypt-v1" ||
    !/^[a-f0-9]{32}$/.test(salt ?? "") ||
    !/^[a-f0-9]{128}$/.test(expected ?? "")
  )
    return false;
  return timingSafeEqual(await derive(value, salt), Buffer.from(expected, "hex"));
}
