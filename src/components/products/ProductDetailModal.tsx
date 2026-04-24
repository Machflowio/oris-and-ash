"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLenis } from "@/components/providers/LenisProvider";
import type { Product } from "@/data/products";
import { getDirection, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ProductReserveForm } from "./ProductReserveForm";

const ease = [0.16, 1, 0.3, 1] as const;

type Fulfillment = "pickup" | "ship";
type Step = "view" | "form";

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const t = useTranslations("collection");
  const format = useFormatter();
  const dir = getDirection(useLocale() as AppLocale);
  const arrow = dir === "rtl" ? "←" : "→";
  const lenis = useLenis();
  const [step, setStep] = useState<Step>("view");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");

  useEffect(() => {
    if (!product) return;
    setStep("view");
    setFulfillment("pickup");

    document.documentElement.style.overflow = "hidden";
    lenis?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [product, onClose, lenis]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <button
            type="button"
            aria-label={t("close")}
            onClick={onClose}
            className="absolute inset-0 bg-ink/85 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-bone/10 bg-ink"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
            data-lenis-prevent
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="absolute end-5 top-5 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60 transition-colors hover:text-bone"
            >
              {t("close")} ×
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image area — stays put through both steps */}
              <div className="relative aspect-[3/4] overflow-hidden bg-elevated md:aspect-auto md:min-h-[600px]">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={`${product.maison} ${product.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <>
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 60%, rgba(139,111,71,0.15) 0%, transparent 70%)",
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 grid select-none place-items-center font-mono text-base uppercase tracking-[0.4em] text-bone/[0.08]"
                    >
                      {product.lot}
                    </span>
                  </>
                )}
                {product.bottlesRemaining <= 2 && (
                  <span className="absolute end-4 top-4 z-10 font-mono text-xs uppercase tracking-[0.2em] text-gold drop-shadow-[0_0_4px_rgba(0,0,0,0.6)]">
                    {t("rare")}
                  </span>
                )}
              </div>

              {/* Right column swaps between product detail view and reserve form */}
              <AnimatePresence mode="wait" initial={false}>
                {step === "view" ? (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="space-y-8 p-8 sm:p-10 lg:p-12"
                  >
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
                        <span>{product.lot}</span>
                        <span>
                          {format.number(product.bottlesRemaining, "n")} /{" "}
                          {format.number(product.bottlesTotal, "n")}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-bone/50">
                        {product.maison}
                      </p>
                      <h2
                        id="modal-title"
                        className="font-display text-3xl leading-tight text-bone"
                      >
                        {product.name}
                      </h2>
                      <p className="pt-1 font-mono text-[10px] uppercase tracking-wider text-bone/40">
                        {format.number(product.ml, "n")} {t("unit_ml")} ·{" "}
                        {format.number(product.year, "year")}
                      </p>
                    </div>

                    <p className="font-mono text-2xl text-bone">
                      ₪{format.number(product.priceIls, "n")}
                    </p>

                    <div className="space-y-2 font-mono text-[10px] uppercase tracking-wider leading-relaxed text-bone/50">
                      <p>
                        <span className="text-bone/70">{t("notes_top")}</span>{" "}
                        — {product.notes.top.join(", ")}
                      </p>
                      <p>
                        <span className="text-bone/70">{t("notes_heart")}</span>{" "}
                        — {product.notes.heart.join(", ")}
                      </p>
                      <p>
                        <span className="text-bone/70">{t("notes_base")}</span>{" "}
                        — {product.notes.base.join(", ")}
                      </p>
                    </div>

                    <div className="space-y-4 border-t border-bone/10 pt-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/40">
                        {t("fulfillment")}
                      </p>

                      <FulfillmentOption
                        selected={fulfillment === "pickup"}
                        onSelect={() => setFulfillment("pickup")}
                        title={t("pickup_title")}
                        subtitle={t("pickup_subtitle")}
                      />
                      <FulfillmentOption
                        selected={fulfillment === "ship"}
                        onSelect={() => setFulfillment("ship")}
                        title={t("ship_title")}
                        subtitle={t("ship_subtitle")}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="w-full bg-brass py-4 font-mono text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-brass/90"
                    >
                      {t("reserve")} {arrow}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <ProductReserveForm
                      product={product}
                      fulfillment={fulfillment}
                      onBack={() => setStep("view")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FulfillmentOption({
  selected,
  onSelect,
  title,
  subtitle,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-start gap-3 text-start"
    >
      <span
        className={cn(
          "mt-1.5 inline-block size-3 shrink-0 rounded-full border transition-colors",
          selected ? "border-brass bg-brass" : "border-bone/40",
        )}
      />
      <span className="block">
        <span className="block font-display text-base text-bone">{title}</span>
        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-bone/40">
          {subtitle}
        </span>
      </span>
    </button>
  );
}
