# Decisions log

Every major choice: the options considered, the pick, and why. Assumptions made while Muneeb was away are listed at the end with what would change them. Licences for every external font and library are in the last section.

## Phase 0: Brand assets

### D1. How to make the SVG logo
- **Options:** (a) auto-trace the PNG with potrace, (b) redraw by eye, (c) rebuild from measured geometry.
- **Picked:** (c). The mark is pure 45 degree geometry, so every edge was measured from the PSD layers and rebuilt as straight lines plus four rounded corners. The wordmark was rebuilt as round-capped centre lines.
- **Why:** auto-tracing gives wobbly curves and hundreds of nodes; redrawing by eye drifts. The rebuild overlaps the original by 98.9% (mark) and 93.9% (hairline wordmark) when rendered and compared pixel by pixel, with 8 and 10 points for the two letters.

### D2. One-colour logo
- **Options:** (a) copy `logo (black).png` where the C and F merge, (b) add a thin knockout where the F crosses the C.
- **Picked:** (b) as the default one-colour version, with (a) kept as `corpafly-logo-black-solid.svg`.
- **Why:** the brand's own white logo on the Amazon banner and the box print already use a knockout, and without it the two letters read as one blob.

### D3. Header lockup and small sizes
- **Picked:** a horizontal lockup (mark left, wordmark right, wordmark cap height 30% of mark height) plus a "small" version whose wordmark stroke is 1.7x heavier.
- **Why:** the stacked logo is too tall for a website header, and the hairline wordmark stroke is 6% of its cap height, which drops below one pixel at header sizes. The brand already uses a heavier cut of the same typeface on the thank-you card. **Needs Muneeb's approval.**

### D4. Which existing images to use
- **Picked:** crops only, saved as WebP and AVIF in `brand/assets/web/`: the J-hook bundle (box cropped out), the two coiled lanyard discs, the fanned lanyards as transparent cut-outs, three office photo halves without baked-in type.
- **Not used:** the branded box (orders ship in plain boxes), banners with type baked into the photo, the children photo, the generic icon strip, the old banner copy.

## Assumptions

| # | Assumption | Would change if |
|---|---|---|
| A1 | Pushing to `main` after each phase is wanted (CLAUDE.md says so), as well as to the working branch | Muneeb prefers pull requests |
| A2 | GitHub Pages is not yet switched on. Muneeb turns it on once (Settings > Pages > main / root) | It is already on |
| A3 | The stock-style lifestyle photos in `storefront-images/` are licensed for Corpafly's own channels, including the website | The licence is Amazon-only. Then remove the three `office-*` / `meeting-*` crops |
| A4 | Placeholder prices: standard 100-pack $26.87 (the real Amazon reference), break-away 100-pack $29.87, 50-pack $17.87, 25-pack $10.87. Always labelled as placeholders | Muneeb sets real prices |
| A5 | Strap colours for green, red, yellow and purple are approximations (no photos exist). Blue and black are sampled from real photos | Real photos arrive |
