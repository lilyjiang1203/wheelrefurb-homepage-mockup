import paintImage from "../assets/product-wheel-paint.jpg";
import primerImage from "../assets/product-primer-kit.jpg";
import clearImage from "../assets/product-clear-coat.jpg";
import prepImage from "../assets/category-other-supplies.jpg";

export type VehicleDetails = { make: string; model: string; year: string; wheel: string; code: string };
export const vehicleModels: Record<string, string[]> = { BMW: ["3 Series", "5 Series", "X3"], Audi: ["A4", "A6", "Q5"], Mercedes: ["C-Class", "E-Class"], Volkswagen: ["Golf", "Tiguan"] };
export const years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];
export const wheelOptions = ['17" Alloy Wheel', '18" Alloy Wheel', '19" Alloy Wheel', '20" Alloy Wheel'];
export const emptyVehicle: VehicleDetails = { make: "", model: "", year: "", wheel: "", code: "" };
export type FinderProduct = {
  id: string; name: string; product_role: string; requirement_level: "Recommended" | "Required" | "Optional";
  description: string; image: string; coating_process: string; project_type: string; finish_family: string;
  vehicle_brand: string; vehicle_model: string; vehicle_year: string; oem_color_code: string;
  system_group: string; compatible_products: string[];
};
export function createMockSystem(vehicle: VehicleDetails): FinderProduct[] {
  const brand = vehicle.make || "Sample";
  const code = vehicle.code.trim() || `${brand.toUpperCase()}-XYZ-001`;
  const shared = { coating_process: "Liquid Paint", project_type: "oem_restore", finish_family: "Silver", vehicle_brand: brand, vehicle_model: vehicle.model, vehicle_year: vehicle.year, oem_color_code: code, system_group: "demo-oem-silver", compatible_products: ["primer", "color", "clear", "prep"] };
  return [
    { ...shared, id: "primer", name: "Wheel Refinishing Primer", product_role: "Primer", requirement_level: "Recommended", description: "Creates an even base for the color coat and helps it adhere to the prepared surface.", image: primerImage },
    { ...shared, id: "color", name: `${brand} OEM Silver Wheel Paint`, product_role: "Color Coat", requirement_level: "Required", description: "The matched silver color coat for the original factory-style appearance in this example system.", image: paintImage },
    { ...shared, id: "clear", name: "Professional Wheel Clear Coat", product_role: "Clear Coat", requirement_level: "Required", description: "Protects the color coat and provides the final gloss finish.", image: clearImage },
    { ...shared, id: "prep", name: "Surface Prep Cleaner", product_role: "Preparation / Other Supplies", requirement_level: "Optional", description: "Helps remove surface contamination before refinishing. Shown with example preparation supplies.", image: prepImage },
  ];
}