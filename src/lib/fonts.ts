import {
  Amiri,
  Assistant,
  Fraunces,
  Frank_Ruhl_Libre,
  IBM_Plex_Sans_Arabic,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import type { AppLocale } from "@/i18n/routing";

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-shared",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display-locale",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-locale",
  display: "swap",
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-display-locale",
  display: "swap",
});

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-body-locale",
  display: "swap",
});

// Brief: "Noto Serif Arabic (or Amiri as fallback)". Noto Serif Arabic
// isn't in next/font's Google Fonts registry, so using Amiri.
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-locale",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-body-locale",
  display: "swap",
});

export const fontsByLocale: Record<
  AppLocale,
  { display: { variable: string }; body: { variable: string } }
> = {
  en: { display: fraunces, body: inter },
  he: { display: frankRuhl, body: assistant },
  ar: { display: amiri, body: ibmPlexArabic },
};
