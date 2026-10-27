import { useEffect, useState } from "react";

// Read-only access to the wheelrefurb-shopify project (publishable key, public by design).
const URL_BASE = "https://unlygyqhgeujetjphrro.supabase.co";
const KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";

export type KitVariant = {
  id: string;
  size: number;
  unit: string;
  inventory: number;
  status: string | null;
};

export type KitLayer = {
  layerOrder: number;
  role: string;
  product: { id: string; name: string; colorCode: string };
  variants: KitVariant[];
};

export type KitState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "none" }
  | { status: "ready"; systemName: string; description: string | null; layers: KitLayer[] };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, { headers: { apikey: KEY } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchCoatingKit(colorCode: string): Promise<KitState> {
  const products = await get<{ id: string }[]>(
    `products?select=id&color_code=eq.${encodeURIComponent(colorCode)}&limit=1`,
  );
  const productId = products[0]?.id;
  if (!productId) return { status: "none" };

  const memberships = await get<{ coating_system_id: string }[]>(
    `coating_system_products?select=coating_system_id&product_id=eq.${productId}&order=layer_order.asc&limit=1`,
  );
  const systemId = memberships[0]?.coating_system_id;
  if (!systemId) return { status: "none" };

  const rows = await get<
    {
      layer_order: number;
      role: string | null;
      coating_systems: { system_name: string; description: string | null } | null;
      products: { id: string; product_name: string; color_code: string } | null;
    }[]
  >(
    `coating_system_products?select=layer_order,role,coating_systems(system_name,description),products(id,product_name,color_code)&coating_system_id=eq.${systemId}&order=layer_order.asc`,
  );

  const layers: KitLayer[] = rows
    .filter((r) => r.products !== null)
    .map((r) => ({
      layerOrder: r.layer_order,
      role: r.role ?? `Layer ${r.layer_order}`,
      product: {
        id: r.products!.id,
        name: r.products!.product_name,
        colorCode: r.products!.color_code,
      },
      variants: [],
    }));
  if (!layers.length) return { status: "none" };

  const ids = layers.map((l) => l.product.id).join(",");
  const variants = await get<
    { id: string; product_id: string; size: number; unit: string | null; inventory_quantity: number | null; status: string | null }[]
  >(`product_variants?select=id,product_id,size,unit,inventory_quantity,status&product_id=in.(${ids})&order=size.asc`);

  for (const layer of layers) {
    layer.variants = variants
      .filter((v) => v.product_id === layer.product.id)
      .map((v) => ({
        id: v.id,
        size: v.size,
        unit: v.unit ?? "L",
        inventory: v.inventory_quantity ?? 0,
        status: v.status,
      }));
  }

  const system = rows[0]?.coating_systems;
  return {
    status: "ready",
    systemName: system?.system_name ?? "Coating system",
    description: system?.description ?? null,
    layers,
  };
}

export function useCoatingKit(colorCode: string): KitState {
  const [state, setState] = useState<KitState>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    fetchCoatingKit(colorCode)
      .then((kit) => alive && setState(kit))
      .catch(() => alive && setState({ status: "error" }));
    return () => {
      alive = false;
    };
  }, [colorCode]);
  return state;
}

export function variantLabel(v: KitVariant): string {
  return `${v.size}${v.unit}`;
}

export function isVariantAvailable(v: KitVariant): boolean {
  return v.status === "active" && v.inventory > 0;
}
