"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import type { Product } from "@/data/products";

const RARE_THRESHOLD = 2;

export function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  const t = useTranslations("collection");
  const format = useFormatter();
  const isRare = product.bottlesRemaining <= RARE_THRESHOLD;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-start"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-elevated transition-shadow duration-500 group-hover:shadow-[inset_0_0_0_1px_rgba(139,111,71,0.4)]">
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.maison} ${product.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 60%, rgba(139,111,71,0.10) 0%, transparent 70%)",
              }}
            />
            <span
              aria-hidden
              className="absolute inset-0 grid select-none place-items-center font-mono text-xs uppercase tracking-[0.4em] text-bone/[0.06]"
            >
              {product.lot}
            </span>
          </>
        )}
        {isRare && (
          <span className="absolute end-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-gold drop-shadow-[0_0_4px_rgba(0,0,0,0.6)]">
            {t("rare")}
          </span>
        )}
      </div>

      <div className="mt-5 space-y-2">
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
        <h3 className="font-display text-xl leading-tight text-bone">
          {product.name}
        </h3>
        <div className="flex items-baseline justify-between pt-1">
          <p className="font-mono text-xs text-bone/70">
            ₪{format.number(product.priceIls, "n")}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-bone/40">
            {format.number(product.ml, "n")} {t("unit_ml")} ·{" "}
            {format.number(product.year, "year")}
          </p>
        </div>
      </div>
    </button>
  );
}
