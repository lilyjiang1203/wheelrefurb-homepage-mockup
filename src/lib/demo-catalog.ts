// Read-only client for the external "wheelrefurb-demo" database.
// Uses only the public publishable key; the database grants SELECT only, so
// this client can never insert, update or delete records.
import { createClient } from "@supabase/supabase-js";

const DEMO_URL = "https://ftwujzvsdymfcbqyjxci.supabase.co";
const DEMO_PUBLISHABLE_KEY = "sb_publishable_QbF4mNg-JnNpAqEYYNpcdw_wO613Xnb";

let client: ReturnType<typeof createClient> | null = null;
function demoDb() {
  client ??= createClient(DEMO_URL, DEMO_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, storageKey: "wheelrefurb-demo-readonly" },
  });
  return client;
}

export type DemoProduct = {
  id: number;
  product_name: string;
  brand: string | null;
  coating_type: string | null;
  coating_layer: string | null;
  liquid_type: string | null;
  finish: string | null;
  gloss_level: string | null;
  clear_coat_type: string | null;
  product_url: string | null;
  color_name: string | null;
  color_family: string | null;
  oem_brand: string | null;
  oem_color_code: string | null;
  formula_code: string | null;
};
export type DemoVehicle = { id: number; brand: string; model: string; year: number };
export type DemoSystem = { id: number; system_name: string; finish_type: string | null; description: string | null };
export type DemoLayer = { id: number; layer_order: number; coating_role: string | null; product: DemoProduct | null };

const productCols = "id,product_name,brand,coating_type,coating_layer,liquid_type,finish,gloss_level,clear_coat_type,product_url,color_name,color_family,oem_brand,oem_color_code,formula_code";

function unwrap<T>(res: { data: unknown; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as T;
}

export async function fetchVehicles(): Promise<DemoVehicle[]> {
  return unwrap(await demoDb().from("vehicles").select("id,brand,model,year").order("brand").order("model").order("year"));
}

export async function fetchVehicleProducts(vehicleId: number): Promise<DemoProduct[]> {
  const rows = unwrap<{ product: DemoProduct | null }[]>(
    await demoDb().from("vehicle_product_matches").select(`product:products(${productCols})`).eq("vehicle_id", vehicleId),
  );
  return rows.map((r) => r.product).filter((p): p is DemoProduct => p !== null);
}

export async function fetchProducts(): Promise<DemoProduct[]> {
  return unwrap(await demoDb().from("products").select(productCols).order("product_name"));
}

export async function fetchSystems(): Promise<DemoSystem[]> {
  return unwrap(await demoDb().from("coating_systems").select("id,system_name,finish_type,description").order("id"));
}

export async function fetchSystemLayers(systemId: number): Promise<DemoLayer[]> {
  const rows = unwrap<DemoLayer[]>(
    await demoDb().from("coating_system_products").select(`id,layer_order,coating_role,product:products(${productCols})`).eq("system_id", systemId).order("layer_order"),
  );
  return sortLayers(rows);
}

// ---- pure helpers (tested) ----
export const sortLayers = (layers: DemoLayer[]) => [...layers].sort((a, b) => a.layer_order - b.layer_order);

export const uniqueSorted = (values: (string | number | null | undefined)[]) =>
  [...new Set(values.filter((v): v is string | number => v !== null && v !== undefined && v !== "").map(String))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

export type ProductFilters = { colorFamily: string; finish: string; coatingType: string };
export const filterProducts = (products: DemoProduct[], f: ProductFilters) =>
  products.filter((p) => (!f.colorFamily || p.color_family === f.colorFamily) && (!f.finish || p.finish === f.finish) && (!f.coatingType || p.coating_type === f.coatingType));

// Product Detail Pages that actually exist in this site.
export const EXISTING_PRODUCT_ROUTES = ["/products/audi-anthracite-lv7d"] as const;
export const existingProductRoute = (url: string | null) =>
  EXISTING_PRODUCT_ROUTES.find((r) => r === url) ?? null;
