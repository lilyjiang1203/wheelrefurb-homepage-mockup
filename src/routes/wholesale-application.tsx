import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { StoreNavigation } from "../components/store-navigation";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/wholesale-application")({
  head: () => ({ meta: [
    { title: "Wholesale Partner Application | FreiLack WheelRefurb" },
    { name: "description", content: "Apply to become a WheelRefurb wholesale partner for professional wheel refinishing products." },
  ] }),
  component: WholesaleApplication,
});

const productOptions = ["Wheel Paint", "Primers", "Clear Coats", "Powder Coatings", "Special Finishes", "Refinishing Supplies"];
const inputClass = "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "block text-sm font-medium text-foreground";
const base = "https://unlygyqhgeujetjphrro.supabase.co";
const key = "sb_publishable_SwnulQeid12F7Qud_jODJQ_1s0DcUCN";

function WholesaleApplication() {
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    // Honeypot: ordinary visitors never see this field.
    if (String(values.get("company_fax") ?? "").trim()) return;
    const read = (name: string) => String(values.get(name) ?? "").trim();
    const payload = {
      company_name: read("company_name"),
      business_type: read("business_type"),
      contact_name: read("contact_name"),
      email: read("email"),
      phone: read("phone"),
      website: read("website") || null,
      city: read("city"),
      region: read("region"),
      country: read("country"),
      product_interests: interests,
      purchase_volume: read("purchase_volume") || null,
      message: read("message") || null,
    };
    setSending(true);
    setError("");
    try {
      const response = await fetch(`${base}/rest/v1/wholesale_applications`, {
        method: "POST",
        headers: {
          apikey: key,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Application submission failed (${response.status})`);
      setSubmitted(true);
      setInterests([]);
      form.reset();
    } catch {
      setError("We couldn't submit your application. Please try again, or contact info@freilackewheelrefurb.com.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreNavigation />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span>Wholesale Partner Application</span>
        </nav>
        <div className="mb-9 max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">For automotive professionals</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Wholesale Partner Application</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Interested in partnering with FreiLack WheelRefurb? Tell us about your business and the products you need.
            Our team will review your application and get in touch.
          </p>
        </div>
        {submitted ? (
          <section className="max-w-2xl rounded-lg border border-border bg-card p-8" role="status">
            <CheckCircle2 className="mb-4 text-brand" size={36} aria-hidden="true" />
            <h2 className="text-2xl font-semibold">Application received</h2>
            <p className="mt-3 text-muted-foreground">Thank you for your interest in becoming a wholesale partner. Our team will review your information and contact you.</p>
            <Button className="mt-6" asChild><Link to="/">Return to homepage <ArrowRight size={16} /></Link></Button>
          </section>
        ) : (
          <form className="max-w-3xl space-y-9 rounded-lg border border-border bg-card p-5 sm:p-8" onSubmit={handleSubmit}>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="wholesale-fax">Company fax</label>
              <input name="company_fax" id="wholesale-fax" tabIndex={-1} autoComplete="off" />
            </div>
            <section className="space-y-5" aria-labelledby="business-heading">
              <h2 id="business-heading" className="border-b border-border pb-3 text-xl font-semibold">1. Business Information</h2>
              <label className={labelClass}>Company name <span aria-hidden="true">*</span>
                <input className={inputClass} name="company_name" required minLength={2} maxLength={160} autoComplete="organization" />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>Business type <span aria-hidden="true">*</span>
                  <select className={inputClass} name="business_type" required defaultValue="">
                    <option value="" disabled>Select your business type</option>
                    {["Wheel Repair Shop","Body Shop","Dealership","Distributor","Other"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
                <label className={labelClass}>Business website <span className="font-normal text-muted-foreground">(optional)</span>
                  <input className={inputClass} type="url" name="website" maxLength={255} placeholder="https://" autoComplete="url" />
                </label>
              </div>
            </section>
            <section className="space-y-5" aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="border-b border-border pb-3 text-xl font-semibold">2. Contact Information</h2>
              <label className={labelClass}>Contact name <span aria-hidden="true">*</span>
                <input className={inputClass} name="contact_name" required minLength={2} maxLength={120} autoComplete="name" />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>Business email <span aria-hidden="true">*</span>
                  <input className={inputClass} type="email" name="email" required maxLength={255} autoComplete="email" />
                </label>
                <label className={labelClass}>Phone number <span aria-hidden="true">*</span>
                  <input className={inputClass} type="tel" name="phone" required minLength={5} maxLength={40} autoComplete="tel" />
                </label>
              </div>
            </section>
            <section className="space-y-5" aria-labelledby="location-heading">
              <h2 id="location-heading" className="border-b border-border pb-3 text-xl font-semibold">3. Business Location</h2>
              <div className="grid gap-5 sm:grid-cols-3">
                <label className={labelClass}>City <span aria-hidden="true">*</span>
                  <input className={inputClass} name="city" required minLength={2} maxLength={120} autoComplete="address-level2" />
                </label>
                <label className={labelClass}>Province / State <span aria-hidden="true">*</span>
                  <input className={inputClass} name="region" required minLength={2} maxLength={120} autoComplete="address-level1" />
                </label>
                <label className={labelClass}>Country <span aria-hidden="true">*</span>
                  <input className={inputClass} name="country" required minLength={2} maxLength={120} defaultValue="Canada" autoComplete="country-name" />
                </label>
              </div>
            </section>
            <section className="space-y-5" aria-labelledby="products-heading">
              <h2 id="products-heading" className="border-b border-border pb-3 text-xl font-semibold">4. Products & Purchasing Needs</h2>
              <fieldset>
                <legend className={labelClass}>Products you're interested in <span className="font-normal text-muted-foreground">(select all that apply)</span></legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {productOptions.map(option => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 text-sm">
                      <input type="checkbox" checked={interests.includes(option)}
                        onChange={(e) => setInterests(old => e.target.checked ? [...old,option] : old.filter(x=>x!==option))}
                        className="size-4 accent-primary" />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className={labelClass}>Estimated monthly purchasing budget <span className="font-normal text-muted-foreground">(optional, USD)</span>
                <select className={inputClass} name="purchase_volume" defaultValue="">
                  <option value="">Prefer not to say / Not sure</option>
                  {["Under $500","$500–$2,000","$2,000–$5,000","Over $5,000","Not sure yet"].map(t=><option key={t}>{t}</option>)}
                </select>
              </label>
              <label className={labelClass}>Additional information <span className="font-normal text-muted-foreground">(optional)</span>
                <textarea className={inputClass} name="message" rows={5} maxLength={3000} placeholder="Tell us about your business, product needs or questions." />
              </label>
            </section>
            <div className="border-t border-border pt-6">
              <p className="mb-4 text-sm text-muted-foreground">By submitting this application, you agree that FreiLack WheelRefurb may use the information provided to review your wholesale inquiry and contact you about it. Required fields are marked *.</p>
              {error && <p className="mb-4 text-sm text-destructive" role="alert">{error}</p>}
              <Button type="submit" size="lg" disabled={sending}>
                {sending ? "Submitting…" : "Submit Application"} <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
