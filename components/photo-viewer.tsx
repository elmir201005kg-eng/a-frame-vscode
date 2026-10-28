"use client";

import Image from "@/components/image";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icon";
import type { GalleryMessages } from "@/app/i18n/gallery";

export type GalleryPhoto = { id: string; src: string; alt: string };

export function PhotoViewer({ images, index, onIndexChange, onClose, labels, children }: {
  images: GalleryPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  labels: GalleryMessages;
  children?: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const swipe = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const titleId = useId();
  const photo = images[index];
  const [dimensions, setDimensions] = useState<{ src: string; ratio: number } | null>(null);
  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  if (!photo) return null;
  const move = (step: number) => onIndexChange((index + step + images.length) % images.length);
  return (
    <dialog ref={dialog} className="photo-viewer" aria-labelledby={titleId} onClose={onClose}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      onKeyDown={event => {
        if (images.length < 2) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
      <div className="photo-viewer-content">
        <div className="photo-viewer-toolbar">
          <span id={titleId}>{labels.photos}</span>
          <span aria-live="polite" aria-atomic="true">{index + 1} / {images.length}</span>
          <button type="button" autoFocus aria-label={labels.close} onClick={() => dialog.current?.close()}><Icon name="x" size={24} /></button>
        </div>
        <div className="photo-viewer-stage" style={{ aspectRatio: dimensions?.src === photo.src ? dimensions.ratio : 1.5 }}
          onPointerDown={event => {
            if (event.pointerType !== "touch" || !event.isPrimary || (event.target as Element).closest("button")) {
              swipe.current = null;
              return;
            }
            swipe.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
          }}
          onPointerCancel={() => { swipe.current = null; }}
          onPointerUp={event => {
            const start = swipe.current;
            swipe.current = null;
            if (!start || start.pointerId !== event.pointerId || images.length < 2) return;
            const horizontal = event.clientX - start.x;
            const vertical = event.clientY - start.y;
            if (Math.abs(horizontal) >= 48 && Math.abs(horizontal) > Math.abs(vertical) * 1.5) move(horizontal < 0 ? 1 : -1);
          }}>
          <Image key={photo.id} src={photo.src} alt={photo.alt} fill sizes="96vw" loading="eager" draggable={false}
            onLoad={event => {
              const image = event.currentTarget;
              if (image.naturalHeight) setDimensions({ src: photo.src, ratio: image.naturalWidth / image.naturalHeight });
            }} />
          {images.length > 1 && <>
            <button type="button" className="photo-viewer-previous" aria-label={labels.previous} onClick={() => move(-1)}><Icon name="chevron-left" size={26} /></button>
            <button type="button" className="photo-viewer-next" aria-label={labels.next} onClick={() => move(1)}><Icon name="chevron-right" size={26} /></button>
          </>}
        </div>
        <div className="photo-viewer-caption"><p>{photo.alt}</p>{children}</div>
      </div>
    </dialog>
  );
}
