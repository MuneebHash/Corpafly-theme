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
- **Picked:** one OFL pairing per direction: Instrument Sans + Fragment Mono (A), Archivo + Martian Mono (B), Hanken Grotesk alone (C). The final pick follows the Gate 1 direction.
- **Changed in Phase 2:** C first used Atkinson Hyperlegible Next + Mono. Built, its slashed zero made every price read like code ("$Ø.27") and it has no plain-zero alternate, so C moved to Hanken Grotesk, whose digits are equal-width by default.
- **Rejected:** Inter and Space Grotesk (banned default look); Geist (default of AI site builders); Mona Sans, Red Hat, IBM Plex (other companies' identity faces); Fontshare fonts (licence bans subsetting and redistribution); Pangram Pangram (personal use only).

### D10. Icons
- **Picked:** Phosphor (MIT), functional icons only, as a small sprite.
- **Rejected:** Lucide and Heroicons (the default shadcn and Tailwind look), Remix Icon (new restrictive licence, Jan 2026), icon rows as section markers.

## Phase 2: Brand book and directions

### D11. Three directions that differ in concept
- **Options considered:** variations on one layout (rejected: that would differ only in colour), a dark "premium tech" look (rejected: too close to neon on near-black), and concepts drawn from the product, the brand mark and the buyer's job.
- **Picked:**
  - **A, Clear Sleeve.** Material-led: the ID badge sleeve is the brand's glass, and the product hangs in the hero.
  - **B, Diamond Grid.** Brand-led: the mark's 45 degree geometry becomes the page system.
  - **C, Order Desk.** Task-led: the homepage is the order form.
- **Why:** each answers "premium and fast" from a different side (object, identity, utility), so the Gate 1 choice is about strategy, not styling.

### D12. Product visual built in code
- **Options:** recoloured photos, stock imagery, placeholders, or a drawn lanyard.
- **Picked:** a code-built lanyard (`prototypes/shared/lanyard.js`): woven strap, crimp, swivel J-hook, break-away clasp. One geometry drawn for all 14 variants, coloured by a CSS variable.
- **Why:** photos exist for black and blue only. Recolouring a photo would misrepresent green, red, yellow and purple; the brief forbids stock. Drawing every variant the same way also follows the "one variable at a time" lesson from the research.

### D13. Review fixes applied by the lead designer (all three directions)
- **Forms never sit on glass:** A's buy panel became a solid sheet. Glass stays on chrome and focal moments.
- **No implied release force:** removed "pull hard" and "pulled hard" everywhere.
- **No glows:** B's hero art is clipped below the dark glass header; A's strap now passes behind the header as real depth, without a fade smear.
- **Numbers read as prices:** A's badge price and C's whole page use proportional sans figures, with no monospace decimals and no slashed zeros.
- **Honest finder:** C recommends the standard Lanyard to adults (Break-Away for kids and safety settings), with the maths shown.

### D14. Direction B's trimmed fonts
- **Picked:** B ships trimmed copies of Archivo and Martian Mono (31 KB in total instead of 133 KB) with their OFL licences in `prototypes/direction-b/fonts/`.
- **Why:** it keeps LCP under 2.5 s. The OFL allows modification, and neither font declares a Reserved Font Name. Every character the page and its scripts produce is covered (checked).

### D15. Brand device in Direction B (needs approval)
- B's hero uses the CF mark's geometry as a cropped background graphic in a dark key: deep teal C, black F. It works as a supergraphic, not as the logo.
- The logo itself (in the header) keeps its approved colours. **Muneeb should approve this use** before it ships.

### D16. Independent QA round before Gate 1
- **Method:** for each direction, an independent design critic and a rules auditor reviewed the live page. A skeptic then reproduced every finding and rejected anything not real, not material, or that would make the page more generic. A fixer applied only the confirmed findings and re-checked.
- **Outcome:** 59 findings, 41 confirmed and applied, 18 rejected. Notable fixes:
  - A: the badge no longer retypes CORPAFLY in a font beside the mark (brand rule); the drawer tint rose to 90%; the sticky bar leads with colour, pack and quantity.
  - B: the hero lens is baked instead of live glass; the hero moment is trimmed to 800 ms; the plates stack below 1100 px.
  - C: cart changes are announced to screen readers; the finder card is solid on small screens; quantities go up to 999.
- **Final checks, all three:**
  - axe-core: 0 violations at 390 and 1440 px.
  - Keyboard: focus visible on every control.
  - Reduced motion: final states shown.
  - Layout: no horizontal scroll from 360 to 1920 px.
  - Lighthouse mobile: 96 to 97 performance, 100 accessibility, 100 best practices (local server, no compression; LCP 2.3 to 2.4 s).

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
| A9 | Product logic in the finder: adults at work get the standard Lanyard; kids, schools, hospitals and warehouses get Break-Away | Muneeb wants Break-Away as the default for everyone |
| A10 | Every "Save X%" figure compares price per lanyard within the Break-Away line against the 25 pack. With placeholder prices these savings are placeholders too | Real prices change the figures |
| A11 | The header lockup (mark plus wordmark side by side) and its heavier small-size wordmark are new arrangements of the original parts, pending approval | Muneeb prefers the stacked logo or mark only in the header |

## Licences

| Item | Licence | Where |
|---|---|---|
| Instrument Sans, Fragment Mono, Archivo, Martian Mono, Hanken Grotesk | SIL Open Font License 1.1 | `prototypes/shared/fonts/` (licence files alongside) |
| Archivo and Martian Mono, trimmed copies | SIL Open Font License 1.1 (modification allowed, no Reserved Font Name) | `prototypes/direction-b/fonts/` (licence files alongside) |
| Phosphor Icons 2.1.1 | MIT | `prototypes/shared/icons.svg`, `prototypes/shared/ICONS-LICENSE-phosphor.txt` |
| Antipasto Pro (wordmark) | Commercial (Zetafonts) | Not distributed: outlined in the SVG logo only |
| JavaScript libraries | None used | |
