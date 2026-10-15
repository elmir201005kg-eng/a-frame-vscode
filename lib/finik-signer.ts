import "server-only";
import { Signer } from "@mancho.devs/authorizer";
import { createSign, createVerify } from "node:crypto";

// The SDK logs the request and signing input, including x-api-key.
// Retain its canonicalization, using Node's RSA operations without these logs.
class QuietSigner extends Signer {
  override async sign(privateKey: string) {
    return createSign("SHA256").update(this.getData()).sign(privateKey, "base64");
  }
  override async verify(publicKey: string, signature: string) {
    return createVerify("SHA256").update(this.getData()).verify(publicKey, signature, "base64");
  }
}

export function createFinikSigner(data: ConstructorParameters<typeof Signer>[0]) {
  const safeData = { ...data, headers: { Host: data.headers.Host }, body: null } as typeof data;
  const instance = new QuietSigner(safeData);
  // The SDK holds this object by reference. Restore secrets after its constructor's log.
  safeData.headers = data.headers;
  safeData.body = data.body;
  return instance;
}
