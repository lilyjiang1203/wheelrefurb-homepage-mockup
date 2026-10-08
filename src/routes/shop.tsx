import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { StoreNavigation } from "../components/store-navigation";
import { audiProduct } from "../components/product-detail-data";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [
    { title: "Product Preview | Wheel Refurb" },
    { name: "description", content: "Browse the Audi Anthracite LV7D example coating product from FreiLacke Wheel Refurb." },
    { property: "og:title", content: "Product Preview — Wheel Refurb" },
    { property: "og:description", content: "Explore our example wheel refinishing product detail page." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image", content: audiProduct.product.images.front },
    { name: "twitter:image", content: audiProduct.product.images.front },
  ] }),
  component: Shop,
});
function Shop() {
  return <div className="min-h-screen bg-background"><StoreNavigation /><main className="pd-shell"><nav className="pd-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={12} /><span>Products</span></nav><header className="pd-list-head"><p className="pd-eyebrow">Product preview</p><h1 className="pd-title">Wheel Refinishing Products</h1><p className="text-sm text-muted-foreground">Example product · Full catalog pending</p></header><Link to="/products/audi-anthracite-lv7d" className="pd-list-card"><img src={audiProduct.product.images.front} alt="Audi Anthracite dark grey sample panel" /><div className="pd-list-card-body"><p className="pd-eyebrow">FreiLacke / Wheel Color</p><h2>AUDI ANTHRACITE LV7D</h2><p className="text-xs text-muted-foreground">Log in to view price</p><span className="mt-5 flex items-center gap-2 text-xs font-semibold text-brand">View product <ArrowRight size={14} /></span></div></Link></main></div>;
}