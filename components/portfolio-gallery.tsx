"use client";

import Image from "@/components/image";
import dynamic from "@/components/lazy-component";
import { useState } from "react";
import Link from "@/components/navigation-link";
import { Icon } from "@/components/icon";
const PhotoViewer = dynamic(() => import("@/components/photo-viewer").then(module => module.PhotoViewer), {
  loading: () => <span className="ui-spinner" role="status" aria-label="A-FRAME KG · …" />,
});
import { galleryMessages } from "@/app/i18n/gallery";
import { formatNumber, interpolate } from "@/app/i18n/format";
import type { Locale } from "@/app/i18n/config";
import type { PortfolioPhoto } from "@/lib/portfolio";

export function PortfolioGallery({ photos, locale, demoLabel }: { photos: PortfolioPhoto[]; locale: Locale; demoLabel: string }) {
  const text = galleryMessages[locale];
  const [region, setRegion] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const regions = Array.from(new Map(photos.map(photo => [photo.regionSlug, photo.region])).entries());
  const visible = photos.filter(photo => !region || photo.regionSlug === region);
  const selectedPhoto = selected === null ? null : visible[selected];

  return (
    <section className="portfolio-gallery" aria-label={text.photos}>
      {regions.length > 1 && <div className="portfolio-filters" role="group" aria-label={text.filter}>
        {[{ slug: "", name: text.all }, ...regions.map(([slug, name]) => ({ slug, name }))].map(item => (
          <button type="button" key={item.slug} aria-pressed={region === item.slug} onClick={() => { setRegion(item.slug); setSelected(null); }}>
            {item.name}
          </button>
        ))}
      </div>}
      <p className="portfolio-count" role="status">{interpolate(text.count, { count: formatNumber(visible.length, locale) })}</p>
      <div className="portfolio-grid">
        {visible.map((photo, index) => (
          <article className="portfolio-card" key={photo.id}>
            <button className="portfolio-photo" type="button" aria-label={`${text.open}: ${photo.alt}`} onClick={() => setSelected(index)}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width:599px) 92vw, (max-width:1023px) 45vw, 30vw" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : undefined} />
              {photo.isDemo && <span className="cabin-photo-label">{demoLabel}</span>}
              <span className="portfolio-photo-action"><Icon name="search" size={17} />{text.open}</span>
            </button>
            <div className="portfolio-card-caption">
              <p><Icon name="pin" size={15} />{photo.region}</p>
              <Link href={`/${locale}/cabins/${photo.slug}`}><h2>{photo.title}</h2><Icon name="arrow-up-right" size={18} /></Link>
            </div>
          </article>
        ))}
      </div>
      {selected !== null && selectedPhoto && <PhotoViewer images={visible} index={selected} onIndexChange={setSelected} onClose={() => setSelected(null)} labels={text}>
        {selectedPhoto.isDemo && <span className="portfolio-demo-label">{demoLabel}</span>}
        <Link className="text-link" href={`/${locale}/cabins/${selectedPhoto.slug}`}>{text.viewCabin}<Icon name="arrow-up-right" size={17} /></Link>
      </PhotoViewer>}
    </section>
  );
}
