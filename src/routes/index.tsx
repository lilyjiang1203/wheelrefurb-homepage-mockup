import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreiLack WheelRefurb | Navigation" },
      { name: "description", content: "Browse FreiLack WheelRefurb paints, clear coats, powders and specialist finishes." },
      { property: "og:title", content: "FreiLack WheelRefurb" },
      { property: "og:description", content: "Browse wheel refinishing paints and specialist finishes." },
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
      <main className="nav-preview-space" aria-label="Store content area" />
    </div>
  );
}
