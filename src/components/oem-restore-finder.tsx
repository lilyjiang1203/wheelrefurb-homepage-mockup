import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Mail, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { ProductFinderHelp } from "./product-finder-help";
import { createMockSystem, emptyVehicle, findMatches, makeOptions, styleOptions, modelOptions, sizeOptions, yearOptions, type FinderProduct, type VehicleDetails } from "./product-finder-data";
import { WheelGlyph } from "./wheel-glyph";

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
  const [chosen, setChosen] = useState("");
  const matches = step >= 1 ? findMatches(vehicle) : [];
  const record = matches.length === 1 ? matches[0] : matches.find((m) => m.oem_color_code === chosen);
  const products = createMockSystem(vehicle, record);
  const color = products.find((product) => product.id === "color");
  const matchName = record?.oem_finish ?? "Not identified";
  const [unsure, setUnsure] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const order: (keyof VehicleDetails)[] = ["make", "model", "year", "wheel", "style"];
  const update = (field: keyof VehicleDetails, value: string) => { setUnsure(false); setVehicle((current) => { const next = { ...current, [field]: value }; order.slice(order.indexOf(field) + 1).forEach((k) => { if (field !== "code") next[k] = ""; }); return next; }); };
  const styles = vehicle.wheel ? styleOptions(vehicle) : [];
  const move = (next: number) => { setStep(next); requestAnimationFrame(() => { stageRef.current?.scrollIntoView({ behavior: "auto", block: "start" }); stageRef.current?.focus({ preventScroll: true }); }); };
  const reset = () => { setChosen(""); setUnsure(false); setPhotos([]); setVehicle({ ...emptyVehicle }); setMethod("vehicle"); setSelected(["primer", "color", "clear"]); setCart(null); move(0); };
  const vehicleSummary = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || "OEM color code provided";
  
  return <main className="gpf-page">
    <div className="featured-inner">
      <Button asChild variant="link" className="gpf-back"><Link to="/"><ArrowLeft aria-hidden="true" />Back to Home</Link></Button>
      <header className="gpf-page-head"><p className="finder-kicker">Guided Product Finder</p><h1>Restore the Original OEM Finish</h1><p>Tell us about your vehicle and we'll help identify the correct OEM color and the products needed for your refinishing project.</p><span className="gpf-demo">Demo only · Sample matches and products</span></header>
      <nav aria-label="Product finder progress"><ol className="gpf-progress">{steps.map((label, index) => <li key={label} className={index === step ? "is-current" : index < step ? "is-complete" : ""} aria-current={index === step ? "step" : undefined}>
        <Button variant="ghost" disabled={index > step} onClick={() => move(index)}><span className="gpf-step-number">{index < step ? <Check size={16} aria-hidden="true" /> : index + 1}</span><span>{label}</span></Button>
      </li>)}</ol></nav>
      <section className="gpf-stage" ref={stageRef} tabIndex={-1} aria-labelledby="gpf-stage-title">
        <div className="gpf-stage-heading"><div><p className="finder-kicker">Step {step + 1} of 4</p><h2 id="gpf-stage-title">{["Tell Us About Your Vehicle", matches.length === 0 ? "No Exact Match Found" : matches.length > 1 ? "Multiple Possible Matches" : "Exact Match Found", "Matching Color Product", "Recommended System for Your Project"][step]}</h2></div><Button variant="link" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Need Help?</Button></div>
        {step === 0 && <>
          <p className="gpf-intro">Enter your vehicle and wheel information so we can help identify the original OEM wheel finish.</p>
          <div className="gpf-method" role="group" aria-label="Find by"><Button variant={method === "vehicle" ? "default" : "outline"} aria-pressed={method === "vehicle"} onClick={() => setMethod("vehicle")}>Vehicle Information</Button><Button variant={method === "code" ? "default" : "outline"} aria-pressed={method === "code"} onClick={() => setMethod("code")}>Already know your OEM color code?</Button></div>
          <form className="gpf-vehicle-form" onSubmit={(event) => { event.preventDefault(); if (method === "code") setVehicle((current) => ({ ...emptyVehicle, code: current.code.trim() })); else setVehicle((current) => ({ ...current, code: "" })); setChosen(""); move(1); }}>
            {method === "vehicle" ? <><div className="gpf-fields">
              <label>Vehicle Make<select aria-label="Vehicle Make" className="gpf-control" required value={vehicle.make} onChange={(event) => update("make", event.target.value)}><option value="">Select make</option>{makeOptions.map((make) => <option key={make}>{make}</option>)}</select></label>
              <label>Vehicle Model<select aria-label="Vehicle Model" className="gpf-control" required disabled={!vehicle.make} value={vehicle.model} onChange={(event) => update("model", event.target.value)}><option value="">Select model</option>{modelOptions(vehicle.make).map((model) => <option key={model}>{model}</option>)}</select></label>
              <label>Model Year<select aria-label="Model Year" className="gpf-control" required disabled={!vehicle.model} value={vehicle.year} onChange={(event) => update("year", event.target.value)}><option value="">Select year</option>{yearOptions(vehicle.make, vehicle.model).map((year) => <option key={year}>{year}</option>)}</select></label>
              <label>Wheel Size<select aria-label="Wheel Size" className="gpf-control" required disabled={!vehicle.year} value={vehicle.wheel} onChange={(event) => update("wheel", event.target.value)}><option value="">Select size</option>{sizeOptions(vehicle).map((size) => <option key={size}>{size}</option>)}</select></label>
            </div>
            <fieldset className="gpf-style-field" disabled={!vehicle.wheel}><legend>Wheel Style / Design</legend><p className="gpf-style-hint">{vehicle.wheel ? "Pick the wheel that looks like yours." : "Choose your wheel size to see matching wheel designs."}</p>
              {vehicle.wheel && <div className="gpf-style-grid" role="radiogroup" aria-label="Wheel Style / Design">
                {styles.map((style, i) => <button type="button" role="radio" aria-checked={vehicle.style === style} key={style} className={`gpf-style-card ${vehicle.style === style ? "is-selected" : ""}`} onClick={() => { setUnsure(false); setVehicle((c) => ({ ...c, style })); }}><WheelGlyph variant={i} /><strong>{style}</strong><span>{vehicle.wheel}</span></button>)}
                <button type="button" role="radio" aria-checked={unsure} className={`gpf-style-card is-unsure ${unsure ? "is-selected" : ""}`} onClick={() => { setUnsure(true); setVehicle((c) => ({ ...c, style: "" })); }}><span className="gpf-unsure-mark" aria-hidden="true">?</span><strong>I'm Not Sure</strong><span>Get help identifying it</span></button>
              </div>}
            </fieldset>
            {unsure && <div className="gpf-unsure-panel"><p>No problem — send us a photo of your wheel and our team will identify the style for you.</p><div className="gpf-actions"><label className="gpf-upload"><input type="file" accept="image/*" multiple onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 5).map((f) => f.name))} />Upload Wheel Photo</label></div>{photos.length > 0 && <p className="gpf-disclaimer">Selected (demo, not sent): {photos.join(", ")}</p>}<p className="gpf-disclaimer">Still need help? Use the Email Our Team section below.</p></div>}
          </> : <label>Enter OEM Color Code<Input required value={vehicle.code} maxLength={60} onChange={(event) => update("code", event.target.value)} placeholder="e.g. BMW-XYZ-001" /></label>}
            <div className="gpf-actions"><Button type="submit" className="gpf-primary" disabled={method === "vehicle" && !vehicle.style}>Find My OEM Color<ArrowRight aria-hidden="true" /></Button></div>
          </form>
        </>}
        {step === 1 && <>
          <p className="gpf-intro">{matches.length === 0 ? "We couldn't find an exact match in our current database." : matches.length > 1 && !record ? "Your wheel was offered in more than one OEM finish. Select the one that matches your wheel." : "Based on the vehicle and wheel information provided, this is the matching OEM finish."}</p>
          {matches.length === 0 && <div className="gpf-unsure-panel"><span className="gpf-demo">No exact match found</span><p className="mt-3">Send us a few photos of your wheel and our team can help identify the correct finish.</p><div className="gpf-actions"><label className="gpf-upload"><input type="file" accept="image/*" multiple onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 5).map((f) => f.name))} />Upload Wheel Photos</label><Button variant="outline" type="button" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></div>{photos.length > 0 && <p className="gpf-disclaimer">Selected (demo, not sent): {photos.join(", ")}</p>}</div>}
          {matches.length > 1 && <><span className="gpf-demo">Multiple possible matches</span><div className="gpf-style-grid gpf-finish-grid" role="radiogroup" aria-label="Possible OEM finishes">{matches.map((m) => <button type="button" role="radio" key={m.oem_color_code} aria-checked={chosen === m.oem_color_code} className={`gpf-style-card ${chosen === m.oem_color_code ? "is-selected" : ""}`} onClick={() => setChosen(m.oem_color_code)}><span className="gpf-finish-swatch" style={{ background: m.swatch }} aria-hidden="true" /><strong>{m.oem_finish}</strong><span>{m.wheel_style} · {m.wheel_size}</span></button>)}</div></>}
          {record && <div className="gpf-match-result"><span className="gpf-demo">{matches.length > 1 ? "Finish confirmed" : "Exact match found"}</span><h3>Matched OEM Wheel Finish</h3>
            <div className="gpf-match"><span className="gpf-oem-swatch" style={{ background: record.swatch }} aria-label={`${record.oem_finish} color swatch`} /><dl className="gpf-details"><div><dt>Finish Name</dt><dd>{record.oem_finish}</dd></div><div><dt>Wheel</dt><dd>{record.make} {record.model} · {vehicle.year || `${record.year_from}–${record.year_to}`} · {record.wheel_size} · {record.wheel_style}</dd></div><div><dt>Matching Wheel Paint Product</dt><dd>{record.wheel_paint_product}</dd></div></dl></div>
            <div className="gpf-match-product"><div className="featured-media"><img src={color?.image} alt="Placeholder wheel paint product" /></div><p>{record.wheel_paint_product}<small>Placeholder product image</small></p></div>
          </div>}
          <p className="gpf-disclaimer">Sample data only. This result has not been checked against a real OEM color database.</p>
          <div className="gpf-actions">{record && <Button className="gpf-primary" onClick={() => move(2)}>Continue to Product Recommendation<ArrowRight aria-hidden="true" /></Button>}<Button variant="outline" onClick={reset}>Start Over</Button></div>
        </>}
        {step === 2 && color && record && <>
          <p className="gpf-intro">This is the primary color product matched to your vehicle and OEM finish.</p>
          <div className="gpf-color-product"><div className="featured-media"><img src={color.image} alt="Example wheel paint product" /></div><div><span className="featured-label">Color Coat · Required</span><h3>{color.name}</h3><dl className="gpf-details"><div><dt>Product Role</dt><dd>Color Coat</dd></div><div><dt>Coating Process</dt><dd>Liquid Paint</dd></div><div><dt>OEM Color</dt><dd>{matchName}</dd></div></dl><p className="gpf-disclaimer">Example product image and recommendation. Compatibility is not verified.</p></div></div>
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
      <section className="gpf-support" aria-labelledby="gpf-support-title"><div><h2 id="gpf-support-title">Still need help?</h2><p>Send us your vehicle and wheel information, along with a few photos, and our team can help identify the correct color and products for your project.</p></div><Button variant="outline" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></section>
    </div>
    <ProductFinderHelp open={help} onOpenChange={setHelp} vehicle={vehicle} />
    <Dialog open={Boolean(detail)} onOpenChange={(open) => { if (!open) setDetail(null); }}><DialogContent className="gpf-dialog"><DialogTitle>{detail?.name}</DialogTitle><DialogDescription>Example product · Not available for purchase in this preview</DialogDescription>{detail && <><div className="featured-media"><img src={detail.image} alt={detail.name} /></div><p>{detail.description}</p><dl className="gpf-details"><div><dt>Product Role</dt><dd>{detail.product_role}</dd></div><div><dt>Coating Process</dt><dd>{detail.coating_process}</dd></div><div><dt>System</dt><dd>OEM Silver Restoration · Example</dd></div></dl></>}</DialogContent></Dialog>
    <Dialog open={Boolean(cart)} onOpenChange={(open) => { if (!open) setCart(null); }}><DialogContent className="gpf-dialog"><DialogTitle>Added to Your Demo Cart</DialogTitle><DialogDescription>{cart?.length} example products selected. No real cart or order has been created.</DialogDescription><ul className="gpf-cart-list">{cart?.map((product) => <li key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><p>{product.product_role} · Qty 1</p></div><Check size={18} className="text-brand" aria-hidden="true" /></li>)}</ul><Button className="gpf-primary" onClick={() => setCart(null)}>Back to Recommended System</Button></DialogContent></Dialog>
  </main>;
}