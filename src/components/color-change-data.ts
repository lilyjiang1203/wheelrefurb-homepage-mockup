/** Mock catalogue for C2 "Change My Wheel Color". Field names mirror future Shopify metafields:
 * project_type, product_role, finish_family, coating_process, system_group, compatible_products, requirement_level.
 * All names, swatches and systems are sample data, not real products. */
import paintImage from "../assets/product-wheel-paint.jpg";
import powderImage from "../assets/product-powder-coating.jpg";
import primerImage from "../assets/product-primer-kit.jpg";
import clearImage from "../assets/product-clear-coat.jpg";
import prepImage from "../assets/category-other-supplies.jpg";

export type FinishFamily = "standard" | "RAL" | "candy" | "special_effect";
export type CoatingProcess = "liquid" | "powder";
export type Requirement = "Required" | "Recommended" | "Optional";

export const processLabel: Record<CoatingProcess, string> = { liquid: "Liquid Paint", powder: "Powder Coating" };

export const finishOptions: { id: FinishFamily; title: string; description: string; swatch: string }[] = [
  { id: "standard", title: "Standard / Solid Color", description: "A clean, single-color wheel finish.", swatch: "linear-gradient(135deg,#2b2d31,#4a4d52)" },
  { id: "RAL", title: "RAL Color", description: "Choose from standardized RAL color options.", swatch: "conic-gradient(#0e0e10 0 33%,#383e42 0 66%,#f1f0ea 0)" },
  { id: "candy", title: "Candy Color", description: "A deep, vibrant custom color effect.", swatch: "radial-gradient(circle at 35% 30%,#ff6b6b,#a3000f 55%,#3a0006)" },
  // backend may later map special_effect to the Freiflip collection; never shown to the customer first
  { id: "special_effect", title: "Special Effect / Color-Shifting", description: "A finish that changes appearance depending on light or viewing angle.", swatch: "linear-gradient(135deg,#2d6cdf,#7b3fe4 45%,#1fb5a8 75%,#d9a400)" },
];
export const finishLabel = (id: FinishFamily) => finishOptions.find((f) => f.id === id)?.title ?? id;

export type ColorProduct = {
  id: string; color: string; name: string; swatch: string; description: string;
  project_type: "color_change"; product_role: "Color Coat"; finish_family: FinishFamily; coating_process: CoatingProcess; system_group: string;
};
const cp = (p: Omit<ColorProduct, "project_type" | "product_role">): ColorProduct => ({ ...p, project_type: "color_change", product_role: "Color Coat" });

export const colorProducts: ColorProduct[] = [
  cp({ id: "std-black-l", color: "Gloss Black", name: "Solid Wheel Paint — Gloss Black", swatch: "#141517", description: "Deep single-stage black for a clean, classic look.", finish_family: "standard", coating_process: "liquid", system_group: "liquid-solid" }),
  cp({ id: "std-gunmetal-l", color: "Gunmetal Grey", name: "Solid Wheel Paint — Gunmetal Grey", swatch: "#4a4d52", description: "Dark metallic grey that hides brake dust well.", finish_family: "standard", coating_process: "liquid", system_group: "liquid-solid" }),
  cp({ id: "std-white-p", color: "Satin White", name: "Wheel Powder — Satin White", swatch: "#eceae4", description: "Durable satin white powder for a modern finish.", finish_family: "standard", coating_process: "powder", system_group: "powder-solid" }),
  cp({ id: "std-bronze-p", color: "Matte Bronze", name: "Wheel Powder — Matte Bronze", swatch: "#7a5a36", description: "Warm bronze with a low-sheen matte texture.", finish_family: "standard", coating_process: "powder", system_group: "powder-solid" }),
  cp({ id: "ral-9005", color: "RAL 9005 Jet Black", name: "RAL Powder — 9005 Jet Black", swatch: "#0e0e10", description: "Standardized jet black powder coating.", finish_family: "RAL", coating_process: "powder", system_group: "powder-ral" }),
  cp({ id: "ral-7016", color: "RAL 7016 Anthracite Grey", name: "RAL Powder — 7016 Anthracite Grey", swatch: "#383e42", description: "Popular anthracite grey, standardized RAL shade.", finish_family: "RAL", coating_process: "powder", system_group: "powder-ral" }),
  cp({ id: "ral-9016", color: "RAL 9016 Traffic White", name: "RAL Powder — 9016 Traffic White", swatch: "#f1f0ea", description: "Bright, clean standardized white.", finish_family: "RAL", coating_process: "powder", system_group: "powder-ral" }),
  cp({ id: "candy-red", color: "Candy Red", name: "Candy Red Wheel Coating", swatch: "radial-gradient(circle at 35% 30%,#ff6b6b,#a3000f 55%,#3a0006)", description: "Translucent red over a bright base for a deep glow.", finish_family: "candy", coating_process: "liquid", system_group: "liquid-candy" }),
  cp({ id: "candy-blue", color: "Candy Blue", name: "Candy Blue Wheel Coating", swatch: "radial-gradient(circle at 35% 30%,#6fa8ff,#0b3fb0 55%,#03133d)", description: "Rich translucent blue with strong depth.", finish_family: "candy", coating_process: "liquid", system_group: "liquid-candy" }),
  cp({ id: "candy-gold", color: "Candy Gold", name: "Candy Gold Wheel Coating", swatch: "radial-gradient(circle at 35% 30%,#ffe08a,#b8860b 55%,#4a3300)", description: "Warm gold candy layer for a custom look.", finish_family: "candy", coating_process: "liquid", system_group: "liquid-candy" }),
  cp({ id: "fx-blue-violet", color: "Blue–Violet Shift", name: "Color-Shift Effect Coat — Blue / Violet", swatch: "linear-gradient(135deg,#2d6cdf,#7b3fe4)", description: "Shifts from blue to violet as the light moves.", finish_family: "special_effect", coating_process: "liquid", system_group: "liquid-effect" }),
];

type SystemItem = { id: string; role: string; name: string; description: string; image: string; requirement_level: Requirement; coating_process: string };
export type SystemProduct = SystemItem;

const item = (id: string, role: string, name: string, description: string, image: string, requirement_level: Requirement, coating_process: string): SystemItem => ({ id, role, name, description, image, requirement_level, coating_process });

/** system_group → ordered compatible_products. "COLOR" is replaced by the chosen color product. Lengths differ on purpose. */
const systems: Record<string, (SystemItem | "COLOR")[]> = {
  "liquid-solid": [item("prep", "Surface Prep / Cleaner", "Wheel Prep Cleaner", "Removes grease and residue before coating.", prepImage, "Recommended", "Liquid Paint"), item("primer", "Primer", "Wheel Refinishing Primer", "Even base that helps the color coat adhere.", primerImage, "Recommended", "Liquid Paint"), "COLOR", item("clear", "Clear Coat", "Professional Wheel Clear Coat", "Protects the color and sets the final gloss.", clearImage, "Required", "Liquid Paint")],
  "powder-solid": [item("prep", "Surface Prep / Cleaner", "Pre-Treatment Cleaner", "Prepares bare metal for powder adhesion.", prepImage, "Required", "Powder Coating"), "COLOR"],
  "powder-ral": [item("primer", "Primer", "Powder Primer", "Anti-corrosion powder base layer.", powderImage, "Recommended", "Powder Coating"), "COLOR", item("clear", "Clear Coat", "Clear Powder Topcoat", "Adds UV protection and gloss.", powderImage, "Optional", "Powder Coating")],
  "liquid-candy": [item("primer", "Primer", "Wheel Refinishing Primer", "Smooth foundation for the base coat.", primerImage, "Recommended", "Liquid Paint"), item("base", "Base / Ground Coat", "Bright Silver Ground Coat", "Reflective base that makes the candy glow.", paintImage, "Required", "Liquid Paint"), "COLOR", item("clear", "Clear Coat", "Professional Wheel Clear Coat", "Seals the candy layer with deep gloss.", clearImage, "Required", "Liquid Paint")],
  "liquid-effect": [item("base", "Base / Ground Coat", "Black Ground Coat", "Dark base that maximizes the color shift.", paintImage, "Required", "Liquid Paint"), "COLOR", item("clear", "Clear Coat", "Professional Wheel Clear Coat", "Protects the effect layer.", clearImage, "Required", "Liquid Paint")],
};

export const processesFor = (family: FinishFamily): CoatingProcess[] =>
  (["liquid", "powder"] as CoatingProcess[]).filter((p) => colorProducts.some((c) => c.finish_family === family && c.coating_process === p));

/** project_type = color_change AND finish_family AND coating_process */
export const filterColors = (family: FinishFamily, process: CoatingProcess) =>
  colorProducts.filter((c) => c.project_type === "color_change" && c.finish_family === family && c.coating_process === process);

export function buildSystem(color: ColorProduct): SystemProduct[] {
  return (systems[color.system_group] ?? ["COLOR"]).map((s) => s === "COLOR"
    ? item(color.id, finishLabel(color.finish_family).startsWith("Candy") ? "Candy Color Coat" : "Color Coat", color.name, color.description, color.coating_process === "powder" ? powderImage : paintImage, "Required", processLabel[color.coating_process])
    : s);
}
