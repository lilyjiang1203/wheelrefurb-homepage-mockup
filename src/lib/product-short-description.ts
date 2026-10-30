import { useEffect, useState } from "react";

const SUPABASE_URL = "https://unlygyqhgeujetjphrro.supabase.co";
const PUBLIC_KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";

/** Public product attributes. Absent or unverified attributes are never invented. */
export type ShortDescriptionProduct = {
  product_name: string | null;
  color_family: string[] | null;
  finish: string | null;
};

function normalWord(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Consistent, single-sentence text shared by future dynamic detail pages. */
export function formatProductShortDescription(product: ShortDescriptionProduct): string {
  const name = product.product_name ?? "";
  const normalized = name.toLowerCase();
  const category = /\bprimer\b/i.test(name)
    ? "primer"
    : /\b(clearcoat|clear coat|topcoat|top coat)\b/i.test(name)
      ? "clearcoat"
      : /\bbasecoat\b/i.test(name)
        ? "basecoat"
        : /\bpowder\b/i.test(name)
          ? "powder coating"
          : "coating";

  if (category === "primer") return "A professional primer for wheel refinishing applications.";
  if (category === "clearcoat") return "A professional clearcoat for wheel refinishing applications.";

  const family = Array.isArray(product.color_family)
    ? product.color_family.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : [];
  const familyText = family.length ? normalWord(family.join(" / ")) : "";
  const finish = product.finish?.trim() ? normalWord(product.finish) : "";
  const coatingType = /\bwater[- ]based\b/i.test(name)
    ? "water-based"
    : /\bsolvent[- ]based\b/i.test(name)
      ? "solvent-based"
      : "";

  // A powder coating can be identified from its actual product name.
  if (category === "powder coating") {
    return `A ${[familyText, finish, "powder coating"].filter(Boolean).join(" ")} for professional wheel refinishing.`;
  }

  return `A ${[familyText, finish, coatingType, category].filter(Boolean).join(" ")} for professional wheel refinishing.`;
}

/** Reads the current product attributes; never prevents the detail page from rendering. */
export function useProductShortDescription(colorCode: string, fallback: string): string {
  const [description, setDescription] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    setDescription(fallback);
    const load = async () => {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/products?select=product_name,color_family,finish&color_code=eq.${encodeURIComponent(colorCode)}&limit=1`,
          { headers: { apikey: PUBLIC_KEY } },
        );
        if (!response.ok) return;
        const rows = (await response.json()) as ShortDescriptionProduct[];
        if (!cancelled && Array.isArray(rows) && rows.length > 0) {
          setDescription(formatProductShortDescription(rows[0]));
        }
      } catch {
        // Retain the approved copy when product metadata is unavailable.
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [colorCode, fallback]);

  return description;
}
