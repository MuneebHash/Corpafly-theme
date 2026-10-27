# Corpafly brand book

Version 0.1, 27 Oct 2026, for Gate 1. The visual version is [`brand-book.html`](brand-book.html). Values here are the source of truth; `prototypes/shared/tokens.css` implements them.

## The brand in one paragraph

Corpafly makes lanyards for people who buy them by the hundred: office managers, teachers, event teams, travellers. The brand is calm, exact and useful. Prices are clear, materials are named, and nothing needs decoding. The look is **office glass**: clear surfaces, depth, light and material, used with restraint, the way a well-run office feels.

**Four principles**

1. **Clear before clever.** Every page answers three questions fast: what is it, how many, how much each.
2. **One thing changes at a time.** Variants are shown the same way; only the colour or the pack changes.
3. **Glass for chrome, not content.** Glass frames the page. It never sits behind reading.
4. **True or not at all.** No invented reviews, numbers, badges or promises.

---

## 1. Logo

The logo has two parts. The **CF mark** is a teal C behind a black F, both drawn only with 45 degree strokes. The **wordmark** is CORPAFLY in Antipasto Pro Hairline. Both are traced from the original files into clean SVGs in [`brand/logo/`](logo/README.md). Never retype the wordmark in a font.

| Lockup | File | Use |
|---|---|---|
| Stacked (master) | `corpafly-logo.svg` | Packaging inserts, about page, print, social avatars |
| Horizontal | `corpafly-lockup.svg` | Website header and footer, documents. New arrangement, needs approval |
| Horizontal, small | `corpafly-lockup-small.svg` | The same, under 240 px wide: wordmark stroke 1.7x so it stays visible |
| Mark | `corpafly-mark.svg` | Favicon, app icon, small spaces, watermark |
| Wordmark | `corpafly-wordmark.svg` | Rare: when the mark already appears nearby |

**Clear space.** Call the width of one mark stroke **X** (15% of the mark's height). Keep X clear on every side of any lockup. In the horizontal lockup the gap between mark and wordmark is fixed at 2.4X.

**Minimum sizes**

| Lockup | Screen | Print |
|---|---|---|
| Mark | 16 px (favicon), 20 px in UI | 6 mm |
| Stacked | 160 px wide | 25 mm wide |
| Horizontal | 240 px wide; 120 px with the small version | 40 mm wide |

**Colour versions**

| Version | Surfaces |
|---|---|
| Full colour: teal C, black F, black wordmark | White and the light glass neutrals only |
| Black | Light surfaces where colour is not available (fax, engraving, one-colour print) |
| White | Black, dark petrol, photography with a dark area, brand teal |
| Reverse: teal C, white F | Dark surfaces where the brand colour should show. Proposed |
| On teal: white C, black F | Solid brand teal, as on the thank-you card |

One-colour versions keep a thin knockout where the F crosses the C, so the letters stay distinct. The brand's own white logo on the Amazon store already does this.

**Do not**

- Recolour the C or F outside the five versions.
- Rotate, skew or stretch the logo. The 45 degree geometry is part of it.
- Add shadows, glows, gradients, outlines, or put the logo on glass under 72% tint.
- Place the full-colour logo on dark or busy backgrounds.
- Move the C and F apart, or change their overlap.
- Set CORPAFLY in any typeface.

---

## 2. Colour

**Core colours, sampled from the logo files**

| Name | Hex | RGB | Role |
|---|---|---|---|
| Corpafly Teal | `#1E806F` | 30 128 111 | The signal colour: primary action, selection, focus, links |
| Corpafly Black | `#050301` | 5 3 1 | Ink: headlines, text, the F |
| White | `#FFFFFF` | 255 255 255 | The main surface |

**Proportion.** Roughly 80% white and glass neutrals, 15% black, 5% teal. Teal is a signal, never a large background behind body text. This is the lesson of every owned brand colour: use it so consistently, and so sparingly, that it means "act here".

**Teal ramp** (OKLCH, hue 178, for states, tints and dark surfaces)

| 50 | 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|
| `#EFFAF7` | `#DEF2ED` | `#BCE5DB` | `#8DCDBE` | `#58AA98` | **`#1E806F`** | `#106A5B` | `#045448` | `#013F35` | `#022B24` | `#021814` |

**Glass neutrals.** Cool greys with a trace of the teal hue, like the green edge of a sheet of float glass.

| 0 | 25 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `#FFFFFF` | `#F9FCFB` | `#F3F7F6` | `#E9EEED` | `#DADFDE` | `#C3C9C7` | `#9CA3A1` | `#777D7C` | `#595F5D` | `#414645` | `#2A2F2E` | `#171C1B` | `#0A0E0D` |

**Product strap colours** (for swatches and code-built visuals only, never for UI)

| Black | Blue | Green | Red | Yellow | Purple |
|---|---|---|---|---|---|
| `#1F1F1F` sampled | `#1E45A8` sampled | `#1F7A45` approx. | `#C42B2B` approx. | `#F2C12E` approx. | `#5E2D8C` approx. |

"Approx." colours get replaced by values sampled from real photos once they exist.

**Legacy.** The Amazon store's dark petrol `#022330` and bright blue `#148AB2` are not part of the system. Teal 950 and the dark neutrals replace them.

**Contrast rules (WCAG 2.2 AA)**

| Pair | Ratio | Use |
|---|---|---|
| Black on white | 20.6:1 | All text |
| White on teal 500 | 4.8:1 | Button labels |
| Teal 500 on white | 4.8:1 | Links on pure white only |
| Teal 600 on neutral 50 | 6.0:1 | Teal text on any tinted surface |
| Neutral 600 on neutral 50 | 6.0:1 | Muted text. Neutral 500 is for large text only (4.3:1) |
| Teal 300 on neutral 950 | 11.2:1 | Teal text on dark |
| White on neutral 950 | 19.4:1 | Text on dark |

- Never put teal text on glass. Teal 500 on black is 4.3:1: large text only.
- **Swatches always carry a hairline ring.** Yellow is 1.7:1 against white and black disappears on dark. Every swatch also shows its colour name.

---

## 3. Type

**Wordmark:** Antipasto Pro Hairline, outlined in the logo files only. It is a commercial font and is not used for text.

**Site type: one family per direction until Gate 1 picks.** All are SIL Open Font License 1.1, self-hosted as WOFF2 (licence files in `prototypes/shared/fonts/`).

| Direction | Headlines and UI | Numbers and labels | Why |
|---|---|---|---|
| A, Clear Sleeve | Instrument Sans | Fragment Mono | Neutral, precise grotesk with a width axis for dense UI; a quiet mono makes prices read like a spec |
| B, Diamond Grid | Archivo, expanded 125% for display | Martian Mono | Light expanded capitals echo the wide, thin wordmark; mono labels read like a datasheet |
| C, Order Desk | Hanken Grotesk | Hanken Grotesk (its digits are tabular by default) | Crisp, legible grotesk; equal-width digits so totals align and update cleanly; a plain zero (Atkinson Hyperlegible was tried and dropped: its slashed zero made prices read like code) |

Not used, on purpose: Inter and Space Grotesk (the default look), Geist (the default of AI site builders), Mona Sans, Red Hat and IBM Plex (other companies' identity faces), Fontshare fonts (their licence bans subsetting and redistribution).

**Rules for every direction**

- Sentence case for headlines and buttons. Uppercase only for short labels, tracked +6 to +8%.
- Headlines tight (line height 1.0 to 1.1, tracking about -2%); body 16 to 18 px at 1.5.
- Prices use tabular figures. The price per lanyard always looks the same everywhere: same face, same position after the pack price.
- Type scale (fluid from 390 to 1440 px): 12, 14, 16, 18 to 20, 22 to 28, 28 to 44, 36 to 68, 44 to 96 px.
- One typeface family plus its mono. No third family.

---

## 4. Glass

Glass is the brand's material: a clear, frosted surface with a bright edge, used on the parts of the interface that frame and control the page.

**Allowed:** header and navigation, the mobile menu, the cart drawer, product quick-view, a hero overlay, a sticky buy bar, one focal card per screen (for example the badge in Direction A).

**Never:** behind paragraphs, price tables, forms or long lists; on the logo; glass inside glass; more than three glass layers on screen.

**Recipe**

| Property | Light glass | Dark glass |
|---|---|---|
| Blur | 16 px (12 px under 768 px; 24 px for drawer and quick-view) | Same |
| Saturation | 150% | 150% |
| Tint, chrome over known content | white 56% | ink `#050301` 50% |
| Tint, any text over scrolling content | white 72% minimum | ink 64% minimum |
| Rim | 1 px white 55% | 1 px white 14% |
| Hairline (separates glass from white pages) | 1 px ink 6% | none |
| Top highlight | inset 0 1px 0 white 70% | inset 0 1px 0 white 12% |
| Shadow | 0 8px 24px ink 8% | 0 8px 24px ink 18% |
| Corner radius | 12 to 26 px, concentric with what it holds | Same |

The tint floors are measured worst cases: 72% white keeps black text above 4.5:1 even when pure black scrolls behind it.

**Behaviour**

- The header starts at chrome tint and rises to the text tint over the first 80 px of scroll, so content sliding under it never hurts legibility.
- The blur radius never animates. Glass moves only by transform and opacity.
- Open drawers lock page scroll, so the glass is not repainted every frame.
- Refraction or lens effects are drawn into the artwork, never computed live. Live SVG refraction works in one browser engine and costs about a third of the frame budget.

**Fallbacks, in order**

1. Live glass.
2. 94% solid white or ink where `backdrop-filter` is missing.
3. Solid white with an ink border when the user asks for more contrast or less transparency.
4. System colours in forced-colours mode.

**Budget.** Scrolling glass under about 10% of the screen. A glass header held 59 fps in testing; glass over a third of a phone screen fell to 33.

---

## 5. Motion

Motion explains and confirms. It never decorates.

| Token | Value | Use |
|---|---|---|
| Press | 100 ms | Buttons scale to 0.98 |
| Quick | 160 ms | Hover, small state changes |
| UI | 240 ms | Menus, popovers, price changes |
| Panel | 320 ms in, 200 ms out | Drawers, quick-view |
| Enter | 480 ms | First-view reveals |
| Hero | 800 ms | The one hero product moment |
| Standard ease | `cubic-bezier(.2, 0, 0, 1)` | State changes |
| Entrance ease | `cubic-bezier(.05, .7, .1, 1)` | Things arriving |
| Exit ease | `cubic-bezier(.3, 0, .8, .15)` | Things leaving |
| Spring | `linear()` with one soft overshoot | The hero moment only |

**What moves**

- The hero product moment, once per visit, about 800 ms.
- Press and hover feedback.
- Drawers and menus.
- First-view reveals: rise 12 px and fade, 40 ms apart, four items at most.
- Price and quantity changes.
- Scroll-linked explanations, such as the clasp separating as you read about it.

**What never moves:** body text, the logo, prices while you read them, anything on a loop. No parallax, no autoplay video, no scroll-jacking, no animated blur.

**Reduced motion.** Everything lives inside `prefers-reduced-motion: no-preference`. Users who ask for less motion see final states, with fades of 150 ms or less. Content is always visible without JavaScript.

**Build.** CSS transitions, scroll-driven animations (now in every engine), `@starting-style`, view transitions and the Web Animations API. No motion library.

---

## 6. Photography and product imagery

**Style**

- **The product as an object.** Lanyards on cool, light neutral surfaces in soft daylight, with real shadows. No props that compete, no colour casts.
- **One angle per shot type, for every variant.** The same framing, scale and light for all 14 variants, so only the colour or pack changes.
- **Hardware in macro.** J-hook, swivel, crimp, weave and the break-away clasp, sharp, with exact captions.
- **Real use.** Badges on lanyards in real offices, schools, event check-ins and cruise terminals. People are busy, not posing. No laptop-smile stock images.
- **No branded boxes.** Orders ship in plain boxes; never show packaging that implies otherwise.

**Until photos exist.** The code-built lanyard (`prototypes/shared/lanyard.js`) is the official stand-in. It draws every colour identically with a woven strap, metal crimp, swivel J-hook and clasp. Existing photos are used only as crops (`brand/assets/web/`). Green, red, yellow and purple are never shown as recoloured photos.

**Photo brief for the first shoot**

| # | Shot | Spec |
|---|---|---|
| 1 | Hero per variant: each pack size and colour, loosely coiled, same angle | Seamless neutral 100 background, 4:5 and 1:1, 4000 px+, plus a transparent cut-out |
| 2 | Bundle shots: 25, 50 and 100 packs side by side, so the volume difference is visible | Top-down, same scale |
| 3 | Macro: J-hook, swivel and crimp; weave texture per colour; break-away clasp closed and open | 100 mm macro, f/8 or deeper |
| 4 | Break-away sequence: worn, pulled, released, in three frames | Locked-off camera, same light |
| 5 | In use: office reception badge; teacher with colour-coded class lanyards (adults, or children only with signed consent and no identifiable faces); event check-in table with colour groups; cruise card on a lanyard | Natural light, real locations |
| 6 | Video: a 6 to 10 second clip of the clasp releasing, and one of a pack being opened | Silent, user-started on site, never autoplay |

Colour accuracy matters: shoot a grey card in every setup and sample strap colours from the raw files to replace the approximate swatch values.

---

## 7. Iconography

- **Phosphor** (MIT), Light at 20 px and above, Regular below, drawn in `currentColor` at 1.25em.
- **Functional only:** cart, account, menu, close, plus, minus, chevrons, play, copy, search.
- Every icon button has a text label or an accessible name.
- Product pictograms (J-hook, clasp) are drawn on the same 256-unit grid when needed.
- **Never** icons as section markers, icon rows that stand in for real information, or emoji. The old "six round icons" strip is retired.

---

## 8. Voice and copy

**Plain, direct, confident.** Short sentences. Numbers as digits. No filler, no hype, no em dashes. US English on the site (color, center), because every buyer is in the US.

**Write like this**

- "Lanyards in packs of 25, 50 and 100. Every price shown per lanyard."
- "The clasp at the neck releases when the strap is pulled."
- "Ships from US warehouses."
- "No reviews yet. Reviews from verified buyers will appear here."

**Not like this** (from the old Amazon store)

- "Unlock a world of convenience with Corpafly's top-notch lanyards" becomes "Lanyards in bulk, priced per lanyard."
- "Elevating Convenience. Designed with meticulous attention, these lanyards offer a sleek solution to daily inconveniences" becomes "Black lanyards, 100 to a pack. Flat polyester strap, swivel metal J-hook."
- "Transform mundane hassles into engaging stories of simplicity" becomes nothing. Cut it.

**Never use:** elevate, seamless, unlock, top-notch, world-class, best-in-class, effortless, curated, solutions, innovative, journey, passionate, "we've got you covered", "game-changer".

**Formats**

| Thing | Format |
|---|---|
| Price | `$26.87` |
| Price per lanyard | `$0.27 per lanyard`; `$0.27 each` where space is tight. Rounded half up to whole cents |
| Pack | `100 pack` |
| Products | `Lanyard`, `Break-Away Lanyard`. In running text: "break-away" |
| Colours | Capitalised names: Black, Blue, Green, Red, Yellow, Purple |
| Unknowns | "To confirm" (never a guessed number) |

**Truth rules**

- No reviews, ratings, testimonials, customer logos, badges, stock counts or "people bought this".
- No delivery promises until shipping speeds are confirmed.
- Savings only when real, within one product line, from current prices.
- No Amazon names, marks or reviews.

---

## 9. Patterns the brand repeats

- **The price block:** pack price, then price per lanyard in the mono face, then the pack size. Same order everywhere.
- **The pack selector:** visible buttons, each showing its count and price per lanyard. Never a drop-down.
- **Swatches:** a ringed dot plus the colour name. Only colours that exist for the selected pack.
- **The trust row:** "Secure checkout by Shopify" · "Ships from US warehouses" · "CORPAFLY LLC, Texas" · "Questions? Contact us".
- **Empty states:** say what will appear and when, in one line.
- **Placeholders:** a dashed amber tag reading "Placeholder price" or "To confirm", so nothing unconfirmed passes as fact.
