import { useEffect, useState } from "react";

const BASE = "https://unlygyqhgeujetjphrro.supabase.co";
const API_KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type DetailRecord = {
  id: string; product_name: string; brand: string | null; color_name: string | null;
  color_code: string | null; color_family: string[] | null; finish: string | null;
  description: string | null; product_line: string | null; panel_number: string | null;
  technical_description: string | null; application_instructions: string | null;
};
export type DetailMedia = {
  id: string; media_type: string | null; media_role: string; alt_text: string | null;
  bucket_name: string; storage_path: string; display_order: number | null;
};
export type DetailVariant = {
  id: string; size: number; unit: string; price: number | null;
  currency_code: string | null; inventory_quantity: number | null; status: string;
};
export type DetailDocument = {
  id: string; document_type: string; document_title: string | null;
  language_code: string | null; bucket_name: string; storage_path: string;
};
export type DetailData = {
  product: DetailRecord; media: DetailMedia[]; variants: DetailVariant[];
  documents: DetailDocument[];
};
export type DetailState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error" }
  | { status: "ready"; data: DetailData };

async function read<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}/rest/v1/${path}`, { headers: { apikey: API_KEY } });
  if (!response.ok) throw new Error(`Product detail request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export function productStorageUrl(file: { bucket_name: string; storage_path: string }): string {
  return `${BASE}/storage/v1/object/public/${encodeURIComponent(file.bucket_name)}/${file.storage_path.split("/").map(encodeURIComponent).join("/")}`;
}

export async function fetchSandboxProductDetail(productId: string): Promise<DetailData | null> {
  if (!ID_RE.test(productId)) return null;
  // Only allow products specifically selected for public Sandbox preview.
  const visible = await read<{ product_id: string }[]>(
    `sandbox_products?select=product_id&product_id=eq.${productId}&is_visible=eq.true&limit=1`,
  );
  if (!visible.length) return null;
  const products = await read<DetailRecord[]>(
    `products?select=id,product_name,brand,color_name,color_code,color_family,finish,description,product_line,panel_number,technical_description,application_instructions&id=eq.${productId}&limit=1`,
  );
  if (!products[0]) return null;
  const [media, variants, documents] = await Promise.all([
    read<DetailMedia[]>(`product_media?select=id,media_type,media_role,alt_text,bucket_name,storage_path,display_order&product_id=eq.${productId}&order=display_order.asc`),
    read<DetailVariant[]>(`product_variants?select=id,size,unit,price,currency_code,inventory_quantity,status&product_id=eq.${productId}&order=size.asc`),
    read<DetailDocument[]>(`product_documents?select=id,document_type,document_title,language_code,bucket_name,storage_path&product_id=eq.${productId}`),
  ]);
  return { product: products[0], media, variants, documents };
}

export function useSandboxProductDetail(productId: string): DetailState {
  const [state, setState] = useState<DetailState>({ status: "loading" });
  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    void fetchSandboxProductDetail(productId)
      .then(data => { if (active) setState(data ? { status: "ready", data } : { status: "not-found" }); })
      .catch(() => { if (active) setState({ status: "error" }); });
    return () => { active = false; };
  }, [productId]);
  return state;
}
