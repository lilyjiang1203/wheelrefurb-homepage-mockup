import { describe, expect, it } from "vitest";
import { existingProductRoute, filterProducts, sortLayers, type DemoProduct } from "./demo-catalog";

const p = (o: Partial<DemoProduct>): DemoProduct => ({ id: 1, product_name: "x", brand: null, coating_type: null, coating_layer: null, liquid_type: null, finish: null, gloss_level: null, clear_coat_type: null, product_url: null, color_name: null, color_family: null, oem_brand: null, oem_color_code: null, formula_code: null, ...o });

describe("demo catalog", () => {
  it("filters by color family, finish and coating type together", () => {
    const list = [p({ id: 1, color_family: "Black", finish: "Solid", coating_type: "Powder" }), p({ id: 2, color_family: "Black", finish: "Metallic", coating_type: "Powder" })];
    expect(filterProducts(list, { colorFamily: "Black", finish: "Solid", coatingType: "Powder" }).map((x) => x.id)).toEqual([1]);
  });
  it("orders coating system layers by layer_order", () => {
    expect(sortLayers([{ id: 4, layer_order: 2, coating_role: "Clear", product: null }, { id: 3, layer_order: 1, coating_role: "Base", product: null }]).map((l) => l.layer_order)).toEqual([1, 2]);
  });
  it("only links product pages that exist", () => {
    expect(existingProductRoute("/products/audi-anthracite-lv7d")).toBe("/products/audi-anthracite-lv7d");
    expect(existingProductRoute("/products/demo-gloss-black-powder")).toBeNull();
  });
});

import { sanitizeCode } from "./demo-catalog";
describe("color code search", () => {
  it("strips characters that could alter the query filter", () => {
    expect(sanitizeCode(" LV7D,(x)%* ")).toBe("LV7Dx");
  });
});
