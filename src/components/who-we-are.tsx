import craftImage from "../assets/about-craft.jpg";

export function WhoWeAre() {
  return (
    <section className="who-section" aria-labelledby="who-title">
      <div className="who-inner">
        <div className="who-grid">
          <div className="who-copy">
            <p className="who-kicker">Who we are</p>
            <h2 id="who-title" className="who-title">
              Built around wheel finishes
            </h2>
            <p className="who-text">
              Wheel Refurb focuses on professional wheel refinishing,
              restoration, coating and custom finishes for alloy wheels.
            </p>
            <p className="who-text">
              Everything in the range is chosen for workmanship, quality
              materials and attention to detail — durable, professional
              finishes built to hold up to daily use.
            </p>
          </div>
          <div className="who-media">
            <img
              src={craftImage}
              alt="Close-up of a technician prepping an alloy wheel spoke before refinishing"
              width={1024}
              height={1024}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
