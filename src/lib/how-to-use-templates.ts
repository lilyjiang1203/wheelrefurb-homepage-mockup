export type CoatingCategory = "Basecoat" | "Primer" | "Clearcoat";

type Step = { title: string; explanation: string };
type Guidance = { steps: Step[]; note: string };

const guidance: Record<CoatingCategory, Guidance> = {
  Basecoat: {
    steps: [
      { title: "Prepare the Surface", explanation: "Clean and prepare the wheel surface following the applicable coating system instructions." },
      { title: "Apply Primer if Required", explanation: "Use the compatible primer specified for the selected coating system, when required." },
      { title: "Apply Basecoat", explanation: "Apply the color coat according to the product's Technical Data Sheet." },
      { title: "Complete the System", explanation: "Apply the compatible next coating layer or clearcoat where specified by the coating system." },
    ],
    note: "Exact preparation, mixing, application, drying, curing, and compatibility requirements must be confirmed against the product and system Technical Data Sheets.",
  },
  Primer: {
    steps: [
      { title: "Prepare the Surface", explanation: "Clean and prepare the substrate as specified in the applicable Technical Data Sheet." },
      { title: "Prepare the Primer", explanation: "Follow the product's instructions for mixing and equipment setup, where applicable." },
      { title: "Apply Primer", explanation: "Apply in accordance with the specified application conditions and required film build." },
      { title: "Continue with Compatible Coatings", explanation: "Observe the required drying or curing conditions before applying the next approved coating layer." },
    ],
    note: "Primer suitability depends on substrate and coating system. Follow the applicable Technical Data Sheets.",
  },
  Clearcoat: {
    steps: [
      { title: "Verify the Base Layer", explanation: "Confirm the underlying coating is compatible and ready for clearcoating." },
      { title: "Prepare the Clearcoat", explanation: "Use the manufacturer's specified mixing, preparation, and equipment settings, where applicable." },
      { title: "Apply Clearcoat", explanation: "Apply under the conditions and film build specified in the product's Technical Data Sheet." },
      { title: "Dry or Cure", explanation: "Follow the specified drying or curing process before handling or returning the wheel to service." },
    ],
    note: "Use the manufacturer's Technical Data Sheets for mixing ratios, recoat windows, film thickness, curing conditions, and compatible systems.",
  },
};

export function resolveHowToUseCategory(layer: string | null | undefined): CoatingCategory | null {
  const value = layer?.trim().toLowerCase();
  if (value === "basecoat") return "Basecoat";
  if (value === "primer") return "Primer";
  if (value === "clearcoat") return "Clearcoat";
  return null;
}

export function howToUseGuide(category: CoatingCategory): Guidance {
  return guidance[category];
}
