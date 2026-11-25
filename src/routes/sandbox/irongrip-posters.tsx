import { createFileRoute } from "@tanstack/react-router";
import audiScene from "../../assets/irongrip-audi-lv7d-wheel-scene.png.asset.json";
import orangeScene from "../../assets/irongrip-orange-wheel-scene.png.asset.json";

export const Route = createFileRoute("/sandbox/irongrip-posters")({
  head: () => ({
    meta: [
      { title: "Iron Grip Coatings Poster Concepts (Private)" },
      { name: "description", content: "Internal side-by-side review of two landscape website poster concepts." },
      { property: "og:title", content: "Iron Grip Coatings Poster Concepts (Private)" },
      { property: "og:description", content: "Two landscape poster concepts for internal review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
  component: PosterPreview,
});

type Poster = {
  id: string;
  image: string;
  alt: string;
  kicker: string;
  headline: string;
  line: string;
  colorName: string;
  code: string;
  tone: "cool" | "warm";
};

const posters: Poster[] = [
  {
    id: "A",
    image: audiScene.url,
    alt: "Alloy wheel and curved sample panel in Audi Anthracite Metallic",
    kicker: "OEM Color Match",
    headline: "It's more than gray",
    line: "Deep anthracite with a fine metallic sparkle, made to sit on the wheel the way it left the factory.",
    colorName: "Audi Anthracite Metallic",
    code: "LV7D",
    tone: "cool",
  },
  {
    id: "B",
    image: orangeScene.url,
    alt: "Alloy wheel and curved sample panel in a brushed copper-orange finish",
    kicker: "Custom Finish",
    headline: "Built to be noticed",
    line: "A warm brushed metallic that catches light along every spoke.",
    colorName: "Oompa Loompa Orange",
    code: "Code TBD",
    tone: "warm",
  },
];

function PosterPreview() {
  return (
    <main className="igp">
      <header className="igp-top">
        <p className="igp-eyebrow">Private preview · Not published</p>
        <h1 className="igp-title">Website poster concepts</h1>
        <p className="igp-sub">Two landscape hero posters for Iron Grip Coatings, built on the Style Guide v1 colors and type.</p>
      </header>
      <div className="igp-grid">
        {posters.map((p) => (
          <figure key={p.id} className="igp-item">
            <div className={`igp-poster igp-${p.tone}`}>
              <img src={p.image} alt={p.alt} className="igp-img" />
              <div className="igp-copy">
                <div className="igp-logo"><span className="igp-mark">IG</span><span>IRONGRIP<small>COATINGS</small></span></div>
                <p className="igp-kicker">{p.kicker}</p>
                <h2 className="igp-h">{p.headline}</h2>
                <p className="igp-line">{p.line}</p>
                <span className="igp-cta">Shop the color</span>
              </div>
              <div className="igp-chip"><strong>{p.colorName}</strong><span>{p.code}</span></div>
            </div>
            <figcaption className="igp-cap">Concept {p.id} · {p.colorName}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
