import { locale as getLocale } from "@/server/context";
import { defaultLocale, isLocale } from "@/app/i18n/config";
import { ResourceUnavailable } from "@/components/resource-unavailable";

export default async function PlatformNotFound() {
  const parameter = await getLocale();
  return <ResourceUnavailable locale={isLocale(parameter) ? parameter : defaultLocale} />;
}
