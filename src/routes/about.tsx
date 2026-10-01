import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { AboutHero } from "../components/about-hero";
import { WhoWeAre } from "../components/who-we-are";
import { WhatWeDo } from "../components/what-we-do";
import { CoatingSolutions } from "../components/coating-solutions";
import { WhyChoose } from "../components/why-choose";
import { AboutPageCta } from "../components/about-page-cta";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | FreiLack WheelRefurb" },
      {
        name: "description",
        content:
          "FreiLack WheelRefurb is a professional automotive wheel refinishing and coating company — OEM-matched wheel paints, clear coats, powders and premium coating solutions.",
      },
      { property: "og:title", content: "About Us — FreiLack WheelRefurb" },
      {
        property: "og:description",
        content:
          "Professional automotive wheel refinishing and coating: restoration, custom finishes and premium coating solutions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <StoreNavigation />
      <main>
        <AboutHero />
        <WhoWeAre />
        <WhatWeDo />
        <CoatingSolutions />
        <WhyChoose />
        <AboutPageCta />
      </main>
    </div>
  );
}
