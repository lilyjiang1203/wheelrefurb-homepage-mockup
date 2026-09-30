import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { ColorFinder } from "../components/color-finder";
import { HomeBanner } from "../components/home-banner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Professional Wheel Refinishing Products | FreiLack WheelRefurb" },
      { name: "description", content: "OEM-quality wheel paints, primers, clear coats, powders and refinishing supplies for professionals, plus a wheel color finder by vehicle brand." },
      { property: "og:title", content: "Professional Wheel Refinishing Products — FreiLack WheelRefurb" },
      { property: "og:description", content: "OEM-quality wheel paints, primers, clear coats, powders and refinishing supplies for professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background" id="home">
      <StoreNavigation />
      <main>
        <HomeBanner />
        <ColorFinder />
      </main>
    </div>
  );
}
