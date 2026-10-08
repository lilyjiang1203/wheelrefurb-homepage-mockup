import { createFileRoute } from "@tanstack/react-router";
import { StoreNavigation } from "../components/store-navigation";
import { ContactPage } from "../components/contact-page";
import { parseFinderContactSearch, finderInquiryMessage } from "../lib/finder-presentation";

export const Route = createFileRoute("/contact")({
  validateSearch: parseFinderContactSearch,
  head: () => ({
    meta: [
      { title: "Contact Us | FreiLack WheelRefurb" },
      {
        name: "description",
        content:
          "Reach FreiLack WheelRefurb for OEM-matched wheel paint, clear coats, powder coatings and refinishing questions — send a message, email our team or call us.",
      },
      { property: "og:title", content: "Contact Us — FreiLack WheelRefurb" },
      {
        property: "og:description",
        content:
          "Questions about a wheel color match, a coating product, or a refinishing project? Send a message or contact the FreiLack WheelRefurb team directly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactRoute,
});

function ContactRoute() {
  const search = Route.useSearch();
  const initialMessage = finderInquiryMessage(search);
  return (
    <div className="min-h-screen bg-background">
      <StoreNavigation />
      <main>
        <ContactPage key={initialMessage} initialMessage={initialMessage} />
      </main>
    </div>
  );
}
