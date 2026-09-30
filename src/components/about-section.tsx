import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const aboutPanels = [
  {
    title: "Our mission",
    text: "Make professional wheel refinishing straightforward — one matched range of paints, coatings and supplies covering every stage of the job, from prep to final coat.",
  },
  {
    title: "Our vision",
    text: "To be the first place shops and refinishing professionals go for wheel paint, coating and refinishing products.",
  },
];

export function AboutSection() {
  return (
    <section className="about-section" id="about-us" aria-labelledby="about-title">
      <div className="about-panel">
        <div className="about-grid">
          <div className="about-copy">
            <h2 id="about-title" className="about-title">
              About us
            </h2>
            <p className="about-intro">
              FreiLack WheelRefurb supplies professional wheel refinishing
              products: wheel paints, primers, clear coats, powders and
              refinishing supplies. The range is built around OEM-matched
              colors and professional-grade finishes, so shops and
              professionals can match, coat and protect alloy wheels properly.
            </p>
            <div className="about-actions">
              <Button asChild size="lg" className="about-cta">
                <a href="/collections/all">
                  Shop products <ArrowRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
          <div className="about-panels">
            {aboutPanels.map((panel) => (
              <article className="about-card" key={panel.title}>
                <h3 className="about-card-title">{panel.title}</h3>
                <p className="about-card-text">{panel.text}</p>
              </article>
            ))}
          </div>
        </div>
        <p className="about-tagline">
          Wheel paint, coating &amp; refinishing products
        </p>
      </div>
    </section>
  );
}
