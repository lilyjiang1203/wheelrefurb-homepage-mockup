import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { ProductFinderHelp } from "./product-finder-help";
import { emptyVehicle } from "./product-finder-data";
import wheelPaintImg from "../assets/product-wheel-paint.jpg";
import powderImg from "../assets/product-powder-coating.jpg";
import clearImg from "../assets/product-clear-coat.jpg";
import {
  existingProductRoute, fetchProducts, fetchSystemLayers, fetchSystems, fetchVehicleProducts, fetchVehicles,
  filterProducts, uniqueSorted, type DemoProduct,
} from "../lib/demo-catalog";

const DEMO_NOTE = "Demonstration data from the wheelrefurb-demo database. Matches and compatibility are not verified recommendations — confirm with our team before purchase or application.";

const imageFor = (p: DemoProduct) => (p.coating_layer === "Clear Coat" ? clearImg : p.coating_type === "Powder" ? powderImg : wheelPaintImg);

function Shell({ title, intro, steps, step, children }: { title: string; intro: string; steps: string[]; step: number; children: ReactNode }) {
  const [help, setHelp] = useState(false);
  return <main className="gpf-page">
    <div className="featured-inner">
      <Button asChild variant="link" className="gpf-back"><Link to="/"><ArrowLeft aria-hidden="true" />Back to Home</Link></Button>
      <header className="gpf-page-head"><p className="finder-kicker">Guided Product Finder</p><h1>{title}</h1><p>{intro}</p><span className="gpf-demo">Demonstration data · Not verified recommendations</span></header>
      <nav aria-label="Product finder progress"><ol className="gpf-progress">{steps.map((label, i) => <li key={label} className={i === step ? "is-current" : i < step ? "is-complete" : ""} aria-current={i === step ? "step" : undefined}>
        <Button variant="ghost" disabled tabIndex={-1}><span className="gpf-step-number">{i < step ? <Check size={16} aria-hidden="true" /> : i + 1}</span><span>{label}</span></Button>
      </li>)}</ol></nav>
      <section className="gpf-stage" aria-labelledby="gpf-stage-title">
        <div className="gpf-stage-heading"><div><p className="finder-kicker">Step {step + 1} of {steps.length}</p><h2 id="gpf-stage-title">{steps[step]}</h2></div><Button variant="link" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Need Help?</Button></div>
        {children}
      </section>
      <section className="gpf-support" aria-labelledby="gpf-support-title"><div><h2 id="gpf-support-title">Still need help?</h2><p>Send us your vehicle and wheel information, along with a few photos, and our team can help identify the correct color and products for your project.</p></div><Button variant="outline" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></section>
    </div>
    <ProductFinderHelp open={help} onOpenChange={setHelp} vehicle={emptyVehicle} />
  </main>;
}

function Status({ loading, error, retry, label }: { loading: boolean; error: unknown; retry: () => void; label: string }) {
  if (loading) return <p className="gpf-intro" role="status">Loading {label}…</p>;
  if (error) return <div className="gpf-unsure-panel" role="alert"><p>We couldn't load {label} from the demo database. Please try again.</p><div className="gpf-actions"><Button variant="outline" onClick={retry}>Try Again</Button></div></div>;
  return null;
}

function Empty({ children }: { children: ReactNode }) {
  return <div className="gpf-unsure-panel"><span className="gpf-demo">No results</span><p className="mt-3">{children}</p></div>;
}

function ProductCard({ product, role }: { product: DemoProduct; role?: string }) {
  const route = existingProductRoute(product.product_url);
  return <article className="featured-card" data-testid="demo-product">
    <div className="gpf-product-role"><h3>{role ?? product.coating_layer ?? "Product"}</h3><span className="gpf-badge">Demo data</span></div>
    <div className="featured-media"><img src={imageFor(product)} alt={`Illustrative image for ${product.product_name}`} loading="lazy" /></div>
    <div className="featured-body">
      <h4 className="featured-name">{product.product_name}</h4>
      <dl className="gpf-details">
        {product.color_name && <div><dt>Color</dt><dd>{product.color_name}{product.color_family ? ` · ${product.color_family}` : ""}</dd></div>}
        {product.finish && <div><dt>Finish</dt><dd>{product.finish}{product.gloss_level ? ` · ${product.gloss_level}` : ""}</dd></div>}
        {product.coating_type && <div><dt>Coating Type</dt><dd>{product.coating_type}{product.liquid_type ? ` · ${product.liquid_type}` : ""}</dd></div>}
        {product.oem_color_code && <div><dt>Code</dt><dd>{product.oem_color_code}</dd></div>}
      </dl>
      {route
        ? <Button asChild variant="link" className="gpf-product-link"><Link to={route}>View Product<ArrowRight aria-hidden="true" /></Link></Button>
        : <p className="gpf-disclaimer">Demo placeholder · Product page not available yet</p>}
    </div>
  </article>;
}

const select = (label: string, value: string, options: string[], onChange: (v: string) => void, disabled = false, placeholder = "Any") =>
  <label>{label}<select aria-label={label} className="gpf-control" disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)}><option value="">{placeholder}</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>;

/* 1. Restore the Original OEM Finish */
export function OemRestoreDbFinder() {
  const [brand, setBrand] = useState(""); const [model, setModel] = useState(""); const [year, setYear] = useState("");
  const vehicles = useQuery({ queryKey: ["demo", "vehicles"], queryFn: fetchVehicles });
  const list = vehicles.data ?? [];
  const vehicle = list.find((v) => v.brand === brand && v.model === model && String(v.year) === year) ?? null;
  const matches = useQuery({ queryKey: ["demo", "vehicle-products", vehicle?.id], queryFn: () => fetchVehicleProducts(vehicle!.id), enabled: vehicle !== null });
  const step = vehicle ? 1 : 0;
  return <Shell title="Restore the Original OEM Finish" intro="Select your vehicle brand, model and year to see the demo products linked to it." steps={["Select Your Vehicle", "Matching Products"]} step={step}>
    <Status loading={vehicles.isLoading} error={vehicles.error} retry={() => vehicles.refetch()} label="vehicles" />
    {vehicles.isSuccess && (list.length === 0 ? <Empty>No vehicles are available in the demo database yet.</Empty> : <>
      <div className="gpf-fields">
        {select("Vehicle Brand", brand, uniqueSorted(list.map((v) => v.brand)), (v) => { setBrand(v); setModel(""); setYear(""); }, false, "Select brand")}
        {select("Vehicle Model", model, uniqueSorted(list.filter((v) => v.brand === brand).map((v) => v.model)), (v) => { setModel(v); setYear(""); }, !brand, "Select model")}
        {select("Model Year", year, uniqueSorted(list.filter((v) => v.brand === brand && v.model === model).map((v) => v.year)), setYear, !model, "Select year")}
      </div>
      {vehicle && <>
        <Status loading={matches.isLoading} error={matches.error} retry={() => matches.refetch()} label="matching products" />
        {matches.isSuccess && (matches.data.length === 0
          ? <Empty>No demo products are linked to the {vehicle.year} {vehicle.brand} {vehicle.model} yet. Email our team and we can help identify the correct finish.</Empty>
          : <><p className="gpf-intro">Demo products linked to the {vehicle.year} {vehicle.brand} {vehicle.model}:</p><div className="gpf-system-grid">{matches.data.map((p) => <ProductCard key={p.id} product={p} role="Demo OEM Match" />)}</div></>)}
      </>}
      {(brand || model || year) && <div className="gpf-actions"><Button variant="outline" onClick={() => { setBrand(""); setModel(""); setYear(""); }}>Start Over</Button></div>}
    </>)}
    <p className="gpf-disclaimer">{DEMO_NOTE}</p>
  </Shell>;
}

/* 2. Change My Wheel Color */
export function ColorChangeDbFinder() {
  const [colorFamily, setColorFamily] = useState(""); const [finish, setFinish] = useState(""); const [coatingType, setCoatingType] = useState("");
  const products = useQuery({ queryKey: ["demo", "products"], queryFn: fetchProducts });
  const all = products.data ?? [];
  const results = filterProducts(all, { colorFamily, finish, coatingType });
  const filtered = Boolean(colorFamily || finish || coatingType);
  return <Shell title="Change My Wheel Color" intro="Filter the demo product catalogue by color family, finish and coating type." steps={["Choose Filters", "Matching Products"]} step={filtered ? 1 : 0}>
    <Status loading={products.isLoading} error={products.error} retry={() => products.refetch()} label="products" />
    {products.isSuccess && <>
      <div className="gpf-fields">
        {select("Color Family", colorFamily, uniqueSorted(all.map((p) => p.color_family)), setColorFamily)}
        {select("Finish", finish, uniqueSorted(all.map((p) => p.finish)), setFinish)}
        {select("Coating Type", coatingType, uniqueSorted(all.map((p) => p.coating_type)), setCoatingType)}
      </div>
      {results.length === 0
        ? <Empty>No demo products match this combination. Try removing a filter.</Empty>
        : <><p className="gpf-intro" role="status">{results.length} demo product{results.length === 1 ? "" : "s"} found.</p><div className="gpf-system-grid">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div></>}
      {filtered && <div className="gpf-actions"><Button variant="outline" onClick={() => { setColorFamily(""); setFinish(""); setCoatingType(""); }}>Clear Filters</Button></div>}
    </>}
    <p className="gpf-disclaimer">{DEMO_NOTE}</p>
  </Shell>;
}

/* 3. Create a Custom / Special Finish */
export function CustomFinishDbFinder() {
  const [systemId, setSystemId] = useState<number | null>(null);
  const systems = useQuery({ queryKey: ["demo", "systems"], queryFn: fetchSystems });
  const layers = useQuery({ queryKey: ["demo", "system-layers", systemId], queryFn: () => fetchSystemLayers(systemId!), enabled: systemId !== null });
  const system = systems.data?.find((s) => s.id === systemId) ?? null;
  return <Shell title="Create a Custom / Special Finish" intro="Choose a demo special finish system to see its products in layer order." steps={["Choose a System", "System Layers"]} step={system ? 1 : 0}>
    <Status loading={systems.isLoading} error={systems.error} retry={() => systems.refetch()} label="finish systems" />
    {systems.isSuccess && (systems.data.length === 0 ? <Empty>No special finish systems are available in the demo database yet.</Empty> : <>
      <div className="gpf-style-grid gpf-finish-grid" role="radiogroup" aria-label="Special finish systems">
        {systems.data.map((s) => <button type="button" role="radio" key={s.id} aria-checked={systemId === s.id} className={`gpf-style-card ${systemId === s.id ? "is-selected" : ""}`} onClick={() => setSystemId(s.id)}><strong>{s.system_name}</strong><span>{s.finish_type ?? "Finish type TBD"}</span>{s.description && <span>{s.description}</span>}</button>)}
      </div>
      {system && <>
        <Status loading={layers.isLoading} error={layers.error} retry={() => layers.refetch()} label="system layers" />
        {layers.isSuccess && (layers.data.length === 0
          ? <Empty>No products are linked to {system.system_name} yet.</Empty>
          : <><p className="gpf-intro">{system.system_name} — applied in this order:</p><div className="gpf-system-grid">{layers.data.map((l) => l.product
            ? <ProductCard key={l.id} product={l.product} role={`Layer ${l.layer_order} · ${l.coating_role ?? "Coat"}`} />
            : <article key={l.id} className="featured-card"><div className="featured-body"><h4 className="featured-name">Layer {l.layer_order}</h4><p className="gpf-disclaimer">Product unavailable</p></div></article>)}</div></>)}
      </>}
    </>)}
    <p className="gpf-disclaimer">{DEMO_NOTE}</p>
  </Shell>;
}
