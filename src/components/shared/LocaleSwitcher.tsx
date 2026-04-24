"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "EN",
  he: "עב",
  ar: "ع",
};

export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const neutralPath = pathname.replace(/^\/[^/]+/, "") || "/";

  return (
    <ul className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <li key={locale}>
            <Link
              href={`/${locale}${neutralPath}`}
              className={cn(
                "transition-colors duration-200",
                isActive
                  ? "text-bone"
                  : "text-bone/40 hover:text-brass",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {LOCALE_LABELS[locale]}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
