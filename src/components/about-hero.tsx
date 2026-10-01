import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import heroImage from "../assets/about-hero.jpg";

export function AboutHero() {
  return (
    <section className="about-hero-section" aria-labelledby="about-page-title">
      <div className="about-hero-inner">
        <p className="about-hero-kicker">About Us</p>
        <h1 id="about-page-title" className="about-hero-title">
          Professional wheel refinishing and coating
        </h1>
        <p className="about-hero-intro">
          FreiLack WheelRefurb is a professional automotive wheel refinishing
          and coating company, supplying OEM-quality wheel paints, primers,
          clear coats, powders and refinishing supplies.
        </p>
        <div className="about-hero-actions">
          <Button asChild size="lg" className="about-hero-cta">
            <a href="/collections/all">
              Shop products <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        </div>
        <img
          className="about-hero-media"
          src={heroImage}
          alt="Technician refinishing an alloy wheel at a professional workshop bench"
          width={1600}
          height={900}
        />
      </div>
    </section>
  );
}
