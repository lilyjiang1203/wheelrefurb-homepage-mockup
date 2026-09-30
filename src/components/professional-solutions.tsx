import { ArrowRight, BadgeCheck, Layers, Palette } from "lucide-react";
import { Button } from "./ui/button";
import solutionsImage from "../assets/finish-solutions.jpg";

const solutionsFeatures = [
  {
    label: "OEM-Matched Finishes",
    text: "Professional wheel paint solutions",
    icon: Palette,
  },
  {
    label: "Professional-Grade",
    text: "Products for wheel refinishing",
    icon: BadgeCheck,
  },
  {
    label: "Complete System",
    text: "Paints, coatings & refinishing supplies",
    icon: Layers,
  },
];

export function ProfessionalSolutions() {
  return (
    <section
      className="solutions-section"
      id="professional-solutions"
      aria-labelledby="solutions-title"
    >
      <div className="solutions-inner">
        <div className="solutions-grid">
          <div className="solutions-copy">
            <p className="solutions-kicker">Wheel refinishing specialists</p>
            <h2 id="solutions-title" className="solutions-title">
              Professional wheel paint solutions
            </h2>
            <p className="solutions-intro">
              Professional-grade wheel paints, coatings and refinishing
              supplies.
            </p>
            <div className="solutions-actions">
              <Button asChild size="lg" className="solutions-cta">
                <a href="/collections/all">
                  Shop products <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
          <div className="solutions-media">
            <img
              src={solutionsImage}
              alt="Freshly refinished graphite metallic alloy wheel on a studio turntable"
              width={1024}
              height={1024}
              loading="lazy"
            />
          </div>
        </div>
        <ul className="solutions-features">
          {solutionsFeatures.map((feature) => (
            <li className="solutions-feature" key={feature.label}>
              <span className="solutions-feature-icon">
                <feature.icon aria-hidden="true" />
              </span>
              <span className="solutions-feature-body">
                <span className="solutions-feature-label">
                  {feature.label}
                </span>
                <span className="solutions-feature-text">{feature.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
