import front from "../assets/audi-anthracite-front.jpg.asset.json";
import back from "../assets/audi-anthracite-back.jpg.asset.json";
import video from "../assets/audi-anthracite-showcase.mp4.asset.json";
import webVideo from "../assets/audi-anthracite-showcase.webm.asset.json";

// Asset serving is hosted by Lovable, not by third-party deployments such as Vercel.
const assetHost = "https://id-preview--6ce181e9-b982-4bba-aea7-1b0876d0a94f.lovable.app";
const hostedAsset = (url: string) => new URL(url, assetHost).href;

export type ProductVariant = { id: string; packageSize: string; sku: string | null; price: number | null; inventory: number | null };
export const audiProduct = {
  product: { slug: "audi-anthracite-lv7d", title: "AUDI ANTHRACITE LV7D", vendor: "FreiLacke", description: "An Anthracite dark grey wheel refinishing color associated with Audi OEM color code LV7D and FreiLacke formula W01838MAU07A. Intended for alloy wheel refinishing applications; consult manufacturer documentation for the appropriate application process.", images: { front: hostedAsset(front.url), back: hostedAsset(back.url) }, video: hostedAsset(video.url), webVideo: hostedAsset(webVideo.url) },
  variants: ["Sample / Touch Up", "Half Liter", "One Liter", "5 Liter Value Pack"].map((packageSize, i): ProductVariant => ({ id: String(i), packageSize, sku: null, price: null, inventory: null })),
  exampleSku: "DVC-GB-1QT",
  metafields: { brand: "FreiLacke", technology: null, subtype: null, layer: null, colorFamily: "Grey", colorName: "Anthracite", finishType: null, glossLevel: null, vehicleBrand: "Audi", oemCode: "LV7D", formulaCode: "W01838MAU07A", panelReference: "12", application: "Alloy Wheel Refinishing" },
  references: { compatiblePrimers: [] as string[], compatibleBaseCoats: [] as string[], compatibleClearCoats: [] as string[], similarColors: [] as string[] },
  documents: [{ name: "Technical Data Sheet (TDS)", url: null }, { name: "Safety Data Sheet (SDS)", url: null }],
};
export const productAttributes: [string, string | null][] = [
  ["Brand", audiProduct.metafields.brand], ["Coating Technology", audiProduct.metafields.technology], ["Coating Subtype", audiProduct.metafields.subtype], ["Coating Layer", audiProduct.metafields.layer], ["Color Family", audiProduct.metafields.colorFamily], ["Color Name", audiProduct.metafields.colorName], ["Finish Type", audiProduct.metafields.finishType], ["Gloss Level", audiProduct.metafields.glossLevel], ["OEM Vehicle Brand", audiProduct.metafields.vehicleBrand], ["OEM Color Code", audiProduct.metafields.oemCode], ["FreiLacke Formula Code", audiProduct.metafields.formulaCode], ["Panel Reference", audiProduct.metafields.panelReference], ["Application", audiProduct.metafields.application],
];
export function normalizeProductQuantity(value: number) { return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1; }