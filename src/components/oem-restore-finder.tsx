import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Mail, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { ProductFinderHelp } from "./product-finder-help";
import { createMockSystem, emptyVehicle, vehicleModels, wheelOptions, years, type FinderProduct, type VehicleDetails } from "./product-finder-data";

const steps = ["Vehicle", "OEM Color", "Color Product", "Recommended System"];
export function OemRestoreFinder() {
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState<VehicleDetails>({ ...emptyVehicle });
  const [method, setMethod] = useState("vehicle");
  const [help, setHelp] = useState(false);
  const [selected, setSelected] = useState(["primer", "color", "clear"]);
  const [detail, setDetail] = useState<FinderProduct | null>(null);
  const [cart, setCart] = useState<FinderProduct[] | null>(null);
  const stageRef = useRef<HTMLElement>(null);
  const products = createMockSystem(vehicle);
  const color = products.find((product) => product.id === "color");
  const matchName = `${vehicle.make || "Sample"} OEM Silver`;
  const update = (field: keyof VehicleDetails, value: string) => setVehicle((current) => ({ ...current, [field]: value, ...(field === "make" ? { model: "" } : {}) }));
  const move = (next: number) => { setStep(next); requestAnimationFrame(() => { stageRef.current?.scrollIntoView({ behavior: "auto", block: "start" }); stageRef.current?.focus({ preventScroll: true }); }); };
  const reset = () => { setVehicle({ ...emptyVehicle }); setMethod("vehicle"); setSelected(["primer", "color", "clear"]); setCart(null); move(0); };
  const vehicleSummary = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || "OEM color code provided";

  return <main className="gpf-page">
    <div className="featured-inner">
      <Button asChild variant="link" className="gpf-back"><Link to="/"><ArrowLeft aria-hidden="true" />Back to Home</Link></Button>
      <header className="gpf-page-head"><p className="finder-kicker">Guided Product Finder</p><h1>Restore the Original OEM Finish</h1><p>Tell us about your vehicle and we'll help identify the correct OEM color and the products needed for your refinishing project.</p><span className="gpf-demo">Demo only · Sample matches and products</span></header>
      <nav aria-label="Product finder progress"><ol className="gpf-progress">{steps.map((label, index) => <li key={label} className={index === step ? "is-current" : index < step ? "is-complete" : ""} aria-current={index === step ? "step" : undefined}>
        <Button variant="ghost" disabled={index > step} onClick={() => move(index)}><span className="gpf-step-number">{index < step ? <Check size={16} aria-hidden="true" /> : index + 1}</span><span>{label}</span></Button>
      </li>)}</ol></nav>
      <section className="gpf-stage" ref={stageRef} tabIndex={-1} aria-labelledby="gpf-stage-title">
        <div className="gpf-stage-heading"><div><p className="finder-kicker">Step {step + 1} of 4</p><h2 id="gpf-stage-title">{["Tell Us About Your Vehicle", "We Found a Matching OEM Finish", "Matching Color Product", "Recommended System for Your Project"][step]}</h2></div><Button variant="link" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Need Help?</Button></div>
        {step === 0 && <>
          <p className="gpf-intro">Enter your vehicle information so we can help identify the original wheel color.</p>
          <div className="gpf-method" role="group" aria-label="Find by"><Button variant={method === "vehicle" ? "default" : "outline"} aria-pressed={method === "vehicle"} onClick={() => setMethod("vehicle")}>Vehicle Information</Button><Button variant={method === "code" ? "default" : "outline"} aria-pressed={method === "code"} onClick={() => setMethod("code")}>Already know your OEM color code?</Button></div>
          <form className="gpf-vehicle-form" onSubmit={(event) => { event.preventDefault(); if (method === "code") setVehicle((current) => ({ ...emptyVehicle, code: current.code.trim() })); else setVehicle((current) => ({ ...current, code: "" })); move(1); }}>
            {method === "vehicle" ? <div className="gpf-fields">
              <label>Vehicle Make<select className="gpf-control" required value={vehicle.make} onChange={(event) => update("make", event.target.value)}><option value="">Select make</option>{Object.keys(vehicleModels).map((make) => <option key={make}>{make}</option>)}</select></label>
              <label>Vehicle Model<select className="gpf-control" required disabled={!vehicle.make} value={vehicle.model} onChange={(event) => update("model", event.target.value)}><option value="">Select model</option>{(vehicleModels[vehicle.make] || []).map((model) => <option key={model}>{model}</option>)}</select></label>
              <label>Year<select className="gpf-control" required value={vehicle.year} onChange={(event) => update("year", event.target.value)}><option value="">Select year</option>{years.map((year) => <option key={year}>{year}</option>)}</select></label>
              <label>Wheel Details<select className="gpf-control" required value={vehicle.wheel} onChange={(event) => update("wheel", event.target.value)}><option value="">Select wheel</option>{wheelOptions.map((wheel) => <option key={wheel}>{wheel}</option>)}</select></label>
            </div> : <label>Enter OEM Color Code<Input required value={vehicle.code} maxLength={60} onChange={(event) => update("code", event.target.value)} placeholder="e.g. BMW-XYZ-001" /></label>}
            <div className="gpf-actions"><Button type="submit" className="gpf-primary">Find My OEM Color<ArrowRight aria-hidden="true" /></Button><Button variant="link" type="button" onClick={() => setHelp(true)}>I'm Not Sure</Button></div>
          </form>
        </>}
        {step === 1 && <>
          <p className="gpf-intro">Based on the vehicle and wheel information provided, this is the closest matching OEM finish.</p>
          <div className="gpf-match"><span className="gpf-oem-swatch" aria-label="Silver color swatch" /><div><span className="gpf-demo">Simulated match</span><h3>{matchName}</h3><p>OEM Color Code: {color?.oem_color_code}</p><p className="text-muted-foreground text-sm mt-2">{vehicleSummary}{vehicle.wheel ? ` · ${vehicle.wheel}` : ""}</p></div></div>
          <p className="gpf-disclaimer">This is an example silver finish, not a verified OEM match. Your vehicle details or code have not been checked against a real color database.</p>
          <div className="gpf-actions"><Button className="gpf-primary" onClick={() => move(2)}>Continue<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={reset}>Start Over</Button></div>
        </>}
        {step === 2 && color && <>
          <p className="gpf-intro">This is the primary color product matched to your vehicle and OEM finish.</p>
          <div className="gpf-color-product"><div className="featured-media"><img src={color.image} alt="Example wheel paint product" /></div><div><span className="featured-label">Color Coat · Required</span><h3>{color.name}</h3><dl className="gpf-details"><div><dt>Product Role</dt><dd>Color Coat</dd></div><div><dt>Coating Process</dt><dd>Liquid Paint</dd></div><div><dt>OEM Color</dt><dd>{vehicle.make || "Sample"} Silver</dd></div></dl><p className="gpf-disclaimer">Example product image and recommendation. Compatibility is not verified.</p></div></div>
          <div className="gpf-actions"><Button className="gpf-primary" onClick={() => move(3)}>Continue to Recommended System<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={() => move(1)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}
        {step === 3 && <>
          <p className="gpf-intro">Based on your selected vehicle and OEM color, these products make up the recommended refinishing system.</p>
          <dl className="gpf-summary"><div><dt>Project</dt><dd>Restore Original OEM Finish</dd></div><div><dt>Vehicle</dt><dd>{vehicleSummary}</dd></div><div><dt>Matched Color</dt><dd>{matchName}</dd></div></dl>
          <div className="gpf-system-grid">{products.map((product) => <article key={product.id} className="featured-card">
            <div className="gpf-product-role"><h3>{product.product_role}</h3><span className={`gpf-badge ${product.requirement_level === "Required" ? "is-required" : ""}`}>{product.requirement_level}</span></div>
            <div className="featured-media"><img src={product.image} alt={`Example ${product.name}`} loading="lazy" /></div>
            <div className="featured-body"><h4 className="featured-name">{product.name}</h4><p className="featured-finish">{product.description}</p><label className="gpf-selection"><input type="checkbox" checked={selected.includes(product.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, product.id] : current.filter((id) => id !== product.id))} />Select {product.product_role}</label><Button variant="link" className="gpf-product-link" onClick={() => setDetail(product)}>View Product<ArrowRight aria-hidden="true" /></Button></div>
          </article>)}</div>
          <p className="gpf-disclaimer">Example system only. Product images are illustrative; confirm the correct color and product compatibility with our team before purchase or application.</p>
          <div className="gpf-cart-actions"><Button className="gpf-primary" disabled={selected.length === 0} onClick={() => setCart(products.filter((product) => selected.includes(product.id)))}><ShoppingBag aria-hidden="true" />Add Selected Products to Cart ({selected.length})</Button><Button variant="outline" onClick={() => { setSelected(products.map((product) => product.id)); setCart(products); }}>Add Complete System to Cart</Button></div>
          <div className="gpf-actions"><Button variant="outline" onClick={() => move(2)}><ArrowLeft aria-hidden="true" />Back</Button><Button variant="link" onClick={reset}>Start Over</Button></div>
        </>}
      </section>
      <section className="gpf-support" aria-labelledby="gpf-support-title"><div><h2 id="gpf-support-title">Still Not Sure?</h2><p>Send us your vehicle and wheel information, along with a few photos, and our team can help identify the correct color and products for your project.</p></div><Button variant="outline" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></section>
    </div>
    <ProductFinderHelp open={help} onOpenChange={setHelp} vehicle={vehicle} />
    <Dialog open={Boolean(detail)} onOpenChange={(open) => { if (!open) setDetail(null); }}><DialogContent className="gpf-dialog"><DialogTitle>{detail?.name}</DialogTitle><DialogDescription>Example product · Not available for purchase in this preview</DialogDescription>{detail && <><div className="featured-media"><img src={detail.image} alt={detail.name} /></div><p>{detail.description}</p><dl className="gpf-details"><div><dt>Product Role</dt><dd>{detail.product_role}</dd></div><div><dt>Coating Process</dt><dd>{detail.coating_process}</dd></div><div><dt>System</dt><dd>OEM Silver Restoration · Example</dd></div></dl></>}</DialogContent></Dialog>
    <Dialog open={Boolean(cart)} onOpenChange={(open) => { if (!open) setCart(null); }}><DialogContent className="gpf-dialog"><DialogTitle>Added to Your Demo Cart</DialogTitle><DialogDescription>{cart?.length} example products selected. No real cart or order has been created.</DialogDescription><ul className="gpf-cart-list">{cart?.map((product) => <li key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><p>{product.product_role} · Qty 1</p></div><Check size={18} className="text-brand" aria-hidden="true" /></li>)}</ul><Button className="gpf-primary" onClick={() => setCart(null)}>Back to Recommended System</Button></DialogContent></Dialog>
  </main>;
}