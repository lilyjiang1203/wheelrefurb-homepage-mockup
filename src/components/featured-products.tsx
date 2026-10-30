import { catalogCategoryHref, catalogHome } from "../lib/catalog-links";
import { ArrowRight } from "lucide-react";
// Independent licensed stock photographs from Pexels; not WheelRefurb product photos.
const wheelPaintProduct = "https://images.pexels.com/photos/15549918/pexels-photo-15549918.jpeg?auto=compress&cs=tinysrgb&w=960";
const clearCoatProduct = "https://images.pexels.com/photos/31768888/pexels-photo-31768888.jpeg?auto=compress&cs=tinysrgb&w=960";
const powderCoatingProduct = "https://images.pexels.com/photos/36215204/pexels-photo-36215204.jpeg?auto=compress&cs=tinysrgb&w=960";
const primerKitProduct = "https://images.pexels.com/photos/7154616/pexels-photo-7154616.jpeg?auto=compress&cs=tinysrgb&w=960";

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
    alt: "Mechanic working on an alloy wheel in a workshop",
  },
  {
    label: "Clear Coat",
    name: "2K High-Build Clear Coat",
    finish: "High Gloss · 2K",
    href: catalogCategoryHref("Clear Coats"),
    image: clearCoatProduct,
    alt: "Close-up of a polished, glossy metallic alloy wheel",
  },
  {
    label: "Powder Coating",
    name: "Powder Coating",
    finish: "Textured Graphite",
    href: catalogCategoryHref("Powder Coatings"),
    image: powderCoatingProduct,
    alt: "Industrial powder coating application on metal parts",
  },
  {
    label: "Refinishing Supply",
    name: "Primer & Surfacer Kit",
    finish: "Grey Filler Primer",
    href: catalogCategoryHref("Other Supplies"),
    image: primerKitProduct,
    alt: "Wheel cleaning and surface preparation in progress",
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
