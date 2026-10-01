const brands = [
  {
    name: "FreiLacke",
    intro:
      "A professional coatings brand with an OEM-matched wheel paint system, covering the primers, basecoats and topcoats used in alloy wheel refinishing.",
    points: [
      "OEM-matched color systems",
      "Primer, basecoat and topcoat layers",
      "Durable, professional topcoats",
    ],
  },
  {
    name: "Cerakote",
    intro:
      "Thin-film ceramic coating technology, known for hard, corrosion-resistant finishes that stand up to heat, chemicals and daily use.",
    points: [
      "Thin-film ceramic coating",
      "Corrosion and chemical resistance",
      "Heat-resistant, durable finish",
    ],
  },
];

export function CoatingSolutions() {
  return (
    <section className="coating-section" aria-labelledby="coating-title">
      <div className="coating-inner">
        <div className="coating-head">
          <p className="coating-kicker">Premium coatings</p>
          <h2 id="coating-title" className="coating-title">
            Premium coating solutions
          </h2>
          <p className="coating-intro">
            We use high-quality coating products from internationally
            recognized brands such as FreiLacke and Cerakote to deliver
            durable, professional finishes for automotive wheels.
          </p>
        </div>
        <div className="coating-grid">
          {brands.map((brand) => (
            <article className="coating-card" key={brand.name}>
              <div className="coating-logo">
                <span className="coating-wordmark">{brand.name}</span>
              </div>
              <p className="coating-text">{brand.intro}</p>
              <ul className="coating-points">
                {brand.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
