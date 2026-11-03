import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ImageOff, Search } from "lucide-react";
import { StoreNavigation } from "../../components/store-navigation";
import { useSandboxCatalog } from "../../lib/sandbox-catalog";
import { matchesCatalogCategory, catalogCategoryNames } from "../../lib/catalog-links";

const PAGE_SIZE = 24;

export const Route = createFileRoute("/sandbox/products")({
  validateSearch: (search: Record<string, unknown>) => ({
    collection: typeof search.collection === "string" ? search.collection : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  head: () => ({ meta: [
    { title: "Sandbox Product Catalog | Wheel Refurb" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: SandboxProducts,
});

function SandboxProducts() {
  const catalog = useSandboxCatalog();
  const filters = Route.useSearch();
  const [collection, setCollection] = useState(filters.collection ?? "all");
  const [category, setCategory] = useState(filters.category ?? "all");
  useEffect(() => {
    setCollection(filters.collection ?? "all");
    setCategory(filters.category ?? "all");
    setPage(1);
  }, [filters.collection, filters.category]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const data = catalog.status === "ready" ? catalog.data : null;
  const q = search.trim().toLowerCase();
  const products = (data?.products ?? []).filter((p) => {
    const collectionName = data?.collections.find((c) => c.collection_id === p.collectionId)?.collection_name ?? "";
    const matchesCollection = collection === "all" || collectionName.toLowerCase() === collection.toLowerCase();
    const matchesCategory = category === "all" || matchesCatalogCategory(category, p, collectionName);
    const matchesSearch = !q || [p.product_name, p.color_name, p.color_code, p.finish]
      .some((value) => value?.toLowerCase().includes(q));
    return matchesCollection && matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const firstItem = (currentPage - 1) * PAGE_SIZE;
  const visibleProducts = products.slice(firstItem, firstItem + PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((number) => number === 1 || number === totalPages || Math.abs(number - currentPage) <= 2);

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
              value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Collection</span>
            <select className="border border-border bg-background p-2 max-w-48"
              value={collection} onChange={(event) => { setCollection(event.target.value); setCategory("all"); setPage(1); }}>
              <option value="all">All collections</option>
              {data.collections.map((c) => <option key={c.collection_id} value={c.collection_name}>{c.collection_name}</option>)}
            </select>
          </label>
          <span className="text-xs text-muted-foreground" role="status">{products.length} of {data.products.length} products</span>
        </div>
        {(category !== "all" || collection !== "all") && (
          <div className="mb-5 flex items-center gap-3 flex-wrap text-sm">
            <span className="font-medium">Showing: {collection !== "all" ? collection : catalogCategoryNames[category] ?? category}</span>
            <Link to="/sandbox/products" className="text-brand hover:underline">View all Sandbox products</Link>
          </div>
        )}
        {products.length === 0 && <p className="py-10 text-sm text-muted-foreground">
          No products in this category yet in the Sandbox preview. Try another collection or view all products.
        </p>}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => {
            const name = product.color_name || product.product_name;

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
                <a href={`/sandbox/products/${encodeURIComponent(product.color_code || "")}`} className="inline-flex mt-4 text-sm font-semibold text-brand hover:underline">View product detail →</a>
              </div>
            </article>;
          })}
        </div>
        {products.length > 0 && (
          <nav className="mt-8 mb-10 flex flex-col items-center gap-4" aria-label="Product pagination">
            <p className="text-sm text-muted-foreground">
              Showing {firstItem + 1}–{Math.min(firstItem + PAGE_SIZE, products.length)} of {products.length} products
            </p>
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button type="button" disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="inline-flex items-center gap-1 border border-border px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand"
                  aria-label="Previous page"><ChevronLeft size={16} /> Previous</button>
                {pageNumbers.map((number, index) => (
                  <span key={number} className="inline-flex items-center gap-2">
                    {index > 0 && number - pageNumbers[index - 1] > 1 && (
                      <span className="px-1 text-muted-foreground" aria-hidden="true">…</span>
                    )}
                    <button type="button" onClick={() => setPage(number)}
                      aria-label={`Page ${number}`} aria-current={number === currentPage ? "page" : undefined}
                      className={`min-w-10 border px-3 py-2 text-sm hover:border-brand ${number === currentPage ? "border-brand bg-muted font-semibold" : "border-border"}`}>
                      {number}
                    </button>
                  </span>
                ))}
                <button type="button" disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  className="inline-flex items-center gap-1 border border-border px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand"
                  aria-label="Next page">Next <ChevronRight size={16} /></button>
              </div>
            )}
          </nav>
        )}
      </>}
    </main>
  </div>;
}
