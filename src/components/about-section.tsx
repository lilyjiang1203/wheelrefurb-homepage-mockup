import { ArrowRight, Package, ShieldCheck, Users } from "lucide-react";
import { Button } from "./ui/button";
import wheelImage from "../assets/about-wheel.jpg";

const aboutStats = [
  { icon: Package, value: "27", label: "Vehicle brands" },
  { icon: Users, value: "6", label: "Product ranges" },
  { icon: ShieldCheck, value: "OEM", label: "Matched finishes" },
];

export function AboutSection() {
  return (
    <section
      className="about-section"
      id="about-us"
      aria-labelledby="about-title"
    >
      <div className="about-panel">
        <div className="about-copy">
          <h2 id="about-title" className="about-title">
            About FreiLack WheelRefurb
          </h2>
          <p className="about-intro">
            FreiLack WheelRefurb supplies professional wheel refinishing
            products: wheel paints, primers, clear coats, powders and
            refinishing supplies. The range is built around OEM-matched colors
            and professional-grade finishes, so shops and professionals can
            match, coat and protect alloy wheels properly.
          </p>
          <ul className="about-stats">
            {aboutStats.map((stat) => (
              <li className="about-stat" key={stat.label}>
                <stat.icon aria-hidden="true" />
                <span className="about-stat-value">{stat.value}</span>
                <span className="about-stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
          <div className="about-actions">
            <Button asChild size="lg" className="about-cta">
              <a href="/collections/all">
                View all <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
        <div className="about-media" aria-hidden="true">
          <span className="about-media-word">Refurb</span>
          <img
            className="about-media-img"
            src={wheelImage}
            alt=""
            width={1280}
            height={1024}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
