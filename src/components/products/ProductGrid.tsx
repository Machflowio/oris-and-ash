"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { products, type Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ProductDetailModal } from "./ProductDetailModal";

export function ProductGrid() {
  const t = useTranslations("collection");
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <section
        id="collection"
        className="relative z-10 border-t border-bone/5 px-6 py-32 sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
            {t("label")}
          </p>
          <h2 className="mt-6 max-w-2xl font-display text-3xl leading-snug text-bone sm:text-4xl">
            {t("heading")}
          </h2>

          <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.lot}
                product={product}
                onClick={() => setSelected(product)}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailModal
        product={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
