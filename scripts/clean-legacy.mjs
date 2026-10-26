import { readdir, rm, realpath } from "node:fs/promises";
import path from "node:path";

const root = await realpath(process.cwd());
for (const name of await readdir(root)) {
  if (name !== ".next" && !/^\.next-[a-z0-9-]+$/.test(name)) continue;
  const candidate = path.resolve(root, name);
  const resolved = await realpath(candidate);
  if (path.dirname(resolved) !== root || resolved !== candidate) throw new Error(`Refusing to remove a path outside this project: ${name}`);
  await rm(resolved, { recursive: true, force: true, maxRetries: 2 });
  console.log(`Removed ${name}`);
}
