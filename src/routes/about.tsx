import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { AboutHero } from "../components/about-hero";
import { WhoWeAre } from "../components/who-we-are";
import { FreilackeSection } from "../components/freilacke-section";
import { WhyChoose } from "../components/why-choose";
import { AboutPageCta } from "../components/about-page-cta";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | FreiLack WheelRefurb" },
      {
        name: "description",
        content:
          "FreiLack WheelRefurb is an authorized FreiLacke partner in Edmonton, Alberta — professional automotive wheel refinishing, restoration and coating with OEM-matched wheel paints, clear coats and powders.",
      },
      { property: "og:title", content: "About Us — FreiLack WheelRefurb" },
      {
        property: "og:description",
        content:
          "Authorized FreiLacke partner offering professional automotive wheel refinishing: restoration, custom finishes and premium coating solutions.",
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
        <div className="ah-intro-band">
          <AboutHero />
          <WhoWeAre />
        </div>
        <FreilackeSection />
        <WhyChoose />
        <AboutPageCta />
      </main>
    </div>
  );
}
