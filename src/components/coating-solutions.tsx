import freilackeImg from "../assets/freilacke-system.jpg";
import cerakoteImg from "../assets/cerakote-finish.jpg";

const freilackeThemes = [
  {
    no: "A",
    title: "Complete product system",
    text: "Primers, fillers, liquid paints, powder coatings and clear coats from a single manufacturer — layers developed to work with one another rather than combined by chance.",
  },
  {
    no: "B",
    title: "Automotive & wheel expertise",
    text: "Coatings formulated for the demands of automotive parts and alloy wheels: stone chips, road salt, brake dust and constant temperature change.",
  },
  {
    no: "C",
    title: "Quality & testing",
    text: "Industrial production with consistent batch quality, and coatings tested for adhesion, weathering and long-term durability.",
  },
  {
    no: "D",
    title: "Technical support",
    text: "Technical data sheets and application guidance covering preparation, layer build and curing.",
  },
];

const cerakoteThemes = [
  { title: "Durability", text: "Built for demanding applications" },
  { title: "Corrosion resistance", text: "Enhanced surface protection" },
  { title: "Chemical & wear resistance", text: "Engineered for lasting performance" },
  { title: "Custom finishes", text: "Distinctive colors and finishes" },
];

export function CoatingSolutions() {
  return (
    <>
      <section className="fl-ed" aria-labelledby="fl-title">
        <div className="ed-wrap">
          <div className="fl-ed-head">
            <p className="ed-index">02 — Coating technology / FreiLacke</p>
            <span className="fl-ed-logo" aria-label="FreiLacke logo placeholder">FreiLacke</span>
          </div>
          <h2 id="fl-title" className="ed-display">
            More than paint.
            <br />
            <span className="ed-display-accent">A complete coating system.</span>
          </h2>

          <div className="fl-ed-grid">
            <figure className="fl-ed-media">
              <img
                src={freilackeImg}
                alt="Refinished alloy wheel beside primer, color and clear coat products"
                width={1280}
                height={1024}
                loading="lazy"
              />
              <figcaption className="ed-caption">Primer · Color · Clear — one system</figcaption>
            </figure>
            <div className="fl-ed-copy">
              <p className="ed-lede">
                FreiLacke is an established German industrial coating
                manufacturer with a comprehensive coating ecosystem — liquid
                paints and powder coatings, from the first primer to the final
                clear coat.
              </p>
              <p className="ed-body">
                We use high-quality coating products from internationally
                recognized brands such as FreiLacke and Cerakote to deliver
                durable, professional finishes for automotive wheels.
              </p>
              <dl className="ed-spec">
                <div><dt>Origin</dt><dd>Germany</dd></div>
                <div><dt>Range</dt><dd>Liquid &amp; powder</dd></div>
                <div><dt>Focus</dt><dd>Industrial &amp; automotive</dd></div>
              </dl>
            </div>
          </div>

          <ol className="fl-ed-themes">
            {freilackeThemes.map((t) => (
              <li key={t.no}>
                <span className="fl-ed-no">{t.no}</span>
                <h3 className="fl-ed-title">{t.title}</h3>
                <p className="ed-body">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ck-ed" aria-labelledby="ck-title">
        <div className="ck-ed-media">
          <img
            src={cerakoteImg}
            alt="Ceramic-coated wheel spoke with water beading on the surface"
            width={1280}
            height={1024}
            loading="lazy"
          />
        </div>
        <div className="ck-ed-inner">
          <p className="ed-index ck-ed-index">03 — Coating technology / Cerakote</p>
          <span className="ck-ed-logo" aria-label="Cerakote logo placeholder">Cerakote</span>
          <h2 id="ck-title" className="ed-display ck-ed-display">
            Ceramic,
            <br />
            engineered thin.
          </h2>
          <p className="ck-ed-lede">
            Cerakote is a specialized thin-film ceramic coating — built for
            parts that face heat, chemicals and harsh conditions, without
            giving up on appearance.
          </p>
          <ul className="ck-ed-list">
            {cerakoteThemes.map((t, i) => (
              <li key={t.title}>
                <span className="ck-ed-no">0{i + 1}</span>
                <span>
                  <span className="ck-ed-title">{t.title}</span>
                  <span className="ck-ed-text">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
