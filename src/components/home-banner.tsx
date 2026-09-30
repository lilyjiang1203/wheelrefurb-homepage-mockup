import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import bannerImage from "../assets/workshop-banner.jpg";

const bannerFacts = [
  { label: "OEM-Matched Finishes", text: "Professional wheel paint solutions" },
  { label: "Professional-Grade", text: "Products for wheel refinishing" },
  { label: "Complete System", text: "Paints, coatings & refinishing supplies" },
];

export function HomeBanner() {
  return (
    <section className="home-banner" aria-labelledby="home-banner-title">
      <img
        className="home-banner-media"
        src={bannerImage}
        alt="Technician in gloves spray finishing an alloy wheel in a professional refinishing workshop"
        width={1920}
        height={1088}
        fetchPriority="high"
      />
      <div className="home-banner-inner">
        <p className="home-banner-kicker">FreiLack WheelRefurb</p>
        <h1 id="home-banner-title" className="home-banner-title">
          Professional wheel refinishing products
        </h1>
        <p className="home-banner-intro">
          OEM-quality wheel paints, primers, clear coats, powders and
          refinishing supplies for professionals.
        </p>
        <div className="home-banner-actions">
          <Button asChild size="lg" className="home-banner-cta">
            <a href="/collections/all">
              Shop products <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        </div>
        <ul className="home-banner-facts">
          {bannerFacts.map((fact) => (
            <li key={fact.label}>
              <span className="home-banner-fact">
                <span className="home-banner-fact-label">{fact.label}</span>
                <span className="home-banner-fact-text">{fact.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
