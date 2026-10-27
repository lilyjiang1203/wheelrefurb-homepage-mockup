import { useState } from "react";
import { Layers, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { isVariantAvailable, useCoatingKit, variantLabel, type KitState } from "../lib/coating-kit";

function LayerCard({
  layer,
  isCurrent,
  selected,
  onSelect,
}: {
  layer: Extract<KitState, { status: "ready" }>["layers"][number];
  isCurrent: boolean;
  selected: string | null;
  onSelect: (variantId: string | null) => void;
}) {
  return (
    <article className="ck-card">
      <div className="ck-card-head">
        <span className="ck-layer-label">
          Layer {layer.layerOrder} — {layer.role}
        </span>
        {isCurrent ? <span className="ck-current-badge">Current Product</span> : null}
      </div>
      <h3 className="ck-product-name">{layer.product.name}</h3>
      <p className="ck-product-code">Product code: {layer.product.colorCode}</p>
      {layer.variants.length ? (
        <div className="ck-sizes" aria-label={`${layer.role} package size`}>
          {layer.variants.map((v) => {
            const available = isVariantAvailable(v);
            return (
              <Button
                key={v.id}
                variant="outline"
                className="pd-variant"
                disabled={!available}
                aria-pressed={selected === v.id}
                title={available ? `${v.inventory} in stock` : "Out of stock"}
                onClick={() => onSelect(selected === v.id ? null : v.id)}
              >
                {variantLabel(v)}
              </Button>
            );
          })}
        </div>
      ) : (
        <p className="pd-caption">Package sizes coming soon.</p>
      )}
      {layer.variants.length ? (
        <p className="pd-caption">
          {layer.variants.some(isVariantAvailable)
            ? "Availability shown from current inventory."
            : "Currently out of stock."}
        </p>
      ) : null}
    </article>
  );
}

export function CoatingKitSection({ colorCode }: { colorCode: string }) {
  const kit = useCoatingKit(colorCode);
  const [selection, setSelection] = useState<Record<string, string | null>>({});

  if (kit.status === "none") return null;

  const selectedLayers =
    kit.status === "ready"
      ? kit.layers
          .map((layer) => {
            const variantId = selection[layer.product.id];
            const variant = layer.variants.find((v) => v.id === variantId);
            return variant ? { layer, variant } : null;
          })
          .filter((x): x is NonNullable<typeof x> => x !== null)
      : [];

  return (
    <section className="pd-section ck-section" aria-labelledby="ck-title">
      <div className="ck-head">
        <div className="ck-head-icon" aria-hidden="true">
          <Layers />
        </div>
        <div>
          <h2 id="ck-title">Build Your Coating Kit</h2>
          {kit.status === "ready" ? (
            <>
              <p className="ck-system-name">{kit.systemName}</p>
              {kit.description ? <p>{kit.description}</p> : null}
            </>
          ) : null}
        </div>
      </div>

      {kit.status === "loading" ? <p className="pd-caption">Loading coating system…</p> : null}
      {kit.status === "error" ? (
        <p className="pd-caption">The coating system is temporarily unavailable. Please try again later.</p>
      ) : null}

      {kit.status === "ready" ? (
        <>
          <div className="ck-layers">
            {kit.layers.map((layer) => (
              <LayerCard
                key={layer.product.id}
                layer={layer}
                isCurrent={layer.product.colorCode === colorCode}
                selected={selection[layer.product.id] ?? null}
                onSelect={(variantId) =>
                  setSelection((prev) => ({ ...prev, [layer.product.id]: variantId }))
                }
              />
            ))}
          </div>

          <div className="ck-summary" aria-live="polite">
            <h3>Your Kit</h3>
            {selectedLayers.length ? (
              <ul>
                {selectedLayers.map(({ layer, variant }) => (
                  <li key={variant.id}>
                    {layer.role}: {layer.product.name} — {variantLabel(variant)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pd-caption">Select a package size above to add a product to your kit.</p>
            )}
            <Button className="pd-cart-button" disabled>
              <ShoppingBag />
              Add Selected Products to Cart
            </Button>
            <p className="pd-caption">Cart integration coming soon. No purchase can be made yet.</p>
          </div>
        </>
      ) : null}
    </section>
  );
}
