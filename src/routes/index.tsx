import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { StoreNavigation } from "../components/store-navigation";
import { HomeBanner } from "../components/home-banner";
import { ShopByCategory } from "../components/shop-by-category";
import { FeaturedProducts } from "../components/featured-products";
import { ProfessionalSolutions } from "../components/professional-solutions";
import { AboutSection } from "../components/about-section";
import { WholesaleProgram } from "../components/wholesale-program";
import { GuidedProductFinder } from "../components/guided-product-finder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Professional Wheel Refinishing Products | FreiLack WheelRefurb" },
      { name: "description", content: "OEM-quality wheel paints, primers, clear coats, powders and refinishing supplies for professionals, plus guided product selection for wheel refinishing." },
      { property: "og:title", content: "Professional Wheel Refinishing Products — FreiLack WheelRefurb" },
      { property: "og:description", content: "OEM-quality wheel paints, primers, clear coats, powders and refinishing supplies for professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background" id="home">
      <StoreNavigation />
      <main>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-border bg-muted/50 px-4 py-2 text-center text-xs sm:text-sm" aria-label="Sandbox catalog preview">
          <span className="text-muted-foreground">Explore our product catalog preview</span>
          <Link to="/sandbox/products" className="inline-flex items-center gap-1 font-semibold text-brand hover:underline">
            Browse Sandbox Products <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <HomeBanner />
        <ShopByCategory />
        <FeaturedProducts />
        <ProfessionalSolutions />
        <GuidedProductFinder />
        <AboutSection />
        <WholesaleProgram />
      </main>
    </div>
  );
}
