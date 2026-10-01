import boothImg from "../assets/about-hero-booth.webp.asset.json";

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
          src={boothImg.url}
          alt="A masked wheel being coated in a workshop spray booth"
          width={1920}
          height={865}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </figure>
      <div className="ah-inner ah-foot">
        <p className="ah-lede">
          Professional wheel refinishing, restoration and coating solutions
          backed by advanced coating technology and industry expertise.
        </p>
        <dl className="ah-facts">
          <div>
            <dt>Location</dt>
            <dd>Edmonton, Alberta</dd>
          </div>
          <div>
            <dt>Field</dt>
            <dd>Professional wheel refinishing</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
