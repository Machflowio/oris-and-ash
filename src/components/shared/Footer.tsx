import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";

const YEAR = new Date().getFullYear();

export function Footer() {
  const t = useTranslations("footer");
  const email = t("email");
  const phone = t("phone");
  const handle = t("instagram_handle");

  return (
    <footer className="relative z-10 border-t border-bone/10 bg-ink px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <p className="font-display text-base uppercase tracking-[0.2em] text-bone">
              ORIS & ASH
            </p>
            <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-wider text-bone/40">
              {t("tagline")}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
              {t("contact_label")}
            </p>
            <ul className="space-y-1 font-mono text-xs text-bone/60">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-bone"
                >
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-bone"
                >
                  {phone}
                </a>
              </li>
              <li className="text-bone/40">{t("address")}</li>
            </ul>
          </div>

          {/* Follow + locale */}
          <div className="flex flex-col gap-6 md:items-end">
            <div className="space-y-3 md:flex md:flex-col md:items-end">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
                {t("follow_label")}
              </p>
              <a
                href={`https://instagram.com/${handle.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-bone/60 transition-colors hover:text-bone"
              >
                {handle}
              </a>
            </div>
            <LocaleSwitcher />
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-2 border-t border-bone/5 pt-8 font-mono text-[10px] uppercase tracking-wider text-bone/30 sm:flex-row sm:items-center sm:gap-0">
          <span>© {YEAR} Oris & Ash</span>
          <span>{t("rights")}</span>
        </div>
      </div>
    </footer>
  );
}
