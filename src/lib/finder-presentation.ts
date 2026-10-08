import { audiProduct } from "../components/product-detail-data";
import type { DemoProduct } from "./demo-catalog";

export type FinderInquiry = "color-assistance" | "custom-finish-assistance";
export type FinderContactSearch = { inquiry?: FinderInquiry; finish?: string | undefined; coating?: string | undefined; family?: string | undefined; system?: string | undefined };

export function parseFinderContactSearch(search: Record<string, unknown>): FinderContactSearch {
  const inquiry = search["inquiry"];
  if (inquiry !== "color-assistance" && inquiry !== "custom-finish-assistance") return {};
  const text = (key: string) => typeof search[key] === "string" ? search[key].trim().slice(0, 200) : undefined;
  return { inquiry, finish: text("finish"), coating: text("coating"), family: text("family"), system: text("system") };
}

export function finderInquiryMessage(search: FinderContactSearch): string {
  if (!search.inquiry) return "";
  const title = search.inquiry === "color-assistance" ? "Color Assistance" : "Custom Finish Assistance";
  const selections = [["Finish", search.finish], ["Coating Type", search.coating], ["Color Family", search.family], ["Demo System", search.system]];
  return [`Inquiry: ${title}`, ...selections.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`), "", "I'd like help finding the right finish for my wheels."].join("\n");
}

/** Identity match only: never assign photography by coating type or approximate name. */
export function verifiedFinderImages(product: DemoProduct): string[] {
  if (product.oem_brand?.trim().toLowerCase() !== "audi" || product.oem_color_code?.trim().toUpperCase() !== "LV7D" || product.formula_code?.trim().toUpperCase() !== "W01838MAU07A") return [];
  return [audiProduct.product.images.front, audiProduct.product.images.back];
}