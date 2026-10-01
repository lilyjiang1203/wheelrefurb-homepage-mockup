import freilackeLogo from "../assets/FreiLacke_Logo.png.asset.json";
import colorPanels from "../assets/freilacke-color-panels.jpg.asset.json";

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
        <div className="fl-band-head">
          <p className="ed-index fl-band-index">Coating technology / FreiLacke</p>
          <img
            className="fl-band-logo"
            src={freilackeLogo.url}
            alt="FreiLacke"
            width={1972}
            height={477}
            loading="lazy"
          />
        </div>
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
          <figure className="fl-band-media">
            <img
              src={colorPanels.url}
              alt="FreiLacke coating color sample panels"
              width={872}
              height={532}
              loading="lazy"
            />
          </figure>
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
