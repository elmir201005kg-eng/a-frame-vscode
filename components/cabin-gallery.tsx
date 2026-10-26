"use client";
import { useState } from "react";
import Image from "@/components/image";
import dynamic from "@/components/lazy-component";
import { Icon } from "@/components/icon";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { Locale } from "@/app/i18n/config";
import { galleryMessages } from "@/app/i18n/gallery";
const PhotoViewer = dynamic(() => import("@/components/photo-viewer").then(module => module.PhotoViewer), {
  loading: () => <span className="ui-spinner" role="status" aria-label="A-FRAME KG · …" />,
});

export function CabinGallery({
  images,
  common,
  demo,
  locale,
}: {
  images: { id: string; src: string; alt: string }[];
  common: CommonDictionary;
  demo: boolean;
  locale: Locale;
}) {
  const [selected, setSelected] = useState(0);
  const [viewing, setViewing] = useState(false);
  const text = galleryMessages[locale];
  return (
    <div className="property-gallery">
      <div className="property-gallery-main">
        {images[selected] ? (
          <Image
            src={images[selected].src}
            alt={images[selected].alt}
            fill
            sizes="(max-width:374px) calc(100vw - 32px), (max-width:767px) calc(100vw - 40px), (max-width:1376px) calc(100vw - 96px), (max-width:1599px) 1280px, 1360px"
            loading="eager"
            fetchPriority="high"
          />
        ) : (
          <span className="property-photo-empty">
            <Icon name="home" size={45} />
            {common.labels.noPhoto}
          </span>
        )}
        {demo && <span className="cabin-photo-label">{common.labels.demo}</span>}
        {images[selected] && <button type="button" className="property-gallery-open" onClick={() => setViewing(true)} aria-label={`${text.open}: ${images[selected].alt}`}>
          <Icon name="search" size={18} />{text.open}<span>{selected + 1} / {images.length}</span>
        </button>}
      </div>
      {images.length > 1 && (
        <div className="property-gallery-thumbs">
          {images.map((image, index) => (
            <button
              className={selected === index ? "is-active" : ""}
              key={image.id}
              type="button"
              aria-label={`${common.labels.photos}: ${index + 1}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <Image src={image.src} alt={image.alt} fill sizes="(max-width:767px) 88px, 108px" />
            </button>
          ))}
        </div>
      )}
      {viewing && images[selected] && <PhotoViewer images={images} index={selected} onIndexChange={setSelected} onClose={() => setViewing(false)} labels={text}>
        {demo && <span className="portfolio-demo-label">{common.labels.demo}</span>}
      </PhotoViewer>}
    </div>
  );
}
