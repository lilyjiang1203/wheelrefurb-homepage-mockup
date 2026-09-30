import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

type Collection = {
  name: string;
  groups: { name?: string; items: string[] }[];
};

const collections: Collection[] = [
  {
    name: "Paint",
    groups: [
      {
        name: "Car Brand",
        items: [
          "Aston Martin",
          "Audi",
          "Bentley",
          "BMW / MINI",
          "Bola",
          "Fiat (wheel)",
          "Ferrari",
          "Ford",
          "Honda",
          "Hyundai",
          "Jaguar / Land Rover",
          "KIA",
          "Lamborghini",
          "Lexus",
          "Lotus",
          "Mazda",
          "Mercedes",
          "MG",
          "Miscellaneous",
          "Mitsubishi",
          "Nissan",
          "Peugeot",
          "Porsche",
          "Renault",
          "SEAT",
          "Škoda",
          "Tesla",
          "Toyota",
          "Volkswagen",
          "Volvo",
        ],
      },
      { items: ["BBS", "OZ Racing"] },
    ],
  },
  { name: "Clear", groups: [{ name: "Clear Coat", items: ["Clear", "Powder Clear"] }] },
  { name: "Powder", groups: [{ items: ["Powder Clear", "Primer", "RAL"] }] },
  { name: "CandyColor", groups: [] },
  { name: "Freiflip", groups: [] },
  { name: "Miscellaneous", groups: [{ items: ["GunWash"] }] },
];

const fallbackCollection: Collection = { name: "Paint", groups: [] };

const primaryLinks = ["Home", "About Us", "Contact Us"];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="FreiLack WheelRefurb home">
      <span className="brand-name">FreiLack</span>
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-wheel" />
        <span className="brand-sub">wheelRefurb</span>
        <span className="brand-lines" />
      </span>
    </a>
  );
}

function DesktopCollections() {
  const [active, setActive] = useState(0);
  const selected = collections[active] ?? fallbackCollection;

  return (
    <div className="collection-nav">
      <button className="nav-link collection-trigger active" type="button" aria-haspopup="true">
        Shop <ChevronDown aria-hidden="true" />
      </button>
      <div className="collection-menu" aria-label="Shop menu">
        <div className="collection-level-one">
          <p className="menu-label">Shop collections</p>
          {collections.map((collection, index) => (
            <a
              href={`#${collection.name.toLowerCase()}`}
              className={index === active ? "collection-category active" : "collection-category"}
              key={collection.name}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              {collection.name}
              <ChevronRight aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="collection-level-two">
          <div className="submenu-heading">
            <span>{selected.name}</span>
            <a href={`#${selected.name.toLowerCase()}`}>View all</a>
          </div>
          {selected.groups.length ? (
            <div className="submenu-groups">
              {selected.groups.map((group, groupIndex) => {
                const hasNamedGroup = selected.groups.some((entry) => entry.name);
                return (
                  <section
                    key={`${selected.name}-${group.name ?? groupIndex}`}
                    className={group.name ? "submenu-group has-label" : "submenu-group no-label"}
                  >
                    {group.name ? <p>{group.name}</p> : null}
                    <div
                      className={
                        group.items.length > 10
                          ? "submenu-items brand-grid"
                          : hasNamedGroup && !group.name
                            ? "submenu-items standalone"
                            : "submenu-items"
                      }
                    >
                      {group.items.map((item) => (
                        <a href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
                          {item}
                        </a>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <p className="empty-collection">Explore all {selected.name} products.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileCollections() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="mobile-collections">
      <button type="button" className="mobile-nav-row" onClick={() => setOpen((value) => !value)}>
        Shop <ChevronDown className={open ? "rotated" : ""} aria-hidden="true" />
      </button>
      {open ? (
        <div className="mobile-collection-list">
          {collections.map((collection) => {
            const expanded = active === collection.name;
            return (
              <div key={collection.name}>
                <button
                  type="button"
                  className="mobile-category"
                  onClick={() => setActive(expanded ? null : collection.name)}
                >
                  {collection.name}
                  <ChevronRight className={expanded ? "rotated" : ""} aria-hidden="true" />
                </button>
                {expanded ? (
                  <div className="mobile-submenu">
                    {collection.groups.length ? (
                      collection.groups.map((group, index) => {
                        const hasNamedGroup = collection.groups.some((entry) => entry.name);
                        return (
                          <section
                            key={`${collection.name}-${group.name ?? index}`}
                            className={group.name ? "submenu-group has-label" : "submenu-group no-label"}
                          >
                            {group.name ? <p>{group.name}</p> : null}
                            {group.items.map((item) => (
                              <a
                                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                                key={item}
                                className={hasNamedGroup && !group.name ? "standalone-item" : undefined}
                              >
                                {item}
                              </a>
                            ))}
                          </section>
                        );
                      })
                    ) : (
                      <a href={`#${collection.name.toLowerCase()}`}>View all {collection.name}</a>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function StoreNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="site-header">
      <nav className="main-nav" aria-label="Main navigation">
        <Brand />
        <div className="desktop-links">
          <a className="nav-link" href="#home">Home</a>
          <DesktopCollections />
          <a className="nav-link" href="#about-us">About Us</a>
          <a className="nav-link" href="#contact-us">Contact Us</a>
        </div>
        <div className="nav-actions">
          <a href="#search" aria-label="Search"><Search /></a>
          <a href="#account" aria-label="Your account"><UserRound /></a>
          <a href="#wishlist" aria-label="Wishlist"><Heart /></a>
          <a href="#bag" aria-label="Shopping bag"><ShoppingBag /></a>
          <button
            className="mobile-menu-trigger"
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {mobileOpen ? (
        <div className="mobile-menu" ref={mobilePanelRef}>
          {primaryLinks.slice(0, 1).map((link) => (
            <a className="mobile-nav-row" href={`#${link.toLowerCase()}`} key={link}>{link}</a>
          ))}
          <MobileCollections />
          {primaryLinks.slice(1).map((link) => (
            <a className="mobile-nav-row" href={`#${link.toLowerCase().replaceAll(" ", "-")}`} key={link}>{link}</a>
          ))}
        </div>
      ) : null}
    </header>
  );
}