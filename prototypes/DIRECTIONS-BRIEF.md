# Shared brief for the three homepage directions

Each direction is built from this brief plus its own concept brief. The concept differs; the facts, rules and quality bars below do not.

## Files and paths

- Build only inside your own folder: `prototypes/direction-X/` with `index.html`, `styles.css`, `main.js`, `README.md`. Add more files there if needed.
- Use the shared foundation by **relative path** (the site is served from the repo root on GitHub Pages, so `../../` reaches the repo root):
  - `../shared/tokens.css`: colours, type scale, space, radius, glass material classes (`.glass`, `.glass-dark`), motion tokens, focus ring, `.ph-tag`, `.swatch-dot`
  - `../shared/fonts/fonts.css`: self-hosted OFL fonts (only the faces you use are downloaded)
  - `../shared/lanyard.js` + `../shared/lanyard.css`: code-built lanyards coloured by `--strap`. See `../shared/lanyard-demo.html`
  - `../shared/products.js`: catalogue, placeholder prices, `perUnit()`, `money()`, `savingVsSmallest()`
  - `../shared/icons.svg`: functional icon sprite (Phosphor, MIT): `i-bag`, `i-user`, `i-menu`, `i-close`, `i-plus`, `i-minus`, `i-chevron-down`, `i-chevron-right`, `i-arrow-right`, `i-play`, `i-check`, `i-search`, `i-copy`, `i-arrow-counter`. Use `<svg class="icon" aria-hidden="true"><use href="../shared/icons.svg#i-bag"/></svg>` and always pair an icon button with an accessible name
  - Logos: `../../brand/logo/*.svg` (use the SVGs, never the PNGs). The header lockup at small sizes is `corpafly-lockup-small.svg`
  - Photos: `../../brand/assets/web/*.avif` with `.webp` fallback via `<picture>`: `hooks-black`, `hooks-blue` (J-hook bundles, 1020 and 640 wide), `coil-black`, `coil-blue` (product discs, transparent corners), `fan-black`, `fan-blue` (transparent cut-outs), `office-black-lanyard`, `office-blue-lanyard`, `meeting-room` (stock-style, use sparingly and small)
- Do not edit anything in `prototypes/shared/` or `brand/`. If you need a variation, copy or wrap it inside your folder.
- No external requests at all: no CDNs, no Google Fonts, no analytics. No frameworks. Vanilla HTML, CSS and JS modules.

## Facts you may state

- Corpafly sells lanyards in bulk packs. CORPAFLY LLC is a Texas company.
- **Lanyard** (standard): 100 pack; Black, Blue, Green, Red. Flat polyester neck strap, swivel metal J-hook.
- **Break-Away Lanyard**: 100 pack (Black, Blue), 50 pack (Black, Blue), 25 pack (Black, Blue, Green, Red, Yellow, Purple). Safety break-away clasp at the neck that releases when the strap is pulled. Same strap and J-hook.
- Uses: ID badges, keys, card holders, whistles; offices, teachers, kids, cruise cards.
- Who buys: office managers and HR (bulk, clean look, fast delivery, easy reorder); schools and teachers (break-away safety, colour coding by class or role, price per unit); events (volume, colour coding, on time); cruise passengers and travellers (small packs, cheap).
- Orders ship from US warehouses. Checkout is Shopify's own, secure checkout.
- Shopify customer accounts show past orders with a "Buy again" option.

## Things you must not do

- **No fake content.** No reviews, star ratings, testimonials, customer logos, award badges, stock counts, "X people bought this", delivery promises or dates. Reviews are an empty-state module.
- **No Amazon** logos, "Prime", stars or reviews. Do not mention Amazon at all on the page.
- **No branded packaging.** Never show the branded box. Never imply unboxing.
- **Prices are placeholders.** Every price block carries a visible `<span class="ph-tag">Placeholder price</span>` (or one clear note covering a whole price table).
- **Unconfirmed specs** (length, width, release force, shipping speed) render as `<span class="ph-tag">To confirm</span>`. Never guess a number.
- Green, red, yellow and purple have no photos: show them with the code-built lanyard, never a recoloured photo.
- No stock photos from anywhere else, no icon packs as section markers, no emoji.
- Avoid on sight: purple-to-blue gradients, neon on near-black, warm cream with serif and terracotta, Inter or Space Grotesk, everything centred, identical rounded cards everywhere, accent bars on cards.

## Voice

- Plain, direct, confident. Short sentences. Numbers as digits. **No em dashes** (use a full stop, comma or colon).
- US English on the page (color, center), because every buyer is in the US.
- Never: elevate, seamless, unlock, top-notch, world-class, best-in-class, effortless, curated, solutions, innovative, journey, passionate, "we've got you covered".
- Prices: `$26.87`. Per lanyard: `$0.27 per lanyard` on product blocks, `$0.27 each` where space is tight. Pack: `100 pack`. Product names: `Lanyard`, `Break-Away Lanyard`; in running text "break-away".
- Teal is a signal (primary action, selected state, focus, links), never a large background behind body text.

## Research to read before building

- `research/05-bulk-ux.md` section 3: the buy box on a 390 px phone, price per lanyard maths, the mixed-colour pattern, cart drawer contents, true trust row.
- `research/01-glass-motion.md` section 3: the glass recipe and motion rules (already encoded in `tokens.css`).
- `research/02-ecommerce-references.md`: what separates premium stores from templates, and what lanyard competitors do badly.

## Content every homepage must include (order and form are yours)

1. Glass header: logo, nav (Shop, Break-away, For teams, Help), account, cart with count. Mobile menu.
2. A hero with one product moment.
3. The range: both products, their packs, colors and price per lanyard.
4. A buy path that a phone user can finish fast: pack, color, quantity, price per lanyard, add to cart. Use visible buttons and named swatches, never drop-downs.
5. Break-away explained in plain words (it releases when pulled; who it is for).
6. Color coding by class, team or role.
7. Specs in a fixed order: Strap, Hook, Clasp, Length, Width, Pack.
8. A video slot (the product video exists but is not in the repo): a 16:9 frame labelled "Product video".
9. Reviews as an empty state ("No reviews yet. Reviews from verified buyers will appear here.").
10. Reorder: sign in to "Buy again", plus a line about reorder links.
11. True trust row: "Secure checkout by Shopify", "Ships from US warehouses", "CORPAFLY LLC, Texas", "Questions? Contact us".
12. Footer with Shop, Help (FAQ, Shipping, Returns, Contact), Company (About), policies, and "Prices shown are placeholders."

Add to cart opens a glass cart drawer (prototype: it lists the item with pack, color, quantity, per-lanyard price and subtotal; Check out is a dead link).

## Glass and motion rules (read `research/01-glass-motion.md` section 3 first)

- Glass only on chrome and focal moments: header, menu, cart drawer, quick-view, hero overlay, sticky buy bar, one key card. Never behind paragraphs, prices tables or forms. "Add to cart" is solid teal, not glass.
- Use the classes in `tokens.css`: `.glass` / `.glass-dark`, plus `.glass--text` whenever text sits on glass over content that can scroll behind it (72% white or 64% ink tint: the measured worst-case floors for 4.5:1).
- Glass cost grows with area: keep scrolling glass under about 10% of the screen, never nest glass, never more than 3 glass layers visible, never animate the blur. Lock page scroll under an open drawer.
- Header: tint rises from `--glass-tint` to `--glass-tint-strong` over the first 80 px of scroll (scroll-driven animation on a pseudo-element's opacity, with a class-toggle fallback).
- No runtime SVG refraction (`backdrop-filter: url()` is Chromium-only and costly) and no WebGL. If you want a lens or refraction look, bake it into the artwork (draw the displaced lines in SVG) and put plain blur glass on top.
- Motion lives inside `@media (prefers-reduced-motion: no-preference)`; content is visible by default (never hidden until JS runs). Reduced-motion users get the final state or opacity fades of 150 ms.
- Animate transform and opacity only. Reveals rise 12 px and fade, 40 ms stagger, 4 items at most. Pressed buttons scale to 0.98. No parallax, no loops, no autoplay.
- One hero product moment, about 800 ms, plays once. No scroll-jacking, no smooth-scroll libraries, no motion libraries (CSS, scroll-driven animations behind `@supports (animation-timeline: view())`, WAAPI and `linear()` springs cover everything).
- Tokens: `--dur-press` 100, `--dur-quick` 160, `--dur-ui` 240, `--dur-panel` 320, `--dur-enter` 480, `--dur-hero` 800 ms; `--ease-standard`, `--ease-out`, `--ease-in`, `--ease-ui`, `--ease-spring`.

## Quality bars (checked before Gate 1)

- Mobile Lighthouse performance 85+, LCP under 2.5 s. The LCP element should be text or an eager `<img>` with `fetchpriority="high"`.
- WCAG 2.2 AA: contrast (including on glass), full keyboard use, visible focus, 24 px minimum targets (design 44 px), labels on every control, `aria-live` for price changes.
- 390 px first, up to 1440 px and wider. No horizontal scroll at any width.
- Clean code, commented where not obvious. No unused CSS or JS.

## Self-check

A static server runs at `http://127.0.0.1:8765/` from the repo root. Check your page at 1440 x 900 and 390 x 844 with Playwright (installed globally: `require('playwright')`), fix what you see, and confirm there are no console errors and no horizontal scroll.
