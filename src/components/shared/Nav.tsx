import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Nav() {
  const t = useTranslations("nav");

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
      <span className="font-display text-base uppercase tracking-[0.2em] sm:text-lg">
        {t("logo")}
      </span>
      <LocaleSwitcher />
    </nav>
  );
}
