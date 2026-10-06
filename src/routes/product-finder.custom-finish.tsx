import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { CustomFinishFinder } from "../components/custom-finish-finder";

export const Route = createFileRoute("/product-finder/custom-finish")({
  head: () => ({ meta: [
    { title: "Custom / Special Finish Finder | Wheel Refurb" },
    { name: "description", content: "Pick candy, color-shifting, pearl or multi-layer wheel effects and see the sample coating system needed to create them." },
    { property: "og:title", content: "Create a Custom / Special Finish — Wheel Refurb" },
    { property: "og:description", content: "Tell us the look you want and we translate it into the layers and products needed for a special wheel finish." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <div className="min-h-screen bg-background"><StoreNavigation /><CustomFinishFinder /></div>,
});
