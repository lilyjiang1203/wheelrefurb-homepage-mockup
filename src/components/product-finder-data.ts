import paintImage from "../assets/product-wheel-paint.jpg";
import primerImage from "../assets/product-primer-kit.jpg";
import clearImage from "../assets/product-clear-coat.jpg";
import prepImage from "../assets/category-other-supplies.jpg";

export type VehicleDetails = { make: string; model: string; year: string; wheel: string; style: string; code: string };
export const emptyVehicle: VehicleDetails = { make: "", model: "", year: "", wheel: "", style: "", code: "" };

/** Mock OEM wheel-finish mapping table. Mirrors the future database:
 * Make | Model | Year Range | Wheel Size | Wheel Style / ID | OEM Finish | Wheel Paint Product */
export type OemWheelRecord = {
  make: string; model: string; year_from: number; year_to: number; wheel_size: string;
  wheel_style: string; oem_finish: string; oem_color_code: string; swatch: string; wheel_paint_product: string;
};
export const oemWheelRecords: OemWheelRecord[] = [
  { make: "BMW / MINI", model: "3 Series", year_from: 2021, year_to: 2022, wheel_size: '18"', wheel_style: "Style 790M", oem_finish: "Ferric Grey", oem_color_code: "MOCK-BMW-FG", swatch: "#5f6266", wheel_paint_product: "FreiLack Wheel Paint — Ferric Grey" },
  { make: "BMW / MINI", model: "3 Series", year_from: 2021, year_to: 2022, wheel_size: '19"', wheel_style: "Style 791M", oem_finish: "Silver", oem_color_code: "MOCK-BMW-SV", swatch: "#c4c7cb", wheel_paint_product: "FreiLack Wheel Paint — Silver" },
  { make: "BMW / MINI", model: "3 Series", year_from: 2021, year_to: 2022, wheel_size: '19"', wheel_style: "Style 792M", oem_finish: "Jet Black", oem_color_code: "MOCK-BMW-JB", swatch: "#1d1e20", wheel_paint_product: "FreiLack Wheel Paint — Jet Black" },
  { make: "BMW / MINI", model: "5 Series", year_from: 2020, year_to: 2023, wheel_size: '19"', wheel_style: "Style 845M", oem_finish: "Orbit Grey", oem_color_code: "MOCK-BMW-OG", swatch: "#6c6f73", wheel_paint_product: "FreiLack Wheel Paint — Orbit Grey" },
  { make: "Audi", model: "Q5", year_from: 2020, year_to: 2023, wheel_size: '20"', wheel_style: "Style Q5-20A", oem_finish: "Graphite Grey", oem_color_code: "MOCK-AUDI-GG", swatch: "#4a4d51", wheel_paint_product: "FreiLack Wheel Paint — Graphite Grey" },
  { make: "Audi", model: "A4", year_from: 2020, year_to: 2024, wheel_size: '18"', wheel_style: "Style A4-18S", oem_finish: "Brilliant Silver", oem_color_code: "MOCK-AUDI-BS", swatch: "#cfd2d6", wheel_paint_product: "FreiLack Wheel Paint — Brilliant Silver" },
  { make: "Mercedes-Benz", model: "C-Class", year_from: 2022, year_to: 2024, wheel_size: '18"', wheel_style: "Style C-18T", oem_finish: "Tremolite Grey", oem_color_code: "MOCK-MB-TG", swatch: "#77797c", wheel_paint_product: "FreiLack Wheel Paint — Tremolite Grey" },
  { make: "Porsche", model: "911", year_from: 2020, year_to: 2024, wheel_size: '20"', wheel_style: "Style 911-C20", oem_finish: "Platinum Satin", oem_color_code: "MOCK-POR-PS", swatch: "#9a9894", wheel_paint_product: "FreiLack Wheel Paint — Platinum Satin" },
  { make: "Tesla", model: "Model 3", year_from: 2021, year_to: 2023, wheel_size: '18"', wheel_style: "Aero 18", oem_finish: "Aero Silver", oem_color_code: "MOCK-TES-AS", swatch: "#b8bbbf", wheel_paint_product: "FreiLack Wheel Paint — Aero Silver" },
  { make: "Toyota", model: "RAV4", year_from: 2019, year_to: 2024, wheel_size: '19"', wheel_style: "Style RAV-19X", oem_finish: "Dark Gunmetal", oem_color_code: "MOCK-TOY-DG", swatch: "#3f4245", wheel_paint_product: "FreiLack Wheel Paint — Dark Gunmetal" },
  { make: "Volkswagen", model: "Golf", year_from: 2020, year_to: 2024, wheel_size: '17"', wheel_style: "Style Dallas", oem_finish: "Sterling Silver", oem_color_code: "MOCK-VW-SS", swatch: "#bfc2c5", wheel_paint_product: "FreiLack Wheel Paint — Sterling Silver" },
];
const uniq = (values: string[]) => [...new Set(values)];
type Filter = { make?: string | undefined; model?: string | undefined; year?: string | undefined; wheel?: string | undefined };
export function filterRecords(f: Filter) {
  return oemWheelRecords.filter((r) => (!f.make || r.make === f.make) && (!f.model || r.model === f.model)
    && (!f.year || (Number(f.year) >= r.year_from && Number(f.year) <= r.year_to)) && (!f.wheel || r.wheel_size === f.wheel));
}
export const makeOptions = ["BMW / MINI", "Audi", "Mercedes-Benz", "Porsche", "Tesla", "Toyota", "Volkswagen"];
export const modelOptions = (make: string) => uniq(filterRecords({ make }).map((r) => r.model));
export const yearOptions = (make: string, model: string) => uniq(filterRecords({ make, model }).flatMap((r) => Array.from({ length: r.year_to - r.year_from + 1 }, (_, i) => String(r.year_to - i)))).sort().reverse();
export const sizeOptions = (v: Filter) => uniq(filterRecords({ make: v.make, model: v.model, year: v.year }).map((r) => r.wheel_size)).sort();
export const findRecord = (v: VehicleDetails) => filterRecords(v).find((r) => r.wheel_style === v.style);
export type FinderProduct = {
  id: string; name: string; product_role: string; requirement_level: "Recommended" | "Required" | "Optional";
  description: string; image: string; coating_process: string; project_type: string; finish_family: string;
  vehicle_brand: string; vehicle_model: string; vehicle_year: string; oem_color_code: string;
  system_group: string; compatible_products: string[];
};
export function createMockSystem(vehicle: VehicleDetails): FinderProduct[] {
  const brand = vehicle.make || "Sample";
  const record = findRecord(vehicle);
  const code = vehicle.code.trim() || record?.oem_color_code || `${brand.toUpperCase()}-XYZ-001`;
  const shared = { coating_process: "Liquid Paint", project_type: "oem_restore", finish_family: "Silver", vehicle_brand: brand, vehicle_model: vehicle.model, vehicle_year: vehicle.year, oem_color_code: code, system_group: "demo-oem-silver", compatible_products: ["primer", "color", "clear", "prep"] };
  return [
    { ...shared, id: "primer", name: "Wheel Refinishing Primer", product_role: "Primer", requirement_level: "Recommended", description: "Creates an even base for the color coat and helps it adhere to the prepared surface.", image: primerImage },
    { ...shared, id: "color", name: record?.wheel_paint_product ?? `${brand} OEM Silver Wheel Paint`, product_role: "Color Coat", requirement_level: "Required", description: "The matched silver color coat for the original factory-style appearance in this example system.", image: paintImage },
    { ...shared, id: "clear", name: "Professional Wheel Clear Coat", product_role: "Clear Coat", requirement_level: "Required", description: "Protects the color coat and provides the final gloss finish.", image: clearImage },
    { ...shared, id: "prep", name: "Surface Prep Cleaner", product_role: "Preparation / Other Supplies", requirement_level: "Optional", description: "Helps remove surface contamination before refinishing. Shown with example preparation supplies.", image: prepImage },
  ];
}