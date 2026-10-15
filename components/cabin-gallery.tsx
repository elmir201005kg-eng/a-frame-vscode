"use client";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icon";
import type { CommonDictionary } from "@/app/i18n/platform";

export function CabinGallery({
  images,
  common,
  demo,
}: {
  images: { id: string; src: string; alt: string }[];
  common: CommonDictionary;
  demo: boolean;
}) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="property-gallery">
      <div className="property-gallery-main">
        {images[selected] ? (
          <Image
            src={images[selected].src}
            alt={images[selected].alt}
            fill
            sizes="(max-width:767px) 92vw, 88vw"
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
              <Image src={image.src} alt={image.alt} fill sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
