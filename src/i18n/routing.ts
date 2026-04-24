import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "he", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
});

export type AppLocale = (typeof routing.locales)[number];

export const RTL_LOCALES = new Set<AppLocale>(["he", "ar"]);

export function getDirection(locale: AppLocale): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}
