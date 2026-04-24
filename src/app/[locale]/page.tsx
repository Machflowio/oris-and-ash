import { setRequestLocale } from "next-intl/server";
import { HeroContent } from "@/components/hero/HeroContent";
import { HeroScrollScrub } from "@/components/hero/HeroScrollScrub";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Footer } from "@/components/shared/Footer";
import { Provenance } from "@/components/shared/Provenance";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroScrollScrub>
        <HeroContent />
      </HeroScrollScrub>
      <ProductGrid />
      <Provenance />
      <Footer />
    </>
  );
}
