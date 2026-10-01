import prepImg from "../assets/surface-prep.jpg";
import boothImage from "../assets/powder-application.webp";
import finishImg from "../assets/wheel-finish-closeup.jpg";


export function WhyChoose() {
  return (
    <section className="ed-close" aria-labelledby="close-title">
      <div className="ed-wrap ed-close-grid">
        <p className="ed-index">Back to the wheel</p>
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
          <div className="ed-close-step">
            <figure className="ed-close-tile">
              <img
                src={prepImg}
                alt="Bare alloy wheel masked and primed on a prep bench"
                width={1200}
                height={912}
                loading="lazy"
              />
            </figure>
            <p className="ed-close-label">Prepare</p>
          </div>
          <div className="ed-close-step">
            <figure className="ed-close-tile">
              <img
                src={boothImage}
                alt="Coating being applied to a wheel with a spray gun"
                width={500}
                height={375}
                loading="lazy"
              />
            </figure>
            <p className="ed-close-label">Coat</p>
          </div>
          <div className="ed-close-step">
            <figure className="ed-close-tile">
              <img
                src={finishImg}
                alt="Finished alloy wheel in a dark metallic clear coat"
                width={1408}
                height={1104}
                loading="lazy"
              />
            </figure>
            <p className="ed-close-label">Finish</p>
          </div>
        </div>
      </div>
    </section>
  );
}
