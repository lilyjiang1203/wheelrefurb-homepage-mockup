import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { OemRestoreDbFinder } from "../components/demo-db-finders";

export const Route = createFileRoute("/product-finder/oem-restore")({
  head: () => ({ meta: [
    { title: "OEM Finish Product Finder | Wheel Refurb" },
    { name: "description", content: "Explore the Wheel Refurb guided OEM wheel restoration journey with sample color matches and recommended refinishing products." },
    { property: "og:title", content: "Restore the Original OEM Finish — Wheel Refurb" },
    { property: "og:description", content: "A guided example journey from your vehicle information to an OEM color and a complete wheel refinishing product system." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ProductFinderPage,
});

function ProductFinderPage() { return <div className="min-h-screen bg-background"><StoreNavigation /><OemRestoreDbFinder /></div>; }