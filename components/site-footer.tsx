
import Link from "@/components/navigation-link";
import { Brand } from "@/components/brand";
import { Icon } from "@/components/icon";

import type { LandingDictionary } from "@/app/i18n/dictionaries";
import type { Locale } from "@/app/i18n/config";

import { publicSupportEmail } from "@/lib/public-settings";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import { siteContact } from "@/lib/site-contact";

// ============================================
// MOKK SKY VILL — CONTACT INFORMATION
// ============================================

const CONTACT = {
  phone: "+996998060622",
  displayPhone: "0998-06-06-22",

  address:
    "Беш-Кунгей, ул. Асанкулов Азиз, 28/4",

  whatsapp:
    "https://wa.me/996998060622",

  instagram:
    "https://www.instagram.com/mokkskyvill.a_frame/",

  threads:
    "https://www.threads.com/@mokkskyvill.a_frame",

  map:
    "https://2gis.kg/bishkek/firm/70000001100817969",
};

// ============================================
// THREADS ICON
// ============================================

function ThreadsIcon({ size = 21 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.7 7.7C16.5 5.9 14.7 5 12 5c-4.3 0-7 3.1-7 7s2.7 7 7 7c4.7 0 7-2.5 7-6.3 0-3.4-2-5.1-5-5.1-2.4 0-4.1 1.2-4.1 3.1 0 1.6 1.3 2.7 3 2.7 2.4 0 4.2-2 4.2-4.7" />
      <path d="M12 2C6.2 2 2 6.2 2 12s4.2 10 10 10 10-4.2 10-10S17.8 2 12 2Z" />
    </svg>
  );
}

// ============================================
// SOCIAL MEDIA
// ============================================

const socialLinks = [
  {
    label: "WhatsApp",
    icon: "whatsapp",
    href: CONTACT.whatsapp,
  },
  {
    label: "Threads",
    icon: "threads",
    href: CONTACT.threads,
  },
  {
    label: "Instagram",
    icon: "instagram",
    href: CONTACT.instagram,
  },
] as const;

// ============================================
// FOOTER COMPONENT
// ============================================

export async function SiteFooter({
  dictionary,
  locale = "ru",
  offline = false,
}: {
  dictionary: LandingDictionary;
  locale?: Locale;
  offline?: boolean;
}) {
  const { footer, accessibility } = dictionary;

  // Email from existing settings
  const configuredEmail = offline
    ? null
    : await publicSupportEmail().catch(
        (error: unknown) => {
          if (!isDatabaseUnavailable(error)) {
            throw error;
          }

          console.warn(
            "[footer] Database unavailable. Using default email."
          );

          return null;
        }
      );

  const supportEmail =
    configuredEmail || siteContact.email;

  const emailHref = `mailto:${supportEmail}`;

  return (
    <footer className="site-footer">
      {/* ====================================
          FOOTER MAIN CONTENT
      ==================================== */}

      <div className="footer-top section-shell">

        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-brand-header">

            <Brand />

            <a
              className="footer-back-top"
              href="#top"
              aria-label={accessibility.backToTop}
              title={accessibility.backToTop}
            >
              <Icon
                name="arrow-up-right"
                size={18}
              />
            </a>

          </div>

          <p>
            {footer.statementLine1}{" "}
            {footer.statementLine2}
          </p>
        </div>

        {/* DISCOVER */}
        <nav
          className="footer-nav footer-discover"
          aria-label={footer.navigation}
        >
          <h2 className="footer-heading">
            {footer.discover}
          </h2>

          <ul>
            <li>
              <Link href={`/${locale}/catalog`}>
                {footer.cabins}
              </Link>
            </li>

            <li>
              <Link href={`/${locale}/portfolio`}>
                {footer.portfolio}
              </Link>
            </li>

            <li>
              <Link
                href={
                  offline
                    ? `/${locale}#destinations`
                    : `/${locale}/destinations`
                }
              >
                {footer.destinations}
              </Link>
            </li>

            <li>
              <Link
                href={
                  offline
                    ? `/${locale}#how-it-works`
                    : `/${locale}/how-it-works`
                }
              >
                {footer.howItWorks}
              </Link>
            </li>
          </ul>
        </nav>

        {/* INFORMATION */}
        <nav
          className="footer-nav footer-information"
          aria-label={footer.information}
        >
          <h2 className="footer-heading">
            {footer.information}
          </h2>

          <ul>
            <li>
              <Link href={`/${locale}#about`}>
                {footer.about}
              </Link>
            </li>

            <li>
              <Link href={`/${locale}/owner`}>
                {footer.owners}
              </Link>
            </li>

            <li>
              <Link href={`/${locale}#faq`}>
                {footer.faq}
              </Link>
            </li>
          </ul>
        </nav>

        {/* CONTACT INFORMATION */}
        <div
          className="footer-contact"
          id="site-contact"
        >
          <h2 className="footer-heading">
            {footer.contact}
          </h2>

          {/* EMAIL */}
          <a href={emailHref}>
            <Icon name="mail" size={16} />

            <span>{supportEmail}</span>
          </a>

          {/* PHONE */}
          <a href={`tel:${CONTACT.phone}`}>
            <Icon name="phone" size={16} />

            <span>
              {CONTACT.displayPhone}
            </span>
          </a>

          {/* LOCATION — 2GIS */}
          <a
            className="footer-address"
            href={CONTACT.map}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="pin" size={16} />

            <span>
              {CONTACT.address}
            </span>

            <Icon
              name="arrow-up-right"
              size={14}
            />
          </a>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="footer-socials">
          {socialLinks.map(
            ({ label, icon, href }) => (
              <a
                key={label}
                className="footer-social"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
              >
                {icon === "threads" ? (
                  <ThreadsIcon size={21} />
                ) : (
                  <Icon
                    name={icon}
                    size={21}
                  />
                )}
              </a>
            )
          )}
        </div>
      </div>

      {/* ====================================
          FOOTER BOTTOM
      ==================================== */}

      <div className="footer-bottom section-shell">

        <span className="footer-copyright">
          {footer.copyright}
        </span>

        <nav
          className="footer-legal"
          aria-label={footer.information}
        >
          <Link href={`/${locale}/privacy`}>
            {footer.privacy}
          </Link>

          <Link href={`/${locale}/terms`}>
            {footer.terms}
          </Link>
        </nav>

      </div>
    </footer>
  );
}
