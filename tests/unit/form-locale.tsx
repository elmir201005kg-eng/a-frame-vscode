import { strict as assert } from "node:assert";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { FormDesignProvider } from "../../components/form-design-provider";
import { PremiumDatePicker } from "../../components/premium-date-picker";
import { GuestSelector } from "../../components/guest-selector";
import { formMessages } from "../../app/i18n/forms";
import { pluralize } from "../../app/i18n/format";

for (const locale of ["kg", "en", "ru"] as const) {
  for (const inheritedLocale of [undefined, locale === "ru" ? "en" : "ru"] as const) {
    test(`${locale} date and guest SSR uses page locale with ${inheritedLocale ?? "no"} provider`, () => {
      const controls = <>
        <PremiumDatePicker locale={locale} />
        <GuestSelector locale={locale} defaultValue="2" />
      </>;
      const html = renderToStaticMarkup(inheritedLocale
        ? <FormDesignProvider locale={inheritedLocale}>{controls}</FormDesignProvider>
        : controls);
      assert.ok(html.includes(`<span>${formMessages[locale].selectDate}</span>`));
      assert.ok(html.includes(`: ${formMessages[locale].selectDate}"`));
      assert.ok(html.includes(pluralize(2, locale, formMessages[locale].guestForms)));
      for (const other of ["kg", "en", "ru"] as const) {
        if (other !== locale) assert.ok(!html.includes(formMessages[other].selectDate));
      }
    });
  }
}
