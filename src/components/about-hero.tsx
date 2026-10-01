import boothImg from "../assets/about-hero-booth.webp.asset.json";

export function AboutHero() {
  return (
    <section className="ah" aria-labelledby="about-page-title">
      <div className="ah-inner">
        <p className="ah-kicker">About Wheel Refurb</p>
        <div className="ah-grid">
          <h1 id="about-page-title" className="ah-display">
            Built around <span className="ah-accent">better finishes.</span>
          </h1>
          <div className="ah-body">
            <p className="ah-lede">
              Professional wheel refinishing, restoration and coating solutions
              backed by advanced coating technology and industry expertise.
            </p>
          </div>
        </div>
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
          <figcaption className="ah-figcaption">
            In the booth — masked wheel, mid-application
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
