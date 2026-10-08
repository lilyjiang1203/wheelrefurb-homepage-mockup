import { useState } from "react";
import { Check, Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { supabase } from "@/integrations/supabase/client";

/**
 * Contact details — identical to the footer's Contact block (see
 * mem://features/contact-details). Phone displays exactly as supplied.
 */
const contact = {
  email: "info@freilackewheelrefurb.com",
  phoneDisplay: "(0)780-434-9191",
  phoneHref: "tel:+17804349191",
  address: "5845 Gateway Blvd NW, Edmonton, AB",
  addressHref:
    "https://www.google.com/maps/search/?api=1&query=5845%20Gateway%20Blvd%20NW%2C%20Edmonton%2C%20AB",
};

const messageSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1, "Please enter a message.").max(5000),
});

type SubmitState = "idle" | "sending" | "sent" | "error";

export function ContactPage() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = messageSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? "") || undefined,
      message: String(data.get("message") ?? ""),
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setState("sending");
    setErrorMessage("");
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      message: parsed.data.message,
    });
    if (error) {
      setState("error");
      setErrorMessage("Sorry — the message could not be sent. Please try again, or email us directly.");
      return;
    }
    form.reset();
    setState("sent");
  }

  return (
    <>
      <section className="contact-hero" aria-labelledby="contact-page-title">
        <div className="contact-hero-inner">
          <p className="contact-kicker">Contact</p>
          <h1 id="contact-page-title" className="contact-title">
            Talk to our team
          </h1>
          <p className="contact-intro">
            Questions about an OEM color match, a coating product, or a wheel
            refinishing project? Send us a note — email and phone are the
            fastest ways to reach us.
          </p>
        </div>
      </section>

      <section className="contact-main" aria-label="Contact details and message form">
        <div className="contact-shell">
          <div className="contact-info">
            <div className="contact-info-item">
              <p className="contact-info-label">Email</p>
              <a className="contact-info-value" href={`mailto:${contact.email}`}>
                <Mail size={16} aria-hidden="true" />
                {contact.email}
              </a>
            </div>
            <div className="contact-info-item">
              <p className="contact-info-label">Phone</p>
              <a className="contact-info-value" href={contact.phoneHref}>
                <Phone size={16} aria-hidden="true" />
                {contact.phoneDisplay}
              </a>
            </div>
            <div className="contact-info-item">
              <p className="contact-info-label">Store address</p>
              <a
                className="contact-info-value"
                href={contact.addressHref}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={16} aria-hidden="true" />
                {contact.address}
              </a>
            </div>
          </div>

          <div className="contact-form-panel">
            {state === "sent" ? (
              <div className="contact-sent">
                <Check size={28} aria-hidden="true" />
                <h2 className="contact-form-title">Message received</h2>
                <p className="contact-form-copy">
                  Thanks — your message has been received. We'll follow up with
                  you by email.
                </p>
                <Button
                  type="button"
                  className="contact-submit"
                  onClick={() => setState("idle")}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <h2 className="contact-form-title">Send a message</h2>
                <div className="contact-fields">
                  <label className="contact-label">
                    Name
                    <Input name="name" autoComplete="name" required maxLength={120} aria-invalid={Boolean(errors["name"])} />
                    {errors["name"] && <span className="contact-field-error">{errors["name"]}</span>}
                  </label>
                  <label className="contact-label">
                    Email
                    <Input name="email" type="email" autoComplete="email" required maxLength={255} aria-invalid={Boolean(errors["email"])} />
                    {errors["email"] && <span className="contact-field-error">{errors["email"]}</span>}
                  </label>
                  <label className="contact-label">
                    Phone <span className="contact-optional">(optional)</span>
                    <Input name="phone" type="tel" autoComplete="tel" maxLength={40} aria-invalid={Boolean(errors["phone"])} />
                    {errors["phone"] && <span className="contact-field-error">{errors["phone"]}</span>}
                  </label>
                </div>
                <label className="contact-label">
                  Message
                  <Textarea name="message" rows={6} required maxLength={5000} aria-invalid={Boolean(errors["message"])} />
                  {errors["message"] && <span className="contact-field-error">{errors["message"]}</span>}
                </label>
                {state === "error" && errorMessage && (
                  <p role="alert" className="contact-field-error">
                    {errorMessage}
                  </p>
                )}
                <Button type="submit" className="contact-submit" disabled={state === "sending"}>
                  {state === "sending" ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
