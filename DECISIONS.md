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

## Phase 1: Research decisions

### D5. Theme base
- **Options:** Dawn 16, Horizon 4.3, Skeleton `main` (v2 release candidate), Skeleton v1.
- **Picked:** Skeleton v1 pinned to commit `a4f32d3`, with Dawn 16 as the reference for cart and quantity logic (ported with credit).
- **Why:** the design is fully custom, so a base's markup and CSS are cost, not value. Skeleton ships 0 KB of JavaScript, theme blocks and a clean Theme Check setup. Horizon loads about 156 KB of gzipped JavaScript and its licence forbids offering derived themes off-platform (this repo is public). Skeleton `main` only runs on preview stores. Details in `research/04-shopify-foundations.md`.

### D6. Price per lanyard
- **Options:** Shopify's native unit price, or compute it in the theme.
- **Picked:** compute it from a variant metafield (`custom.units_per_pack`) with decimal division, rounded half up to whole cents; read `variant.unit_price` instead if Muneeb turns the native feature on.
- **Why:** sources disagree on whether native unit pricing works for US stores, and the computed value works either way.

### D7. Glass technique
- **Options:** CSS `backdrop-filter`, SVG displacement refraction, WebGL libraries (liquidGL, liquidglass, liquid-glass-js).
- **Picked:** CSS `backdrop-filter` only, solid-first fallbacks, measured tint floors (72% white behind ink text, 64% ink behind white text). Any lens effect is baked into artwork.
- **Why:** refraction works in Chromium only and cost about a third of the frame budget in testing; WebGL rasterises the page and adds 26 to 61 KB.

### D8. Motion
- **Options:** GSAP 3.15, Motion, anime.js, Lenis, native CSS and WAAPI.
- **Picked:** native only: CSS transitions, scroll-driven animations, `@starting-style`, view transitions, WAAPI, `linear()` springs.
- **Why:** every engine supports these as of 27 Oct 2026. GSAP is free but proprietary and revocable, and 45 KB with ScrollTrigger; Lenis takes over scrolling.

### D9. Type
- **Options considered:** 18 free families set against the real wordmark (specimen rendered and compared).
- **Picked:** one OFL pairing per direction: Instrument Sans + Fragment Mono (A), Archivo + Martian Mono (B), Atkinson Hyperlegible Next + Mono (C). The final pick follows the Gate 1 direction.
- **Rejected:** Inter and Space Grotesk (banned default look); Geist (default of AI site builders); Mona Sans, Red Hat, IBM Plex (other companies' identity faces); Fontshare fonts (licence bans subsetting and redistribution); Pangram Pangram (personal use only).

### D10. Icons
- **Picked:** Phosphor (MIT), functional icons only, as a small sprite.
- **Rejected:** Lucide and Heroicons (the default shadcn and Tailwind look), Remix Icon (new restrictive licence, Jan 2026), icon rows as section markers.

## Assumptions

| # | Assumption | Would change if |
|---|---|---|
| A1 | Pushing to `main` after each phase is wanted (CLAUDE.md says so), as well as to the working branch | Muneeb prefers pull requests |
| A2 | GitHub Pages is not yet switched on. Muneeb turns it on once (Settings > Pages > main / root) | It is already on |
| A3 | The stock-style lifestyle photos in `storefront-images/` are licensed for Corpafly's own channels, including the website | The licence is Amazon-only. Then remove the three `office-*` / `meeting-*` crops |
| A4 | Placeholder prices: standard 100-pack $26.87 (the real Amazon reference), break-away 100-pack $29.87, 50-pack $17.87, 25-pack $10.87. Always labelled as placeholders | Muneeb sets real prices |
| A5 | Strap colours for green, red, yellow and purple are approximations (no photos exist). Blue and black are sampled from real photos | Real photos arrive |
| A6 | Site copy is US English (color, center) because every buyer is in the US; project documents keep Muneeb's spelling | Muneeb prefers otherwise |
| A7 | Shopify catalogue = 2 products (Lanyard, Break-Away Lanyard) with Pack size and Colour options, 14 variants; combinations that do not exist are left out, not marked sold out | Muneeb wants 4 separate products as on Amazon |
| A8 | Specs not in the brief (length, width, release force) and shipping speeds are shown as "To confirm", never guessed | Muneeb supplies them |

## Licences

| Item | Licence | Where |
|---|---|---|
| Instrument Sans, Fragment Mono, Archivo, Martian Mono, Atkinson Hyperlegible Next and Mono | SIL Open Font License 1.1 | `prototypes/shared/fonts/` (licence files alongside) |
| Phosphor Icons 2.1.1 | MIT | `prototypes/shared/icons.svg`, `prototypes/shared/ICONS-LICENSE-phosphor.txt` |
| Antipasto Pro (wordmark) | Commercial (Zetafonts) | Not distributed: outlined in the SVG logo only |
| JavaScript libraries | None used | |
