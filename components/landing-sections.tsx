import Image from "@/components/image";
import Link from "@/components/navigation-link";
import { Icon } from "@/components/icon";
import type { Locale } from "@/app/i18n/config";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { destinations } from "@/lib/landing-data";

export type DestinationGridProps = {
  locale: Locale;
  dictionary: LandingDictionary;
  offline?: boolean;
  headingLevel?: 2 | 3;
};

export function DestinationGrid({ locale, dictionary, offline = false, headingLevel = 3 }: DestinationGridProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className="destination-grid">
      {destinations.map((destination) => {
        const content = dictionary.destinations[destination.id];
        return (
          <Link
            className="destination-card"
            href={`/${locale}/catalog?region=${destination.id}`}
            key={destination.id}
          >
            <Image
              unoptimized={offline}
              src={destination.image}
              alt={content.imageAlt}
              fill
              sizes="(max-width:374px) 92vw, (max-width:767px) 44vw, (max-width:1392px) 30vw, 410px"
            />
            <span className="destination-overlay" />
            <span className="destination-content">
              <Heading>{content.title}</Heading>
              <p>{content.subtitle}</p>
            </span>
            <span className="destination-arrow">
              <Icon name="arrow-up-right" size={19} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export type BookingStepsProps = {
  how: LandingDictionary["how"];
  headingLevel?: 2 | 3;
};

const stepIcons = ["compass", "calendar", "leaf"] as const;

export function BookingSteps({ how, headingLevel = 3 }: BookingStepsProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <div className="steps-grid">
      {how.steps.map((step, index) => (
        <article className="step" key={step.title}>
          <div className="step-top">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <Icon name={stepIcons[index]} size={30} />
          </div>
          <Heading>{step.title}</Heading>
          <p>{step.text}</p>
        </article>
      ))}
    </div>
  );
}
