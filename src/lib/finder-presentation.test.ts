import { describe, expect, it } from "vitest";
import { finderInquiryMessage, parseFinderContactSearch, verifiedFinderImages } from "./finder-presentation";
import { audiProduct } from "../components/product-detail-data";
import type { DemoProduct } from "./demo-catalog";

const product = { oem_brand: "Audi", oem_color_code: "LV7D", formula_code: "W01838MAU07A" } as DemoProduct;
describe("finder presentation rules", () => {
  it("reuses Audi Anthracite's actual product page swatches", () => {
    expect(verifiedFinderImages(product)).toEqual([audiProduct.product.images.front, audiProduct.product.images.back]);
  });
  it("does not assign Audi photography to other or unidentified products", () => {
    expect(verifiedFinderImages({ ...product, formula_code: null })).toEqual([]);
    expect(verifiedFinderImages({ ...product, oem_brand: "BMW" })).toEqual([]);
  });
  it("carries color assistance and previous selections to the existing message field", () => {
    expect(finderInquiryMessage(parseFinderContactSearch({ inquiry: "color-assistance", finish: "Metallic", coating: "Liquid", family: "Grey" }))).toContain("Inquiry: Color Assistance\nFinish: Metallic\nCoating Type: Liquid\nColor Family: Grey");
  });
  it("carries a selected demo system for custom finish assistance", () => {
    expect(finderInquiryMessage(parseFinderContactSearch({ inquiry: "custom-finish-assistance", system: "Demo Pearl System" }))).toContain("Inquiry: Custom Finish Assistance\nDemo System: Demo Pearl System");
  });
  it("ignores unrelated contact search parameters", () => {
    expect(finderInquiryMessage(parseFinderContactSearch({ inquiry: "unknown", finish: "Metallic" }))).toBe("");
  });
});