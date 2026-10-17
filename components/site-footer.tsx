import Link from "@/components/navigation-link";
import { Brand } from "@/components/brand";
import { Icon } from "@/components/icon";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import type { Locale } from "@/app/i18n/config";
import { publicSupportEmail, publicContactSettings } from "@/lib/public-settings";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import { siteContact } from "@/lib/site-contact";

const socialLinks = [
  { label: "WhatsApp", icon: "whatsapp", href: siteContact.whatsappUrl },
  { label: "Telegram", icon: "telegram", href: siteContact.telegramUrl },
  { label: "Instagram", icon: "instagram", href: siteContact.instagramUrl },
] as const;

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
  const supportEmail = (offline ? null : await publicSupportEmail().catch((error: unknown) => {
    if (!isDatabaseUnavailable(error)) throw error;
    console.warn(`[footer] Support email unavailable (${error.code}); using the default contact email. Check DATABASE_URL and database connectivity.`);
    return null;
  })) || siteContact.email;
  const emailHref = `mailto:${encodeURIComponent(supportEmail)}`;
  const contacts = offline ? null : await publicContactSettings().catch((error: unknown) => { if (!isDatabaseUnavailable(error)) throw error; return null; });
  const phone = contacts?.phone || siteContact.phone;
  const displayPhone = phone.replace(/^(\+\d{3})(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4");

  return (
    <footer className="site-footer">
      <div className="footer-top section-shell">
        <div className="footer-brand">
          <div className="footer-brand-header">
            <Brand label={accessibility.brandHome} href={`/${locale}`} />
            <a className="footer-back-top" href="#top" aria-label={accessibility.backToTop} title={accessibility.backToTop}>
              <Icon name="arrow-up-right" size={18} />
            </a>
          </div>
          <p>{footer.statementLine1} {footer.statementLine2}</p>
        </div>
        <nav className="footer-nav footer-discover" aria-label={footer.navigation}>
          <h2 className="footer-heading">{footer.discover}</h2>
          <ul>
            <li><Link href={`/${locale}/catalog`}>{footer.cabins}</Link></li>
            <li><Link href={`/${locale}#destinations`}>{footer.destinations}</Link></li>
            <li><Link href={`/${locale}#how-it-works`}>{footer.howItWorks}</Link></li>
            <li><Link href={`/${locale}/account?tab=favorites`}>{footer.favorites}</Link></li>
          </ul>
        </nav>
        <nav className="footer-nav footer-information" aria-label={footer.information}>
          <h2 className="footer-heading">{footer.information}</h2>
          <ul>
            <li><Link href={`/${locale}#about`}>{footer.about}</Link></li>
            <li><Link href={`/${locale}/owner`}>{footer.owners}</Link></li>
            <li><Link href={`/${locale}#faq`}>{footer.faq}</Link></li>
            <li><Link href={`/${locale}/account`}>{footer.account}</Link></li>
          </ul>
        </nav>
        <div className="footer-contact" id="site-contact">
          <h2 className="footer-heading">{footer.contact}</h2>
          <a href={emailHref}>
            <Icon name="mail" size={16} /><span>{supportEmail}</span>
          </a>
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
            <Icon name="phone" size={16} /><span>{displayPhone}</span>
          </a>
          <p className="footer-address">
            <Icon name="pin" size={16} /><span>{contacts?.address || footer.address}</span>
          </p>
        </div>
        <div className="footer-socials">
          {socialLinks.filter(({ href }) => href).map(({ label, icon, href }) => (
            <a key={label} className="footer-social" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
              <Icon name={icon} size={21} />
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom section-shell">
        <span className="footer-copyright">{footer.copyright}</span>
      </div>
    </footer>
  );
}
