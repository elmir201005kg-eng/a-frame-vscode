// node-jose only calls v4() without arguments to generate a key ID.
exports.v4 = () => globalThis.crypto.randomUUID();
