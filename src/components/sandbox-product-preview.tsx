import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { ProductGallery } from "./product-gallery";

const BASE = "https://unlygyqhgeujetjphrro.supabase.co";
const KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";
type Media = { id: string; bucket_name: string; storage_path: string; media_type: string; media_role: string; alt_text: string | null };
type Product = { color_name: string | null; product_name: string; description: string | null; benefits: string[] | null; application_instructions: string | null; technical_details: Record<string, unknown> | null };
type Variant = { id: string; size: number; unit: string; price: number | null; currency_code: string | null; inventory_quantity: number | null; status: string };
type Document = { id: string; document_type: string; document_title: string; bucket_name: string; storage_path: string };
type Data = { product: Product; media: Media[]; variants: Variant[]; documents: Document[] };
async function read<T>(path: string, signal: AbortSignal): Promise<T> {
  const r = await fetch(`${BASE}/rest/v1/${path}`, { headers: { apikey: KEY }, signal });
  if (!r.ok) throw new Error("Unable to load product");
  return r.json();
}
const url = (m: { bucket_name: string; storage_path: string }) => `${BASE}/storage/v1/object/public/${encodeURIComponent(m.bucket_name)}/${m.storage_path.split('/').map(encodeURIComponent).join('/')}`;
const labels: Record<string,string> = {brand:"Brand",color_name:"Color Name",item_number:"Item No.",color_family:"Color Family",finish:"Finish",product_line:"Product Line",coating_form:"Coating Form",carrier_type:"Carrier Type",coating_layer:"Coating Layer",panel_number:"Panel Number",gloss_level:"Gloss Level",application_parameters:"Application Parameters",coating_system_reference:"Coating System Reference"};
export function SandboxProductPreview({ productId, onClose }: { productId: string | null; onClose: () => void }) {
  const [state,setState]=useState<{status:"loading"|"error"|"ready";data:Data|null}>({status:"loading",data:null});
  useEffect(()=>{
    if(!productId)return;
    const controller=new AbortController();setState({status:"loading",data:null});
    Promise.all([
      read<Product[]>(`products?select=color_name,product_name,description,benefits,application_instructions,technical_details&id=eq.${productId}`,controller.signal),
      read<Media[]>(`product_media?select=*&product_id=eq.${productId}&order=display_order.asc`,controller.signal),
      read<Variant[]>(`product_variants?select=id,size,unit,price,currency_code,inventory_quantity,status&product_id=eq.${productId}&is_dummy=eq.false&order=size.asc`,controller.signal),
      read<Document[]>(`product_documents?select=id,document_type,document_title,bucket_name,storage_path&product_id=eq.${productId}`,controller.signal),
    ]).then(([products,media,variants,documents])=>{
      if(!products[0])throw new Error("Product unavailable");
      if(!controller.signal.aborted)setState({status:"ready",data:{product:products[0],media,variants,documents}});
    }).catch(()=>{if(!controller.signal.aborted)setState({status:"error",data:null});});
    return ()=>controller.abort();
  },[productId]);
  const d=state.data;
  return <Dialog open={!!productId} onOpenChange={open=>{if(!open)onClose();}}>
    <DialogContent className="max-h-[92vh] overflow-y-auto w-[96vw] sm:max-w-6xl p-5 sm:p-8">
      <DialogTitle className="text-2xl font-semibold pr-8">{d?.product.color_name||d?.product.product_name||"Product preview"}</DialogTitle>
      <DialogDescription>Sandbox preview · No checkout · Unconfirmed details appear as pending.</DialogDescription>
      {state.status==="loading"&&<p role="status">Loading product details…</p>}
      {state.status==="error"&&<p role="alert">Unable to load this product. Close and try again.</p>}
      {d&&<>
        <div className="grid gap-8 md:grid-cols-2 mt-4">
          <div><ProductGallery key={productId} images={d.media.filter(m=>m.media_type==="image").map(m=>({id:m.id,src:url(m),alt:m.alt_text||d.product.color_name||"Product sample",label:m.media_role==="back"?"Back label":"Color sample"}))} videos={d.media.filter(m=>m.media_type==="video").map(m=>({id:m.id,label:"Rotation video",poster:d.media.find(x=>x.media_role==="front")?url(d.media.find(x=>x.media_role==="front")!):null,sources:[{src:url(m),type:"video/mp4"}]}))}/></div>
          <div>
            <h2 className="font-semibold text-lg mb-3">Available sizes</h2>
            {d.variants.length?<ul className="space-y-3">{d.variants.map(v=><li key={v.id} className="border border-border rounded p-3 text-sm"><strong>{v.size} {v.unit}</strong><span className="block mt-1">{v.price===null?"Price pending":`${v.price.toFixed(2)} ${v.currency_code||"(currency pending)"}`}</span><span className="block text-muted-foreground">{v.inventory_quantity===null?"Stock unconfirmed":`Recorded stock: ${v.inventory_quantity}`}{v.status!=="active"?` · ${v.status}`:""}</span></li>)}</ul>:<p className="text-muted-foreground">Sizes, price and stock pending confirmation.</p>}
          </div>
        </div>
        <Accordion type="multiple" defaultValue={["description"]} className="mt-6">
          <AccordionItem value="description"><AccordionTrigger>Description</AccordionTrigger><AccordionContent><p className="whitespace-pre-line leading-relaxed">{d.product.description||"Pending confirmation."}</p></AccordionContent></AccordionItem>
          <AccordionItem value="benefits"><AccordionTrigger>Benefits</AccordionTrigger><AccordionContent>{d.product.benefits?.length?<ul className="list-disc pl-5 space-y-3">{d.product.benefits.map(b=><li key={b}>{b}</li>)}</ul>:"Pending confirmation."}</AccordionContent></AccordionItem>
          <AccordionItem value="use"><AccordionTrigger>How to Use</AccordionTrigger><AccordionContent><p className="whitespace-pre-line leading-relaxed">{d.product.application_instructions||"Pending confirmation."}</p></AccordionContent></AccordionItem>
          <AccordionItem value="technical"><AccordionTrigger>Technical Details</AccordionTrigger><AccordionContent><dl className="divide-y divide-border">{Object.entries(labels).map(([key,label])=>{const val=d.product.technical_details?.[key];return <div key={key} className="grid sm:grid-cols-[200px_1fr] gap-2 py-3"><dt className="font-medium">{label}</dt><dd className="whitespace-pre-line">{val===null||val===undefined||val===""?"Pending confirmation":Array.isArray(val)?val.join(', '):String(val)}</dd></div>;})}</dl></AccordionContent></AccordionItem>
        </Accordion>
        <section className="mt-6"><h2 className="text-lg font-semibold mb-3">Technical Documents</h2>{d.documents.length?<ul className="space-y-2">{d.documents.map(doc=><li key={doc.id}><a className="text-brand underline" href={url(doc)} target="_blank" rel="noreferrer">{doc.document_title} ({doc.document_type})</a></li>)}</ul>:<p className="text-muted-foreground">No documents linked yet.</p>}</section>
      </>}
    </DialogContent>
  </Dialog>;
}
