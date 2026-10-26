import { ResourceUnavailable } from "@/components/resource-unavailable";
import { randomUUID } from "node:crypto";
import { redirect } from "@/server/navigation";
import Image from "@/components/image";
import Link from "@/components/navigation-link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { routeLocale } from "@/lib/route";
import { cabinCardDto, cabinCardSelect, single, publicCabinWhere } from "@/lib/catalog";
import type { SearchParams } from "@/lib/catalog";
import { pageDictionaries } from "@/app/i18n/platform";
import { today } from "@/lib/validation";
import { PageHeading, Money } from "@/components/product-ui";
import { BookingForm } from "@/components/booking-form";
import { blockedNights } from "@/lib/booking";
import { addDays } from "@/lib/stay-dates";

export const instant = false;
export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const locale = await routeLocale(params),
    query = await searchParams,
    slug = single(query, "cabin");
  if (!slug) redirect(`/${locale}/catalog`);
  const next = new URLSearchParams({
    cabin: slug,
    checkIn: single(query, "checkIn"),
    checkOut: single(query, "checkOut"),
    guests: single(query, "guests") || "1",
  });
  const user = await requireUser(locale, `/${locale}/booking?${next}`);
  const [record, { common, text }] = await Promise.all([
    db.cabin.findFirst({
      where: publicCabinWhere({ slug }),
      select: cabinCardSelect,
    }),
    pageDictionaries(locale, "booking"),
  ]);
  if (!record) return <ResourceUnavailable locale={locale} />;
  const cabin = cabinCardDto(record, locale);
  const start = today();
  const blocked = await blockedNights(record.id, start, new Date(`${addDays(start, 365)}T00:00:00Z`));
  return (
    <>
      <PageHeading
        text={cabin.isDemo ? { ...text, description: common.labels.demoBookingHint } : text}
      />
      <div className="checkout-layout">
        <section className="product-panel">
          <BookingForm
            locale={locale}
            common={common}
            demo={cabin.isDemo}
            cabinId={cabin.id}
            maxGuests={cabin.maxGuests}
            today={start}
            blocked={blocked}
            requestKey={randomUUID()}
            initial={{
              checkIn: single(query, "checkIn"),
              checkOut: single(query, "checkOut"),
              guests: single(query, "guests") || "1",
            }}
            contact={{
              guestName: [user.firstName, user.lastName].filter(Boolean).join(" "),
              guestPhone: user.phone || "",
              guestEmail: user.email,
            }}
          />
        </section>
        <aside className="checkout-summary product-panel">
          {cabin.images[0] && (
            <div className="checkout-photo">
              <Image
                src={cabin.images[0].src}
                alt={cabin.images[0].alt}
                fill
                loading="eager"
                sizes="(max-width:767px) 92vw, 360px"
              />
            </div>
          )}
          <p className="cabin-location">{cabin.location}</p>
          <h2>{cabin.title}</h2>
          <p className="stay-price">
            <strong>
              <Money amount={cabin.price} locale={locale} common={common} />
            </strong>
            <span>{common.labels.perNight}</span>
          </p>
          {cabin.isDemo && <p className="product-notice">{common.labels.demoHint}</p>}
          <Link className="text-link" href={`/${locale}/cabins/${slug}`}>
            {common.labels.details}
          </Link>
        </aside>
      </div>
    </>
  );
}
