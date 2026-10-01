import coatingAsset from "../assets/who-we-are-coating.webp.asset.json";
const coatingImage = coatingAsset.url;

const disciplines = ["Refinishing", "Restoration", "Coating", "Custom finishes"];

export function WhoWeAre() {
  return (
    <section className="ed-intro" aria-labelledby="who-title">
      <div className="ed-wrap ed-intro-grid">
        <div className="ed-intro-copy">
          <p className="ed-index">01 — Wheel Refurb</p>
          <h2 id="who-title" className="ed-h2">
            Focused on the finish.
          </h2>
          <p className="ed-lede">
            Wheel Refurb specializes in professional automotive wheel
            refinishing, restoration and coating. From surface preparation to
            the final finish, we focus on consistent results, durable
            protection and attention to detail.
          </p>
          <p className="ed-body">
            We also supply professional coating products for wheel
            refinishing, including paints, primers, clear coats and powders
            from established manufacturers.
          </p>
          <ul className="ed-disciplines" aria-label="What we do">
            {disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <figure className="ed-intro-media">
          <img
            src={coatingImage}
            alt="Technician spray-coating a gloss black wheel in the booth"
            width={1024}
            height={1280}
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}
