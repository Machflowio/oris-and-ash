"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getDirection, type AppLocale } from "@/i18n/routing";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroContent() {
  const t = useTranslations("hero");
  const locale = useLocale() as AppLocale;
  const dir = getDirection(locale);
  const arrow = dir === "rtl" ? "←" : "→";

  return (
    <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 sm:px-10 sm:pb-32 lg:px-16">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
        className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-brass sm:mb-8 sm:text-xs"
      >
        {t("label")}
      </motion.p>

      <h1 className="mb-10 max-w-5xl font-display text-4xl leading-[1.05] tracking-tight text-bone sm:mb-12 sm:text-6xl lg:text-8xl">
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease }}
        >
          {t("headline_part1")} <em>{t("headline_emphasis")}</em>
        </motion.span>
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease }}
        >
          {t("headline_part2")}
        </motion.span>
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9, ease }}
      >
        <a
          href="#collection"
          className="group inline-flex items-center gap-2 border-b border-brass/30 pb-1 font-mono text-xs uppercase tracking-wider text-brass transition-colors hover:border-brass sm:text-sm"
        >
          <span>{t("cta")}</span>
          <span
            className={
              dir === "rtl"
                ? "inline-block transition-transform duration-300 group-hover:-translate-x-1"
                : "inline-block transition-transform duration-300 group-hover:translate-x-1"
            }
          >
            {arrow}
          </span>
        </a>
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease }}
        className="absolute bottom-6 start-6 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/30 sm:bottom-8 sm:start-10 lg:start-16"
      >
        {t("scroll")}
      </motion.span>
    </div>
  );
}
