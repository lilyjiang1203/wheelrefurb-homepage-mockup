import { BadgeDollarSign, ArrowRight, Boxes, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import wholesaleWorkshop from "@/assets/wholesale-workshop.jpg";

/**
 * Placeholder benefits — swap the labels and copy for the company's real
 * wholesale benefits when those are confirmed.
 */
const wholesaleBenefits = [
  { icon: BadgeDollarSign, label: "Dealer Pricing" },
  { icon: Boxes, label: "Bulk Ordering" },
  { icon: Headset, label: "Dedicated Support" },
];

export function WholesaleProgram() {
  return (
    <section
      id="wholesale-partner-program"
      className="wholesale-section"
      aria-labelledby="wholesale-title"
    >
      <div className="wholesale-panel">
        <div className="wholesale-copy">
          <p className="wholesale-label">For professionals</p>
          <h2 id="wholesale-title" className="wholesale-title">
            Wholesale Partner Program
          </h2>
          <p className="wholesale-intro">
            Built for wheel repair shops, body shops, dealerships, and automotive
            professionals.
          </p>

          <ul className="wholesale-benefits">
            {wholesaleBenefits.map(({ icon: Icon, label }) => (
              <li key={label} className="wholesale-benefit">
                <span className="wholesale-benefit-icon">
                  <Icon aria-hidden />
                </span>
                <span className="wholesale-benefit-label">{label}</span>
              </li>
            ))}
          </ul>

          <div className="wholesale-actions">
            {/* Temporary destination until the wholesale application page exists. */}
            <Button asChild size="lg" className="wholesale-cta">
              <a href="/wholesale-application">
                Become a partner
                <ArrowRight aria-hidden />
              </a>
            </Button>
          </div>
        </div>

        <div className="wholesale-media">
          <img
            src={wholesaleWorkshop}
            alt="Technician spraying an alloy wheel in a professional refinishing workshop"
            loading="lazy"
            width={1280}
            height={1024}
          />
        </div>
      </div>
    </section>
  );
}
