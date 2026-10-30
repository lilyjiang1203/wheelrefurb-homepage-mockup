import { useEffect, useState } from "react";

// Public read-only access, matching the existing product documents integration.
const URL_BASE = "https://unlygyqhgeujetjphrro.supabase.co";
const KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";

export type PricedVariant = {
  id: string;
  packageSize: string;
  size: number;
  price: number | null;
  currency: string | null;
  status: string;
  inventory: number | null;
};

type PriceState =
  | { status: "loading"; variants: PricedVariant[] }
  | { status: "error"; variants: PricedVariant[] }
  | { status: "ready"; variants: PricedVariant[] };

type VariantRow = {
  id: string;
  size: number;
  unit: string;
  price: number | null;
  currency_code: string | null;
  status: string;
  inventory_quantity: number | null;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    headers: { apikey: KEY },
  });
  if (!response.ok) throw new Error(`Failed to load product pricing: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function fetchProductPrices(colorCode: string): Promise<PricedVariant[]> {
  const products = await fetchJson<{ id: string }[]>(
    `products?select=id&color_code=eq.${encodeURIComponent(colorCode)}&limit=1`,
  );
  if (!products.length) return [];

  const rows = await fetchJson<VariantRow[]>(
    `product_variants?select=id,size,unit,price,currency_code,status,inventory_quantity&product_id=eq.${products[0].id}&unit=eq.L&size=in.(0.03,0.5,1,5)&order=size.asc`,
  );

  return rows.map((row) => ({
    id: row.id,
    size: Number(row.size),
    packageSize: Number(row.size) === 0.03 ? "30 mL" : `${Number(row.size)} L`,
    price: row.price == null ? null : Number(row.price),
    currency: row.currency_code,
    status: row.status,
    inventory: row.inventory_quantity,
  }));
}

export function useProductPrices(colorCode: string): PriceState {
  const [state, setState] = useState<PriceState>({ status: "loading", variants: [] });
  useEffect(() => {
    let active = true;
    setState({ status: "loading", variants: [] });
    fetchProductPrices(colorCode)
      .then((variants) => {
        if (active) setState({ status: "ready", variants });
      })
      .catch(() => {
        if (active) setState({ status: "error", variants: [] });
      });
    return () => { active = false; };
  }, [colorCode]);
  return state;
}

export function formatVariantUsd(variant: PricedVariant | undefined): string | null {
  if (!variant || variant.price === null || variant.currency !== "USD") return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "code",
  }).format(variant.price);
}
