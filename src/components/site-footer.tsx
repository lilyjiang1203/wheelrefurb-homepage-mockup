import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import logoLight from "../assets/freilacke-logo-light.png";

/**
 * Contact details supplied by the company on 2026-10-08. Keep the displayed
 * phone exactly as supplied; the tel: href is the same number in dial form.
 */
const contact = {
  email: "info@freilackewheelrefurb.com",
  phoneDisplay: "(0)780-434-9191",
  phoneHref: "tel:+17804349191",
  address: "5845 Gateway Blvd NW, Edmonton, AB",
  addressHref:
    "https://www.google.com/maps/search/?api=1&query=5845%20Gateway%20Blvd%20NW%2C%20Edmonton%2C%20AB",
};

/**
 * Temporary destinations — every category points at the preview listing until
 * the real Shopify collection URLs are supplied.
 */
const shopLinks = [
  { label: "Wheel Paint", to: "/shop" },
  { label: "Clear Coats", to: "/shop" },
  { label: "Powder Coatings", to: "/shop" },
  { label: "Candy Colors", to: "/shop" },
  { label: "FreiFlip", to: "/shop" },
  { label: "Other Supplies", to: "/shop" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact-us">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <img
              className="footer-logo"
              src={logoLight}
              alt="FreiLacke wheelRefurb"
              width={763}
              height={200}
              loading="lazy"
            />
            <p className="footer-lede">
              Wheel refinishing and coating — OEM-matched paints, clear coats,
              powders and supplies for shops, dealers and refinishers.
            </p>
          </div>

          <nav className="footer-column" aria-label="Shop categories">
            <h2 className="footer-column-title">Shop</h2>
            <ul className="footer-links">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-column" aria-label="Site pages">
            <h2 className="footer-column-title">Explore</h2>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/" hash="find-your-color">
                  Find Your Color
                </Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/" hash="wholesale-partner-program">
                  Wholesale Partner Program
                </Link>
              </li>
            </ul>
          </nav>

          <div className="footer-column">
            <h2 className="footer-column-title">Contact</h2>
            <ul className="footer-contact">
              <li>
                <Mail aria-hidden="true" />
                <span>
                  <span className="footer-contact-label">Email</span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </span>
              </li>
              <li>
                <MapPin aria-hidden="true" />
                <span>
                  <span className="footer-contact-label">Store Address</span>
                  <a href={contact.addressHref} target="_blank" rel="noreferrer">
                    {contact.address}
                  </a>
                </span>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <span>
                  <span className="footer-contact-label">Phone</span>
                  <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} FreiLack WheelRefurb. All rights
            reserved.
          </p>
          <p className="footer-partner">Authorized FreiLacke Partner</p>
        </div>
      </div>
    </footer>
  );
}
