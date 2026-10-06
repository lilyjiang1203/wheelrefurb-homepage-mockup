import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { ColorChangeFinder } from "../components/color-change-finder";

export const Route = createFileRoute("/product-finder/change-wheel-color")({
  head: () => ({ meta: [
    { title: "Change My Wheel Color — Product Finder | Wheel Refurb" },
    { name: "description", content: "Pick a solid, RAL, candy or color-shifting wheel finish and see a sample refinishing product system." },
    { property: "og:title", content: "Change My Wheel Color — Wheel Refurb" },
    { property: "og:description", content: "A guided example journey from the look you want to a matching color and complete wheel coating system." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <div className="min-h-screen bg-background"><StoreNavigation /><ColorChangeFinder /></div>,
});
