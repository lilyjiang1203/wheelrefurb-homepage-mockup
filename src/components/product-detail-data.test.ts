import { describe, expect, it } from "vitest";
import { audiProduct, availableDocuments, formatPrice, keyAttributes } from "./product-detail-data";

describe("Audi product verification rules", () => {
  it("keeps the supplied formula and OEM code", () => {
    expect(audiProduct.metafields.formulaCode).toBe("W01838MAU07A");
    expect(audiProduct.metafields.oemCode).toBe("LV7D");
  });
  it("offers the standard 0.5L, 1L and 5L packages", () => {
    expect(audiProduct.variants.map((v) => v.packageSize)).toEqual(["0.5L", "1L", "5L"]);
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
    expect(audiProduct.documents.map((d) => d.url)).toEqual([null, null, null]);
  });
  it("hides unverified key attributes", () => {
    expect(keyAttributes(audiProduct.metafields)).toEqual([["Color Family", "Grey"], ["OEM Brand", "Audi"]]);
  });
  it("shows no price until real pricing exists", () => {
    expect(formatPrice(null)).toBeNull();
  });
  it("hides download actions for missing documents", () => {
    expect(availableDocuments(audiProduct.documents)).toEqual([]);
  });
});
