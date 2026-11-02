import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../../components/store-navigation";
import { ProductDetail, type ProductDetailData } from "../../components/product-detail";

export const Route = createFileRoute("/sandbox/products_/$itemNo")({
  head: () => ({ meta: [{ title: "Product Preview | WheelRefurb" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ProductPage,
});
const BASE = "https://unlygyqhgeujetjphrro.supabase.co";
const KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";
type Row = { id: string; product_name: string; color_name: string | null; color_code: string; description: string | null; benefits: string[] | null; application_instructions: string | null; technical_details: Record<string, unknown> | null };
type Media = { bucket_name: string; storage_path: string; media_role: string; media_type: string };
async function read<T>(path: string, signal: AbortSignal): Promise<T> {
  const r = await fetch(`${BASE}/rest/v1/${path}`, { headers: { apikey: KEY }, signal });
  if (!r.ok) throw new Error("Product load failed");
  return r.json();
}
function ProductPage() {
  const { itemNo } = Route.useParams();
  const [state, setState] = useState<{ code: string; data: ProductDetailData | null; subtitle: string; error: boolean }>({ code: itemNo, data: null, subtitle: "", error: false });
  useEffect(() => {
    const c = new AbortController();
    setState({ code: itemNo, data: null, subtitle: "", error: false });
    (async () => {
      const rows = await read<Row[]>(`products?select=id,product_name,color_name,color_code,description,benefits,application_instructions,technical_details&color_code=eq.${encodeURIComponent(itemNo)}&limit=1`, c.signal);
      const p = rows[0]; if (!p) throw new Error("Product not found");
      const media = await read<Media[]>(`product_media?select=bucket_name,storage_path,media_role,media_type&product_id=eq.${p.id}&order=display_order.asc`, c.signal);
      const asset = (role: string) => { const m = media.find(x => x.media_role === role); return m ? `${BASE}/storage/v1/object/public/${encodeURIComponent(m.bucket_name)}/${m.storage_path.split('/').map(encodeURIComponent).join('/')}` : ""; };
      const t = p.technical_details || {};
      const val = (key: string): string | null => { const v = t[key]; return typeof v === "string" && v.trim() ? v : Array.isArray(v) ? v.join(', ') : null; };
      const data: ProductDetailData = {
        product: { slug: p.color_code, title: p.color_name || p.product_name, vendor: val('brand') || "FreiLacke", description: p.description || "Description awaiting confirmation.", images: { front: asset('front'), back: asset('back') }, video: asset('video'), webVideo: "" },
        content: { benefits: p.benefits || [], howToUse: (p.application_instructions || "").split(/\n\s*\n/).filter(Boolean) },
        metafields: { brand: val('brand'), colorName: p.color_name, formulaCode: p.color_code, colorFamily: val('color_family'), finishType: val('finish'), productLine: val('product_line'), coatingForm: val('coating_form'), carrierType: val('carrier_type'), layer: val('coating_layer'), panelReference: val('panel_number'), glossLevel: val('gloss_level'), applicationParameters: val('application_parameters'), technology: null, subtype: null, vehicleBrand: null, oemCode: null, application: "Wheel Refinishing" },
      };
      if (!c.signal.aborted) setState({ code: itemNo, data, subtitle: (p.description || "Wheel refinishing coating.").split(/\n\s*\n/)[0] || "Wheel refinishing coating.", error: false });
    })().catch(() => { if (!c.signal.aborted) setState({ code: itemNo, data: null, subtitle: "", error: true }); });
    return () => c.abort();
  }, [itemNo]);
  return <div className="min-h-screen bg-background"><StoreNavigation /><main>
    {state.code === itemNo && state.data ? <ProductDetail key={itemNo} colorCode={itemNo} data={state.data} subtitle={state.subtitle} /> : <div className="pd-shell py-16"><p role={state.error ? "alert" : "status"}>{state.error ? "Product preview unavailable. Please return to the catalog and try again." : "Loading product preview…"}</p><a className="text-brand underline" href="/sandbox/products">Back to product catalog</a></div>}
  </main></div>;
}
