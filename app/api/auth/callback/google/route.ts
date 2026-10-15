import { GET as handleGoogleCallback } from "@/app/api/auth/google/callback/route";

export async function GET(request: Request) {
  return handleGoogleCallback(request);
}
