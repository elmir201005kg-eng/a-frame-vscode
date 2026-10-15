import type { Locale } from "@/app/i18n/config";
import { getNotFoundDictionary } from "@/app/i18n/not-found";
import { Icon } from "@/components/icon";
import Link from "@/components/navigation-link";

// Missing database records are an expected state inside a streamed page.
// Render that state on the server without aborting the enclosing Suspense stream.
export async function ResourceUnavailable({ locale }: { locale: Locale }) {
  const text = await getNotFoundDictionary(locale);
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <section className="not-found-content" aria-labelledby="not-found-title">
        <Icon name="compass" size={42} />
        <p className="not-found-code" aria-hidden="true">
          {text.code}
        </p>
        <p className="eyebrow">{text.eyebrow}</p>
        <h1 id="not-found-title">{text.title}</h1>
        <p className="not-found-description">{text.description}</p>
        <div className="not-found-actions">
          <Link className="button button-primary" href={`/${locale}`}>
            {text.homeAction}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
