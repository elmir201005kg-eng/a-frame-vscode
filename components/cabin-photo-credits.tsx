import type { Locale } from "@/app/i18n/config";
import photoCredits from "@/public/images/demo-photo-credits.json";

type PhotoCredit = { source: string; author: string; license: string; licenseUrl: string };
const credits: Record<string, PhotoCredit> = photoCredits;
const messages = {
  ru: {
    title: "Авторы и лицензии фотографий", photo: "Фото", source: "Источник",
    modified: "Размер изменён, формат WebP.",
    shareAlike: "Изменённая версия распространяется по той же лицензии.",
  },
  kg: {
    title: "Сүрөттөрдүн авторлору жана лицензиялары", photo: "Сүрөт", source: "Булак",
    modified: "Өлчөмү өзгөртүлүп, WebP форматына өткөрүлгөн.",
    shareAlike: "Өзгөртүлгөн нуска ошол эле лицензия менен таратылат.",
  },
  en: {
    title: "Photo credits and licenses", photo: "Photo", source: "Source",
    modified: "Resized and converted to WebP.",
    shareAlike: "The modified version is distributed under the same license.",
  },
};

export function CabinPhotoCredits({ images, locale }: { images: { src: string }[]; locale: Locale }) {
  const text = messages[locale];
  const credited = images.flatMap((image, index) => {
    const credit = image.src.startsWith("/images/") ? credits[image.src.slice("/images/".length)] : undefined;
    return credit ? [{ ...credit, src: image.src, index }] : [];
  });
  if (!credited.length) return null;
  return <details className="property-photo-credits">
    <summary>{text.title}</summary>
    <ul>
      {credited.map(credit => <li key={`${credit.src}:${credit.index}`}>
        {text.photo} {credit.index + 1}: {" "}
        <a href={credit.source} target="_blank" rel="noreferrer" aria-label={`${text.source}: ${credit.author}`}>{credit.author}</a>
        {" · "}<a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>
        {" · "}{text.modified}{credit.license.startsWith("CC BY-SA") && ` ${text.shareAlike}`}
      </li>)}
    </ul>
  </details>;
}
