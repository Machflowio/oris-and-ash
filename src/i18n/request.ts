import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Force Arabic-Indic numerals (٠-٩) on the AR locale; Latin (0-9) elsewhere.
  // Without this, Intl.NumberFormat("ar") defaults to Latin numerals, which
  // looks inconsistent next to AR copy that uses Arabic-Indic (e.g. "تأسست ٢٠٢٥").
  const numberingSystem = locale === "ar" ? "arab" : "latn";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    formats: {
      number: {
        // Default number style — used for prices, ml, scarcity counts.
        n: { numberingSystem },
        // Years should NOT have a thousands separator (e.g. "2,014" → "2014").
        year: { numberingSystem, useGrouping: false },
      },
    },
  };
});
