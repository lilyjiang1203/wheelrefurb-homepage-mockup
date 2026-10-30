import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ImageOff, Search } from "lucide-react";
import { StoreNavigation } from "../../components/store-navigation";
import { useSandboxCatalog } from "../../lib/sandbox-catalog";

export const Route = createFileRoute("/sandbox/products")({
  head: () => ({ meta: [
    { title: "Sandbox Product Catalog | Wheel Refurb" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: SandboxProducts,
});

function SandboxProducts() {
  const catalog = useSandboxCatalog();
  const [collection, setCollection] = useState("all");
  const [search, setSearch] = useState("");
  const data = catalog.status === "ready" ? catalog.data : null;
  const q = search.trim().toLowerCase();
  const products = (data?.products ?? []).filter((p) => {
    const matchesCollection = collection === "all" || p.collectionId === collection;
    const matchesSearch = !q || [p.product_name, p.color_name, p.color_code, p.finish]
      .some((value) => value?.toLowerCase().includes(q));
    return matchesCollection && matchesSearch;
  });

  return <div className="min-h-screen bg-background">
    <StoreNavigation />
    <main className="pd-shell">
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link><ChevronRight size={12} /><span>Sandbox Products</span>
      </nav>
      <header className="mb-8">
        <p className="pd-eyebrow">Internal preview · Not a live store</p>
        <h1 className="pd-title">Sandbox Product Catalog</h1>
        <p className="text-sm text-muted-foreground">
          Selected real product records for testing collections, images, pricing and catalog navigation.
          No checkout is available.
        </p>
      </header>
      {catalog.status === "loading" && <p role="status" className="text-sm text-muted-foreground">Loading sandbox products…</p>}
      {catalog.status === "error" && <p role="alert" className="text-sm text-muted-foreground">Sandbox catalog is temporarily unavailable. Please try again later.</p>}
      {data && <>
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 border border-border px-3 py-2 flex-1 min-w-48 max-w-md">
            <Search size={16} aria-hidden="true" />
            <input className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              aria-label="Search products" placeholder="Search name or color code"
              value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Collection</span>
            <select className="border border-border bg-background p-2 max-w-48"
              value={collection} onChange={(event) => setCollection(event.target.value)}>
              <option value="all">All collections</option>
              {data.collections.map((c) => <option key={c.collection_id} value={c.collection_id}>{c.collection_name}</option>)}
            </select>
          </label>
          <span className="text-xs text-muted-foreground" role="status">{products.length} of {data.products.length} products</span>
        </div>
        {products.length === 0 && <p className="py-10 text-sm text-muted-foreground">No matching Sandbox products.</p>}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const name = product.color_name || product.product_name;
            const isAudiDemo = product.color_code === "WO1838MAU07A";
            return <article key={product.id} className="border border-border rounded-sm overflow-hidden">
              <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={name} loading="lazy" className="w-full h-full object-contain" />
                  : <div className="text-muted-foreground flex flex-col items-center gap-2"><ImageOff size={24}/><span className="text-xs">Image coming soon</span></div>}
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-2">{data.collections.find((c) => c.collection_id === product.collectionId)?.collection_name ?? "Uncategorized"}</p>
                <h2 className="text-sm font-semibold leading-snug">{name}</h2>
                <p className="text-xs text-muted-foreground mt-1">{product.color_code}</p>
                <p className="text-sm font-semibold mt-3">{product.price1L ? `1 L · ${product.price1L}` : "Pricing pending"}</p>
                {isAudiDemo
                  ? <Link to="/products/audi-anthracite-lv7d" className="inline-flex mt-4 text-sm font-semibold text-brand hover:underline">View demo detail →</Link>
                  : <p className="text-xs text-muted-foreground mt-4">Product detail preview coming soon</p>}
              </div>
            </article>;
          })}
        </div>
      </>}
    </main>
  </div>;
}
