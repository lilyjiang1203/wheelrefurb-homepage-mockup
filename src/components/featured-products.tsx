import { catalogCategoryHref, catalogHome } from "../lib/catalog-links";
import { ArrowRight } from "lucide-react";
import wheelPaintProduct from "../assets/category-wheel-paint.jpg";
import clearCoatProduct from "../assets/category-clear-coats.jpg";
import powderCoatingProduct from "../assets/category-powder-coatings.jpg";
import primerKitProduct from "../assets/category-other-supplies.jpg";

type FeaturedProduct = {
  label: string;
  name: string;
  finish?: string;
  href: string;
  image: string;
  alt: string;
};

const featuredProducts: FeaturedProduct[] = [
  {
    label: "Wheel Paint",
    name: "OEM Wheel Paint",
    finish: "Graphite Metallic · Metallic",
    href: catalogCategoryHref("Wheel Paint"),
    image: wheelPaintProduct,
    alt: "Wheel paint being applied to an alloy wheel",
  },
  {
    label: "Clear Coat",
    name: "2K High-Build Clear Coat",
    finish: "High Gloss · 2K",
    href: catalogCategoryHref("Clear Coats"),
    image: clearCoatProduct,
    alt: "Glossy clear coat finish on an alloy wheel",
  },
  {
    label: "Powder Coating",
    name: "Powder Coating",
    finish: "Textured Graphite",
    href: catalogCategoryHref("Powder Coatings"),
    image: powderCoatingProduct,
    alt: "Powder coating being applied to an alloy wheel",
  },
  {
    label: "Refinishing Supply",
    name: "Primer & Surfacer Kit",
    finish: "Grey Filler Primer",
    href: catalogCategoryHref("Other Supplies"),
    image: primerKitProduct,
    alt: "Wheel refinishing preparation supplies and workshop tools",
  },
];

export function FeaturedProducts() {
  return (
    <section className="featured-section" id="featured-products" aria-labelledby="featured-title">
      <div className="featured-inner">
        <div className="featured-head">
          <h2 id="featured-title" className="featured-title">
            Featured products
          </h2>
          <p className="featured-intro">
            Professional products for wheel refinishing.
          </p>
        </div>
        <ul className="featured-grid">
          {featuredProducts.map((product) => (
            <li key={product.name}>
              <FeaturedProductLink product={product}>
                <span className="featured-media">
                  <img
                    src={product.image}
                    alt={product.alt}
                    width={1024}
                    height={768}
                    loading="lazy"
                  />
                </span>
                <span className="featured-body">
                  <span className="featured-label">{product.label}</span>
                  <span className="featured-name">{product.name}</span>
                  {product.finish ? (
                    <span className="featured-finish">{product.finish}</span>
                  ) : null}
                  <span className="featured-price">Explore category options</span>
                  <span className="featured-cta">
                    Browse category <ArrowRight aria-hidden="true" />
                  </span>
                </span>
              </FeaturedProductLink>
            </li>
          ))}
        </ul>
        <div className="featured-actions">
          <a className="featured-all" href={catalogHome}>
            View all products <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FeaturedProductLink({ product, children }: { product: FeaturedProduct; children: React.ReactNode }) {
  return <a className="featured-card" href={product.href}>{children}</a>;
}
