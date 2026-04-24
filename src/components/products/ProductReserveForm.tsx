"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { getDirection, type AppLocale } from "@/i18n/routing";

type Fulfillment = "pickup" | "ship";

export function ProductReserveForm({
  product,
  fulfillment,
  onBack,
}: {
  product: Product;
  fulfillment: Fulfillment;
  onBack: () => void;
}) {
  const t = useTranslations("collection");
  const format = useFormatter();
  const dir = getDirection(useLocale() as AppLocale);
  const backArrow = dir === "rtl" ? "→" : "←";

  return (
    <div className="space-y-7 p-8 sm:p-10 lg:p-12">
      <button
        type="button"
        onClick={onBack}
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60 transition-colors hover:text-bone"
      >
        {backArrow} {t("back")}
      </button>

      {/* Compact summary so the user knows what they're reserving */}
      <div className="space-y-1 border-b border-bone/10 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
          {product.lot}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-bone/50">
          {product.maison}
        </p>
        <h2 className="font-display text-2xl text-bone">{product.name}</h2>
        <p className="pt-1 font-mono text-base text-bone">
          ₪{format.number(product.priceIls, "n")}
        </p>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
        {t("form_heading")}
      </p>

      <FormField
        label={t("name_label")}
        placeholder={t("name_placeholder")}
        autoComplete="name"
      />
      <FormField
        label={t("email_label")}
        type="email"
        placeholder={t("email_placeholder")}
        autoComplete="email"
      />
      <FormField
        label={t("phone_label")}
        type="tel"
        placeholder={t("phone_placeholder")}
        autoComplete="tel"
      />

      {fulfillment === "pickup" ? (
        <FormField
          label={t("pickup_time_label")}
          placeholder={t("pickup_time_placeholder")}
        />
      ) : (
        <FormField
          label={t("address_label")}
          placeholder={t("address_placeholder")}
          multiline
          autoComplete="street-address"
        />
      )}

      <div className="space-y-2 pt-4">
        <button
          type="button"
          disabled
          aria-label={t("payment_disabled")}
          className="w-full cursor-not-allowed bg-brass/25 py-4 font-mono text-xs uppercase tracking-[0.25em] text-ink/50"
        >
          {t("payment")}
        </button>
        <p className="text-center font-mono text-[10px] uppercase tracking-wider text-bone/30">
          {t("payment_disabled")}
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
  autoComplete,
  multiline = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const baseClass =
    "w-full border-0 border-b border-bone/20 bg-transparent py-2 font-display text-base text-bone placeholder:text-bone/30 transition-colors focus:border-brass focus:outline-none";

  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-bone/40">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={2}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={baseClass}
        />
      )}
    </div>
  );
}
