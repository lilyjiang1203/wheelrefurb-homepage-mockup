import finishesImg from "../assets/about-hero-finishes.jpg";

export function AboutHero() {
  return (
    <section className="ah" aria-labelledby="about-page-title">
      <div className="ah-inner ah-head">
        <p className="ah-kicker">About Wheel Refurb</p>
        <h1 id="about-page-title" className="ah-display">
          Built around <span className="ah-accent">better finishes.</span>
        </h1>
      </div>
      <figure className="ah-media">
        <img
          src={finishesImg}
          alt="A row of alloy wheels shown in different coating finishes"
          width={1920}
          height={768}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </figure>
      <div className="ah-inner ah-foot">
        <p className="ah-lede">
          Professional wheel refinishing and coating solutions backed by
          advanced coating technology and industry expertise.
        </p>
        <dl className="ah-facts">
          <div>
            <dt>Specialty</dt>
            <dd>Wheel Refinishing &amp; Coating</dd>
          </div>
          <div>
            <dt>Serving</dt>
            <dd>Professionals &amp; Wheel Refinishers</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
