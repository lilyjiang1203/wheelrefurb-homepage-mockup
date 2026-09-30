# Homepage Color Finder

## What will change
- Move **Find Your Color** from its separate page into a full-width section on the homepage.
- Keep **FIND YOUR COLOR** in the navigation, but make it scroll directly to that homepage section.
- Replace the long native brand list with a searchable dropdown:
  - User types a brand name.
  - Matching brands filter immediately.
  - Keyboard and pointer selection are supported.
  - “View Colors” stays unavailable until a brand is selected.
- Remove the separate Find Your Color page and its navigation-active state.

## Visual direction
- Create a product-focused section showing a clearly finished automotive wheel beside the finder.
- Add a curated row of paint/color swatches near the wheel to communicate finish options.
- Keep the existing FreiLack navigation styling and blue brand accent.
- Stack the wheel visual, finder, and swatches cleanly on smaller screens.

## Technical details
- Build the searchable brand selector as an accessible combobox with filtered options, empty results, Escape handling, and click-outside closing.
- Keep the existing temporary collection destinations generated from each selected brand.
- Add the generated wheel image as a bundled project asset.
- Update homepage metadata to describe both the catalogue and color finder.
- Verify navigation scrolling, brand filtering, selection, and mobile layout in the live preview.
