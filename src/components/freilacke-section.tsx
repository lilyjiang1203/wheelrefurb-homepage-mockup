import freilackeSignSrc from "../assets/freilacke-sign.webp";
import coatingPowdersSrc from "../assets/coating-powders-clean.jpg";

const freilackeSpec = [
  { term: "Since 1926", desc: "Coating expertise" },
  { term: "30+ Years", desc: "Light-alloy wheel expertise" },
  { term: "Complete systems", desc: "Coordinated coating technologies" },
  { term: "Tested & supported", desc: "Performance testing and technical support" },
];

export function FreilackeSection() {
  return (
    <section className="fl-band" aria-labelledby="fl-title">
      <div className="ed-wrap">
        <p className="ed-index fl-band-index">Coating technology / FreiLacke</p>
        <div className="fl-band-cols">
          <div>
            <p className="fl-band-status">Authorized FreiLacke Partner</p>
            <h2 id="fl-title" className="ed-display fl-band-display">
              More than paint.
              <br />
              <span className="ed-display-accent">A complete coating system.</span>
            </h2>
            <p className="fl-band-lede">
              As an Authorized FreiLacke Partner, Wheel Refurb brings German-engineered coating
              technology to professional wheel refinishing.
            </p>
            <p className="fl-band-body">
              Founded in 1926, FreiLacke brings decades of coating expertise and
              more than 30 years of experience in the light-alloy wheel
              industry. Its System Coatings approach integrates compatible
              coating technologies with rigorous testing, technical expertise
              and ongoing support.
            </p>
          </div>
          <div className="fl-band-media">
            <div className="fl-band-step">
              <figure className="fl-band-tile">
                <img
                  src={freilackeSignSrc}
                  alt="FreiLacke lettering on a wall at the coating manufacturer"
                  width={1920}
                  height={1280}
                  loading="lazy"
                />
              </figure>
              <p className="fl-band-label">The manufacturer</p>
            </div>
            <div className="fl-band-step">
              <figure className="fl-band-tile">
                <img
                  src={coatingPowdersSrc}
                  alt="Colored coating powders in sample bowls"
                  width={494}
                  height={330}
                  loading="lazy"
                />
              </figure>
              <p className="fl-band-label">Coating systems</p>
            </div>
          </div>
        </div>
        <dl className="fl-band-spec">
          {freilackeSpec.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.desc}</dd>
            </div>
          ))}
        </dl>
        <p className="fl-band-note">
          From primer to finish, every layer works as part of a complete system.
        </p>
      </div>
    </section>
  );
}
