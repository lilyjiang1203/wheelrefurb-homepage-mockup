import { describe, expect, it } from "vitest";
import { isVariantAvailable, variantLabel, type KitVariant } from "./coating-kit";

const base: KitVariant = { id: "1", size: 1, unit: "L", inventory: 3, status: "active" };

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
