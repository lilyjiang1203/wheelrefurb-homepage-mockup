import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, Search } from "lucide-react";
import finishedWheel from "../assets/wheel-finish-closeup.jpg";
import { Button } from "./ui/button";

const vehicleBrands = [
  "Aston Martin", "Audi", "Bentley", "BMW / MINI", "Chrysler", "Ferrari", "Fiat",
  "Ford", "General Motors", "Honda", "Hyundai", "Infiniti", "Jaguar", "Kia",
  "Land Rover", "Lexus", "Maserati", "Mazda", "Mercedes-Benz", "Mitsubishi",
  "Nissan", "Porsche", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo",
];

const finishes = [
  { name: "Hyper Silver", className: "finish-silver" },
  { name: "Graphite", className: "finish-graphite" },
  { name: "Satin Black", className: "finish-black" },
  { name: "Bronze", className: "finish-bronze" },
  { name: "Bright White", className: "finish-white" },
];

function collectionSlug(brand: string) {
  return brand.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function ColorFinder() {
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return vehicleBrands;
    return vehicleBrands.filter((brand) => brand.toLowerCase().includes(normalizedQuery));
  }, [query]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const chooseBrand = (brand: string) => {
    setSelectedBrand(brand);
    setQuery(brand);
    setOpen(false);
  };

  return (
    <section id="find-your-color" className="color-finder-section" aria-labelledby="color-finder-title">
      <div className="color-finder-inner">
        <div className="wheel-showcase">
          <span className="finder-kicker">OEM-matched finishes</span>
          <div className="wheel-image-wrap">
            <img
              src={finishedWheel}
              alt="Close-up of a professionally refinished alloy wheel spoke with metallic paint coating"
              width={1408}
              height={1104}
              loading="lazy"
            />
          </div>
          <p className="finish-heading">Popular wheel finishes</p>
          <div className="finish-row">
            {finishes.map((finish) => (
              <div className="finish-option" key={finish.name}>
                <span className={`finish-swatch ${finish.className}`} aria-hidden="true" />
                <span>{finish.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="finder-copy">
          <p className="finder-kicker">Color finder</p>
          <h1 id="color-finder-title">Find your wheel color</h1>
          <p className="finder-intro">Browse wheel paint colors available for your vehicle brand.</p>

          <div className="brand-combobox" ref={containerRef}>
            <label htmlFor="vehicle-brand-search">Select your vehicle brand</label>
            <div className="brand-input-wrap">
              <Search aria-hidden="true" />
              <input
                id="vehicle-brand-search"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls="vehicle-brand-options"
                aria-activedescendant={open && matches[highlightedIndex] ? `brand-${collectionSlug(matches[highlightedIndex])}` : undefined}
                autoComplete="off"
                placeholder="Type to search brands…"
                value={query}
                onFocus={() => setOpen(true)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedBrand("");
                  setHighlightedIndex(0);
                  setOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setOpen(false);
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setOpen(true);
                    setHighlightedIndex((index) => Math.min(index + 1, matches.length - 1));
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setHighlightedIndex((index) => Math.max(index - 1, 0));
                  }
                  if (event.key === "Enter" && open && matches[highlightedIndex]) {
                    event.preventDefault();
                    chooseBrand(matches[highlightedIndex]);
                  }
                }}
              />
              <ChevronDown className={open ? "is-open" : ""} aria-hidden="true" />
            </div>

            {open ? (
              <div className="brand-options" id="vehicle-brand-options" role="listbox">
                {matches.length ? matches.map((brand, index) => (
                  <button
                    id={`brand-${collectionSlug(brand)}`}
                    type="button"
                    role="option"
                    aria-selected={selectedBrand === brand}
                    className={index === highlightedIndex ? "highlighted" : undefined}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => chooseBrand(brand)}
                    key={brand}
                  >
                    <span>{brand}</span>
                    {selectedBrand === brand ? <Check aria-hidden="true" /> : null}
                  </button>
                )) : (
                  <p className="no-brand-results">No matching vehicle brands.</p>
                )}
              </div>
            ) : null}
          </div>

          {selectedBrand ? (
            <Button asChild size="lg" className="finder-submit">
              <a href={`/collections/${collectionSlug(selectedBrand)}`}>
                View colors <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          ) : (
            <Button type="button" size="lg" className="finder-submit" disabled>
              View colors <ArrowRight aria-hidden="true" />
            </Button>
          )}
          <p className="finder-status" role="status">
            {selectedBrand ? `Ready to view ${selectedBrand} wheel colors.` : "Select a vehicle brand first."}
          </p>
          <p className="finder-help">
            Can't find your brand? <a href="#contact-us">Contact us for assistance.</a>
          </p>
        </div>
      </div>
    </section>
  );
}
