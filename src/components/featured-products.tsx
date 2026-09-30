import { ArrowRight } from "lucide-react";
import wheelPaintProduct from "../assets/product-wheel-paint.jpg";
import clearCoatProduct from "../assets/product-clear-coat.jpg";
import powderCoatingProduct from "../assets/product-powder-coating.jpg";
import primerKitProduct from "../assets/product-primer-kit.jpg";

type FeaturedProduct = {
  label: string;
  name: string;
  finish?: string;
  href: string;
  image: string;
  alt: string;
};

/*
 * Collection and product links are placeholders until the real Shopify URLs
 * are supplied, then swap each href below.
 */
const featuredProducts: FeaturedProduct[] = [
  {
    label: "Wheel Paint",
    name: "OEM Wheel Paint",
    finish: "Graphite Metallic · Metallic",
    href: "/collections/wheel-paint",
    image: wheelPaintProduct,
    alt: "Aerosol can of automotive wheel paint with a metallic paint swatch beside it",
  },
  {
    label: "Clear Coat",
    name: "2K High-Build Clear Coat",
    finish: "High Gloss · 2K",
    href: "/collections/clear-coats",
    image: clearCoatProduct,
    alt: "Bottle of automotive clear coat next to a glossy clear coated sample panel",
  },
  {
    label: "Powder Coating",
    name: "Powder Coating",
    finish: "Textured Graphite",
    href: "/collections/powder-coatings",
    image: powderCoatingProduct,
    alt: "Tub of graphite powder coating next to a coated sample panel",
  },
  {
    label: "Refinishing Supply",
    name: "Primer & Surfacer Kit",
    finish: "Grey Filler Primer",
    href: "/collections/other-supplies",
    image: primerKitProduct,
    alt: "Primer can, surfacer tub, sanding disc and masking tape arranged as a kit",
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
              <a className="featured-card" href={product.href}>
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
                  <span className="featured-price">Log in to view price</span>
                  <span className="featured-cta">
                    View product <ArrowRight aria-hidden="true" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="featured-actions">
          <a className="featured-all" href="/collections/all">
            View all products <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
