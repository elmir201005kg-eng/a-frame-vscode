import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { requestAbort } from "../client/request-abort";

const compat = ts.transpileModule(
  await readFile(new URL("../client/browser-compat.ts", import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } },
).outputText;

test("Safari fallbacks sort a copy and count live query entries, including duplicate keys", () => {
  const size = Object.getOwnPropertyDescriptor(URLSearchParams.prototype, "size")!;
  const context = vm.createContext({ URLSearchParams });
  try {
    Reflect.deleteProperty(URLSearchParams.prototype, "size");
    vm.runInContext("delete Array.prototype.toSorted", context);
    vm.runInContext(compat, context);
    assert.equal(vm.runInContext(`
      const original = [3, 1, 2];
      JSON.stringify([original.toSorted((a, b) => a - b), original, Array(2).toSorted()]);
    `, context), "[[1,2,3],[3,1,2],[null,null]]");
    const params = new URLSearchParams("region=lake&amenity=wifi&amenity=sauna");
    assert.equal(params.size, 3);
    params.append("guests", "2");
    assert.equal(params.size, 4);
    params.delete("amenity");
    assert.equal(params.size, 2);
    assert.equal(new URLSearchParams().size, 0);
    assert.equal(Object.getOwnPropertyDescriptor(URLSearchParams.prototype, "size")?.enumerable, false);
  } finally {
    Object.defineProperty(URLSearchParams.prototype, "size", size);
  }
});

test("modern browsers keep their native implementations", () => {
  const context = vm.createContext({ URLSearchParams });
  vm.runInContext("const nativeSort = Array.prototype.toSorted", context);
  const size = Object.getOwnPropertyDescriptor(URLSearchParams.prototype, "size")?.get;
  vm.runInContext(compat, context);
  assert.equal(vm.runInContext("Array.prototype.toSorted === nativeSort", context), true);
  assert.equal(Object.getOwnPropertyDescriptor(URLSearchParams.prototype, "size")?.get, size);
});

test("requests time out without AbortSignal.timeout or AbortSignal.any", async () => {
  const timeout = Object.getOwnPropertyDescriptor(AbortSignal, "timeout")!;
  const any = Object.getOwnPropertyDescriptor(AbortSignal, "any")!;
  try {
    Reflect.deleteProperty(AbortSignal, "timeout");
    Reflect.deleteProperty(AbortSignal, "any");
    const request = requestAbort(10);
    try {
      assert.equal(request.signal.aborted, false);
      await new Promise<void>(resolve => request.signal.addEventListener("abort", () => resolve(), { once: true }));
      assert.equal(request.signal.aborted, true);
    } finally { request.dispose(); }
  } finally {
    Object.defineProperty(AbortSignal, "timeout", timeout);
    Object.defineProperty(AbortSignal, "any", any);
  }
});

test("cancelling a parent aborts its request, including an already cancelled parent", () => {
  const parent = new AbortController();
  const request = requestAbort(1000, parent.signal);
  try {
    parent.abort();
    assert.equal(request.signal.aborted, true);
    const cancelled = requestAbort(1000, parent.signal);
    assert.equal(cancelled.signal.aborted, true);
    cancelled.dispose();
  } finally { request.dispose(); }
});

test("disposing a completed request removes its timer and parent listener", async () => {
  const parent = new AbortController();
  const request = requestAbort(10, parent.signal);
  request.dispose();
  request.dispose();
  parent.abort();
  await new Promise(resolve => setTimeout(resolve, 25));
  assert.equal(request.signal.aborted, false);
});

const buildDir = process.env.BROWSER_COMPAT_BUILD_DIR;
test("production client chunks contain no class static blocks unsupported by Safari 15", { skip: !buildDir }, async () => {
  const directory = path.join(buildDir!, "client/assets");
  const files = (await readdir(directory)).filter(file => file.endsWith(".js"));
  assert.ok(files.length > 0, "Build the production client before checking compatibility");
  const incompatible: string[] = [];
  for (const file of files) {
    const source = ts.createSourceFile(file, await readFile(path.join(directory, file), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    function visit(node: ts.Node) {
      if (ts.isClassStaticBlockDeclaration(node)) incompatible.push(file);
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  assert.deepEqual(incompatible, [], "Static blocks prevent Safari 15 from parsing the module and hydrating the page");
});
