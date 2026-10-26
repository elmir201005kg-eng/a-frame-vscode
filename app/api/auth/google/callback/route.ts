import { defaultLocale, isLocale, localeCookie } from "@/app/i18n/config";
import { cookies } from "@/server/context";
import { clearGoogleFlow, finishGoogleLogin, googleErrorCode } from "@/lib/google-auth";

export async function GET(request: Request) {
  let target: URL;
  try {
    const result = await finishGoogleLogin(request);
    target = new URL(result.path, result.origin);
  } catch (error) {
    await clearGoogleFlow();
    const saved = (await cookies()).get(localeCookie)?.value;
    const locale = saved && isLocale(saved) ? saved : defaultLocale;
    target = new URL(`/${locale}/login?error=${encodeURIComponent(googleErrorCode(error))}`, request.url);
  }
  const response = new Response(null, { status: 303, headers: { Location: target.href } });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
