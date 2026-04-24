import { useTranslations } from "next-intl";

const STEP_NUMBERS = ["01", "02", "03"] as const;

export function Provenance() {
  const t = useTranslations("provenance");

  return (
    <section
      id="provenance"
      className="relative z-10 border-t border-bone/5 bg-ink px-6 py-32 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
          {t("label")}
        </p>
        <h2 className="mt-6 max-w-3xl font-display text-3xl leading-snug text-bone sm:text-4xl">
          {t("heading")}
        </h2>

        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-3">
          {STEP_NUMBERS.map((n) => (
            <div key={n} className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
                {n} — {t(`step_${n}_title`)}
              </p>
              <p className="max-w-sm font-mono text-xs leading-relaxed text-bone/60">
                {t(`step_${n}_body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
