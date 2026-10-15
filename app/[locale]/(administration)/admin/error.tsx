"use client";
import { usePathname } from "next/navigation";
import { AlertCircle } from "lucide-react";
import ru from "@/app/i18n/locales/ru/admin.json";
import kg from "@/app/i18n/locales/kg/admin.json";
import en from "@/app/i18n/locales/en/admin.json";
export default function AdminError({ reset }: { reset: () => void }) {
  const locale = usePathname().split("/")[1];
  const text = (locale === "kg" ? kg : locale === "en" ? en : ru).dashboard;
  return <section className="admin-panel admin-error" role="alert"><AlertCircle size={32} /><h1>{text.error}</h1><p>{text.errorDescription}</p><button className="admin-button admin-button-primary" onClick={reset}>{text.retry}</button></section>;
}
