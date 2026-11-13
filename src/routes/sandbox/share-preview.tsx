import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Share, Share2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

export const Route = createFileRoute("/sandbox/share-preview")({
  head: () => ({
    meta: [
      { title: "Share Control Preview (Private) | Wheel Refurb" },
      { name: "description", content: "Internal comparison of four share control treatments in the purchase section." },
      { property: "og:title", content: "Share Control Preview (Private)" },
      { property: "og:description", content: "Internal comparison of four share control treatments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SharePreview,
});

const sizes = ["0.5L", "1L", "5L"];
type Variant = "A" | "B" | "C" | "D";

const variantLabels: Record<Variant, string> = {
  A: "plain text link below Add to cart",
  B: "icon + text pill below Add to cart",
  C: "small icon on the Add to cart row",
  D: "icon at the top corner of the panel",
};

function useShare() {
  const [note, setNote] = useState<string | null>(null);
  const share = async () => {
    const url = `${window.location.origin}/products/audi-anthracite-lv7d`;
    try {
      if (navigator.share) await navigator.share({ title: "Audi Anthracite LV7D", url });
      else {
        await navigator.clipboard.writeText(url);
        setNote("Link copied");
        setTimeout(() => setNote(null), 1800);
      }
    } catch {
      /* user cancelled */
    }
  };
  return { share, note };
}

function Purchase({ variant }: { variant: Variant }) {
  const [size, setSize] = useState("1L");
  const { share, note } = useShare();

  const cornerShare = variant === "D" && (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="sp-corner" aria-label="Share this product" onClick={share}>
          <Share size={15} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent>Share</TooltipContent>
    </Tooltip>
  );

  return (
    <div className={variant === "D" ? "sp-purchase sp-purchase-rel" : "sp-purchase"}>
      {cornerShare}
      <p className="sp-eyebrow">FreiLacke / Wheel Refinishing Color</p>
      <h3 className="sp-title">Audi Anthracite LV7D</h3>
      <p className="sp-price">CAD $XX.XX</p>
      <span className="sp-label">Package size</span>
      <div className="sp-sizes">
        {sizes.map((s) => (
          <Button key={s} variant="outline" size="sm" aria-pressed={size === s} className={size === s ? "sp-size-on" : ""} onClick={() => setSize(s)}>
            {s}
          </Button>
        ))}
      </div>

      {variant === "C" ? (
        <div className="sp-row">
          <Button className="sp-cart sp-cart-flex">Add to cart</Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="sp-share-icon" aria-label="Share this product" onClick={share}>
                <Share size={16} strokeWidth={1.5} aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <Button className="sp-cart">Add to cart</Button>
      )}

      {variant === "A" && (
        <button type="button" className="sp-share-text" onClick={share}>
          Share
        </button>
      )}
      {variant === "B" && (
        <button type="button" className="sp-share-pill" onClick={share}>
          <Share2 size={13} strokeWidth={1.5} aria-hidden="true" /> Share
        </button>
      )}

      <p className="sp-note" aria-live="polite">{note ?? ""}</p>
    </div>
  );
}

function SharePreview() {
  return (
    <TooltipProvider delayDuration={200}>
      <main className="sp-shell">
        <header className="sp-head">
          <p className="sp-eyebrow">Private preview · not published</p>
          <h1>Share control — purchase section</h1>
          <p>Same product details and Add to cart; only the share control differs. Demo data, no real cart.</p>
        </header>
        {(["desktop", "mobile"] as const).map((d) => (
          <section key={d} className="sp-device">
            <h2>{d === "desktop" ? "Desktop" : "Mobile (375px)"}</h2>
            <div className="sp-grid">
              {(["A", "B", "C", "D"] as const).map((v) => (
                <figure key={v} className="sp-fig">
                  <figcaption>
                    Version {v} — {variantLabels[v]}
                  </figcaption>
                  <div className={d === "mobile" ? "sp-frame sp-frame-mobile" : "sp-frame"}>
                    <Purchase variant={v} />
                  </div>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </main>
    </TooltipProvider>
  );
}
