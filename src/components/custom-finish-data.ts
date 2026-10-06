/** Mock catalogue for C3 "Create a Custom / Special Finish". Field names mirror future Shopify metafields:
 * project_type, effect_type, finish_family, coating_process, base_required, base_color, product_role,
 * system_group, compatible_products, requirement_level. All entries are sample data, not real products. */
import paintImage from "../assets/product-wheel-paint.jpg";
import powderImage from "../assets/product-powder-coating.jpg";
import primerImage from "../assets/product-primer-kit.jpg";
import clearImage from "../assets/product-clear-coat.jpg";

export type EffectType = "candy" | "color_shift" | "metallic_pearl" | "multi_layer";
export type Process = "liquid" | "powder";
export type BaseColor = "black" | "silver" | "white" | "custom";
export type Requirement = "Required" | "Recommended" | "Optional";
export const processLabel: Record<Process, string> = { liquid: "Liquid Paint", powder: "Powder Coating" };

export const effectOptions: { id: EffectType; title: string; description: string; swatch: string; processes: Process[]; base_required: boolean }[] = [
  { id: "candy", title: "Candy Finish", description: "A deep, vibrant, translucent color effect.", swatch: "radial-gradient(circle at 35% 30%,#ff6b6b,#a3000f 55%,#3a0006)", processes: ["liquid"], base_required: true },
  // may later map to the Freiflip collection; not shown to customers
  { id: "color_shift", title: "Color-Shifting Effect", description: "A finish that changes appearance depending on light and viewing angle.", swatch: "linear-gradient(135deg,#6a2bd9,#1fb57a 60%,#d9a400)", processes: ["liquid"], base_required: true },
  { id: "metallic_pearl", title: "Metallic / Pearl Effect", description: "A reflective or pearlescent finish with extra depth and visual texture.", swatch: "radial-gradient(circle at 30% 25%,#ffffff,#cfd3d8 35%,#7d838b 75%)", processes: ["liquid", "powder"], base_required: false },
  { id: "multi_layer", title: "Custom Multi-Layer Finish", description: "A more complex finish created using multiple coating layers.", swatch: "conic-gradient(from 45deg,#0b3fb0,#7b3fe4,#d9a400,#0b3fb0)", processes: ["liquid"], base_required: true },
];
export const effectLabel = (id: EffectType) => effectOptions.find((e) => e.id === id)?.title ?? id;

export const effectExamples: { label: string; effect: EffectType; swatch: string; text: string }[] = [
  { label: "Candy", effect: "candy", swatch: effectOptions[0]!.swatch, text: "A see-through color over a bright base — glows like candy apple red." },
  { label: "Color-Shifting", effect: "color_shift", swatch: effectOptions[1]!.swatch, text: "Changes color as you walk around the car, e.g. purple to green." },
  { label: "Metallic", effect: "metallic_pearl", swatch: "radial-gradient(circle at 30% 25%,#e9ebee,#6b7078 60%,#2b2e33)", text: "Fine metal flake that sparkles in direct light." },
  { label: "Pearl", effect: "metallic_pearl", swatch: "radial-gradient(circle at 30% 25%,#ffffff,#f1e8d8 40%,#c9bfae 80%)", text: "Soft, glowing shimmer with a subtle color tint." },
  { label: "Multi-Layer", effect: "multi_layer", swatch: effectOptions[3]!.swatch, text: "Several effects stacked — e.g. a color shift with a pearl top layer." },
];

export const baseOptions: { id: BaseColor; title: string; swatch: string }[] = [
  { id: "black", title: "Black Base", swatch: "#141517" },
  { id: "silver", title: "Silver Base", swatch: "radial-gradient(circle at 30% 25%,#f4f5f7,#a9aeb5 60%,#6d7279)" },
  { id: "white", title: "White Base", swatch: "#f1f0ea" },
  { id: "custom", title: "Custom Base", swatch: "conic-gradient(#c33,#3c3,#33c,#c33)" },
];

export type EffectProduct = {
  id: string; finish: string; name: string; swatch: string; description: string; project_type: "custom_finish";
  effect_type: EffectType; coating_process: Process; base_color: BaseColor | null; product_role: string; system_group: string;
};
const ep = (p: Omit<EffectProduct, "project_type">): EffectProduct => ({ ...p, project_type: "custom_finish" });

export const effectProducts: EffectProduct[] = [
  ep({ id: "candy-red", finish: "Candy Red", name: "Candy Coat — Red", swatch: "radial-gradient(circle at 35% 30%,#ff6b6b,#a3000f 55%,#3a0006)", description: "Rich red with a deep glow over silver.", effect_type: "candy", coating_process: "liquid", base_color: "silver", product_role: "Candy Color Coat", system_group: "candy" }),
  ep({ id: "candy-blue", finish: "Candy Blue", name: "Candy Coat — Blue", swatch: "radial-gradient(circle at 35% 30%,#6fa8ff,#0b3fb0 55%,#03133d)", description: "Ocean-deep blue over silver.", effect_type: "candy", coating_process: "liquid", base_color: "silver", product_role: "Candy Color Coat", system_group: "candy" }),
  ep({ id: "candy-gold", finish: "Candy Gold", name: "Candy Coat — Gold", swatch: "radial-gradient(circle at 35% 30%,#ffe08a,#b8860b 55%,#4a3300)", description: "Warm gold glow over silver.", effect_type: "candy", coating_process: "liquid", base_color: "silver", product_role: "Candy Color Coat", system_group: "candy" }),
  ep({ id: "candy-smoke", finish: "Candy Smoke", name: "Candy Coat — Smoke", swatch: "radial-gradient(circle at 35% 30%,#8a8f96,#2b2e33 60%,#0c0d0f)", description: "Moody tinted smoke over black.", effect_type: "candy", coating_process: "liquid", base_color: "black", product_role: "Candy Color Coat", system_group: "candy" }),
  ep({ id: "cs-purple-green", finish: "Purple-to-Green Color Shift", name: "Color-Shift Effect Coat — Purple / Green", swatch: "linear-gradient(135deg,#6a2bd9,#1fb57a)", description: "Shifts from purple to green as the angle changes.", effect_type: "color_shift", coating_process: "liquid", base_color: "black", product_role: "Color-Shifting Effect Coat", system_group: "color_shift" }),
  ep({ id: "cs-blue-violet", finish: "Blue-to-Violet Color Shift", name: "Color-Shift Effect Coat — Blue / Violet", swatch: "linear-gradient(135deg,#2d6cdf,#7b3fe4)", description: "Cool blue turning to violet in the light.", effect_type: "color_shift", coating_process: "liquid", base_color: "black", product_role: "Color-Shifting Effect Coat", system_group: "color_shift" }),
  ep({ id: "cs-bronze-gold", finish: "Bronze-to-Gold Color Shift", name: "Color-Shift Effect Coat — Bronze / Gold", swatch: "linear-gradient(135deg,#7a4a22,#d9a400)", description: "Warm bronze shifting to bright gold.", effect_type: "color_shift", coating_process: "liquid", base_color: "white", product_role: "Color-Shifting Effect Coat", system_group: "color_shift" }),
  ep({ id: "mp-silver-pearl", finish: "Silver Pearl", name: "Pearl Coat — Silver", swatch: "radial-gradient(circle at 30% 25%,#ffffff,#d9dce0 40%,#9aa0a8 80%)", description: "Bright silver with a soft pearl shimmer.", effect_type: "metallic_pearl", coating_process: "liquid", base_color: null, product_role: "Pearl Coat", system_group: "metallic_pearl" }),
  ep({ id: "mp-gold-pearl", finish: "Gold Pearl", name: "Pearl Coat — Gold", swatch: "radial-gradient(circle at 30% 25%,#fff4cf,#d8b45a 45%,#8a6a1f 85%)", description: "Champagne gold with pearlescent depth.", effect_type: "metallic_pearl", coating_process: "liquid", base_color: null, product_role: "Pearl Coat", system_group: "metallic_pearl" }),
  ep({ id: "mp-graphite", finish: "Graphite Metallic", name: "Metallic Powder — Graphite", swatch: "radial-gradient(circle at 30% 25%,#9aa0a8,#4a4d52 55%,#1d1e20)", description: "Dark graphite with fine metal flake.", effect_type: "metallic_pearl", coating_process: "powder", base_color: null, product_role: "Metallic Coat", system_group: "metallic_powder" }),
  ep({ id: "ml-galaxy", finish: "Midnight Galaxy", name: "Multi-Layer Effect Coat — Midnight Galaxy", swatch: "conic-gradient(from 45deg,#0b3fb0,#7b3fe4,#0b3fb0)", description: "Blue-violet shift topped with a fine pearl.", effect_type: "multi_layer", coating_process: "liquid", base_color: "black", product_role: "Effect Coat", system_group: "multi_layer" }),
  ep({ id: "ml-solar", finish: "Solar Flare", name: "Multi-Layer Effect Coat — Solar Flare", swatch: "conic-gradient(from 45deg,#d9a400,#c33a0b,#d9a400)", description: "Gold-to-copper shift with a warm pearl layer.", effect_type: "multi_layer", coating_process: "liquid", base_color: "black", product_role: "Effect Coat", system_group: "multi_layer" }),
];

export type SystemProduct = { id: string; role: string; name: string; description: string; image: string; requirement_level: Requirement; coating_process: string };
const it = (id: string, role: string, name: string, description: string, image: string, requirement_level: Requirement, coating_process = "Liquid Paint"): SystemProduct => ({ id, role, name, description, image, requirement_level, coating_process });
const baseCoat = (b: BaseColor | null, req: Requirement = "Required") => it("base", "Base / Ground Coat", `${b ? b[0]!.toUpperCase() + b.slice(1) : "Black"} Ground Coat`, "Sets the color underneath the effect layer.", paintImage, req);

/** system_group → ordered layers. "EFFECT" is replaced by the chosen product. Lengths differ on purpose. */
const systems: Record<string, (p: EffectProduct) => (SystemProduct | "EFFECT")[]> = {
  candy: (p) => [it("primer", "Primer", "Wheel Refinishing Primer", "Smooth foundation for the base coat.", primerImage, "Recommended"), baseCoat(p.base_color), "EFFECT", it("clear", "Clear Coat", "Professional Wheel Clear Coat", "Seals the candy layer with deep gloss.", clearImage, "Required")],
  color_shift: (p) => [baseCoat(p.base_color), "EFFECT", it("clear", "Clear Coat", "Professional Wheel Clear Coat", "Protects the effect layer.", clearImage, "Required")],
  metallic_pearl: () => [it("primer", "Primer", "Wheel Refinishing Primer", "Even base for the metallic layer.", primerImage, "Recommended"), "EFFECT", it("clear", "Clear Coat", "Professional Wheel Clear Coat", "Locks in the shimmer.", clearImage, "Required")],
  metallic_powder: () => ["EFFECT", it("clear", "Clear Coat", "Clear Powder Topcoat", "Adds UV protection and gloss.", powderImage, "Recommended", "Powder Coating")],
  multi_layer: (p) => [it("primer", "Primer", "Wheel Refinishing Primer", "Required foundation for a multi-layer build.", primerImage, "Required"), baseCoat(p.base_color), "EFFECT", it("pearl", "Secondary Effect / Pearl Coat", "Fine Pearl Overlay", "Adds a second shimmer layer over the effect.", paintImage, "Required"), it("clear", "Clear Coat", "Professional Wheel Clear Coat", "Protects all layers.", clearImage, "Required")],
};

/** project_type = custom_finish AND effect_type AND coating_process AND (base_color when required) */
export const filterEffects = (effect: EffectType, process: Process, base: BaseColor | null) =>
  effectProducts.filter((p) => p.effect_type === effect && p.coating_process === process && (base === null || p.base_color === base));

export function buildSystem(p: EffectProduct): SystemProduct[] {
  return (systems[p.system_group]?.(p) ?? ["EFFECT"]).map((s) => s === "EFFECT"
    ? it(p.id, p.product_role, p.name, p.description, p.coating_process === "powder" ? powderImage : paintImage, "Required", processLabel[p.coating_process])
    : s);
}
