import { useState } from "react";
import { PaintBucket } from "lucide-react";
import { Button } from "./ui/button";
import {
  isVariantAvailable,
  isVariantPurchasable,
  recommendedLayers,
  useCoatingKit,
  variantLabel,
  type KitLayer,
} from "../lib/coating-kit";

const cad = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

function EssentialRow({ layer }: { layer: KitLayer }) {
  const first = layer.variants.find(isVariantAvailable) ?? layer.variants[0];
  const [variantId, setVariantId] = useState(first?.id ?? "");
  const variant = layer.variants.find((v) => v.id === variantId);
  const status = !variant
    ? "Sizes coming soon"
    : !isVariantAvailable(variant)
      ? "Out of stock"
      : variant.price === null
        ? "Price coming soon"
        : "In stock";

  return (
    <li className="re-row">
      <div className="re-thumb" aria-hidden="true"><PaintBucket /></div>
      <div className="re-info">
        <h3 className="re-name">{layer.product.name}</h3>
        <p className="re-role">{layer.role} · {layer.product.colorCode}</p>
        <p className="re-price">
          {variant?.price != null ? cad.format(variant.price) : null}
          <span className="re-status">{status}</span>
        </p>
      </div>
      <div className="re-actions">
        {layer.variants.length ? (
          <select
            className="re-select"
            aria-label={`${layer.product.name} size`}
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
          >
            {layer.variants.map((v) => (
              <option key={v.id} value={v.id} disabled={!isVariantAvailable(v)}>
                {variantLabel(v)}{isVariantAvailable(v) ? "" : " (out of stock)"}
              </option>
            ))}
          </select>
        ) : null}
        {/* Cart is not implemented yet, so the button stays disabled even when purchasable. */}
        <Button className="re-add" disabled title={variant && isVariantPurchasable(variant) ? "Cart coming soon" : status}>
          Add to Cart
        </Button>
      </div>
    </li>
  );
}

export function CoatingKitSection({ colorCode }: { colorCode: string }) {
  const kit = useCoatingKit(colorCode);
  if (kit.status === "none") return null;
  const rows = kit.status === "ready" ? recommendedLayers(kit.layers, colorCode) : [];
  if (kit.status === "ready" && !rows.length) return null;

  return (
    <section className="pd-section re-section" aria-labelledby="re-title">
      <h2 id="re-title" className="re-title">Recommended Essentials</h2>
      {kit.status === "loading" ? <p className="pd-caption">Loading recommendations…</p> : null}
      {kit.status === "error" ? (
        <p className="pd-caption">Recommendations are temporarily unavailable. Please try again later.</p>
      ) : null}
      {rows.length ? (
        <>
          <ul className="re-list">{rows.map((l) => <EssentialRow key={l.product.id} layer={l} />)}</ul>
          <p className="pd-caption">Online ordering is coming soon.</p>
        </>
      ) : null}
    </section>
  );
}
