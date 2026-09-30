import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { ColorFinder } from "../components/color-finder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wheel Paint & Color Finder | FreiLack WheelRefurb" },
      { name: "description", content: "Find OEM-matched wheel paint by vehicle brand and browse FreiLack WheelRefurb specialist finishes." },
      { property: "og:title", content: "Wheel Paint & Color Finder — FreiLack WheelRefurb" },
      { property: "og:description", content: "Search by vehicle brand to find OEM-matched wheel paint and specialist finishes." },
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
        <ColorFinder />
      </main>
    </div>
  );
}
