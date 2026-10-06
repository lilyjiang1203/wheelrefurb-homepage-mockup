import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import finishImage from "../assets/about-hero-wheels.jpg";
import colorImage from "../assets/category-wheel-paint.jpg";
import customImage from "../assets/category-candy-colors.jpg";
import { Button } from "./ui/button";

export function GuidedProductFinder() {
  const projects = [
    { title: "Restore the Original OEM Finish", description: "Bring your wheels back to their original factory color and finish.", image: finishImage, active: true },
    { title: "Change My Wheel Color", description: "Choose a different color or finish for your wheels.", image: colorImage, active: false },
    { title: "Create a Custom / Special Finish", description: "Explore candy colors, special effects, and custom wheel finishes.", image: customImage, active: false },
  ];
  return <section className="featured-section gpf-entry" aria-labelledby="guided-finder-title">
    <div className="featured-inner">
      <div className="featured-head"><p className="finder-kicker">Guided Product Finder</p><h2 className="featured-title" id="guided-finder-title">Not Sure What You Need?</h2><p className="featured-intro">Tell us what you're working on and we'll guide you to the right products.</p></div>
      <div className="gpf-project-grid">{projects.map((project) => <article className="featured-card" key={project.title}>
        <div className="featured-media"><img src={project.image} alt={project.title} loading="lazy" /></div>
        <div className="featured-body gpf-project-body"><h3 className="featured-name">{project.title}</h3><p className="featured-finish">{project.description}</p>
          {project.active ? <Button asChild className="gpf-primary"><Link to="/product-finder/oem-restore">Start Product Finder<ArrowRight aria-hidden="true" /></Link></Button> : <span className="gpf-coming">Coming Soon</span>}
        </div>
      </article>)}</div>
    </div>
  </section>;
}