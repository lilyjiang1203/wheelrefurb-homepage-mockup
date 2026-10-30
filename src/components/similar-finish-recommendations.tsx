import { useSandboxCatalog, type SandboxProduct } from "../lib/sandbox-catalog";
import { ImageOff, ArrowRight } from "lucide-react";

function rankSimilarity(current: SandboxProduct, other: SandboxProduct): number {
  const sameFamily = (other.color_family ?? []).some(f => (current.color_family ?? []).some(c => c.toLowerCase() === f.toLowerCase()));
  if (!sameFamily) return -1;
  let score = 10;
  if (current.finish && other.finish && current.finish.toLowerCase() === other.finish.toLowerCase()) score += 10;
  const first = (text: string) => text.toLowerCase().match(/anthracite|graphite|gunmetal|metallic|grey|gray/g) ?? [];
  const target = new Set(first(`${current.color_name ?? ""} ${current.product_name}`));
  score += first(`${other.color_name ?? ""} ${other.product_name}`).filter(t => target.has(t)).length * 2;
  if (current.collectionId && other.collectionId === current.collectionId) score += 1;
  return score;
}

export function SimilarFinishRecommendations({ colorCode }: { colorCode: string }) {
  const catalog = useSandboxCatalog();
  if (catalog.status === "loading") return <section className="pd-section" aria-label="Similar wheel colors"><p className="text-sm text-muted-foreground">Finding similar wheel colors…</p></section>;
  if (catalog.status === "error") return null;

  const products = catalog.data.products;
  const current = products.find(p => p.color_code === colorCode);
  if (!current) return null;
  const recommendations = products
    .filter(p => p.id !== current.id && p.color_code !== current.color_code && /basecoat/i.test(p.product_name))
    .map(p => ({ product: p, score: rankSimilarity(current, p) }))
    .filter(item => item.score >= 10)
    .sort((a, b) => b.score - a.score || (a.product.color_name ?? a.product.product_name).localeCompare(b.product.color_name ?? b.product.product_name))
    .slice(0, 4);

  if (!recommendations.length) return null;
  return <section className="pd-section" aria-labelledby="pd-similar-title">
    <div className="mb-6">
      <p className="pd-explore-eyebrow">EXPLORE MORE FINISHES</p>
      <h2 id="pd-similar-title" className="text-2xl font-semibold tracking-tight">Similar Wheel Colors</h2>
      <p className="mt-2 text-sm text-muted-foreground">Explore related colors from the same color family. Finish and appearance may differ; compare physical samples for an accurate match.</p>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {recommendations.map(({product}) => {
        const title = product.color_name || product.product_name;
        const href = `/sandbox/products?search=${encodeURIComponent(product.color_code ?? title)}`;
        return <a key={product.id} href={href} className="group overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-brand">
          <div className="flex aspect-square items-center justify-center overflow-hidden bg-muted/20">
            {product.imageUrl
              ? <img src={product.imageUrl} alt={title} loading="lazy" className="h-full w-full object-contain transition-transform group-hover:scale-[1.03]" />
              : <div className="flex flex-col items-center gap-2 text-muted-foreground"><ImageOff size={24} /><span className="text-xs">Image coming soon</span></div>}
          </div>
          <div className="space-y-2 p-3 sm:p-4">
            <h3 className="text-sm font-semibold leading-snug">{title}</h3>
            <p className="text-xs text-muted-foreground">{product.finish || "Finish not specified"}</p>
            <p className="text-sm font-medium">{product.price1L ? `1 L · ${product.price1L}` : "Price pending"}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">View in catalog <ArrowRight size={14} aria-hidden="true" /></span>
          </div>
        </a>;
      })}
    </div>
  </section>;
}
