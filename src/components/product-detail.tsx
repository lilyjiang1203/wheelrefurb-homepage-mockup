import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Download, FileText, Minus, Palette, Plus, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { audiProduct, essentialInfo, normalizeProductQuantity, samplePriceLabel } from "./product-detail-data";
import { ProductGallery } from "./product-gallery";
import finishExample from "../assets/wheel-finish-closeup.jpg";
import panelBand from "../assets/audi-anthracite-panel-band.jpg";

function PlaceholderProduct({ title, image, alt }: { title: string; image: string; alt: string }) {
  return <article className="pd-placeholder"><div className="pd-placeholder-media"><img src={image} alt={alt} /></div><div className="pd-placeholder-body"><h3>{title}</h3><p>Product name / SKU — TBD</p><p>Illustrative image only. Similar color selection pending.</p></div></article>;
}

export function ProductDetail() {
  const [variantId, setVariantId] = useState("2");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<{ packageSize: string; quantity: number } | null>(null);
  const variant = audiProduct.variants.find((v) => v.id === variantId) ?? audiProduct.variants[0];
  const p = audiProduct.product;
  return <div className="pd-shell">
    <nav className="pd-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={12} /><Link to="/shop">Products</Link><ChevronRight size={12} /><span>Audi Anthracite LV7D</span></nav>
    <section className="pd-overview" aria-labelledby="product-title">
      <div>
        <ProductGallery images={[
          { id: "front", src: p.images.front, alt: "Audi Anthracite dark grey coating sample panel", label: "Show color sample" },
          { id: "back", src: p.images.back, alt: "Back of Audi Anthracite sample panel with FreiLacke formula and layer references", label: "Show panel reference" },
        ]} videos={[{ id: "video", label: "Watch product video", poster: p.images.front, sources: [{ src: p.webVideo, type: "video/webm" }, { src: p.video, type: "video/mp4" }] }]} />
        <p className="pd-caption">Color appearance varies with lighting and screen settings. Supplied sample panel shown.</p>
      </div>
      <div>
        <p className="pd-eyebrow">FreiLacke / Wheel Refinishing Color</p>
        <span className="pd-type-label">Coating Technology: TBD</span>
        <h1 id="product-title" className="pd-title">AUDI ANTHRACITE<br />LV7D</h1>
        <p className="pd-sku">SKU: {variant?.sku ?? `${audiProduct.exampleSku} (example — varies by package)`}</p>
        <div className="pd-code-row"><span>OEM code <strong>LV7D</strong></span><span>Formula <strong>W01838MAU07A</strong></span></div>
        <p className="pd-summary">Anthracite dark grey for alloy wheel refinishing.<br />Associated with Audi OEM color code LV7D.</p>
        <p className="pd-price">{samplePriceLabel} <span className="pd-price-note">sample price</span></p>
        <p className="pd-stock">In Stock <span>— sample status, not live inventory</span></p>
        <span className="pd-form-label">Package size</span>
        <div className="pd-variants" aria-label="Package size">{audiProduct.variants.map((v) => <Button key={v.id} variant="outline" className="pd-variant" aria-pressed={variantId === v.id} onClick={() => setVariantId(v.id)}>{v.packageSize}</Button>)}</div>
        <label className="pd-form-label mt-5" htmlFor="product-quantity">Quantity</label>
        <div className="pd-purchase">
          <div className="pd-quantity"><Button variant="ghost" size="icon" aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity(normalizeProductQuantity(quantity - 1))}><Minus /></Button><input id="product-quantity" type="number" min={1} step={1} value={quantity} onChange={(e) => setQuantity(normalizeProductQuantity(Number(e.target.value)))} /><Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Plus /></Button></div>
          <Button className="pd-cart-button" onClick={() => { if (variant) setCart({ packageSize: variant.packageSize, quantity }); }}><ShoppingBag />Add to Cart</Button>
        </div>
        <p className="pd-caption">Demo cart only. No purchase or payment will be made.</p>
      </div>
    </section>
    <section className="pd-section"><h2>Product Description</h2><p>{p.description}</p></section>
    <section className="pd-section"><h2>Product Information</h2><dl className="pd-attributes">{essentialInfo.map(([label, value]) => <div key={label} className="pd-attribute"><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
    <section className="pd-help" aria-labelledby="pd-help-title"><div className="pd-help-icon" aria-hidden="true"><Palette /></div><div className="pd-help-copy"><h2 id="pd-help-title">Need Help Finding Your Wheel Color?</h2><p>Not sure which wheel color is right for your vehicle? Use our Wheel Color Finder to explore colors by vehicle, color, or OEM color code.</p></div><Button asChild className="pd-help-cta"><Link to="/" hash="find-your-color">Find Your Wheel Color <ArrowRight /></Link></Button></section>
    <section className="pd-section"><h2>Technical Downloads</h2><div className="pd-documents">{audiProduct.documents.map((doc) => <div key={doc.name} className="pd-document"><FileText aria-hidden="true" /><div><h3>{doc.name}{doc.optional ? " (optional)" : ""}</h3><p>Manufacturer PDF pending</p></div><Button variant="outline" size="sm" disabled><Download />Download</Button></div>)}</div><p className="pd-caption">Application parameters and technical properties will be provided in the official manufacturer documents.</p></section>
    <section className="pd-section pd-related"><h2>Complete Your Coating System</h2><h3>Compatible Products</h3><p>No confirmed compatible products yet. Verified primers and clear coats will appear here once compatibility is confirmed.</p></section>
    <section className="pd-section pd-related"><h2>Related Products</h2><h3>Similar Colors</h3><p>Visual alternatives are separate from technical compatibility.</p><div className="pd-placeholder-grid"><PlaceholderProduct title="Similar grey color — TBD" image={finishExample} alt="Dark anthracite metallic wheel finish close-up used as an illustrative placeholder" /><PlaceholderProduct title="Similar anthracite color — TBD" image={panelBand} alt="Close-up of the anthracite coating sample panel used as an illustrative placeholder" /></div></section>
    <Dialog open={cart !== null} onOpenChange={(open) => { if (!open) setCart(null); }}><DialogContent><DialogTitle>Added to Demo Cart</DialogTitle><DialogDescription>Simulated cart only — no order has been placed.</DialogDescription><div className="flex items-center gap-4"><img className="h-24 w-24 object-contain" src={p.images.front} alt="Audi Anthracite panel" /><div><p className="text-sm font-semibold">{p.title}</p><p className="mt-2 text-sm text-muted-foreground">{cart?.packageSize} · Quantity: {cart?.quantity}</p><p className="mt-2 text-xs text-muted-foreground">Price and package SKU pending.</p></div></div><Button variant="outline" onClick={() => setCart(null)}>Continue browsing</Button></DialogContent></Dialog>
  </div>;
}