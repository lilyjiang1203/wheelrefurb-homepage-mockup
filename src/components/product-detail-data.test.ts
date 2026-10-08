import { describe, expect, it } from "vitest";
import { audiProduct } from "./product-detail-data";

describe("Audi product verification rules", () => {
  it("keeps the supplied formula and OEM code", () => {
    expect(audiProduct.metafields.formulaCode).toBe("W01838MAU07A");
    expect(audiProduct.metafields.oemCode).toBe("LV7D");
  });
  it("offers only the four supplied package options", () => {
    expect(audiProduct.variants.map((v) => v.packageSize)).toEqual(["Sample / Touch Up", "Half Liter", "One Liter", "5 Liter Value Pack"]);
  });
  it("does not invent prices, package SKUs or inventory", () => {
    expect(audiProduct.variants.every((v) => v.price === null && v.sku === null && v.inventory === null)).toBe(true);
  });
  it("keeps unverified coating specifications empty", () => {
    expect([audiProduct.metafields.technology, audiProduct.metafields.subtype, audiProduct.metafields.layer, audiProduct.metafields.finishType, audiProduct.metafields.glossLevel]).toEqual([null, null, null, null, null]);
  });
  it("does not claim compatible products", () => {
    expect(audiProduct.references.compatiblePrimers).toEqual([]);
    expect(audiProduct.references.compatibleBaseCoats).toEqual([]);
    expect(audiProduct.references.compatibleClearCoats).toEqual([]);
  });
  it("keeps document downloads unavailable until files are supplied", () => {
    expect(audiProduct.documents.map((d) => d.url)).toEqual([null, null]);
  });
});