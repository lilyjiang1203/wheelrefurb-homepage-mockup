<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep storefront navigation data in the navigation component; it is a static catalogue derived from the supplied workbook.
- Keep the vehicle-brand color finder as a homepage section; its catalogue is static and collection links remain temporary until Shopify URLs are supplied.
- Keep each homepage section in its own component under src/components and render them in display order from the index route, so section order is readable in one place.
- Keep the guided OEM finder data in a typed mock catalogue separate from its journey, help form and homepage entry; product metadata fields support a future integration without coupling the current UI to a live service.
- Keep finder state in memory and explicitly mark matches, product compatibility, cart and help submissions as simulated; this prevents a UI-only prototype from implying real purchases or email delivery.
- Keep product detail data separated into product, variants, metafields, references and documents with null unverified values; this supports future Shopify integration without invented specifications.
- Resolve product asset pointers against their verified Lovable hosting origin for third-party deployment and offer WebM/MP4 video sources; relative asset infrastructure paths and codec support otherwise fail outside the preview.
- Use the shared ProductGallery for product media; filter missing sources and remove failed media with selection fallback so future product pages never show empty gallery placeholders.

