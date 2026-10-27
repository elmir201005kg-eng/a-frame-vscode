// Vercel's Node.js Web handler owns the HTTP listener and response streaming.
// Import the compiled RSC entry so its SSR, API and server-action dependencies
// are traced into the function, without starting server/start.mjs.
export const config = { supportsResponseStreaming: true };
export { default } from "../dist/rsc/index.js";
