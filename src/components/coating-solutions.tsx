import freilackeImg from "../assets/freilacke-system.jpg";
import cerakoteImg from "../assets/cerakote-finish.jpg";
import {
  Factory,
  Layers,
  BadgeCheck,
  FileText,
  FlaskConical,
  ShieldCheck,
  Flame,
  Droplets,
  Palette,
  Sparkles,
  Gauge,
  Car,
} from "lucide-react";

const freilackeBenefits = [
  { icon: Layers, label: "Complete coating system", text: "Matched pretreatment, primers, basecoats, powders and clear coats designed to work together." },
  { icon: BadgeCheck, label: "Quality standards", text: "Industrial manufacturing with consistent batch quality and repeatable results." },
  { icon: FileText, label: "Technical documentation", text: "Data sheets and process guidance for application, curing and layer build." },
  { icon: FlaskConical, label: "Tested performance", text: "Coatings developed and tested for adhesion, weathering and long-term durability." },
  { icon: ShieldCheck, label: "Durable finishes", text: "Resistant to stone chips, road salt, brake dust and everyday wear." },
  { icon: Car, label: "Automotive & wheel experience", text: "Coating solutions used across automotive and alloy wheel applications." },
];

const process = [
  { step: "01", title: "Surface preparation", text: "Stripping, cleaning and pretreatment for a sound base." },
  { step: "02", title: "Primer", text: "Adhesion and corrosion protection on bare alloy." },
  { step: "03", title: "Color coat", text: "OEM-matched wet paint or powder in the chosen finish." },
  { step: "04", title: "Clear coat", text: "Gloss, depth and protection against the elements." },
  { step: "05", title: "Curing & inspection", text: "Controlled cure, then a final quality check." },
];

const cerakoteFeatures = [
  { icon: Sparkles, label: "Ceramic coating technology", text: "Thin-film ceramic finish that keeps fine detail and tight tolerances." },
  { icon: ShieldCheck, label: "Durability", text: "Hard, abrasion- and impact-resistant surface." },
  { icon: Droplets, label: "Corrosion resistance", text: "Protects metal against moisture, salt and oxidation." },
  { icon: FlaskConical, label: "Chemical resistance", text: "Holds up to cleaners, fuels and brake dust." },
  { icon: Flame, label: "Heat resistance", text: "High-temperature formulations for demanding parts." },
  { icon: Palette, label: "Customization", text: "Wide range of colors and specialized finishes for unique builds." },
];

export function CoatingSolutions() {
  return (
    <>
      <section className="coating-section" aria-labelledby="coating-title">
        <div className="coating-inner">
          <div className="coating-head">
            <p className="coating-kicker">Premium coatings</p>
            <h2 id="coating-title" className="coating-title">Premium coating solutions</h2>
            <p className="coating-intro">
              We use high-quality coating products from internationally
              recognized brands such as FreiLacke and Cerakote to deliver
              durable, professional finishes for automotive wheels.
            </p>
          </div>
        </div>
      </section>

      {/* FreiLacke */}
      <section className="fl-section" aria-labelledby="fl-title">
        <div className="coating-inner">
          <div className="fl-top">
            <div>
              <div className="fl-logo"><span className="coating-wordmark">FreiLacke</span></div>
              <p className="coating-kicker fl-kicker"><Factory aria-hidden className="size-4" /> German coating manufacturer</p>
              <h2 id="fl-title" className="coating-title">A complete professional coating system</h2>
              <p className="coating-intro">
                FreiLacke is an established German industrial coating manufacturer
                with a comprehensive range of liquid paints and powder coatings.
                Rather than a single paint, it offers a complete system — from
                pretreatment and primer to color and clear coat — built around
                consistent quality, technical support and proven durability.
              </p>
              <p className="coating-intro">
                For wheel refinishing, that means every layer is designed to work
                with the next, giving professional, repeatable results.
              </p>
            </div>
            <figure className="fl-media">
              <img src={freilackeImg} alt="Refinished alloy wheel beside primer, color and clear coat products" width={1280} height={1024} loading="lazy" />
            </figure>
          </div>

          <div className="fl-process" aria-label="FreiLacke coating process">
            <p className="fl-process-label">The coating process</p>
            <ol className="fl-steps">
              {process.map((p) => (
                <li key={p.step} className="fl-step">
                  <span className="fl-step-num">{p.step}</span>
                  <span className="fl-step-title">{p.title}</span>
                  <span className="fl-step-text">{p.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <ul className="fl-benefits">
            {freilackeBenefits.map(({ icon: Icon, label, text }) => (
              <li key={label} className="fl-benefit">
                <span className="fl-benefit-icon"><Icon aria-hidden className="size-5" /></span>
                <span className="fl-benefit-label">{label}</span>
                <span className="fl-benefit-text">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cerakote */}
      <section className="ck-section" aria-labelledby="ck-title">
        <div className="coating-inner ck-grid">
          <figure className="ck-media">
            <img src={cerakoteImg} alt="Close-up of a ceramic-coated wheel spoke with water beading" width={1280} height={1024} loading="lazy" />
          </figure>
          <div>
            <div className="fl-logo ck-logo"><span className="coating-wordmark">Cerakote</span></div>
            <p className="coating-kicker fl-kicker"><Gauge aria-hidden className="size-4" /> Ceramic coating technology</p>
            <h2 id="ck-title" className="coating-title">Advanced ceramic finishes</h2>
            <p className="coating-intro">
              Cerakote is a thin-film ceramic coating known for specialized
              finishes that combine a sleek look with exceptional toughness —
              ideal for wheels and parts that face heat, chemicals and harsh
              conditions.
            </p>
            <ul className="ck-features">
              {cerakoteFeatures.map(({ icon: Icon, label, text }) => (
                <li key={label} className="ck-feature">
                  <span className="fl-benefit-icon"><Icon aria-hidden className="size-4" /></span>
                  <span>
                    <span className="fl-benefit-label">{label}</span>
                    <span className="fl-benefit-text">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
