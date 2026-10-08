import { useRef, useState, type ReactNode, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Mail, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { ProductFinderHelp } from "./product-finder-help";
import { emptyVehicle } from "./product-finder-data";
import { WheelGlyph } from "./wheel-glyph";
import wheelPaintImg from "../assets/product-wheel-paint.jpg";
import powderImg from "../assets/product-powder-coating.jpg";
import clearImg from "../assets/product-clear-coat.jpg";
import primerImg from "../assets/product-primer-kit.jpg";
import {
  existingProductRoute, fetchProducts, fetchProductsByCode, fetchSystemLayers, fetchSystems, fetchSystemsForProduct,
  fetchVehicleProducts, fetchVehicles, uniqueSorted, type DemoLayer, type DemoProduct, type DemoSystem,
} from "../lib/demo-catalog";

// Always re-query the database: on page load, on every new search, and when the tab regains focus.
const fresh = { staleTime: 0, gcTime: 0, refetchOnMount: "always" as const, refetchOnWindowFocus: true };
const DEMO_NOTE = "Demonstration data from the wheelrefurb-demo database. Matches and compatibility are not verified recommendations — confirm with our team before purchase or application.";

const imageFor = (p: DemoProduct) => (p.coating_layer === "Clear Coat" ? clearImg : p.coating_type === "Powder" ? powderImg : wheelPaintImg);
// Presentational swatch tint only; unknown families fall back to a neutral grey.
const swatchTint: Record<string, string> = { Grey: "linear-gradient(160deg,#6b6f75,#2f3236)", Silver: "linear-gradient(160deg,#eef1f4,#9aa3ad)", Black: "linear-gradient(160deg,#3a3a3a,#0b0b0b)", Gold: "linear-gradient(160deg,#f1d27a,#a7781f)", Clear: "linear-gradient(160deg,#ffffff,#dfe6ef)", Bronze: "linear-gradient(160deg,#b08350,#5d3e1f)", White: "linear-gradient(160deg,#ffffff,#e7e9ec)" };
const swatch = (family: string | null) => (family && swatchTint[family]) || "linear-gradient(160deg,#d6dae0,#9aa0a8)";
const Swatch = ({ family }: { family: string | null }) => <span className="gpf-finish-swatch" style={{ background: swatch(family) }} aria-hidden="true" />;

function useStage() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const move = (next: number) => { setStep(next); requestAnimationFrame(() => { ref.current?.scrollIntoView({ behavior: "auto", block: "start" }); ref.current?.focus({ preventScroll: true }); }); };
  return { step, move, ref };
}

function Shell({ title, intro, steps, titles, step, move, stageRef, support, children }: { title: string; intro: string; steps: string[]; titles: string[]; step: number; move: (n: number) => void; stageRef: RefObject<HTMLElement | null>; support: string; children: (openHelp: () => void) => ReactNode }) {
  const [help, setHelp] = useState(false);
  const openHelp = () => setHelp(true);
  return <main className="gpf-page">
    <div className="featured-inner">
      <Button asChild variant="link" className="gpf-back"><Link to="/"><ArrowLeft aria-hidden="true" />Back to Home</Link></Button>
      <header className="gpf-page-head"><p className="finder-kicker">Guided Product Finder</p><h1>{title}</h1><p>{intro}</p><span className="gpf-demo">Demo data · Not verified recommendations</span></header>
      <nav aria-label="Product finder progress"><ol className="gpf-progress">{steps.map((label, i) => <li key={label} className={i === step ? "is-current" : i < step ? "is-complete" : ""} aria-current={i === step ? "step" : undefined}>
        <Button variant="ghost" disabled={i > step} onClick={() => move(i)}><span className="gpf-step-number">{i < step ? <Check size={16} aria-hidden="true" /> : i + 1}</span><span>{label}</span></Button>
      </li>)}</ol></nav>
      <section className="gpf-stage" ref={stageRef} tabIndex={-1} aria-labelledby="gpf-stage-title">
        <div className="gpf-stage-heading"><div><p className="finder-kicker">Step {step + 1} of {steps.length}</p><h2 id="gpf-stage-title">{titles[step]}</h2></div><Button variant="link" onClick={openHelp}><Mail aria-hidden="true" />Need Help?</Button></div>
        {children(openHelp)}
        <p className="gpf-disclaimer">{DEMO_NOTE}</p>
      </section>
      <section className="gpf-support" aria-labelledby="gpf-support-title"><div><h2 id="gpf-support-title">Still need help?</h2><p>{support}</p></div><Button variant="outline" onClick={openHelp}><Mail aria-hidden="true" />Email Our Team</Button></section>
    </div>
    <ProductFinderHelp open={help} onOpenChange={setHelp} vehicle={emptyVehicle} />
  </main>;
}

function Status({ loading, error, retry, label }: { loading: boolean; error: unknown; retry: () => void; label: string }) {
  if (loading) return <p className="gpf-intro" role="status">Loading {label}…</p>;
  if (error) return <div className="gpf-unsure-panel" role="alert"><p>We couldn't load {label} from the demo database. Please try again.</p><div className="gpf-actions"><Button variant="outline" onClick={retry}>Try Again</Button></div></div>;
  return null;
}

function NoMatch({ text, onHelp, children }: { text: string; onHelp: () => void; children?: ReactNode }) {
  return <div className="gpf-unsure-panel"><span className="gpf-demo">No matching products</span><p className="mt-3">{text}</p><div className="gpf-actions">{children}<Button type="button" variant="outline" onClick={onHelp}><Mail aria-hidden="true" />Email Our Team</Button></div></div>;
}

const ProductLink = ({ product }: { product: DemoProduct }) => {
  const route = existingProductRoute(product.product_url);
  return route
    ? <Button asChild variant="link" className="gpf-product-link"><Link to={route}>View Product<ArrowRight aria-hidden="true" /></Link></Button>
    : <p className="gpf-disclaimer">Demo placeholder · Product page not available yet</p>;
};

const Details = ({ product }: { product: DemoProduct }) => <dl className="gpf-details">
  {product.color_name && <div><dt>Color</dt><dd>{product.color_name}{product.color_family ? ` · ${product.color_family}` : ""}</dd></div>}
  {product.finish && <div><dt>Finish</dt><dd>{product.finish}{product.gloss_level ? ` · ${product.gloss_level}` : ""}</dd></div>}
  {product.coating_type && <div><dt>Coating Type</dt><dd>{product.coating_type}{product.liquid_type ? ` · ${product.liquid_type}` : ""}</dd></div>}
  {product.oem_brand && <div><dt>OEM Brand</dt><dd>{product.oem_brand}</dd></div>}
  {product.oem_color_code && <div><dt>OEM Color Code</dt><dd>{product.oem_color_code}</dd></div>}
  {product.formula_code && <div><dt>Formula Code</dt><dd>{product.formula_code}</dd></div>}
</dl>;

function ColorProduct({ product }: { product: DemoProduct }) {
  return <div className="gpf-color-product" data-testid="demo-color-product"><div className="featured-media"><img src={imageFor(product)} alt={`Illustrative image for ${product.product_name}`} /></div><div><span className="featured-label">{product.coating_layer ?? "Color Coat"} · Demo data</span><h3>{product.product_name}</h3><Details product={product} /><ProductLink product={product} /><p className="gpf-disclaimer">Illustrative product image. Compatibility is not verified.</p></div></div>;
}

/* ---- shared system/cart pieces ---- */
type CartItem = { key: string; name: string; role: string; image: string };
const layerItem = (l: DemoLayer): CartItem | null => l.product ? { key: `l${l.id}`, name: l.product.product_name, role: `Layer ${l.layer_order} · ${l.coating_role ?? "Coat"}`, image: imageFor(l.product) } : null;

function CartDialog({ items, onClose, back }: { items: CartItem[] | null; onClose: () => void; back: string }) {
  return <Dialog open={Boolean(items)} onOpenChange={(o) => { if (!o) onClose(); }}><DialogContent className="gpf-dialog"><DialogTitle>Added to Your Demo Cart</DialogTitle><DialogDescription>{items?.length} demo products selected. No real cart or order has been created.</DialogDescription><ul className="gpf-cart-list">{items?.map((p) => <li key={p.key}><img src={p.image} alt="" /><div><strong>{p.name}</strong><p>{p.role} · Qty 1</p></div><Check size={18} className="text-brand" aria-hidden="true" /></li>)}</ul><Button className="gpf-primary" onClick={onClose}>{back}</Button></DialogContent></Dialog>;
}

function LayerCards({ layers, selected, toggle }: { layers: DemoLayer[]; selected: string[]; toggle: (key: string, on: boolean) => void }) {
  return <div className="gpf-system-grid">{layers.map((l) => {
    const key = `l${l.id}`;
    if (!l.product) return <article key={key} className="featured-card"><div className="featured-body"><h4 className="featured-name">Layer {l.layer_order}</h4><p className="gpf-disclaimer">Product unavailable</p></div></article>;
    return <article key={key} className="featured-card" data-testid="demo-layer">
      <div className="gpf-product-role"><h3>Layer {l.layer_order} — {l.coating_role ?? "Coat"}</h3><span className="gpf-badge">Demo data</span></div>
      <div className="featured-media"><img src={imageFor(l.product)} alt={`Illustrative image for ${l.product.product_name}`} loading="lazy" /></div>
      <div className="featured-body"><h4 className="featured-name">{l.product.product_name}</h4><Details product={l.product} /><label className="gpf-selection"><input type="checkbox" checked={selected.includes(key)} onChange={(e) => toggle(key, e.target.checked)} />Select {l.coating_role ?? "layer"}</label><ProductLink product={l.product} /></div>
    </article>;
  })}</div>;
}

function FutureCard({ role, image, text }: { role: string; image: string; text: string }) {
  return <article className="featured-card" aria-disabled="true" style={{ opacity: 0.6 }}>
    <div className="gpf-product-role"><h3>{role}</h3><span className="gpf-badge">Coming soon</span></div>
    <div className="featured-media"><img src={image} alt="" loading="lazy" /></div>
    <div className="featured-body"><h4 className="featured-name">Future functionality</h4><p className="featured-finish">{text}</p><label className="gpf-selection"><input type="checkbox" disabled />Select {role}</label></div>
  </article>;
}

/** Recommended system for one color product, read from coating_system_products. */
function SystemForProduct({ product, summary, onBack, onReset }: { product: DemoProduct; summary: [string, string][]; onBack: () => void; onReset: () => void }) {
  const systems = useQuery({ ...fresh, queryKey: ["demo", "systems-for-product", product.id], queryFn: () => fetchSystemsForProduct(product.id) });
  const [systemId, setSystemId] = useState<number | null>(null);
  const system = systems.data?.find((s) => s.id === systemId) ?? systems.data?.[0] ?? null;
  const layers = useQuery({ ...fresh, queryKey: ["demo", "system-layers", system?.id], queryFn: () => fetchSystemLayers(system!.id), enabled: system !== null });
  const [selected, setSelected] = useState<string[] | null>(null);
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const colorItem: CartItem = { key: `p${product.id}`, name: product.product_name, role: "Color Coat", image: imageFor(product) };
  const items: CartItem[] = system ? (layers.data ?? []).map(layerItem).filter((i): i is CartItem => i !== null) : [colorItem];
  const chosen = selected ?? items.map((i) => i.key);
  const toggle = (key: string, on: boolean) => setSelected(on ? [...chosen, key] : chosen.filter((k) => k !== key));
  return <>
    <dl className="gpf-summary">{summary.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    <Status loading={systems.isLoading} error={systems.error} retry={() => systems.refetch()} label="coating systems" />
    {systems.isSuccess && (systems.data.length > 0 ? <>
      {systems.data.length > 1 && <div className="gpf-method" role="group" aria-label="Demo systems">{systems.data.map((s) => <Button key={s.id} variant={system?.id === s.id ? "default" : "outline"} aria-pressed={system?.id === s.id} onClick={() => { setSystemId(s.id); setSelected(null); }}>{s.system_name}</Button>)}</div>}
      {system && <p className="gpf-intro">This product is part of the demo system <strong>{system.system_name}</strong>{system.description ? ` — ${system.description}` : "."}</p>}
      <Status loading={layers.isLoading} error={layers.error} retry={() => layers.refetch()} label="system layers" />
      {layers.isSuccess && <LayerCards layers={layers.data} selected={chosen} toggle={toggle} />}
    </> : <>
      <p className="gpf-intro">No demo coating system includes this product yet. The color coat is shown below; primer and clear coat recommendations will appear here once they are linked in the database.</p>
      <div className="gpf-system-grid">
        <FutureCard role="Primer" image={primerImg} text="Primer recommendations are not yet linked to this product." />
        <article className="featured-card" data-testid="demo-layer"><div className="gpf-product-role"><h3>Color Coat</h3><span className="gpf-badge is-required">Demo data</span></div><div className="featured-media"><img src={imageFor(product)} alt={`Illustrative image for ${product.product_name}`} loading="lazy" /></div><div className="featured-body"><h4 className="featured-name">{product.product_name}</h4><label className="gpf-selection"><input type="checkbox" checked={chosen.includes(colorItem.key)} onChange={(e) => toggle(colorItem.key, e.target.checked)} />Select Color Coat</label><ProductLink product={product} /></div></article>
        <FutureCard role="Clear Coat" image={clearImg} text="Clear coat recommendations are not yet linked to this product." />
      </div>
    </>)}
    <div className="gpf-cart-actions"><Button className="gpf-primary" disabled={chosen.length === 0 || items.length === 0} onClick={() => setCart(items.filter((i) => chosen.includes(i.key)))}><ShoppingBag aria-hidden="true" />Add Selected Products to Cart ({chosen.filter((k) => items.some((i) => i.key === k)).length})</Button><Button variant="outline" disabled={items.length === 0} onClick={() => { setSelected(items.map((i) => i.key)); setCart(items); }}>Add Complete System to Cart</Button></div>
    <div className="gpf-actions"><Button variant="outline" onClick={onBack}><ArrowLeft aria-hidden="true" />Back</Button><Button variant="link" onClick={onReset}>Start Over</Button></div>
    <CartDialog items={cart} onClose={() => setCart(null)} back="Back to Recommended System" />
  </>;
}

const selectField = (label: string, value: string, options: string[], onChange: (v: string) => void, disabled: boolean, placeholder: string) =>
  <label>{label}<select aria-label={label} className="gpf-control" required disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)}><option value="">{placeholder}</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>;

/* =========== 1. Restore the Original OEM Finish =========== */
export function OemRestoreDbFinder() {
  const { step, move, ref } = useStage();
  const [method, setMethod] = useState<"vehicle" | "code">("vehicle");
  const [brand, setBrand] = useState(""); const [model, setModel] = useState(""); const [year, setYear] = useState("");
  const [code, setCode] = useState(""); const [search, setSearch] = useState<{ kind: "vehicle"; id: number; label: string } | { kind: "code"; code: string } | null>(null);
  const [chosenId, setChosenId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const vehicles = useQuery({ ...fresh, queryKey: ["demo", "vehicles"], queryFn: fetchVehicles });
  const list = vehicles.data ?? [];
  const vehicle = list.find((v) => v.brand === brand && v.model === model && String(v.year) === year) ?? null;
  const matches = useQuery({
    ...fresh, queryKey: ["demo", "oem-matches", search],
    queryFn: () => search!.kind === "vehicle" ? fetchVehicleProducts(search!.id) : fetchProductsByCode(search!.code),
    enabled: search !== null,
  });
  const found = matches.data ?? [];
  const record = found.length === 1 ? found[0]! : found.find((p) => p.id === chosenId) ?? null;
  const reset = () => { setBrand(""); setModel(""); setYear(""); setCode(""); setSearch(null); setChosenId(null); setPhotos([]); move(0); };
  const searchLabel = search?.kind === "vehicle" ? search.label : search ? `OEM color code “${search.code}”` : "";
  const resultTitle = matches.isLoading ? "Searching…" : found.length === 0 ? "No Exact Match Found" : found.length > 1 ? "Multiple Possible Matches" : "Exact Match Found";
  const upload = <label className="gpf-upload"><input type="file" accept="image/*" multiple onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 5).map((f) => f.name))} />Upload Wheel Photos</label>;

  return <Shell title="Restore the Original OEM Finish" intro="Tell us about your vehicle and we'll help identify the correct OEM color and the products needed for your refinishing project." steps={["Vehicle", "OEM Color", "Color Product", "Recommended System"]} titles={["Tell Us About Your Vehicle", resultTitle, "Matching Color Product", "Recommended System for Your Project"]} step={step} move={move} stageRef={ref} support="Send us your vehicle and wheel information, along with a few photos, and our team can help identify the correct color and products for your project.">
    {(openHelp) => <>
      {step === 0 && <>
        <p className="gpf-intro">Search by your vehicle, or enter the OEM color code or formula code if you already know it.</p>
        <div className="gpf-method" role="group" aria-label="Find by"><Button variant={method === "vehicle" ? "default" : "outline"} aria-pressed={method === "vehicle"} onClick={() => setMethod("vehicle")}>Search by Vehicle</Button><Button variant={method === "code" ? "default" : "outline"} aria-pressed={method === "code"} onClick={() => setMethod("code")}>Search by OEM Color Code</Button></div>
        <form className="gpf-vehicle-form" onSubmit={(e) => {
          e.preventDefault(); setChosenId(null);
          if (method === "code") { if (!code.trim()) return; setSearch({ kind: "code", code: code.trim() }); }
          else { if (!vehicle) return; setSearch({ kind: "vehicle", id: vehicle.id, label: `${vehicle.year} ${vehicle.brand} ${vehicle.model}` }); }
          move(1);
        }}>
          {method === "vehicle" ? <>
            <Status loading={vehicles.isLoading} error={vehicles.error} retry={() => vehicles.refetch()} label="vehicles" />
            {vehicles.isSuccess && (list.length === 0 ? <p className="gpf-intro">No vehicles are available in the demo database yet. Try searching by OEM color code.</p> : <div className="gpf-fields">
              {selectField("Vehicle Brand", brand, uniqueSorted(list.map((v) => v.brand)), (v) => { setBrand(v); setModel(""); setYear(""); }, false, "Select brand")}
              {selectField("Vehicle Model", model, uniqueSorted(list.filter((v) => v.brand === brand).map((v) => v.model)), (v) => { setModel(v); setYear(""); }, !brand, "Select model")}
              {selectField("Model Year", year, uniqueSorted(list.filter((v) => v.brand === brand && v.model === model).map((v) => v.year)), setYear, !model, "Select year")}
              <label>Wheel Size<select aria-label="Wheel Size" className="gpf-control" disabled><option>Coming soon</option></select></label>
            </div>)}
            <fieldset className="gpf-style-field" disabled><legend>Wheel Style / Design</legend><p className="gpf-style-hint">Future functionality — wheel size and style matching will be available once wheel data is added to the database.</p>
              <div className="gpf-style-grid" aria-hidden="true" style={{ opacity: 0.45 }}>{[0, 1, 2].map((i) => <div key={i} className="gpf-style-card"><WheelGlyph variant={i} /><strong>Coming soon</strong></div>)}</div>
            </fieldset>
          </> : <label>Enter OEM Color Code or Formula Code<Input required value={code} maxLength={60} onChange={(e) => setCode(e.target.value)} placeholder="e.g. LV7D or W01838MAU07A" /></label>}
          <div className="gpf-actions"><Button type="submit" className="gpf-primary" disabled={method === "vehicle" ? !vehicle : !code.trim()}>Find My OEM Color<ArrowRight aria-hidden="true" /></Button></div>
        </form>
      </>}
      {step === 1 && search && <>
        <Status loading={matches.isLoading} error={matches.error} retry={() => matches.refetch()} label="matching products" />
        {matches.isSuccess && <>
          <p className="gpf-intro">{found.length === 0 ? `We couldn't find a match for ${searchLabel} in our current demo database.` : found.length > 1 && !record ? `More than one demo finish is linked to ${searchLabel}. Select the one that matches your wheel.` : `Based on ${searchLabel}, this is the matching demo OEM finish.`}</p>
          {found.length === 0 && <NoMatch text="Send us a few photos of your wheel and our team can help identify the correct finish." onHelp={openHelp}>{upload}</NoMatch>}
          {photos.length > 0 && <p className="gpf-disclaimer">Selected (demo, not sent): {photos.join(", ")}</p>}
          {found.length > 1 && <div className="gpf-style-grid gpf-finish-grid" role="radiogroup" aria-label="Possible OEM finishes">{found.map((p) => <button type="button" role="radio" key={p.id} aria-checked={chosenId === p.id} className={`gpf-style-card ${chosenId === p.id ? "is-selected" : ""}`} onClick={() => setChosenId(p.id)}><Swatch family={p.color_family} /><strong>{p.color_name ?? p.product_name}</strong><span>{[p.oem_brand, p.oem_color_code].filter(Boolean).join(" · ")}</span></button>)}</div>}
          {record && <div className="gpf-match-result"><span className="gpf-demo">{found.length > 1 ? "Finish selected" : "Demo match"} · Not verified</span><h3>Matched OEM Wheel Finish</h3>
            <div className="gpf-match"><span className="gpf-oem-swatch" style={{ background: swatch(record.color_family) }} aria-label={`${record.color_name ?? record.product_name} color swatch`} /><dl className="gpf-details"><div><dt>Finish Name</dt><dd>{record.color_name ?? record.product_name}</dd></div><div><dt>Searched</dt><dd>{searchLabel}</dd></div>{record.oem_color_code && <div><dt>OEM Color Code</dt><dd>{record.oem_color_code}</dd></div>}<div><dt>Matching Product</dt><dd>{record.product_name}</dd></div></dl></div>
          </div>}
        </>}
        <div className="gpf-actions">{record && <Button className="gpf-primary" onClick={() => move(2)}>Continue to Product Recommendation<ArrowRight aria-hidden="true" /></Button>}<Button variant="outline" onClick={() => move(0)}><ArrowLeft aria-hidden="true" />Back</Button><Button variant="link" onClick={reset}>Start Over</Button></div>
      </>}
      {step === 2 && record && <>
        <p className="gpf-intro">This is the primary color product linked to your search.</p>
        <ColorProduct product={record} />
        <div className="gpf-actions"><Button className="gpf-primary" onClick={() => move(3)}>Continue to Recommended System<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={() => move(1)}><ArrowLeft aria-hidden="true" />Back</Button></div>
      </>}
      {step === 3 && record && <SystemForProduct product={record} summary={[["Project", "Restore Original OEM Finish"], ["Search", searchLabel], ["Matched Color", record.color_name ?? record.product_name]]} onBack={() => move(2)} onReset={reset} />}
    </>}
  </Shell>;
}

/* =========== 2. Change My Wheel Color =========== */
export function ColorChangeDbFinder() {
  const { step, move, ref } = useStage();
  const [finish, setFinish] = useState(""); const [coating, setCoating] = useState(""); const [family, setFamily] = useState("");
  const [auto, setAuto] = useState(false); const [unsure, setUnsure] = useState<"" | "finish" | "coating">("");
  const [product, setProduct] = useState<DemoProduct | null>(null);
  const products = useQuery({ ...fresh, queryKey: ["demo", "products"], queryFn: fetchProducts });
  const all = products.data ?? [];
  const finishes = uniqueSorted(all.map((p) => p.finish));
  const coatings = uniqueSorted(all.filter((p) => p.finish === finish).map((p) => p.coating_type));
  const byFinishCoating = all.filter((p) => p.finish === finish && p.coating_type === coating);
  const families = uniqueSorted(byFinishCoating.map((p) => p.color_family));
  const colors = byFinishCoating.filter((p) => !family || p.color_family === family);
  const countFor = (f: string) => all.filter((p) => p.finish === f).length;
  const reset = () => { setFinish(""); setCoating(""); setFamily(""); setAuto(false); setUnsure(""); setProduct(null); move(0); };
  const continueFromFinish = () => {
    const valid = uniqueSorted(all.filter((p) => p.finish === finish).map((p) => p.coating_type));
    setFamily("");
    if (valid.length === 1) { setCoating(valid[0]!); setAuto(true); move(2); } else { setCoating(""); setAuto(false); move(1); }
  };
  return <Shell title="Change My Wheel Color" intro="Choose the type of color or finish you are interested in. We'll help narrow down the products that match your project." steps={["Finish Type", "Coating", "Color", "Color Product", "System"]} titles={["What type of finish are you looking for?", "How will the wheels be coated?", colors.length === 0 ? "No Matching Products Found" : "Choose Your Color", "Selected Color Product", "Recommended System for Your Project"]} step={step} move={move} stageRef={ref} support="Tell us the look you want and share a few inspiration photos — our team can recommend the right products.">
    {(openHelp) => <>
      <Status loading={products.isLoading} error={products.error} retry={() => products.refetch()} label="products" />
      {products.isSuccess && <>
        {step === 0 && <>
          {finishes.length === 0 ? <NoMatch text="No products are available in the demo database yet." onHelp={openHelp} /> : <div className="gpf-style-grid" role="radiogroup" aria-label="Finish type">
            {finishes.map((f) => <button type="button" role="radio" aria-checked={finish === f} key={f} className={`gpf-style-card ${finish === f ? "is-selected" : ""}`} onClick={() => { setFinish(f); setUnsure(""); }}><Swatch family={all.find((p) => p.finish === f)?.color_family ?? null} /><strong>{f}</strong><span>{countFor(f)} demo product{countFor(f) === 1 ? "" : "s"}</span></button>)}
            <button type="button" role="radio" aria-checked={unsure === "finish"} className={`gpf-style-card is-unsure ${unsure === "finish" ? "is-selected" : ""}`} onClick={() => { setFinish(""); setUnsure("finish"); }}><span className="gpf-unsure-mark" aria-hidden="true">?</span><strong>I'm Not Sure</strong><span>Show me examples and help me choose.</span></button>
          </div>}
          {unsure === "finish" && <div className="gpf-unsure-panel"><h3 className="featured-name">Finish Examples</h3><p>Here are example colors for each finish currently in our demo catalog. Pick the one closest to what you want.</p><div className="gpf-style-grid gpf-finish-grid">{finishes.map((f) => <article key={f} className="gpf-style-card"><Swatch family={all.find((p) => p.finish === f)?.color_family ?? null} /><strong>{f}</strong><span>{uniqueSorted(all.filter((p) => p.finish === f).map((p) => p.color_name)).join(", ")}</span><Button size="sm" variant="outline" onClick={() => { setFinish(f); setUnsure(""); }}>Choose {f}</Button></article>)}</div></div>}
          <div className="gpf-actions"><Button className="gpf-primary" disabled={!finish} onClick={continueFromFinish}>Continue<ArrowRight aria-hidden="true" /></Button></div>
        </>}
        {step === 1 && finish && <>
          <p className="gpf-intro">If you already know which coating process you are using, select it below. If not, choose "I'm Not Sure" and we can help.</p>
          <div className="gpf-style-grid" role="radiogroup" aria-label="Coating process">
            {coatings.map((c) => <button type="button" role="radio" aria-checked={coating === c} key={c} className={`gpf-style-card ${coating === c ? "is-selected" : ""}`} onClick={() => { setCoating(c); setUnsure(""); }}><Swatch family={null} /><strong>{c}</strong><span>{all.filter((p) => p.finish === finish && p.coating_type === c).length} demo products</span></button>)}
            <button type="button" role="radio" aria-checked={unsure === "coating"} className={`gpf-style-card is-unsure ${unsure === "coating" ? "is-selected" : ""}`} onClick={() => { setCoating(""); setUnsure("coating"); }}><span className="gpf-unsure-mark" aria-hidden="true">?</span><strong>I'm Not Sure</strong><span>Help me decide</span></button>
          </div>
          {unsure === "coating" && <div className="gpf-unsure-panel"><h3 className="featured-name">Liquid or Powder?</h3><p><strong>Liquid</strong> coatings are sprayed in thin coats and air or low-bake cured — ideal for spot repairs and smaller setups. <strong>Powder</strong> coatings are applied electrostatically and oven cured — very tough, but need a curing oven. If you don't have an oven, choose Liquid.</p><div className="gpf-actions">{coatings.map((c) => <Button key={c} size="sm" variant="outline" onClick={() => { setCoating(c); setUnsure(""); }}>Use {c}</Button>)}</div></div>}
          <div className="gpf-actions"><Button className="gpf-primary" disabled={!coating} onClick={() => { setFamily(""); move(2); }}>Show Matching Colors<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={() => move(0)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}
        {step === 2 && finish && coating && <>
          {byFinishCoating.length === 0 ? <NoMatch text="We couldn't find a matching product for this combination in our current demo catalog." onHelp={openHelp}><Button type="button" className="gpf-primary" onClick={reset}>Try a Different Finish</Button></NoMatch> : <>
            <p className="gpf-intro">These demo products match the finish and coating type you selected.</p>
            <span className="gpf-demo">{colors.length} demo product{colors.length === 1 ? "" : "s"} · {finish} · {coating}{auto ? " (only option for this finish)" : ""}</span>
            {families.length > 1 && <div className="gpf-fields">{selectField("Color Family", family, families, setFamily, false, "All color families")}</div>}
            <div className="gpf-style-grid gpf-finish-grid">{colors.map((c) => <article key={c.id} className="gpf-style-card" data-testid="demo-color"><Swatch family={c.color_family} /><strong>{c.color_name ?? c.product_name}</strong><span>{c.product_name}</span><span>{[c.color_family, c.gloss_level].filter(Boolean).join(" · ")}</span><Button size="sm" className="gpf-primary" onClick={() => { setProduct(c); move(3); }}>Select</Button></article>)}</div>
          </>}
          <div className="gpf-actions"><Button variant="outline" onClick={() => move(auto ? 0 : 1)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}
        {step === 3 && product && <>
          <ColorProduct product={product} />
          <div className="gpf-actions"><Button className="gpf-primary" onClick={() => move(4)}>Continue to Recommended System<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={() => move(2)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}
        {step === 4 && product && <SystemForProduct product={product} summary={[["Project", "Change My Wheel Color"], ["Selected Finish", finish], ["Selected Color", product.color_name ?? product.product_name], ["Coating Type", coating]]} onBack={() => move(3)} onReset={reset} />}
      </>}
    </>}
  </Shell>;
}

/* =========== 3. Create a Custom / Special Finish =========== */
export function CustomFinishDbFinder() {
  const { step, move, ref } = useStage();
  const [system, setSystem] = useState<DemoSystem | null>(null);
  const [selected, setSelected] = useState<string[] | null>(null);
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const systems = useQuery({ ...fresh, queryKey: ["demo", "systems"], queryFn: fetchSystems, retry: 1 });
  const layers = useQuery({ ...fresh, queryKey: ["demo", "system-layers", system?.id], queryFn: () => fetchSystemLayers(system!.id), enabled: system !== null });
  const items = (layers.data ?? []).map(layerItem).filter((i): i is CartItem => i !== null);
  const chosen = selected ?? items.map((i) => i.key);
  const toggle = (key: string, on: boolean) => setSelected(on ? [...chosen, key] : chosen.filter((k) => k !== key));
  const reset = () => { setSystem(null); setSelected(null); setCart(null); move(0); };
  const layerList = layers.data ?? [];
  return <Shell title="Create a Custom / Special Finish" intro="Tell us the look you want and we'll show the layers and products needed to create it." steps={["Choose a Finish", "How It's Built", "Your System"]} titles={["Choose a Special Finish System", system ? `How ${system.system_name} Is Built` : "How It's Built", "Your Special Finish System"]} step={step} move={move} stageRef={ref} support="Share a few inspiration photos of the look you want — our team can recommend the right layers and products.">
    {(openHelp) => <>
      {step === 0 && <>
        <Status loading={systems.isLoading} error={systems.error} retry={() => systems.refetch()} label="finish systems" />
        {systems.isSuccess && (systems.data.length === 0 ? <NoMatch text="No special finish systems are available in the demo database yet." onHelp={openHelp} /> : <>
          <p className="gpf-intro">Each special finish is built from several coating layers. Choose a system to see how it comes together.</p>
          <div className="gpf-style-grid gpf-finish-grid" role="radiogroup" aria-label="Special finish systems">
            {systems.data.map((s) => <button type="button" role="radio" key={s.id} aria-checked={system?.id === s.id} className={`gpf-style-card ${system?.id === s.id ? "is-selected" : ""}`} onClick={() => { setSystem(s); setSelected(null); }}><strong>{s.system_name}</strong><span>{s.finish_type ?? "Finish type TBD"}</span>{s.description && <span>{s.description}</span>}</button>)}
          </div>
          <div className="gpf-unsure-panel" aria-disabled="true" style={{ opacity: 0.6 }}><span className="gpf-demo">Coming soon</span><p className="mt-3">Upload an inspiration photo and get a matching system suggestion — future functionality.</p></div>
        </>)}
        <div className="gpf-actions"><Button className="gpf-primary" disabled={!system} onClick={() => move(1)}>See How It's Built<ArrowRight aria-hidden="true" /></Button></div>
      </>}
      {step === 1 && system && <>
        <p className="gpf-intro">{system.description ?? "Demo special finish system."} Layers are applied in the order shown, from the wheel surface outward.</p>
        <dl className="gpf-summary"><div><dt>System</dt><dd>{system.system_name}</dd></div><div><dt>Finish Type</dt><dd>{system.finish_type ?? "TBD"}</dd></div><div><dt>Layers</dt><dd>{layers.isSuccess ? layerList.length : "…"}</dd></div></dl>
        <Status loading={layers.isLoading} error={layers.error} retry={() => layers.refetch()} label="system layers" />
        {layers.isSuccess && (layerList.length === 0 ? <NoMatch text={`No products are linked to ${system.system_name} yet.`} onHelp={openHelp} /> : <ol className="gpf-details" aria-label="Layer order" data-testid="layer-order">{layerList.map((l) => <li key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}><span className="gpf-step-number">{l.layer_order}</span><Swatch family={l.product?.color_family ?? null} /><span><strong>{l.coating_role ?? "Coat"}</strong> — {l.product?.product_name ?? "Product unavailable"}{l.product?.finish ? ` · ${l.product.finish}` : ""}</span></li>)}</ol>)}
        <div className="gpf-actions">{layerList.length > 0 && <Button className="gpf-primary" onClick={() => move(2)}>View System Products<ArrowRight aria-hidden="true" /></Button>}<Button variant="outline" onClick={() => move(0)}><ArrowLeft aria-hidden="true" />Back</Button></div>
      </>}
      {step === 2 && system && <>
        <dl className="gpf-summary"><div><dt>Project</dt><dd>Custom / Special Finish</dd></div><div><dt>System</dt><dd>{system.system_name}</dd></div><div><dt>Finish Type</dt><dd>{system.finish_type ?? "TBD"}</dd></div></dl>
        <LayerCards layers={layerList} selected={chosen} toggle={toggle} />
        <div className="gpf-cart-actions"><Button className="gpf-primary" disabled={chosen.length === 0} onClick={() => setCart(items.filter((i) => chosen.includes(i.key)))}><ShoppingBag aria-hidden="true" />Add Selected Products to Cart ({chosen.length})</Button><Button variant="outline" onClick={() => { setSelected(items.map((i) => i.key)); setCart(items); }}>Add Complete System to Cart</Button></div>
        <div className="gpf-actions"><Button variant="outline" onClick={() => move(1)}><ArrowLeft aria-hidden="true" />Back</Button><Button variant="link" onClick={reset}>Start Over</Button></div>
        <CartDialog items={cart} onClose={() => setCart(null)} back="Back to Your System" />
      </>}
    </>}
  </Shell>;
}
