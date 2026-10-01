import heroImage from "../assets/about-hero.jpg";

export function AboutHero() {
  return (
    <section className="ah" aria-labelledby="about-page-title">
      <div className="ah-grid">
        <div className="ah-copy">
          <p className="ah-kicker">About Wheel Refurb</p>
          <h1 id="about-page-title" className="ah-display">
            Built around
            <br />
            <span className="ah-accent">better finishes.</span>
          </h1>
          <p className="ah-lede">
            Professional wheel refinishing, restoration and coating solutions
            backed by advanced coating technology and industry expertise.
          </p>
          <p className="ah-meta">
            <span className="ah-dot" aria-hidden="true" />
            <span className="ah-meta-city">Edmonton, Alberta</span>
            <span className="ah-meta-sep" aria-hidden="true">
              ·
            </span>
            <span className="ah-meta-field">Professional wheel refinishing</span>
          </p>
        </div>

        <figure className="ah-media">
          <span className="ah-fig" aria-hidden="true">
            Fig. 01
          </span>
          <img
            src={heroImage}
            alt="Macro detail of a refinished alloy wheel: coated spokes, machined rim lip and water beading on the clear coat"
            width={1024}
            height={1408}
          />
        </figure>
      </div>
    </section>
  );
}
