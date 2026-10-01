import { BadgeCheck, Palette, ShieldCheck, Wrench } from "lucide-react";

const reasons = [
  {
    icon: BadgeCheck,
    label: "Quality Workmanship",
    text: "Professional refinishing standards at every step.",
  },
  {
    icon: ShieldCheck,
    label: "Durable Finishes",
    text: "Coatings chosen to survive brake dust, heat and weather.",
  },
  {
    icon: Palette,
    label: "Customized Solutions",
    text: "OEM-matched colors plus candy and color-shifting finishes.",
  },
  {
    icon: Wrench,
    label: "Attention to Detail",
    text: "Prep, masking and application done the careful way.",
  },
];

export function WhyChoose() {
  return (
    <section className="why-section" aria-labelledby="why-title">
      <div className="why-inner">
        <div className="why-head">
          <p className="why-kicker">Why choose us</p>
          <h2 id="why-title" className="why-title">
            Why choose Wheel Refurb
          </h2>
          <p className="why-intro">
            The reasons shops and enthusiasts keep coming back.
          </p>
        </div>
        <ul className="why-grid">
          {reasons.map((reason) => (
            <li className="solutions-feature" key={reason.label}>
              <span className="solutions-feature-icon">
                <reason.icon aria-hidden="true" />
              </span>
              <span className="solutions-feature-body">
                <span className="solutions-feature-label">{reason.label}</span>
                <span className="solutions-feature-text">{reason.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
