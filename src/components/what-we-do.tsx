import { Layers, ShieldCheck, SprayCan } from "lucide-react";

const services = [
  {
    icon: SprayCan,
    label: "Wheel Refinishing",
    text: "OEM-matched wheel paints and primers for factory-style finishes and accurate color restoration.",
  },
  {
    icon: ShieldCheck,
    label: "Coating & Protection",
    text: "Clear coats and powder coatings that seal, protect and extend the life of a refinished wheel.",
  },
  {
    icon: Layers,
    label: "Custom Finishes",
    text: "Candy colors and FreiFlip color-shifting finishes for standout, custom-styled wheels.",
  },
];

export function WhatWeDo() {
  return (
    <section className="services-section" aria-labelledby="services-title">
      <div className="services-inner">
        <div className="services-head">
          <p className="services-kicker">What we do</p>
          <h2 id="services-title" className="services-title">
            Key services
          </h2>
          <p className="services-intro">
            A focused range covering every stage of a professional wheel
            finish.
          </p>
        </div>
        <ul className="services-grid">
          {services.map((service) => (
            <li className="services-card" key={service.label}>
              <span className="services-icon">
                <service.icon aria-hidden="true" />
              </span>
              <span className="services-label">{service.label}</span>
              <span className="services-text">{service.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
