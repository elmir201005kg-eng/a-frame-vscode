import "server-only";

export class NavigationResponse extends Error {
  constructor(public status: number, public location?: string) { super(location ? "Redirect" : "Not found"); }
}
export function redirect(location: string): never {
  if (!location.startsWith("/") || location.startsWith("//") || /[\r\n\\]/.test(location)) throw new Error("Invalid redirect");
  throw new NavigationResponse(303, location);
}
export function notFound(): never { throw new NavigationResponse(404); }
// Payment URLs reach this function only after the provider response is validated.
export function redirectExternal(location: string): never {
  const url = new URL(location);
  if (url.protocol !== "https:" || url.username || url.password || /[\r\n\\]/.test(location)) throw new Error("Invalid redirect");
  throw new NavigationResponse(303, url.href);
}
