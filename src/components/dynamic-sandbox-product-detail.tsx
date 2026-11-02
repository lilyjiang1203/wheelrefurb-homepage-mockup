import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Download, FileText, ImageOff } from "lucide-react";
import { CoatingKitSection } from "./coating-kit";
import { SimilarColorRecommendations } from "./similar-color-recommendations";
import { ReviewSummary, ReviewsSection, WriteReviewDialog, type ProductReview } from "./product-reviews";
import "../product-reviews.css";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { ProductGallery } from "./product-gallery";
import { formatProductShortDescription } from "../lib/product-short-description";
import { resolveHowToUseCategory, howToUseGuide } from "../lib/how-to-use-templates";
import { productStorageUrl, useSandboxProductDetail, type DetailVariant } from "../lib/sandbox-product-detail";

function formatSize(variant: DetailVariant): string {
  if (variant.unit.toLowerCase() === "l") return variant.size < 1 ? `${Math.round(variant.size * 1000)} mL` : `${variant.size} L`;
  return `${variant.size} ${variant.unit}`;
}
function formatPrice(variant: DetailVariant | undefined): string {
  if (!variant || variant.price == null || !variant.currency_code) return "Price coming soon";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: variant.currency_code }).format(variant.price) + ` ${variant.currency_code}`;
  } catch {
    return "Price coming soon";
  }
}
function DocumentLink({ title, url, language }: { title: string; url: string; language: string | null }) {
  return <div className="pd-document"><FileText aria-hidden="true" /><div><h3>{title}</h3><p className="pd-caption">Language: {language || "Not specified"}</p></div>
    <Button asChild size="sm" variant="outline"><a href={url} target="_blank" rel="noreferrer"><Download />Download</a></Button></div>;
}

export function DynamicSandboxProductDetail({ productId }: { productId: string }) {
  const detail = useSandboxProductDetail(productId);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);

  if (detail.status === "loading") return <main className="pd-shell" role="status">Loading product information…</main>;
  if (detail.status === "error") return <main className="pd-shell" role="alert"><h1 className="pd-title">Product unavailable</h1><p>We couldn't load this product. Please try again later.</p><Link to="/sandbox/products">Back to products</Link></main>;
  if (detail.status === "not-found") return <main className="pd-shell"><h1 className="pd-title">Product not found</h1><p>This product is not in the published Sandbox selection.</p><Link to="/sandbox/products">Back to products</Link></main>;

  const { product, variants, media, documents } = detail.data;
  const front = media.find(m => m.media_role === "front");
  const images = media.filter(m => m.media_type?.startsWith("image") || /\.(jpg|jpeg|png|webp)$/i.test(m.storage_path))
    .map(m => ({ id: m.id, src: productStorageUrl(m), alt: m.alt_text || product.color_name || product.product_name, label: m.media_role }));
  const videos = media.filter(m => m.media_type?.startsWith("video") || /\.(mp4|webm)$/i.test(m.storage_path))
    .map(m => ({ id: m.id, label: "Watch product video", poster: front ? productStorageUrl(front) : undefined,
      sources: [{ src: productStorageUrl(m), type: m.media_type || (m.storage_path.endsWith(".webm") ? "video/webm" : "video/mp4") }] }));
  const variant = variants.find(v => v.id === selectedVariantId) ?? variants.find(v => v.size === 1 && v.unit.toLowerCase() === "l") ?? variants[0];
  const productTitle = product.color_name || product.product_name;
  const attrs = [
    ["Color Name", product.color_name], ["Color Family", product.color_family?.join(", ")],
    ["Finish", product.finish], ["Product Line", product.product_line],
    ["Brand", product.brand], ["Panel Number", product.panel_number],
  ].filter((pair): pair is [string, string] => Boolean(pair[1]));
  const description = product.description?.trim() || product.technical_description?.trim();
  const useCategory = resolveHowToUseCategory(product.coating_layers?.name);
  const useGuide = useCategory ? howToUseGuide(useCategory) : null;
  return <main className="pd-shell">
    <nav className="pd-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={12} /><Link to="/sandbox/products">Sandbox Products</Link><ChevronRight size={12}/><span>{productTitle}</span></nav>
    <section className="pd-overview" aria-labelledby="product-title">
      <div>
        {images.length || videos.length ? <ProductGallery images={images} videos={videos} /> :
          <div className="flex aspect-square items-center justify-center border border-border bg-muted/20 text-muted-foreground"><ImageOff size={32} aria-hidden="true"/><span className="ml-2">Product images coming soon</span></div>}
        <p className="pd-caption">Color appearance may vary with lighting and display settings. Verify the finish against a physical sample.</p>
      </div>
      <div>
        <p className="pd-eyebrow">FreiLacke / Wheel Refinishing Color</p>
        <h1 className="pd-title pd-title--single-line" id="product-title">{productTitle}</h1>
        <p className="pd-summary">{formatProductShortDescription(product)}</p>
        <ReviewSummary reviews={reviews} onWrite={() => setReviewOpen(true)} />
        <p className="pd-price">{formatPrice(variant)}</p>
        <span className="pd-form-label">Package size</span>
        {variants.length ? <div className="pd-variants">{variants.map(v => <Button key={v.id} variant="outline" className="pd-variant" aria-pressed={variant?.id === v.id} onClick={() => setSelectedVariantId(v.id)}>{formatSize(v)}</Button>)}</div> :
          <p className="pd-caption">Package sizes coming soon.</p>}
        <label className="pd-form-label mt-5" htmlFor="sandbox-quantity">Quantity</label>
        <div className="pd-purchase">
          <div className="pd-quantity">
            <Button variant="ghost" size="icon" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</Button>
            <input id="sandbox-quantity" type="number" min={1} step={1} value={quantity} onChange={e => setQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))}/>
            <Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQuantity(q => q + 1)}>+</Button>
          </div>
          <Button className="pd-cart-button" disabled title="Sandbox preview only — checkout is not connected">Add to Cart</Button>
        </div>
        <p className="pd-caption">Sandbox preview only · No real checkout. Inventory and availability require confirmation.</p>
      </div>
    </section>
    <section className="pd-section">
      <Accordion type="multiple" defaultValue={["description"]} className="pd-accordion">
        <AccordionItem value="description"><AccordionTrigger>Description</AccordionTrigger><AccordionContent>
          {description ? <p className="whitespace-pre-line">{description}</p> : <p className="pd-tbd">Product description coming soon.</p>}
        </AccordionContent></AccordionItem>
        <AccordionItem value="benefits"><AccordionTrigger>Benefits</AccordionTrigger><AccordionContent><p className="pd-tbd">Benefits are pending product documentation and verification.</p></AccordionContent></AccordionItem>
        <AccordionItem value="how-to-use"><AccordionTrigger>How to Use</AccordionTrigger><AccordionContent>
          {useGuide ? <>
            <ol className="list-decimal pl-6 space-y-2">
              {useGuide.steps.map(step => <li key={step.title}><strong>{step.title}:</strong> {step.explanation}</li>)}
            </ol>
            <p className="mt-4"><strong>Important:</strong> {useGuide.note}</p>
          </> : <p className="pd-tbd">Consult the product Technical Data Sheet for application instructions. Product category is not confirmed.</p>}
        </AccordionContent></AccordionItem>
        <AccordionItem value="technical"><AccordionTrigger>Technical Details</AccordionTrigger><AccordionContent>
          <dl className="pd-attributes">{attrs.map(([label, value]) => <div className="pd-attribute" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <h3 className="pd-docs-title">Technical Documents</h3>
          {documents.length ? <div className="pd-documents">{documents.map(d => <DocumentLink key={d.id} title={d.document_title || d.document_type} url={productStorageUrl(d)} language={d.language_code}/>)}</div> :
            <p className="pd-caption">Technical documents will be available when supplied.</p>}
        </AccordionContent></AccordionItem>
      </Accordion>
    </section>
    {product.color_code ? <CoatingKitSection colorCode={product.color_code} /> : null}
    <section className="pd-help"><div className="pd-help-copy"><h2>Need Help Finding Your Wheel Color?</h2><p>Our team can help confirm the correct product and coating system.</p></div>
      <Button asChild className="pd-help-cta"><Link to="/" hash="need-help">Get Product Guidance</Link></Button></section>
    {product.color_code ? <SimilarColorRecommendations colorCode={product.color_code} /> : null}
    <ReviewsSection reviews={reviews} onWrite={() => setReviewOpen(true)} />
    <WriteReviewDialog open={reviewOpen} onOpenChange={setReviewOpen} productName={productTitle}
      onSubmit={review => setReviews(current => [review, ...current])} />
  </main>;
}
