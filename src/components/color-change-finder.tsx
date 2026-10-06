import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Mail, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { buildSystem, filterColors, finishExamples, finishLabel, finishOptions, processesFor, processLabel, type CoatingProcess, type ColorProduct, type FinishFamily, type SystemProduct } from "./color-change-data";

const steps = ["Finish Type", "Coating", "Color", "Color Product", "System"];
const isGradient = (s: string) => s.includes("gradient");
const Swatch = ({ value, large }: { value: string; large?: boolean }) => <span className="gpf-finish-swatch" style={{ background: value, ...(large ? { width: 160, height: 160 } : {}) }} aria-hidden="true" data-gradient={isGradient(value) || undefined} />;

export function ColorChangeFinder() {
  const [step, setStep] = useState(0);
  const [family, setFamily] = useState<FinishFamily | null>(null);
  const [process, setProcess] = useState<CoatingProcess | null>(null);
  const [autoProcess, setAutoProcess] = useState(false);
  const [unsure, setUnsure] = useState<"" | "finish" | "process">("");
  const [color, setColor] = useState<ColorProduct | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<SystemProduct | null>(null);
  const [cart, setCart] = useState<SystemProduct[] | null>(null);
  const [help, setHelp] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const move = (next: number) => { setStep(next); requestAnimationFrame(() => { stageRef.current?.scrollIntoView({ behavior: "auto", block: "start" }); stageRef.current?.focus({ preventScroll: true }); }); };
  const colors = family && process ? filterColors(family, process) : [];
  const system = color ? buildSystem(color) : [];

  const continueFromFinish = () => {
    if (!family) return;
    const valid = processesFor(family);
    if (valid.length === 1) { setProcess(valid[0]!); setAutoProcess(true); move(2); }
    else { setProcess(null); setAutoProcess(false); move(1); }
  };
  const pickColor = (c: ColorProduct) => { setColor(c); setSelected(buildSystem(c).filter((p) => p.requirement_level !== "Optional").map((p) => p.id)); move(3); };
  const reset = () => { setFamily(null); setProcess(null); setAutoProcess(false); setUnsure(""); setColor(null); setCart(null); move(0); };
  const titles = ["What type of color or finish are you looking for?", "How will the wheels be coated?", colors.length === 0 ? "No Matching Products Found" : "Choose Your Color", "Selected Color Product", "Recommended System for Your Project"];
  const helpPanel = <div className="gpf-unsure-panel"><h3 className="featured-name">Need Help Choosing a Finish?</h3><p>Tell us what kind of look you want, or send us a few inspiration photos, and our team can help recommend the right products.</p><div className="gpf-actions"><Button type="button" variant="outline" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></div></div>;

  return <main className="gpf-page">
    <div className="featured-inner">
      <Button asChild variant="link" className="gpf-back"><Link to="/"><ArrowLeft aria-hidden="true" />Back to Home</Link></Button>
      <header className="gpf-page-head"><p className="finder-kicker">Guided Product Finder</p><h1>Change My Wheel Color</h1><p>Choose the type of color or finish you are interested in. We'll help narrow down the products that match your project.</p><span className="gpf-demo">Demo only · Sample colors and products</span></header>
      <nav aria-label="Product finder progress"><ol className="gpf-progress">{steps.map((label, index) => <li key={label} className={index === step ? "is-current" : index < step ? "is-complete" : ""} aria-current={index === step ? "step" : undefined}>
        <Button variant="ghost" disabled={index > step || (index === 1 && autoProcess)} onClick={() => move(index)}><span className="gpf-step-number">{index < step ? <Check size={16} aria-hidden="true" /> : index + 1}</span><span>{index === 1 && autoProcess && process ? `${label}: ${processLabel[process]}` : label}</span></Button>
      </li>)}</ol></nav>
      <section className="gpf-stage" ref={stageRef} tabIndex={-1} aria-labelledby="gpf-stage-title">
        <div className="gpf-stage-heading"><div><p className="finder-kicker">Step {step + 1} of 5</p><h2 id="gpf-stage-title">{titles[step]}</h2></div><Button variant="link" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Need Help?</Button></div>

        {step === 0 && <>
          <div className="gpf-style-grid" role="radiogroup" aria-label="Finish type">
            {finishOptions.map((f) => <button type="button" role="radio" aria-checked={family === f.id} key={f.id} className={`gpf-style-card ${family === f.id ? "is-selected" : ""}`} onClick={() => { setFamily(f.id); setUnsure(""); }}><Swatch value={f.swatch} /><strong>{f.title}</strong><span>{f.description}</span></button>)}
            <button type="button" role="radio" aria-checked={unsure === "finish"} className={`gpf-style-card is-unsure ${unsure === "finish" ? "is-selected" : ""}`} onClick={() => { setFamily(null); setUnsure("finish"); }}><span className="gpf-unsure-mark" aria-hidden="true">?</span><strong>I'm Not Sure</strong><span>Show me examples and help me choose.</span></button>
          </div>
          {unsure === "finish" && <div className="gpf-unsure-panel"><h3 className="featured-name">Finish Examples</h3><p>Here is how the four finish types differ. Pick the one closest to what you want.</p><div className="gpf-style-grid gpf-finish-grid">{finishOptions.map((f) => <article key={f.id} className="gpf-style-card"><Swatch value={f.swatch} /><strong>{f.title}</strong><span>{finishExamples[f.id]}</span><Button size="sm" variant="outline" onClick={() => { setFamily(f.id); setUnsure(""); }}>Choose {f.title}</Button></article>)}</div></div>}
          <div className="gpf-actions"><Button className="gpf-primary" disabled={!family} onClick={continueFromFinish}>Continue<ArrowRight aria-hidden="true" /></Button></div>
        </>}

        {step === 1 && family && <>
          <p className="gpf-intro">If you already know which coating process you are using, select it below. If not, choose "I'm Not Sure" and we can help.</p>
          <div className="gpf-style-grid" role="radiogroup" aria-label="Coating process">
            {processesFor(family).map((p) => <button type="button" role="radio" aria-checked={process === p} key={p} className={`gpf-style-card ${process === p ? "is-selected" : ""}`} onClick={() => { setProcess(p); setUnsure(""); }}><Swatch value={p === "liquid" ? "linear-gradient(160deg,#dfe6ef,#8a97a8)" : "radial-gradient(circle,#c9ccd1 2px,#9aa0a8 3px)"} /><strong>{processLabel[p]}</strong><span>{p === "liquid" ? "Sprayed wet coats" : "Electrostatic powder, oven cured"}</span></button>)}
            <button type="button" role="radio" aria-checked={unsure === "process"} className={`gpf-style-card is-unsure ${unsure === "process" ? "is-selected" : ""}`} onClick={() => { setProcess(null); setUnsure("process"); }}><span className="gpf-unsure-mark" aria-hidden="true">?</span><strong>I'm Not Sure</strong><span>Help me decide</span></button>
          </div>
          {unsure === "process" && <div className="gpf-unsure-panel"><h3 className="featured-name">Liquid or Powder?</h3><p><strong>Liquid Paint</strong> is sprayed in thin coats and air or low-bake cured — ideal for spot repairs and most at-home or small-shop setups. <strong>Powder Coating</strong> is applied electrostatically and oven cured — very tough, but needs a curing oven. If you don't have an oven, choose Liquid Paint.</p><div className="gpf-actions">{processesFor(family).map((p) => <Button key={p} size="sm" variant="outline" onClick={() => { setProcess(p); setUnsure(""); }}>Use {processLabel[p]}</Button>)}</div></div>}
          <div className="gpf-actions"><Button className="gpf-primary" disabled={!process} onClick={() => move(2)}>Show Matching Colors<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={() => move(0)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}

        {step === 2 && family && process && <>
          {colors.length === 0 ? <div className="gpf-unsure-panel"><span className="gpf-demo">No matching products</span><p className="mt-3">We couldn't find a matching product for this combination in our current catalog.</p><div className="gpf-actions"><Button type="button" className="gpf-primary" onClick={reset}>Try a Different Finish</Button><Button type="button" variant="outline" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></div></div> : <>
            <p className="gpf-intro">These products match the finish and coating process you selected.</p>
            <span className="gpf-demo">{colors.length === 1 ? "Exact match found" : `${colors.length} products available`} · {finishLabel(family)} · {processLabel[process]}{autoProcess ? " (only option for this finish)" : ""}</span>
            <div className="gpf-style-grid gpf-finish-grid">{colors.map((c) => <article key={c.id} className="gpf-style-card"><Swatch value={c.swatch} /><strong>{c.color}</strong><span>{c.name}</span><span>{processLabel[c.coating_process]}</span><span>{c.description}</span><Button size="sm" className="gpf-primary" onClick={() => pickColor(c)}>Select</Button></article>)}</div>
          </>}
          <div className="gpf-actions"><Button variant="outline" onClick={() => move(autoProcess ? 0 : 1)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}

        {step === 3 && color && <>
          <div className="gpf-color-product"><div className="featured-media" style={{ display: "grid", placeItems: "center" }}><Swatch value={color.swatch} large /></div><div><span className="featured-label">Color Coat · Required</span><h3>{color.name}</h3><dl className="gpf-details"><div><dt>Product Role</dt><dd>Color Coat</dd></div><div><dt>Finish Family</dt><dd>{finishLabel(color.finish_family)}</dd></div><div><dt>Coating Process</dt><dd>{processLabel[color.coating_process]}</dd></div></dl><p className="gpf-disclaimer">Example product. Swatch is illustrative.</p></div></div>
          <div className="gpf-actions"><Button className="gpf-primary" onClick={() => move(4)}>Continue to Recommended System<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={() => move(2)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}

        {step === 4 && color && <>
          <dl className="gpf-summary"><div><dt>Project</dt><dd>Change My Wheel Color</dd></div><div><dt>Selected Finish</dt><dd>{finishLabel(color.finish_family)}</dd></div><div><dt>Selected Color</dt><dd>{color.color}</dd></div><div><dt>Coating Process</dt><dd>{processLabel[color.coating_process]}</dd></div></dl>
          <div className="gpf-system-grid">{system.map((p, i) => <article key={p.id} className="featured-card">
            <div className="gpf-product-role"><h3>Step {i + 1} — {p.role}</h3><span className={`gpf-badge ${p.requirement_level === "Required" ? "is-required" : ""}`}>{p.requirement_level}</span></div>
            <div className="featured-media"><img src={p.image} alt={`Example ${p.name}`} loading="lazy" /></div>
            <div className="featured-body"><h4 className="featured-name">{p.name}</h4><p className="featured-finish">{p.description}</p><label className="gpf-selection"><input type="checkbox" checked={selected.includes(p.id)} onChange={(e) => setSelected((c) => e.target.checked ? [...c, p.id] : c.filter((id) => id !== p.id))} />Select {p.role}</label><Button variant="link" className="gpf-product-link" onClick={() => setDetail(p)}>View Product<ArrowRight aria-hidden="true" /></Button></div>
          </article>)}</div>
          <p className="gpf-disclaimer">Example system only. Confirm product compatibility with our team before purchase or application.</p>
          <div className="gpf-cart-actions"><Button className="gpf-primary" disabled={selected.length === 0} onClick={() => setCart(system.filter((p) => selected.includes(p.id)))}><ShoppingBag aria-hidden="true" />Add Selected Products to Cart ({selected.length})</Button><Button variant="outline" onClick={() => { setSelected(system.map((p) => p.id)); setCart(system); }}>Add Complete System to Cart</Button></div>
          <div className="gpf-actions"><Button variant="outline" onClick={() => move(3)}><ArrowLeft aria-hidden="true" />Back</Button><Button variant="link" onClick={reset}>Start Over</Button></div>
        </>}
      </section>
      <section className="gpf-support" aria-labelledby="gpf-support-title"><div><h2 id="gpf-support-title">Still need help?</h2><p>Tell us the look you want and share a few inspiration photos — our team can recommend the right products.</p></div><Button variant="outline" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></section>
    </div>
    <ColorHelpDialog open={help} onOpenChange={setHelp} look={family ? finishLabel(family) : ""} preferred={color?.color ?? ""} />
    <Dialog open={Boolean(detail)} onOpenChange={(o) => { if (!o) setDetail(null); }}><DialogContent className="gpf-dialog"><DialogTitle>{detail?.name}</DialogTitle><DialogDescription>Example product · Not available for purchase in this preview</DialogDescription>{detail && <><div className="featured-media"><img src={detail.image} alt={detail.name} /></div><p>{detail.description}</p><dl className="gpf-details"><div><dt>Product Role</dt><dd>{detail.role}</dd></div><div><dt>Coating Process</dt><dd>{detail.coating_process}</dd></div></dl></>}</DialogContent></Dialog>
    <Dialog open={Boolean(cart)} onOpenChange={(o) => { if (!o) setCart(null); }}><DialogContent className="gpf-dialog"><DialogTitle>Added to Your Demo Cart</DialogTitle><DialogDescription>{cart?.length} example products selected. No real cart or order has been created.</DialogDescription><ul className="gpf-cart-list">{cart?.map((p) => <li key={p.id}><img src={p.image} alt="" /><div><strong>{p.name}</strong><p>{p.role} · Qty 1</p></div><Check size={18} className="text-brand" aria-hidden="true" /></li>)}</ul><Button className="gpf-primary" onClick={() => setCart(null)}>Back to Recommended System</Button></DialogContent></Dialog>
  </main>;
}

function ColorHelpDialog({ open, onOpenChange, look, preferred }: { open: boolean; onOpenChange: (o: boolean) => void; look: string; preferred: string }) {
  const [sent, setSent] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  return <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setSent(false); setPhotos([]); } }}><DialogContent className="gpf-dialog">
    <DialogTitle>Need Help Choosing a Finish?</DialogTitle><DialogDescription>Tell us what kind of look you want, or send us a few inspiration photos, and our team can help recommend the right products.</DialogDescription>
    {sent ? <><p><strong>Project details ready.</strong> This is a demo — nothing was sent.</p><Button className="gpf-primary" onClick={() => onOpenChange(false)}>Close</Button></> :
    <form className="gpf-vehicle-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <label>Name<Input maxLength={100} /></label>
      <label>Email<Input type="email" maxLength={255} /></label>
      <label>What kind of look do you want?<Input defaultValue={look} maxLength={200} /></label>
      <label>Preferred color<Input defaultValue={preferred} maxLength={100} /></label>
      <label className="gpf-upload"><input type="file" accept="image/*" multiple onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 5).map((f) => f.name))} />Upload inspiration photos</label>
      {photos.length > 0 && <p className="gpf-disclaimer">Selected (demo, not sent): {photos.join(", ")}</p>}
      <label>Additional notes<textarea className="gpf-control" rows={3} maxLength={1000} /></label>
      <Button type="submit" className="gpf-primary"><Mail aria-hidden="true" />Email Our Team</Button>
      <p className="gpf-disclaimer">Demo only — no email is sent.</p>
    </form>}
  </DialogContent></Dialog>;
}
