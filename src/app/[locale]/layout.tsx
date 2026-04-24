import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Nav } from "@/components/shared/Nav";
import { fontsByLocale, jetbrainsMono } from "@/lib/fonts";
import { getDirection, routing, type AppLocale } from "@/i18n/routing";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const fonts = fontsByLocale[locale as AppLocale];
  const dir = getDirection(locale as AppLocale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fonts.display.variable} ${fonts.body.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-ink text-bone">
        <NextIntlClientProvider>
          <LenisProvider>
            <Nav />
            {children}
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
