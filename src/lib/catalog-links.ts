/** Shared navigation targets for the Sandbox catalog. Shopify collection URLs are not live yet. */
export const catalogHome = "/sandbox/products";

export function catalogCategoryHref(category: string): string {
  const ids: Record<string, string> = {
    Paint: "wheel-paint",
    "Wheel Paint": "wheel-paint",
    Clear: "clear-coats",
    "Clear Coats": "clear-coats",
    "Clear Coat": "clear-coats",
    Powder: "powder-coatings",
    "Powder Coatings": "powder-coatings",
    "Powder Coating": "powder-coatings",
    CandyColor: "candy-colors",
    "Candy Colors": "candy-colors",
    Freiflip: "freiflip",
    FreiFlip: "freiflip",
    Miscellaneous: "miscellaneous",
    "Other Supplies": "other-supplies",
    "Refinishing Supply": "other-supplies",
    "Powder Clear": "powder-clear",
    Primer: "primer",
    RAL: "ral",
    GunWash: "gunwash",
  };
  return `${catalogHome}?category=${encodeURIComponent(ids[category] ?? category.toLowerCase())}`;
}

export function catalogCollectionHref(name: string): string {
  if (["Clear", "Clear Coat", "Powder Clear", "Primer", "RAL", "GunWash"].includes(name)) {
    return catalogCategoryHref(name);
  }
  const normalized = name === "BMW / MINI" ? "BMW/MINI" : name === "Fiat (wheel)" ? "Fiat" : name;
  return `${catalogHome}?collection=${encodeURIComponent(normalized)}`;
}

export function matchesCatalogCategory(
  category: string,
  product: { product_name: string; color_name: string | null },
  collectionName: string,
): boolean {
  const label = `${product.product_name} ${product.color_name ?? ""}`.toLowerCase();
  const collection = collectionName.toLowerCase();
  switch (category) {
    case "wheel-paint": return label.includes("basecoat") && !label.includes("powder");
    case "clear-coats": return collection === "clear coats" || /clearcoat|clear coat|lacquer/.test(label);
    case "powder-coatings": return /powder/.test(label);
    case "powder-clear": return /powder/.test(label) && /clear/.test(label);
    case "candy-colors": return /candy/.test(label);
    case "freiflip": return /freiflip/.test(label);
    case "other-supplies": return /primer|surfacer|gunwash|gun wash|supplies/.test(label);
    case "primer": return /primer/.test(label);
    case "ral": return /\bral\b/.test(label) || collection === "ral";
    case "gunwash": return /gunwash|gun wash/.test(label);
    case "miscellaneous": return collection === "miscellaneous";
    default: return false;
  }
}

export const catalogCategoryNames: Record<string, string> = {
  "wheel-paint": "Wheel Paint",
  "clear-coats": "Clear Coats",
  "powder-coatings": "Powder Coatings",
  "powder-clear": "Powder Clear",
  "candy-colors": "Candy Colors",
  freiflip: "FreiFlip",
  "other-supplies": "Other Supplies",
  primer: "Primer",
  ral: "RAL",
  gunwash: "GunWash",
  miscellaneous: "Miscellaneous",
};
