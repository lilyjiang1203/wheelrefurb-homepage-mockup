import { useEffect, useState } from "react";

// Sandbox-only read access. Product records remain in their existing canonical tables.
const BASE = "https://unlygyqhgeujetjphrro.supabase.co";
const KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";

type SandboxRecord = {
  product_id: string;
  primary_collection_id: string | null;
  display_order: number | null;
  is_featured: boolean;
  demo_note: string | null;
};
type ProductRecord = {
  id: string;
  product_name: string;
  color_name: string | null;
  color_code: string | null;
  finish: string | null;
  color_family: string[] | null;
};
type CollectionRecord = {
  collection_id: string;
  collection_name: string;
  collection_type: string | null;
  display_order: number;
};
type MediaRecord = {
  product_id: string;
  bucket_name: string;
  storage_path: string;
  media_role: string;
};
type VariantRecord = {
  product_id: string;
  size: number;
  unit: string;
  price: number | null;
  currency_code: string | null;
};

export type SandboxProduct = ProductRecord & {
  collectionId: string | null;
  featured: boolean;
  demoNote: string | null;
  imageUrl: string | null;
  price1L: string | null;
};
export type SandboxCollection = CollectionRecord;
type CatalogData = { products: SandboxProduct[]; collections: SandboxCollection[] };
export type SandboxCatalogState =
  | { status: "loading"; data: null }
  | { status: "error"; data: null }
  | { status: "ready"; data: CatalogData };

async function read<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}/rest/v1/${path}`, { headers: { apikey: KEY } });
  if (!response.ok) throw new Error(`Sandbox catalog load failed (${response.status})`);
  return response.json() as Promise<T>;
}

function publicStorageUrl(row: MediaRecord): string {
  const path = row.storage_path.split("/").map(encodeURIComponent).join("/");
  return `${BASE}/storage/v1/object/public/${encodeURIComponent(row.bucket_name)}/${path}`;
}
export async function fetchSandboxCatalog(): Promise<CatalogData> {
  const [selected, collections] = await Promise.all([
    read<SandboxRecord[]>("sandbox_products?select=product_id,primary_collection_id,display_order,is_featured,demo_note&is_visible=eq.true&order=display_order.asc"),
    read<CollectionRecord[]>("sandbox_collection_navigation?select=collection_id,collection_name,collection_type,display_order&is_visible=eq.true&order=display_order.asc"),
  ]);
  if (!selected.length) return { products: [], collections };
  const ids = selected.map((p) => p.product_id).join(",");
  const [products, media, variants] = await Promise.all([
    read<ProductRecord[]>(`products?select=id,product_name,color_name,color_code,finish,color_family&id=in.(${ids})`),
    read<MediaRecord[]>(`product_media?select=product_id,bucket_name,storage_path,media_role&product_id=in.(${ids})&media_role=eq.front`),
    read<VariantRecord[]>(`product_variants?select=product_id,size,unit,price,currency_code&product_id=in.(${ids})&size=eq.1&unit=eq.L`),
  ]);
  const details = new Map(products.map((p) => [p.id, p]));
  const fronts = new Map(media.map((m) => [m.product_id, publicStorageUrl(m)]));
  const oneL = new Map(variants.map((v) => [v.product_id, v]));
  const display = selected.flatMap((s): SandboxProduct[] => {
    const product = details.get(s.product_id);
    if (!product) return [];
    const variant = oneL.get(s.product_id);
    const price1L = variant?.price != null && variant.currency_code === "USD"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(variant.price)) + " USD"
      : null;
    return [{
      ...product,
      collectionId: s.primary_collection_id,
      featured: s.is_featured,
      demoNote: s.demo_note,
      imageUrl: fronts.get(s.product_id) ?? null,
      price1L,
    }];
  });
  return { products: display, collections };
}

export function useSandboxCatalog(): SandboxCatalogState {
  const [state, setState] = useState<SandboxCatalogState>({ status: "loading", data: null });
  useEffect(() => {
    let active = true;
    fetchSandboxCatalog()
      .then((data) => { if (active) setState({ status: "ready", data }); })
      .catch(() => { if (active) setState({ status: "error", data: null }); });
    return () => { active = false; };
  }, []);
  return state;
}
