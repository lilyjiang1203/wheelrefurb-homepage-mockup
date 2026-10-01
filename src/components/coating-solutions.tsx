import cerakoteImg from "../assets/cerakote-finish.jpg";
import cerakoteLogo from "../assets/cerakote_black_gold.png.asset.json";

const cerakoteThemes = [
  { title: "Durability", text: "Built for demanding applications" },
  { title: "Corrosion resistance", text: "Enhanced surface protection" },
  { title: "Chemical & wear resistance", text: "Engineered for lasting performance" },
  { title: "Custom finishes", text: "Distinctive colors and finishes" },
];

export function CoatingSolutions() {
  return (
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
        <p className="ed-index ck-ed-index">02 — Coating technology / Cerakote</p>
        <img
          className="ck-ed-logo"
          src={cerakoteLogo.url}
          alt="Cerakote"
          width={1024}
          height={395}
          loading="lazy"
        />
        <p className="ck-ed-kicker">Advanced ceramic coating technology</p>
        <h2 id="ck-title" className="ed-display ck-ed-display">
          Performance
          <br />
          meets customization.
        </h2>
        <p className="ck-ed-lede">
          Cerakote is an advanced ceramic coating technology designed for
          applications where both performance and appearance matter.
        </p>
        <p className="ck-ed-body">
          Its thin-film ceramic coatings combine durability, corrosion
          resistance, chemical resistance and excellent wear performance with
          a wide range of colors and finishes — making Cerakote an exciting
          option for distinctive, high-performance wheel finishes.
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
  );
}
