import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { DynamicSandboxProductDetail } from "../components/dynamic-sandbox-product-detail";

export const Route = createFileRoute("/sandbox/product/$productId")({
  head: () => ({
    meta: [
      { title: "Product Detail Preview | WheelRefurb" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SandboxDetailRoute,
});

function SandboxDetailRoute() {
  const { productId } = Route.useParams();
  return <div className="min-h-screen bg-background"><StoreNavigation /><DynamicSandboxProductDetail productId={productId}/></div>;
}
