import { ArrowRight } from "lucide-react";
import wheelPaintImage from "../assets/category-wheel-paint.jpg";
import clearCoatsImage from "../assets/category-clear-coats.jpg";
import powderCoatingsImage from "../assets/category-powder-coatings.jpg";
import candyColorsImage from "../assets/category-candy-colors.jpg";
import freiflipImage from "../assets/category-freiflip.jpg";
import otherSuppliesImage from "../assets/category-other-supplies.jpg";

type ShopCategory = {
  name: string;
  href: string;
  image: string;
  alt: string;
};

/*
 * Collection links are placeholders until the real Shopify collection URLs
 * are supplied, then swap each href below.
 */
const shopCategories: ShopCategory[] = [
  {
    name: "Wheel Paint",
    href: "/collections/wheel-paint",
    image: wheelPaintImage,
    alt: "Spray gun laying a wet coat of metallic paint onto an alloy wheel spoke",
  },
  {
    name: "Clear Coats",
    href: "/collections/clear-coats",
    image: clearCoatsImage,
    alt: "Freshly clear-coated alloy wheel with a deep, mirror-like gloss finish",
  },
  {
    name: "Powder Coatings",
    href: "/collections/powder-coatings",
    image: powderCoatingsImage,
    alt: "Alloy wheel hung in a powder booth while colored powder is applied",
  },
  {
    name: "Candy Colors",
    href: "/collections/candy-colors",
    image: candyColorsImage,
    alt: "Alloy wheel spokes coated in deep translucent candy paint finishes",
  },
  {
    name: "FreiFlip",
    href: "/collections/freiflip",
    image: freiflipImage,
    alt: "Close-up of a color-shifting chameleon wheel finish changing from violet to green",
  },
  {
    name: "Other Supplies",
    href: "/collections/other-supplies",
    image: otherSuppliesImage,
    alt: "Primers, mixing cups, masking tape and sanding discs laid out on a workbench",
  },
];

export function ShopByCategory() {
  return (
    <section className="category-section" id="shop-by-category" aria-labelledby="category-title">
      <div className="category-inner">
        <div className="category-head">
          <h2 id="category-title" className="category-title">
            Shop by category
          </h2>
          <p className="category-intro">
            Everything you need for professional wheel refinishing.
          </p>
        </div>
        <ul className="category-grid">
          {shopCategories.map((category) => (
            <li key={category.name}>
              <a className="category-card" href={category.href}>
                <span className="category-media">
                  <img
                    src={category.image}
                    alt={category.alt}
                    width={1024}
                    height={768}
                    loading="lazy"
                  />
                </span>
                <span className="category-body">
                  <span className="category-name">{category.name}</span>
                  <span className="category-cta">
                    Shop now <ArrowRight aria-hidden="true" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
