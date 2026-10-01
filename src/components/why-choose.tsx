import powdersAsset from "../assets/coating-powders-clean.jpg.asset.json";
import signAsset from "../assets/freilacke-sign.webp.asset.json";
import boothAsset from "../assets/powder-application.webp.asset.json";

const powdersImage = powdersAsset.url;
const signImage = signAsset.url;
const boothImage = boothAsset.url;

export function WhyChoose() {
  return (
    <section className="ed-close" aria-labelledby="close-title">
      <div className="ed-wrap ed-close-grid">
        <p className="ed-index">03 — Back to the wheel</p>
        <div>
          <h2 id="close-title" className="ed-h2">
            The right system, applied with care.
          </h2>
          <p className="ed-lede">
            Advanced coatings only perform when the preparation and application
            are right. At Wheel Refurb we pair proven coating technology with
            careful workmanship — so every wheel leaves with a finish that looks
            right and lasts.
          </p>
          <p className="ed-body ed-close-note">
            Quality workmanship · Durable finishes · Attention to detail ·
            Customized solutions
          </p>
        </div>
        <div className="ed-close-strip">
          <figure className="ed-close-tile">
            <img
              src={boothImage}
              alt="Coating being applied with a spray gun"
              width={500}
              height={375}
              loading="lazy"
            />
          </figure>
          <figure className="ed-close-tile ed-close-tile-sign">
            <img
              src={signImage}
              alt="FreiLacke signage with its color band"
              width={1920}
              height={1280}
              loading="lazy"
            />
          </figure>
          <figure className="ed-close-tile">
            <img
              src={powdersImage}
              alt="Pans of colored coating powder"
              width={500}
              height={340}
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
