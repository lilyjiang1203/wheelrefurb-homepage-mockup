import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function AboutPageCta() {
  return (
    <section className="cta-section" aria-labelledby="about-page-cta-title">
      <div className="cta-panel">
        <p className="cta-kicker">Get started</p>
        <h2 id="about-page-cta-title" className="cta-title">
          Ready for a better finish?
        </h2>
        <p className="cta-intro">
          Find the right products for your next wheel refinishing project or
          talk to our team.
        </p>
        <div className="cta-actions">
          <Button asChild size="lg" className="cta-primary">
            <a href="/#contact-us">
              Contact us <ArrowRight aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="cta-secondary">
            <a href="/collections/all">Shop products</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
