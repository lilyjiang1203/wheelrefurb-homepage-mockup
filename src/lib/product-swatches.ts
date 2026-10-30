import { useEffect, useState } from "react";

const URL_BASE = "https://unlygyqhgeujetjphrro.supabase.co";
const KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";

export type ProductSwatch = {
  id: string;
  price: number;
  isAvailable: boolean;
  inventory: number | null;
};

export type SwatchState =
  | { status: "loading"; swatch: null }
  | { status: "error"; swatch: null }
  | { status: "ready"; swatch: ProductSwatch | null };

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${URL_BASE}/rest/v1/${path}`, { headers: { apikey: KEY } });
  if (!response.ok) throw new Error(`Unable to load swatch: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function fetchProductSwatch(colorCode: string): Promise<ProductSwatch | null> {
  const products = await get<{ id: string }[]>(
    `products?select=id&color_code=eq.${encodeURIComponent(colorCode)}&limit=1`,
  );
  if (!products[0]) return null;
  const rows = await get<{
    id: string; price: number; is_available: boolean; inventory_quantity: number | null;
  }[]>(`product_swatches?select=id,price,is_available,inventory_quantity&product_id=eq.${products[0].id}&limit=1`);
  const row = rows[0];
  return row ? {
    id: row.id,
    price: Number(row.price),
    isAvailable: row.is_available,
    inventory: row.inventory_quantity,
  } : null;
}

export function useProductSwatch(colorCode: string): SwatchState {
  const [state, setState] = useState<SwatchState>({ status: "loading", swatch: null });
  useEffect(() => {
    let alive = true;
    setState({ status: "loading", swatch: null });
    fetchProductSwatch(colorCode)
      .then((swatch) => { if (alive) setState({ status: "ready", swatch }); })
      .catch(() => { if (alive) setState({ status: "error", swatch: null }); });
    return () => { alive = false; };
  }, [colorCode]);
  return state;
}
