import craftImage from "../assets/about-craft.jpg";

const disciplines = ["Refinishing", "Restoration", "Coating", "Custom finishes"];

export function WhoWeAre() {
  return (
    <section className="ed-intro" aria-labelledby="who-title">
      <div className="ed-wrap ed-intro-grid">
        <div className="ed-intro-copy">
          <p className="ed-index">01 — Wheel Refurb</p>
          <h2 id="who-title" className="ed-h2">
            Wheel finishes are our whole focus.
          </h2>
          <p className="ed-lede">
            Wheel Refurb works in one discipline: professional refinishing of
            automotive alloy wheels. We restore, prepare, coat and finish wheels
            — and supply the paints, primers, clear coats and powders that
            professionals rely on to do the same.
          </p>
          <p className="ed-body">
            Good work starts with good materials. That is why we build around
            advanced coating technology from established manufacturers, applied
            with careful preparation and attention to detail.
          </p>
          <ul className="ed-disciplines" aria-label="What we do">
            {disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <figure className="ed-intro-media">
          <img
            src={craftImage}
            alt="Technician prepping an alloy wheel spoke before refinishing"
            width={1024}
            height={1024}
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}
