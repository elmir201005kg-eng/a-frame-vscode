import { Suspense, ViewTransition } from "react";
import Image from "next/image";
import Link from "@/components/navigation-link";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Icon } from "@/components/icon";
import { LandingExplorer } from "@/components/landing-explorer";
import { PlatformHeader } from "@/components/platform-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OfflineNotice } from "@/components/offline-notice";
import { getLandingDictionary, type LandingDictionary } from "@/app/i18n/dictionaries";
import { translated } from "@/app/i18n/platform";
import type { Locale } from "@/app/i18n/config";
import { pwaText } from "@/lib/pwa";

const stepIcons = ["compass", "calendar", "leaf"] as const;
const heroImage = "/images/hero.webp";
const benefitIcons = ["compass", "shield", "calendar", "heart"] as const;

export async function HomeContent({ locale, offline = false }: { locale: Locale; offline?: boolean }) {
  const dictionary = offline ? await getLandingDictionary(locale) : await translated<LandingDictionary>(locale, "landing");
  const { accessibility, hero, story, benefits, how, owners, faq } = dictionary;

  return (
    <div id="top" data-offline-page={offline || undefined}>
      <a className="skip-link" href="#main-content">{accessibility.skipToContent}</a>
      <Suspense fallback={<LoadingSkeleton variant="header" />}>{offline ? <SiteHeader locale={locale} dictionary={dictionary} logoutError={pwaText[locale].catalog} /> : <PlatformHeader locale={locale} />}</Suspense>
      {offline && <OfflineNotice locale={locale} />}
      <main id="main-content">
        <ViewTransition default="route-fade">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <Image
            unoptimized={offline}
            className="hero-image"
            src={heroImage}
            alt={hero.imageAlt}
            fill
            quality={60}
            sizes="(max-width: 1392px) 96vw, 1320px"
            preload
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="hero-eyebrow"><span /> {hero.regionLabel}</p>
            <h1 id="hero-title">{hero.titleLine1}<br /><span>{hero.titleLine2}</span></h1>
            <p className="hero-description">{hero.description}</p>
            <div className="hero-actions">
              <Link className="hero-explore" href={`/${locale}/catalog`}>{hero.action} <span><Icon name="arrow-up-right" size={21} /></span></Link>
              <a className="hero-secondary" href="#destinations">{hero.secondaryAction}<Icon name="arrow-right" size={18} /></a>
            </div>
          </div>
          <div className="hero-location"><Icon name="pin" size={16} /><span>{hero.location}</span></div>
          <div className="hero-season"><Icon name="sun" size={18} /><span>{hero.season}</span></div>
          <span className="hero-image-note">{hero.imageNote}</span>
        </section>

        <Suspense fallback={<div className="section-shell"><LoadingSkeleton variant="catalog" /></div>}>
          <LandingExplorer locale={locale} dictionary={dictionary} offline={offline} />
        </Suspense>

        <section className="story-section section-shell" id="about" aria-labelledby="story-title">
          <div className="story-photo">
            <Image unoptimized={offline} src="/images/story.webp" alt={story.imageAlt} fill sizes="(max-width: 767px) 92vw, 48vw" />
            <div className="story-caption"><Icon name="tree" size={21} /><span>{story.captionLine1}<br /><strong>{story.captionLine2}</strong></span></div>
            <div className="story-photo-label">{story.photoLabel}</div>
            <span className="story-image-note">{story.imageNote}</span>
          </div>
          <div className="story-content">
            <p className="eyebrow">{story.eyebrow}</p>
            <h2 id="story-title">{story.titleLine1}<br />{story.titleLine2}</h2>
            <p className="story-lead">{story.lead}</p>
            <p className="story-description">{story.description}</p>
            <div className="story-values">
              <span><Icon name="mountain" />{story.values.nature}</span>
              <span><Icon name="home" />{story.values.comfort}</span>
              <span><Icon name="heart" />{story.values.time}</span>
            </div>
            <a className="text-link" href="#destinations">{story.action} <Icon name="arrow-up-right" size={20} /></a>
          </div>
        </section>

        <section className="benefits-section section-shell" aria-labelledby="benefits-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{benefits.eyebrow}</p>
              <h2 id="benefits-title">{benefits.title}</h2>
              <p>{benefits.description}</p>
            </div>
          </div>
          <div className="benefits-grid">
            {benefits.items.map((item, index) => (
              <article className="benefit-card" key={item.title}>
                <Icon name={benefitIcons[index]} size={25} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section section-shell" id="how-it-works" aria-labelledby="how-title">
          <div className="section-heading centered-heading">
            <p className="eyebrow">{how.eyebrow}</p>
            <h2 id="how-title">{how.title}</h2>
            <p>{how.description}</p>
          </div>
          <div className="steps-grid">
            {how.steps.map((step, index) => (
              <article className="step" key={index}>
                <div className="step-top"><span>{String(index + 1).padStart(2, "0")}</span><Icon name={stepIcons[index]} size={30} /></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="owner-section section-shell" id="owners" aria-labelledby="owner-title">
          <div className="owner-pattern" aria-hidden="true"><svg viewBox="0 0 420 320" fill="none"><path d="M40 320 210 15l170 305H40Z" /><path d="m96 320 114-204 114 204H96Z" /><path d="m152 320 58-104 58 104H152Z" /></svg></div>
          <div className="owner-copy">
            <p className="eyebrow">{owners.eyebrow}</p>
            <h2 id="owner-title">{owners.titleLine1}<br />{owners.titleLine2}</h2>
            <p>{owners.description}</p>
          </div>
          <div className="owner-action">
            <Link className="button button-light" href={`/${locale}/owner`}>{owners.action} <Icon name="arrow-up-right" size={20} /></Link>
            <span>{owners.hint}</span>
          </div>
        </section>

        <section className="faq-section section-shell" id="faq" aria-labelledby="faq-title">
          <div className="faq-intro"><p className="eyebrow">{faq.eyebrow}</p><h2 id="faq-title">{faq.titleLine1}<br />{faq.titleLine2}</h2><p>{faq.description}</p><Icon name="compass" size={47} /></div>
          <div className="faq-list">
            {faq.questions.map((question, index) => (
              <details className="faq-item" key={index} id={index === faq.questions.length - 1 ? "owner-question" : undefined}>
                <summary>{question.title}<span><Icon name="plus" size={19} /></span></summary>
                <p>{question.answer}</p>
              </details>
            ))}
          </div>
        </section>
        </ViewTransition>
      </main>

      <SiteFooter dictionary={dictionary} locale={locale} offline={offline} />
    </div>
  );
}
