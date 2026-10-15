import type { Locale } from "@/app/i18n/config";

export function LanguageFlag({ locale }: { locale: Locale }) {
  return (
    <svg className="language-flag" data-locale={locale} viewBox="0 0 60 40" width="20" height="14" aria-hidden="true" focusable="false">
      {locale === "kg" ? <>
        <path fill="#e8112d" d="M0 0h60v40H0z" />
        <g stroke="#ffef00" strokeWidth=".85">
          {Array.from({ length: 40 }, (_, index) => (
            <path key={index} d="M30 8v4" transform={`rotate(${index * 9} 30 20)`} />
          ))}
        </g>
        <circle cx="30" cy="20" r="7.5" fill="#ffef00" />
        <circle cx="30" cy="20" r="5.5" fill="#e8112d" />
        <path fill="none" stroke="#ffef00" strokeWidth=".8" d="M26 16q5 2 8 8M25 18q4 2 7 7M28 15q4 2 7 7M34 16q-5 2-8 8M35 18q-4 2-7 7M32 15q-4 2-7 7" />
      </> : locale === "ru" ? <>
        <path fill="#fff" d="M0 0h60v40H0z" />
        <path fill="#0039a6" d="M0 13.333h60v13.334H0z" />
        <path fill="#d52b1e" d="M0 26.667h60V40H0z" />
      </> : <>
        <path fill="#012169" d="M0 0h60v40H0z" />
        <path stroke="#fff" strokeWidth="8" d="m0 0 60 40M60 0 0 40" />
        <path fill="#c8102e" d="m0 0 26 18h6L6 0zM60 0 34 18v4L60 4zM60 40 34 22h-6l26 18zM0 40l26-18v-4L0 36z" />
        <path stroke="#fff" strokeWidth="13" d="M30 0v40M0 20h60" />
        <path stroke="#c8102e" strokeWidth="8" d="M30 0v40M0 20h60" />
      </>}
    </svg>
  );
}
