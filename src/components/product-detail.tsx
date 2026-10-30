import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Download, FileText, Minus, Palette, Plus, ShoppingBag } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import {
  audiProduct,
  keyAttributes,
  normalizeProductQuantity,
} from "./product-detail-data";
import { ProductGallery } from "./product-gallery";
import { CoatingKitSection } from "./coating-kit";
import { ReviewSummary, ReviewsSection, WriteReviewDialog, type ProductReview } from "./product-reviews";
import { useSdsDocuments } from "../lib/product-documents";
import { formatVariantUsd, useProductPrices } from "../lib/product-pricing";
import { useProductSwatch } from "../lib/product-swatches";
import finishExample from "../assets/wheel-finish-closeup.jpg";
import panelBand from "../assets/audi-anthracite-panel-band.jpg";
import "../product-reviews.css";

function PlaceholderProduct({ title, image, alt }: { title: string; image: string; alt: string }) {
  return (
    <article className="pd-placeholder">
      <div className="pd-placeholder-media">
        <img src={image} alt={alt} />
      </div>
      <div className="pd-placeholder-body">
        <h3>{title}</h3>
        <p>Product name / SKU — TBD</p>
        <p>Illustrative image only. Similar color selection pending.</p>
      </div>
    </article>
  );
}

export function ProductDetail() {
  const [variantId, setVariantId] = useState<string | null>(null);
  const pricing = useProductPrices("WO1838MAU07A");
  const swatchState = useProductSwatch("WO1838MAU07A");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<{ packageSize: string; quantity: number } | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const purchaseRef = useRef<HTMLDivElement>(null);

  // Show the compact purchase bar only after the main purchase area is scrolled past.
  useEffect(() => {
    const update = () => {
      const purchase = purchaseRef.current;
      if (!purchase) return;
      setShowStickyCart(purchase.getBoundingClientRect().bottom < 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const selectedId = variantId ?? pricing.variants.find((v) => v.size === 1)?.id ?? pricing.variants[0]?.id;
  const variant = pricing.variants.find((v) => v.id === selectedId);
  const isPriced = !!variant && variant.price !== null && variant.currency === "USD";
  const p = audiProduct.product;
  const m = audiProduct.metafields;
  const price = formatVariantUsd(variant);
  const pricingMessage = pricing.status === "loading" ? "Loading price…" : pricing.status === "error" ? "Pricing temporarily unavailable" : !variant ? "Price unavailable" : variant.price === null ? "Price coming soon" : variant.currency !== "USD" ? "Currency unavailable" : "Price unavailable";
  const sds = useSdsDocuments("WO1838MAU07A");
  const pending = <p className="pd-tbd">Pending manufacturer verification.</p>;
  return (
    <div className={`pd-shell ${showStickyCart ? "pd-has-sticky-cart" : ""}`}>
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop">Products</Link>
        <ChevronRight size={12} />
        <span>Audi Anthracite LV7D</span>
      </nav>
      <section className="pd-overview" aria-labelledby="product-title">
        <div>
          <ProductGallery
            images={[
              {
                id: "front",
                src: p.images.front,
                alt: "Audi Anthracite dark grey coating sample panel",
                label: "Show color sample",
              },
              {
                id: "back",
                src: p.images.back,
                alt: "Back of Audi Anthracite sample panel with FreiLacke formula and layer references",
                label: "Show panel reference",
              },
            ]}
            videos={[
              {
                id: "video",
                label: "Watch product video",
                poster: p.images.front,
                sources: [
                  { src: p.webVideo, type: "video/webm" },
                  { src: p.video, type: "video/mp4" },
                ],
              },
            ]}
          />
          <p className="pd-caption">
            Color appearance varies with lighting and screen settings. Supplied sample panel shown.
          </p>
        </div>
        <div>
          <p className="pd-eyebrow">FreiLacke / Wheel Refinishing Color</p>
          <h1 id="product-title" className="pd-title">
            AUDI ANTHRACITE
            <br />
            LV7D
          </h1>
          <p className="pd-summary">
            Anthracite dark grey for alloy wheel refinishing.
            <br />
            Associated with Audi OEM color code LV7D.
          </p>

          <ReviewSummary reviews={reviews} onWrite={() => setReviewDialogOpen(true)} />
          <p className="pd-price">{price ?? <span className="pd-price-pending">{pricingMessage}</span>}</p>
          <span className="pd-form-label">Package size</span>
          <div className="pd-variants" aria-label="Package size">
            {pricing.variants.map((v) => (
              <Button
                key={v.id}
                variant="outline"
                className="pd-variant"
                aria-pressed={selectedId === v.id}
                title={v.price === null ? "Price coming soon" : undefined}
                onClick={() => setVariantId(v.id)}
              >
                {v.packageSize}
              </Button>
            ))}
          </div>
          <label className="pd-form-label mt-5" htmlFor="product-quantity">
            Quantity
          </label>
          <div className="pd-purchase" ref={purchaseRef}>
            <div className="pd-quantity">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Decrease quantity"
                disabled={quantity === 1}
                onClick={() => setQuantity(normalizeProductQuantity(quantity - 1))}
              >
                <Minus />
              </Button>
              <input
                id="product-quantity"
                type="number"
                min={1}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(normalizeProductQuantity(Number(e.target.value)))}
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Increase quantity"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus />
              </Button>
            </div>
            <Button
              className="pd-cart-button"
              disabled={!isPriced || variant?.status !== "active" || (variant.inventory ?? 0) <= 0}
              onClick={() => {
                if (isPriced && variant) setCart({ packageSize: variant.packageSize, quantity });
              }}
            >
              <ShoppingBag />
              Add to Cart
            </Button>
          </div>
          <div className="pd-swatch" aria-label="Color swatch option">
            <div className="pd-swatch-inline">
              <span className="pd-swatch-label">Color swatch <strong>FREE · $0.00</strong></span>
              <Button type="button" variant="outline" size="sm" className="pd-swatch-button" disabled
                title={swatchState.status === "loading" ? "Checking swatch availability" :
                  swatchState.status === "error" ? "Swatch availability temporarily unavailable" :
                  swatchState.swatch?.isAvailable ? "Online swatch ordering coming soon" : "Swatch availability to be confirmed"}>
                <Plus size={14} aria-hidden="true" /> Add Swatch
              </Button>
            </div>
            <p className="pd-swatch-shipping">Free swatch · Shipping applies to swatch-only orders.</p>
          </div>
        </div>
      </section>
      <section className="pd-section">
        <Accordion type="multiple" defaultValue={["description"]} className="pd-accordion">
          <AccordionItem value="description">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              <p>{p.description}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="benefits">
            <AccordionTrigger>Benefits</AccordionTrigger>
            <AccordionContent>
              {audiProduct.content.benefits.length ? (
                <ul className="list-disc pl-6 space-y-2">
                  {audiProduct.content.benefits.map((item) => {
                    const [heading, ...rest] = item.split(":");
                    return (
                      <li key={item}>
                        <strong>{heading}:</strong>
                        {rest.length > 0 ? ` ${rest.join(":").trim()}` : ""}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                pending
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-to-use">
            <AccordionTrigger>How to Use</AccordionTrigger>
            <AccordionContent>
              {audiProduct.content.howToUse.length ? (
                <ol className="list-decimal pl-6 space-y-2">
                  {audiProduct.content.howToUse
                    .filter((item) => !item.startsWith("Important:"))
                    .map((item) => {
                      const [heading, ...rest] = item.split(":");
                      return (
                        <li key={item}>
                          <strong>{heading}:</strong>
                          {rest.length > 0 ? ` ${rest.join(":").trim()}` : ""}
                        </li>
                      );
                    })}
                </ol>
              ) : (
                pending
              )}

              {audiProduct.content.howToUse
                .filter((item) => item.startsWith("Important:"))
                .map((item) => (
                  <p key={item} className="mt-4">
                    <strong>Important:</strong> {item.slice("Important:".length).trim()}
                  </p>
                ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="technical">
            <AccordionTrigger>Technical Details</AccordionTrigger>
            <AccordionContent>
              <dl className="pd-attributes">
                {(
                  [
                    ["Brand", m.brand],
                    ["Color Name", m.colorName],
                    ["Item No.", m.formulaCode],
                    ["Color Family", m.colorFamily],
                    ["Finish", m.finishType],
                    ["Product Line", m.productLine],
                    ["Coating Form", m.coatingForm],
                    ["Carrier Type", m.carrierType],
                    ["Coating Layer", m.layer],
                    ["Panel Number", m.panelReference],
                    ["Gloss Level", m.glossLevel ?? "Not specified"],
                    ["Application Parameters", m.applicationParameters ?? "Pending TDS verification"],
                  ] as [string, string | null][]
                )
                  .filter(([, value]) => value !== null && value !== "")
                  .map(([label, value]) => (
                    <div key={label} className="pd-attribute">
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
              </dl>

              <h3 className="pd-docs-title">Technical Documents</h3>
              {sds.status === "ready" && sds.docs.length ? (
                <div className="pd-documents">
                  {sds.docs.map((doc) => (
                    <div key={doc.url} className="pd-document">
                      <FileText aria-hidden="true" />
                      <div>
                        <h3>{doc.title}</h3>
                        <p className="pd-caption">Language: {doc.language}</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a href={doc.url} target="_blank" rel="noreferrer">
                          <Download />
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pd-caption">
                  {sds.status === "loading"
                    ? "Loading documents…"
                    : sds.status === "error"
                      ? "Technical documents are temporarily unavailable. Please try again later."
                      : "TDS and SDS documents will be available here once supplied by the manufacturer."}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <CoatingKitSection colorCode="WO1838MAU07A" />
      <section className="pd-help" aria-labelledby="pd-help-title">
        <div className="pd-help-icon" aria-hidden="true">
          <Palette />
        </div>
        <div className="pd-help-copy">
          <h2 id="pd-help-title">Need Help Finding Your Wheel Color?</h2>
          <p>
            Not sure which wheel color is right for your vehicle? Use our Wheel Color Finder to explore colors by
            vehicle, color, or OEM color code.
          </p>
        </div>
        <Button asChild className="pd-help-cta">
          <Link to="/" hash="need-help">
            Get Product Guidance <ArrowRight />
          </Link>
        </Button>
      </section>
     
<section className="pd-section pd-related-minimal">
  <div className="pd-explore-content">
    <div className="pd-explore-copy">
      <p className="pd-explore-eyebrow">
        EXPLORE MORE FINISHES
      </p>
      <h2>Find Your Next Wheel Color</h2>
      <p>
        Browse our wheel refinishing colors and discover
        other options for your project.
      </p>
    </div>

    <Button asChild variant="outline" className="pd-explore-button">
      <Link to="/shop">
        Explore Colors <ArrowRight size={17} />
      </Link>
    </Button>
  </div>
</section>

      <ReviewsSection reviews={reviews} onWrite={() => setReviewDialogOpen(true)} />
      {showStickyCart && (
        <aside className="pd-sticky-cart" aria-label="Product quick purchase">
          <div className="pd-sticky-inner">
            <div className="pd-sticky-product">
              <img src={p.images.front} alt="" />
              <div className="pd-sticky-copy">
                <span className="pd-sticky-kicker">WHEEL REFINISHING COLOR</span>
                <strong>{p.title}</strong>
                <span>{price ?? pricingMessage} · {variant?.packageSize ?? "Size unavailable"}</span>
              </div>
            </div>
            <div className="pd-sticky-actions">
              <div className="pd-sticky-quantity" aria-label="Quantity">
                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <output aria-label="Selected quantity">{quantity}</output>
                <button type="button" aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
              <Button type="button" className="pd-sticky-add" disabled={!isPriced || variant?.status !== "active" || (variant.inventory ?? 0) <= 0}
                onClick={() => {
                  if (isPriced && variant) setCart({ packageSize: variant.packageSize, quantity });
                }}>
                <ShoppingBag size={17} /> Add to Cart
              </Button>
            </div>
          </div>
        </aside>
      )}
      <WriteReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        productName={p.title}
        onSubmit={(review) => setReviews((current) => [review, ...current])}
      />
      <Dialog
        open={cart !== null}
        onOpenChange={(open) => {
          if (!open) setCart(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Added to Demo Cart</DialogTitle>
          <DialogDescription>Simulated cart only — no order has been placed.</DialogDescription>
          <div className="flex items-center gap-4">
            <img className="h-24 w-24 object-contain" src={p.images.front} alt="Audi Anthracite panel" />
            <div>
              <p className="text-sm font-semibold">{p.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {cart?.packageSize} · Quantity: {cart?.quantity}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{price ?? pricingMessage} (USD pricing)</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setCart(null)}>
            Continue browsing
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
