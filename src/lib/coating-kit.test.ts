import { describe, expect, it } from "vitest";
import { isVariantAvailable, isVariantPurchasable, recommendedLayers, variantLabel, type KitLayer, type KitVariant } from "./coating-kit";

const base: KitVariant = { id: "1", size: 1, unit: "L", inventory: 3, status: "active", price: null };

describe("variantLabel", () => {
  it("formats size and unit", () => {
    expect(variantLabel(base)).toBe("1L");
    expect(variantLabel({ ...base, size: 0.5 })).toBe("0.5L");
  });
});

describe("isVariantAvailable", () => {
  it("requires active status and positive inventory", () => {
    expect(isVariantAvailable(base)).toBe(true);
    expect(isVariantAvailable({ ...base, inventory: 0 })).toBe(false);
    expect(isVariantAvailable({ ...base, status: "draft" })).toBe(false);
    expect(isVariantAvailable({ ...base, status: null })).toBe(false);
  });
});

describe("isVariantPurchasable", () => {
  it("needs a real price and stock", () => {
    expect(isVariantPurchasable(base)).toBe(false);
    expect(isVariantPurchasable({ ...base, price: 20 })).toBe(true);
    expect(isVariantPurchasable({ ...base, price: 20, inventory: 0 })).toBe(false);
  });
});

describe("recommendedLayers", () => {
  const mk = (o: number, code: string): KitLayer => ({ layerOrder: o, role: "r", product: { id: code, name: code, colorCode: code }, variants: [] });
  it("excludes the current product and keeps layer order", () => {
    const out = recommendedLayers([mk(3, "PY1005BR999D"), mk(2, "WO1838MAU07A"), mk(1, "PB6005AR701C")], "WO1838MAU07A");
    expect(out.map((l) => l.product.colorCode)).toEqual(["PB6005AR701C", "PY1005BR999D"]);
  });
});
