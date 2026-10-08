import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { ProductDetail } from "../components/product-detail";
import { audiProduct } from "../components/product-detail-data";

export const Route = createFileRoute("/products/audi-anthracite-lv7d")({
  head: () => ({ meta: [
    { title: "Audi Anthracite LV7D | FreiLacke Wheel Refurb" },
    { name: "description", content: "Explore the Audi Anthracite LV7D coating sample, FreiLacke formula W01838MAU07A, package options and technical document availability." },
    { property: "og:title", content: "Audi Anthracite LV7D — FreiLacke Wheel Refurb" },
    { property: "og:description", content: "Audi Anthracite wheel refinishing color: supplied sample photos, product video and essential coating attributes." },
    { property: "og:type", content: "product" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image", content: audiProduct.product.images.front },
    { name: "twitter:image", content: audiProduct.product.images.front },
  ] }),
  component: () => <div className="min-h-screen bg-background"><StoreNavigation /><main><ProductDetail /></main></div>,
});