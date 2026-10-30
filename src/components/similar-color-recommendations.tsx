import { useEffect, useState, type ReactNode, Component } from "react";
import { ArrowRight, ImageOff } from "lucide-react";
import { useSandboxCatalog, type SandboxProduct } from "../lib/sandbox-catalog";

// Intentionally isolated from the shared catalog loader and global styles.
// Recommendations are advisory: equal color families do not imply an exact visual match.
const SUPABASE_URL = "https://unlygyqhgeujetjphrro.supabase.co";
const PUBLIC_KEY = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";

type FamilyRow = { id: string; color_family: string[] | null };
type FamilyState = { status: "loading" | "ready" | "error"; values: Record<string, string[]> };

class RecommendationBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <RecommendationsFallback /> : this.props.children;
  }
}

function RecommendationsFallback() {
  return (
    <section className="pd-section" aria-label="Explore more finishes">
      <p className="pd-explore-eyebrow">EXPLORE MORE FINISHES</p>
      <h2 className="mt-2 text-2xl font-semibold">Discover More Wheel Colors</h2>
      <p className="mt-2 text-sm text-muted-foreground">Browse our currently available color previews.</p>
      <a className="mt-4 inline-flex items-center gap-2 font-semibold text-brand hover:underline" href="/sandbox/products">
        Browse Product Catalog <ArrowRight size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

function calculateScore(
  current: SandboxProduct,
  candidate: SandboxProduct,
  familyById: Record<string, string[]>,
): number {
  const currentFamily = familyById[current.id] ?? [];
  const candidateFamily = familyById[candidate.id] ?? [];
  const shared = currentFamily.some(f => candidateFamily.some(g => f.toLowerCase() === g.toLowerCase()));
  if (!shared) return -1;

  let score = 10;
  if (current.finish && candidate.finish && current.finish.toLowerCase() === candidate.finish.toLowerCase()) score += 20;
  const terms = ["anthracite", "graphite", "gunmetal", "grey", "gray", "metallic"];
  const currentName = (current.color_name || current.product_name).toLowerCase();
  const otherName = (candidate.color_name || candidate.product_name).toLowerCase();
  score += terms.filter(term => currentName.includes(term) && otherName.includes(term)).length * 2;
  if (candidate.collectionId && candidate.collectionId === current.collectionId) score += 1;
  return score;
}

function Recommendations({ colorCode }: { colorCode: string }) {
  const catalog = useSandboxCatalog();
  const [families, setFamilies] = useState<FamilyState>({ status: "loading", values: {} });

  useEffect(() => {
    if (catalog.status !== "ready") return;
    const ids = catalog.data.products.map(p => p.id);
    if (!ids.length) {
      setFamilies({ status: "ready", values: {} });
      return;
    }
    let cancelled = false;
    // Network calls only happen in an effect, never while rendering or server-rendering.
    const fetchFamilies = async () => {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/products?select=id,color_family&id=in.(${ids.join(",")})`,
          { headers: { apikey: PUBLIC_KEY } },
        );
        if (!response.ok) throw new Error("Related color metadata unavailable");
        const rows = await response.json() as FamilyRow[];
        if (!Array.isArray(rows)) throw new Error("Unexpected related color response");
        const values: Record<string, string[]> = {};
        for (const row of rows) {
          if (typeof row.id !== "string") continue;
          values[row.id] = Array.isArray(row.color_family)
            ? row.color_family.filter((item): item is string => typeof item === "string")
            : [];
        }
        if (!cancelled) setFamilies({ status: "ready", values });
      } catch {
        if (!cancelled) setFamilies({ status: "error", values: {} });
      }
    };
    void fetchFamilies();
    return () => { cancelled = true; };
  }, [catalog.status]);

  if (catalog.status === "loading" || families.status === "loading") {
    return <section className="pd-section" aria-label="Similar wheel colors"><p className="text-sm text-muted-foreground">Loading similar colors…</p></section>;
  }
  if (catalog.status !== "ready" || families.status === "error") return <RecommendationsFallback />;

  const current = catalog.data.products.find(p => p.color_code === colorCode);
  if (!current) return <RecommendationsFallback />;

  const suggestions = catalog.data.products
    .filter(p => p.id !== current.id && /basecoat/i.test(p.product_name))
    .map(p => ({ product: p, score: calculateScore(current, p, families.values) }))
    .filter(item => item.score >= 10)
    .sort((a, b) => b.score - a.score || (a.product.color_name || a.product.product_name).localeCompare(b.product.color_name || b.product.product_name))
    .slice(0, 4);

  if (!suggestions.length) return <RecommendationsFallback />;

  return (
    <section className="pd-section" aria-labelledby="similar-colors-title">
      <p className="pd-explore-eyebrow">EXPLORE MORE FINISHES</p>
      <h2 id="similar-colors-title" className="mt-2 text-2xl font-semibold">Similar Wheel Colors</h2>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">
        Other colors in the same color family, with matching known finishes prioritized.
        Physical color matching is not guaranteed.
      </p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {suggestions.map(({ product }) => {
          const name = product.color_name || product.product_name;
          const collectionName = catalog.data.collections.find(c => c.collection_id === product.collectionId)?.collection_name;
          const href = collectionName
            ? `/sandbox/products?collection=${encodeURIComponent(collectionName)}`
            : "/sandbox/products";
          return (
            <article key={product.id} className="overflow-hidden rounded-md border border-border bg-card">
              <div className="flex aspect-square items-center justify-center bg-muted/20">
                {product.imageUrl
                  ? <img className="h-full w-full object-contain" src={product.imageUrl} alt={name} loading="lazy" />
                  : <span className="flex flex-col items-center gap-2 text-xs text-muted-foreground"><ImageOff size={24} />Image coming soon</span>}
              </div>
              <div className="space-y-2 p-3">
                <h3 className="text-sm font-semibold leading-snug">{name}</h3>
                <p className="text-xs text-muted-foreground">{product.finish || "Finish not specified"}</p>
                {product.price1L && <p className="text-sm font-semibold">1 L · {product.price1L}</p>}
                <a className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline" href={href}>
                  Browse collection <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SimilarColorRecommendations({ colorCode }: { colorCode: string }) {
  return (
    <RecommendationBoundary>
      <Recommendations colorCode={colorCode} />
    </RecommendationBoundary>
  );
}
