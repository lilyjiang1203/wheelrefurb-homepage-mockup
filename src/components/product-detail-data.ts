import front from "../assets/audi-anthracite-front.jpg.asset.json";
import back from "../assets/audi-anthracite-back.jpg.asset.json";
import video from "../assets/audi-anthracite-showcase.mp4.asset.json";
import webVideo from "../assets/audi-anthracite-showcase.webm.asset.json";

// Asset serving is hosted by Lovable, not by third-party deployments such as Vercel.
const assetHost = "https://id-preview--6ce181e9-b982-4bba-aea7-1b0876d0a94f.lovable.app";
const hostedAsset = (url: string) => new URL(url, assetHost).href;

export type ProductVariant = {
  id: string;
  packageSize: string;
  sku: string | null;
  price: number | null;
  inventory: number | null;
};
export const audiProduct = {
  product: {
    slug: "audi-anthracite-lv7d",
    title: "AUDI ANTHRACITE LV7D",
    vendor: "FreiLacke",
    description:
      "An Anthracite dark grey wheel refinishing color associated with Audi OEM color code LV7D and FreiLacke formula W01838MAU07A. Intended for alloy wheel refinishing applications; consult manufacturer documentation for the appropriate application process.",
    images: { front: hostedAsset(front.url), back: hostedAsset(back.url) },
    video: hostedAsset(video.url),
    webVideo: hostedAsset(webVideo.url),
  },
  variants: ["0.5L", "1L", "5L"].map((packageSize, i): ProductVariant => ({
    id: String(i),
    packageSize,
    sku: null,
    price: null,
    inventory: null,
  })),
  /** Manufacturer-verified content only; empty until supplied. */
  content: {
    benefits: [
      "Audi-Inspired Color Match: Developed to recreate the Audi Anthracite LV7D wheel color.",
      "Metallic Grey Appearance: Creates the distinctive anthracite metallic visual effect.",
      "Water-Based Formulation: Water-based liquid basecoat for professional wheel refinishing.",
      "System Compatibility: Designed to work as the color layer within a compatible primer, basecoat and clearcoat system.",
      "Professional Refinishing: Suitable for alloy wheel color restoration applications.",
    ],
    howToUse: [
      "Prepare the Surface: Ensure the wheel surface has been properly cleaned and prepared according to the applicable coating system specifications.",
      "Apply the Primer: Use the specified compatible primer and follow its technical application instructions.",
      "Apply the Basecoat: Apply Audi Anthracite LV7D using the application conditions specified in the manufacturer's Technical Data Sheet.",
      "Apply the Clearcoat: Complete the coating system with the specified clearcoat following the required processing conditions.",
      "Important: Mixing ratios, spray settings, film thickness and curing conditions must be verified against the applicable manufacturer's Technical Data Sheet before application.",
    ],
  },
  metafields: {
    brand: "FreiLacke",
    colorName: "Audi Anthracite Metallic LV7D",
    formulaCode: "WO1838MAU07A",
    colorFamily: "Grey",
    finishType: "Metallic",
    productLine: "FREIOTHERM-Hydro-Basecoat",
    coatingForm: "Wet Paint",
    carrierType: "Water-Based",
    layer: "Basecoat",
    panelReference: "12",
    glossLevel: null,
    applicationParameters: null,

    // Preserve existing fields
    technology: null,
    subtype: null,
    vehicleBrand: "Audi",
    oemCode: "LV7D",
    application: "Alloy Wheel Refinishing",
  },
  references: {
    compatiblePrimers: [] as string[],
    compatibleBaseCoats: [] as string[],
    compatibleClearCoats: [] as string[],
    similarColors: [] as string[],
  },
  documents: [
    { name: "Technical Data Sheet (TDS)", url: null, optional: false },
    { name: "Safety Data Sheet (SDS)", url: null, optional: false },
    { name: "Application Guide", url: null, optional: true },
  ] as { name: string; url: string | null; optional: boolean }[],
};
/** Customer-relevant attributes near the purchase area; unverified values are hidden. */
export function keyAttributes(m: typeof audiProduct.metafields & { coatingType?: string | null }): [string, string][] {
  return (
    [
      ["Color Family", m.colorFamily],
      ["Finish", m.finishType],
      ["Coating Type", m.coatingType ?? m.technology],
      ["OEM Brand", m.vehicleBrand],
    ] as [string, string | null][]
  ).filter((r): r is [string, string] => !!r[1]);
}
export const formatPrice = (price: number | null) =>
  price === null ? null : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(price);
export const availableDocuments = <T extends { url: string | null }>(docs: T[]) =>
  docs.filter((d): d is T & { url: string } => !!d.url);
export function normalizeProductQuantity(value: number) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}
