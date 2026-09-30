import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { StoreNavigation } from "../components/store-navigation";

// Phase 1: static catalogue from the Find Your Color brief.
// Placeholder collection URLs — real Shopify collections connect later.
const vehicleBrands = [
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW / MINI",
  "Chrysler",
  "Ferrari",
  "Fiat",
  "Ford",
  "General Motors",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Kia",
  "Land Rover",
  "Lexus",
  "Maserati",
  "Mazda",
  "Mercedes-Benz",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

const steps = [
  {
    title: "Select your brand",
    body: "Pick the manufacturer of your vehicle from the list.",
  },
  {
    title: "View wheel colors",
    body: "Browse the OEM-matched paint collection for that brand.",
  },
  {
    title: "Order with confidence",
    body: "Every color is matched to the original factory finish.",
  },
];

function collectionSlug(brand: string) {
  return brand
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const Route = createFileRoute("/find-your-color")({
  head: () => ({
    meta: [
      { title: "Find Your Wheel Color | FreiLack WheelRefurb" },
      {
        name: "description",
        content:
          "Find OEM-matched wheel paint for your vehicle. Select your vehicle brand and view the matching wheel paint collection.",
      },
      { property: "og:title", content: "Find Your Wheel Color — FreiLack WheelRefurb" },
      {
        property: "og:description",
        content: "Find OEM-matched wheel paint for your vehicle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FindYourColorPage,
});

function FindYourColorPage() {
  const [brand, setBrand] = useState("");
  const selectedBrand = vehicleBrands.find((entry) => entry === brand);

  return (
    <div className="min-h-screen bg-background" id="find-your-color">
      <StoreNavigation active="finder" />
      <main>
        <section
          aria-labelledby="finder-title"
          className="mx-auto w-full max-w-3xl px-6 pb-16 pt-16 text-center sm:pt-20"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
            OEM color matching
          </p>
          <h1
            id="finder-title"
            className="mt-3 text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl"
          >
            Find Your Wheel Color
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Find OEM-matched wheel paint for your vehicle.
          </p>

          <div className="mt-10 rounded-xl border border-border bg-card p-8 text-left shadow-sm">
            <label
              htmlFor="vehicle-brand"
              className="block text-sm font-bold uppercase tracking-wide text-foreground"
            >
              Select your vehicle brand
            </label>
            <div className="relative mt-3">
              <select
                id="vehicle-brand"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="w-full appearance-none rounded-md border border-input bg-background px-4 py-3 pr-10 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Choose a brand…</option>
                {vehicleBrands.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>

            {selectedBrand ? (
              <a
                href={`/collections/${collectionSlug(selectedBrand)}`}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
              >
                View Colors
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="mt-6 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-primary/40 px-8 text-sm font-bold uppercase tracking-widest text-primary-foreground"
                >
                  View Colors
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <p role="status" className="mt-3 text-center text-sm text-muted-foreground">
                  Select a vehicle brand first.
                </p>
              </>
            )}
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Phase 1 prototype: collection links are placeholders until the Shopify
              collections go live.
            </p>
          </div>
        </section>

        <section
          aria-label="How the color finder works"
          className="border-t border-border bg-muted/40"
        >
          <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-14 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
                  Step {index + 1}
                </p>
                <h2 className="mt-2 text-lg font-bold uppercase tracking-tight text-foreground">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
