import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Share } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

export const Route = createFileRoute("/sandbox/share-preview")({
  head: () => ({
    meta: [
      { title: "Share Control Preview (Private) | Wheel Refurb" },
      { name: "description", content: "Internal comparison of two share control treatments in the purchase section." },
      { property: "og:title", content: "Share Control Preview (Private)" },
      { property: "og:description", content: "Internal comparison of two share control treatments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SharePreview,
});

const sizes = ["0.5L", "1L", "5L"];

function Purchase({ variant }: { variant: "A" | "B" }) {
  const [size, setSize] = useState("1L");
  const [note, setNote] = useState<string | null>(null);
  const share = async () => {
    const url = `${window.location.origin}/products/audi-anthracite-lv7d`;
    try {
      if (navigator.share) await navigator.share({ title: "Audi Anthracite LV7D", url });
      else { await navigator.clipboard.writeText(url); setNote("Link copied"); setTimeout(() => setNote(null), 1800); }
    } catch { /* user cancelled */ }
  };
  return (
    <div className="sp-purchase">
      <p className="sp-eyebrow">FreiLacke / Wheel Refinishing Color</p>
      <h3 className="sp-title">Audi Anthracite LV7D</h3>
      <p className="sp-price">CAD $XX.XX</p>
      <span className="sp-label">Package size</span>
      <div className="sp-sizes">
        {sizes.map((s) => (
          <Button key={s} variant="outline" size="sm" aria-pressed={size === s} className={size === s ? "sp-size-on" : ""} onClick={() => setSize(s)}>{s}</Button>
        ))}
      </div>
      {variant === "A" ? (
        <>
          <Button className="sp-cart">Add to cart</Button>
          <button type="button" className="sp-share-link" onClick={share}>
            <Share size={14} strokeWidth={1.5} aria-hidden="true" /> Share
          </button>
        </>
      ) : (
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
              {(["A", "B"] as const).map((v) => (
                <figure key={v} className="sp-fig">
                  <figcaption>Version {v} — {v === "A" ? "text link below Add to cart" : "outlined icon button with tooltip"}</figcaption>
                  <div className={d === "mobile" ? "sp-frame sp-frame-mobile" : "sp-frame"}><Purchase variant={v} /></div>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </main>
    </TooltipProvider>
  );
}
