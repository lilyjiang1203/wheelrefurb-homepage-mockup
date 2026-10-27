import { useEffect, useState } from "react";

// Read-only access to the wheelrefurb-shopify project (publishable key, public by design).
const URL_BASE = "https://unlygyqhgeujetjphrro.supabase.co";
const KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";

export type ProductDocument = { title: string; language: string; url: string };
export type DocsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; docs: ProductDocument[] };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, { headers: { apikey: KEY } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchSdsByColorCode(colorCode: string): Promise<ProductDocument[]> {
  const products = await get<{ id: string }[]>(
    `products?select=id&color_code=eq.${encodeURIComponent(colorCode)}&limit=1`,
  );
  const id = products[0]?.id;
  if (!id) return [];
  const rows = await get<
    { document_title: string | null; language_code: string | null; bucket_name: string; storage_path: string }[]
  >(`product_documents?select=document_title,language_code,bucket_name,storage_path&document_type=eq.SDS&product_id=eq.${id}`);
  return rows.map((r) => ({
    title: r.document_title ?? "Safety Data Sheet (SDS)",
    language: languageLabel(r.language_code),
    url: `${URL_BASE}/storage/v1/object/public/${encodeURIComponent(r.bucket_name)}/${r.storage_path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
  }));
}

function languageLabel(code: string | null): string {
  if (!code) return "Language not specified";
  const names: Record<string, string> = { en: "English", fr: "French", de: "German" };
  return names[code.toLowerCase()] ?? code.toUpperCase();
}

export function useSdsDocuments(colorCode: string): DocsState {
  const [state, setState] = useState<DocsState>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    fetchSdsByColorCode(colorCode)
      .then((docs) => alive && setState({ status: "ready", docs }))
      .catch(() => alive && setState({ status: "error" }));
    return () => {
      alive = false;
    };
  }, [colorCode]);
  return state;
}
