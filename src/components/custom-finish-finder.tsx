import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Mail, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { baseOptions, buildSystem, effectExamples, effectLabel, effectOptions, filterEffects, processLabel, type BaseColor, type EffectProduct, type EffectType, type Process, type SystemProduct } from "./custom-finish-data";

const steps = ["Finish Type", "Coating", "Base Color", "Finish", "Effect Product", "System"];
const Swatch = ({ value, size = 84 }: { value: string; size?: number }) => <span className="gpf-finish-swatch" style={{ background: value, width: size, height: size }} aria-hidden="true" />;

export function CustomFinishFinder() {
  const [step, setStep] = useState(0);
  const [effect, setEffect] = useState<EffectType | null>(null);
  const [process, setProcess] = useState<Process | null>(null);
  const [base, setBase] = useState<BaseColor | null>(null);
  const [autoProcess, setAutoProcess] = useState(false);
  const [noBase, setNoBase] = useState(false);
  const [unsure, setUnsure] = useState<"" | "effect" | "process">("");
  const [product, setProduct] = useState<EffectProduct | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<SystemProduct | null>(null);
  const [cart, setCart] = useState<SystemProduct[] | null>(null);
  const [help, setHelp] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const opt = effectOptions.find((e) => e.id === effect);
  const needsBase = (p: Process | null) => Boolean(opt?.base_required && p === "liquid");
  const results = effect && process && (noBase || base) ? filterEffects(effect, process, noBase ? null : base) : [];
  const system = product ? buildSystem(product) : [];
  const move = (next: number) => { setStep(next); requestAnimationFrame(() => { stageRef.current?.scrollIntoView({ behavior: "auto", block: "start" }); stageRef.current?.focus({ preventScroll: true }); }); };
  const afterProcess = (p: Process) => { setProcess(p); setUnsure(""); setBase(null); if (needsBase(p)) { setNoBase(false); move(2); } else { setNoBase(true); move(3); } };
  const continueFromEffect = () => { if (!opt) return; if (opt.processes.length === 1) { setAutoProcess(true); afterProcess(opt.processes[0]!); } else { setAutoProcess(false); setProcess(null); move(1); } };
  const pick = (p: EffectProduct) => { setProduct(p); setSelected(buildSystem(p).filter((s) => s.requirement_level !== "Optional").map((s) => s.id)); move(4); };
  const reset = () => { setEffect(null); setProcess(null); setBase(null); setAutoProcess(false); setNoBase(false); setUnsure(""); setProduct(null); setCart(null); move(0); };
  const stepLabel = (i: number, label: string) => i === 1 && autoProcess && process ? `${label}: ${processLabel[process]}` : i === 2 && noBase && step > 2 ? `${label}: Not needed` : label;
  const titles = ["What kind of special finish are you looking for?", "How will the wheels be coated?", "Choose a Base / Ground Color", results.length === 0 ? "No Matching System Found" : "Choose Your Special Finish", "Selected Special Finish", "Recommended System for Your Project"];

  return <main className="gpf-page">
    <div className="featured-inner">
      <Button asChild variant="link" className="gpf-back"><Link to="/"><ArrowLeft aria-hidden="true" />Back to Home</Link></Button>
      <header className="gpf-page-head"><p className="finder-kicker">Guided Product Finder</p><h1>Create a Custom / Special Finish</h1><p>Choose the type of visual effect you are interested in. We'll help you find the products and coating system needed to create it.</p><span className="gpf-demo">Demo only · Sample finishes and products</span></header>
      <nav aria-label="Product finder progress"><ol className="gpf-progress">{steps.map((label, i) => <li key={label} className={i === step ? "is-current" : i < step ? "is-complete" : ""} aria-current={i === step ? "step" : undefined}>
        <Button variant="ghost" disabled={i > step || (i === 1 && autoProcess) || (i === 2 && noBase)} onClick={() => move(i)}><span className="gpf-step-number">{i < step ? <Check size={16} aria-hidden="true" /> : i + 1}</span><span>{stepLabel(i, label)}</span></Button>
      </li>)}</ol></nav>
      <section className="gpf-stage" ref={stageRef} tabIndex={-1} aria-labelledby="gpf-stage-title">
        <div className="gpf-stage-heading"><div><p className="finder-kicker">Step {step + 1} of 6</p><h2 id="gpf-stage-title">{titles[step]}</h2></div><Button variant="link" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Need Help?</Button></div>

        {step === 0 && <>
          <div className="gpf-style-grid" role="radiogroup" aria-label="Special finish type">
            {effectOptions.map((e) => <button type="button" role="radio" aria-checked={effect === e.id} key={e.id} className={`gpf-style-card ${effect === e.id ? "is-selected" : ""}`} onClick={() => { setEffect(e.id); setUnsure(""); }}><Swatch value={e.swatch} /><strong>{e.title}</strong><span>{e.description}</span></button>)}
            <button type="button" role="radio" aria-checked={unsure === "effect"} className={`gpf-style-card is-unsure ${unsure === "effect" ? "is-selected" : ""}`} onClick={() => { setEffect(null); setUnsure("effect"); }}><span className="gpf-unsure-mark" aria-hidden="true">?</span><strong>I'm Not Sure</strong><span>Show me examples and help me choose.</span></button>
          </div>
          {unsure === "effect" && <div className="gpf-unsure-panel"><h3 className="featured-name">Special Finish Examples</h3><p>Compare these effects and pick the one closest to the look you want.</p><div className="gpf-style-grid gpf-finish-grid">{effectExamples.map((x) => <article key={x.label} className="gpf-style-card"><Swatch value={x.swatch} /><strong>{x.label}</strong><span>{x.text}</span><Button size="sm" variant="outline" onClick={() => { setEffect(x.effect); setUnsure(""); }}>Choose {x.label}</Button></article>)}</div></div>}
          <div className="gpf-actions"><Button className="gpf-primary" disabled={!effect} onClick={continueFromEffect}>Continue<ArrowRight aria-hidden="true" /></Button></div>
        </>}

        {step === 1 && opt && <>
          <p className="gpf-intro">If you already know which coating process you are using, select it below. If not, choose "I'm Not Sure" and we can help.</p>
          <div className="gpf-style-grid" role="radiogroup" aria-label="Coating process">
            {opt.processes.map((p) => <button type="button" role="radio" aria-checked={process === p} key={p} className={`gpf-style-card ${process === p ? "is-selected" : ""}`} onClick={() => { setProcess(p); setUnsure(""); }}><Swatch value={p === "liquid" ? "linear-gradient(160deg,#dfe6ef,#8a97a8)" : "radial-gradient(circle,#c9ccd1 2px,#9aa0a8 3px)"} /><strong>{processLabel[p]}</strong><span>{p === "liquid" ? "Sprayed wet coats" : "Electrostatic powder, oven cured"}</span></button>)}
            <button type="button" role="radio" aria-checked={unsure === "process"} className={`gpf-style-card is-unsure ${unsure === "process" ? "is-selected" : ""}`} onClick={() => { setProcess(null); setUnsure("process"); }}><span className="gpf-unsure-mark" aria-hidden="true">?</span><strong>I'm Not Sure</strong><span>Help me decide</span></button>
          </div>
          {unsure === "process" && <div className="gpf-unsure-panel"><h3 className="featured-name">Liquid or Powder?</h3><p><strong>Liquid Paint</strong> is sprayed in thin coats and offers the widest range of effects. <strong>Powder Coating</strong> is applied electrostatically and oven cured — very tough, but needs a curing oven. Still unsure? Our team can help.</p><div className="gpf-actions"><Button type="button" variant="outline" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></div></div>}
          <div className="gpf-actions"><Button className="gpf-primary" disabled={!process} onClick={() => process && afterProcess(process)}>Continue<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={() => move(0)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}

        {step === 2 && <>
          <p className="gpf-intro">The base color can influence the final appearance of the special-effect finish.</p>
          <div className="gpf-style-grid" role="radiogroup" aria-label="Base color">
            {baseOptions.map((b) => <button type="button" role="radio" aria-checked={base === b.id} key={b.id} className={`gpf-style-card ${base === b.id ? "is-selected" : ""}`} onClick={() => setBase(b.id)}><Swatch value={b.swatch} size={110} /><strong>{b.title}</strong>{opt && <span className="gpf-finish-swatch" style={{ width: 40, height: 14, borderRadius: 7, background: `${opt.swatch}`, opacity: b.id === "black" ? 0.75 : b.id === "white" ? 0.55 : 0.95 }} aria-label={`Preview of ${opt.title} over ${b.title}`} />}<span>Preview over this base</span></button>)}
          </div>
          <div className="gpf-actions"><Button className="gpf-primary" disabled={!base} onClick={() => move(3)}>Show Matching Finishes<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={() => move(autoProcess ? 0 : 1)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}

        {step === 3 && effect && process && <>
          {results.length === 0 ? <div className="gpf-unsure-panel"><span className="gpf-demo">No matching system</span><p className="mt-3">We couldn't find a complete system for this combination in our current catalog.</p><div className="gpf-actions"><Button type="button" className="gpf-primary" onClick={reset}>Try a Different Finish</Button><Button type="button" variant="outline" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></div></div> : <>
            <span className="gpf-demo">{results.length === 1 ? "Exact match found" : `${results.length} options available`} · {effectLabel(effect)} · {processLabel[process]}{base ? ` · ${baseOptions.find((b) => b.id === base)?.title}` : ""}</span>
            <div className="gpf-style-grid gpf-finish-grid">{results.map((p) => <article key={p.id} className="gpf-style-card"><Swatch value={p.swatch} /><strong>{p.finish}</strong><span>{p.description}</span><span>{processLabel[p.coating_process]}</span><Button size="sm" className="gpf-primary" onClick={() => pick(p)}>Select</Button></article>)}</div>
          </>}
          <div className="gpf-actions"><Button variant="outline" onClick={() => move(noBase ? (autoProcess ? 0 : 1) : 2)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}

        {step === 4 && product && <>
          <div className="gpf-color-product"><div className="featured-media" style={{ display: "grid", placeItems: "center" }}><Swatch value={product.swatch} size={180} /></div><div><span className="featured-label">{product.product_role} · Required</span><h3>{product.finish}</h3><p className="featured-finish">{product.description}</p><dl className="gpf-details"><div><dt>Product Name</dt><dd>{product.name}</dd></div><div><dt>Product Role</dt><dd>{product.product_role}</dd></div><div><dt>Effect Type</dt><dd>{effectLabel(product.effect_type)}</dd></div><div><dt>Coating Process</dt><dd>{processLabel[product.coating_process]}</dd></div></dl><p className="gpf-disclaimer">Example preview. Actual appearance depends on base, lighting and application.</p></div></div>
          <div className="gpf-actions"><Button className="gpf-primary" onClick={() => move(5)}>Continue to Recommended System<ArrowRight aria-hidden="true" /></Button><Button variant="outline" onClick={() => move(3)}><ArrowLeft aria-hidden="true" />Back</Button></div>
        </>}

        {step === 5 && product && <>
          <dl className="gpf-summary"><div><dt>Project</dt><dd>Custom / Special Finish</dd></div><div><dt>Effect</dt><dd>{effectLabel(product.effect_type)}</dd></div><div><dt>Selected Finish</dt><dd>{product.finish}</dd></div><div><dt>Coating Process</dt><dd>{processLabel[product.coating_process]}</dd></div></dl>
          <div className="gpf-system-grid">{system.map((p, i) => <article key={p.id} className="featured-card">
            <div className="gpf-product-role"><h3>Step {i + 1} — {p.role}</h3><span className={`gpf-badge ${p.requirement_level === "Required" ? "is-required" : ""}`}>{p.requirement_level}</span></div>
            <div className="featured-media"><img src={p.image} alt={`Example ${p.name}`} loading="lazy" /></div>
            <div className="featured-body"><h4 className="featured-name">{p.name}</h4><p className="featured-finish">{p.description}</p><label className="gpf-selection"><input type="checkbox" checked={selected.includes(p.id)} onChange={(e) => setSelected((c) => e.target.checked ? [...c, p.id] : c.filter((id) => id !== p.id))} />Select {p.role}</label><Button variant="link" className="gpf-product-link" onClick={() => setDetail(p)}>View Product<ArrowRight aria-hidden="true" /></Button></div>
          </article>)}</div>
          <p className="gpf-disclaimer">Example system only. Confirm product compatibility with our team before purchase or application.</p>
          <div className="gpf-cart-actions"><Button className="gpf-primary" disabled={selected.length === 0} onClick={() => setCart(system.filter((p) => selected.includes(p.id)))}><ShoppingBag aria-hidden="true" />Add Selected Products to Cart ({selected.length})</Button><Button variant="outline" onClick={() => { setSelected(system.map((p) => p.id)); setCart(system); }}>Add Complete System to Cart</Button></div>
          <div className="gpf-actions"><Button variant="outline" onClick={() => move(4)}><ArrowLeft aria-hidden="true" />Back</Button><Button variant="link" onClick={reset}>Start Over</Button></div>
        </>}
      </section>
      <section className="gpf-support" aria-labelledby="gpf-support-title"><div><h2 id="gpf-support-title">Still need help?</h2><p>Send us inspiration photos or examples of the finish you want, and our team can help identify the right products and coating system.</p></div><Button variant="outline" onClick={() => setHelp(true)}><Mail aria-hidden="true" />Email Our Team</Button></section>
    </div>
    <CustomHelpDialog open={help} onOpenChange={setHelp} finish={effect ? effectLabel(effect) : ""} process={process ? processLabel[process] : ""} />
    <Dialog open={Boolean(detail)} onOpenChange={(o) => { if (!o) setDetail(null); }}><DialogContent className="gpf-dialog"><DialogTitle>{detail?.name}</DialogTitle><DialogDescription>Example product · Not available for purchase in this preview</DialogDescription>{detail && <><div className="featured-media"><img src={detail.image} alt={detail.name} /></div><p>{detail.description}</p><dl className="gpf-details"><div><dt>Product Role</dt><dd>{detail.role}</dd></div><div><dt>Coating Process</dt><dd>{detail.coating_process}</dd></div></dl></>}</DialogContent></Dialog>
    <Dialog open={Boolean(cart)} onOpenChange={(o) => { if (!o) setCart(null); }}><DialogContent className="gpf-dialog"><DialogTitle>Added to Your Demo Cart</DialogTitle><DialogDescription>{cart?.length} example products selected. No real cart or order has been created.</DialogDescription><ul className="gpf-cart-list">{cart?.map((p) => <li key={p.id}><img src={p.image} alt="" /><div><strong>{p.name}</strong><p>{p.role} · Qty 1</p></div><Check size={18} className="text-brand" aria-hidden="true" /></li>)}</ul><Button className="gpf-primary" onClick={() => setCart(null)}>Back to Recommended System</Button></DialogContent></Dialog>
  </main>;
}

function CustomHelpDialog({ open, onOpenChange, finish, process }: { open: boolean; onOpenChange: (o: boolean) => void; finish: string; process: string }) {
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => setFiles((c) => [...c, ...Array.from(e.target.files ?? []).slice(0, 5).map((f) => f.name)]);
  return <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setSent(false); setFiles([]); } }}><DialogContent className="gpf-dialog">
    <DialogTitle>Email Our Team</DialogTitle><DialogDescription>Send us inspiration photos or examples of the finish you want, and our team can help identify the right products and coating system.</DialogDescription>
    {sent ? <><p><strong>Project details ready.</strong> This is a demo — nothing was sent.</p><Button className="gpf-primary" onClick={() => onOpenChange(false)}>Close</Button></> :
    <form className="gpf-vehicle-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <label>Name<Input maxLength={100} /></label>
      <label>Email<Input type="email" maxLength={255} /></label>
      <label>What kind of finish are you looking for?<Input defaultValue={finish} maxLength={200} /></label>
      <label>Preferred colors<Input maxLength={100} /></label>
      <label>Liquid / Powder, if known<select className="gpf-control" defaultValue={process}><option value="">Not sure</option><option>Liquid Paint</option><option>Powder Coating</option></select></label>
      <div className="gpf-actions"><label className="gpf-upload"><input type="file" accept="image/*" multiple onChange={onFiles} />Upload inspiration photos</label><label className="gpf-upload"><input type="file" accept="image/*" multiple onChange={onFiles} />Upload wheel photos</label></div>
      {files.length > 0 && <p className="gpf-disclaimer">Selected (demo, not sent): {files.join(", ")}</p>}
      <label>Additional notes<textarea className="gpf-control" rows={3} maxLength={1000} /></label>
      <Button type="submit" className="gpf-primary"><Mail aria-hidden="true" />Email Our Team</Button>
      <p className="gpf-disclaimer">Demo only — no email is sent.</p>
    </form>}
  </DialogContent></Dialog>;
}
