# Phase 1 research report

27 October 2026. Synthesis of five parallel research streams. Each stream file has the full findings and every source link:

| Stream | File |
|---|---|
| 1. Glass and motion on the web | [`01-glass-motion.md`](01-glass-motion.md) |
| 2. Best e-commerce experiences across industries | [`02-ecommerce-references.md`](02-ecommerce-references.md) |
| 3. Tools and resources, with licences | [`03-tools-resources.md`](03-tools-resources.md) |
| 4. Shopify theme foundations | [`04-shopify-foundations.md`](04-shopify-foundations.md) |
| 5. Bulk-buying UX | [`05-bulk-ux.md`](05-bulk-ux.md) |

## Executive summary

1. **Glass belongs on chrome only, and it is cheap only when small.** In a proxy test, a glass header held 59 fps; glass over 38% of a phone screen fell to 33 fps. Cost tracks glass *area*, not blur radius. Keep scrolling glass under about 10% of the screen, never nest it, never animate the blur. [01]
2. **Legible glass has hard numbers.** Ink text needs at least 72% white tint behind it, white text at least 62 to 64% ink tint, to pass 4.5:1 over the worst background. Apple's own Liquid Glass shipped too clear and has been made frostier twice since 2025. [01]
3. **No runtime refraction, no WebGL.** `backdrop-filter: url()` refraction renders only in Chromium and costs about a third of the frame budget; WebGL glass libraries rasterise the page. Bake any lens effect into artwork and put plain blur on top. [01]
4. **Native CSS now covers all of Corpafly's motion.** Scroll-driven animations reach every engine with Firefox 159 (27 Oct 2026); same-document View Transitions, `@starting-style` and `linear()` springs are everywhere. GSAP is free but proprietary and revocable, and 45 KB. Ship no motion library. [01, 03]
5. **Premium stores change one thing at a time.** Identical renders across variants, specs printed in a fixed order, honest price architecture, guided choice, and restraint in chrome and colour. Award-site spectacle suits one hero moment, never the buy flow. [02]
6. **Lanyard competitors are easy to beat on clarity:** promo-code banners, "was" prices next to every price, part-number product names, per-pack and per-lanyard prices mixed, colours split across listings, vague "breakaway" claims. [02, 05]
7. **Price per lanyard is Corpafly's strongest true claim.** Baymard finds 86% of sites omit unit prices on multi-packs, and almost no lanyard seller shows it. Show it beside every pack price, computed with decimal division (Liquid's integer division turns $0.2687 into $0.26). [05]
8. **The buy path is three taps for a repeat buyer:** pack, colour, Shop Pay. Visible pack buttons and named swatches, never drop-downs; a pack stepper; mixed colours as rows added in one cart call; a sticky add bar; a glass cart drawer with wallet buttons. [05]
9. **Trust means only checkable facts:** Shopify checkout, ships from US warehouses, CORPAFLY LLC in Texas, confirmed specs. The FTC rule in force since Oct 2024 bans fake reviews, so reviews render nothing until real ones exist. [05]
10. **Theme base: Shopify's Skeleton theme v1, pinned to commit `a4f32d3`, with Dawn 16 as the reference for cart logic.** It ships 0 KB of JavaScript, theme blocks and a clean Theme Check config. Horizon carries about 156 KB of gzipped JavaScript and a licence that forbids publishing derived themes off-platform, which clashes with this public repo. [04]

## Findings

### 1. Glass and motion

- **What Apple's Liquid Glass teaches, after a year of fixes.** Glass sits on the navigation layer only, never in content, never glass on glass, and colour goes only on the primary action. After legibility complaints, iOS 26.1 added a Tinted option and iOS 27 a clarity slider. For the web: frosted by default, more opaque once content scrolls under, hairline edges. Leave the live lensing and elastic morphing behind.
- **Recipe adopted** (now in `prototypes/shared/tokens.css`): blur 16 px (12 px on phones, 24 px for drawers), saturation 150%, 56% white tint for chrome over known content, 72% wherever text sits over scrolling content, 1 px light rim, 6% ink hairline, inner top highlight. Solid-first fallback: 94% white without `backdrop-filter`; solid with an ink border under `prefers-contrast: more` (Safari ignores `prefers-reduced-transparency`, so contrast is the setting that reaches iPhone users); system colours in forced-colours mode.
- **Motion tokens adopted:** 100 ms press, 160 ms hover, 240 ms UI, 320 ms panels (out 200 ms), 480 ms first-view reveals, 800 ms for the one hero moment; Material's standard curve `cubic-bezier(.2,0,0,1)` plus decelerating entrance and accelerating exit curves. Transform and opacity only; reveals rise 12 px with a 40 ms stagger; no parallax, loops or autoplay. Reduced motion shows final states and short fades.
- **Cross-document View Transitions** work in Chrome and Safari, so page-to-page transitions in the Shopify theme are a free enhancement.

### 2. What premium stores do

- **Variant discipline** (Apple Watch bands, NOMOS): every option shot the same way, and only real combinations offered. For Corpafly: identical renders of all 14 variants, and the break-away 25 pack's six colours never shown on the 50 or 100 pack.
- **Specs as design** (Arc'teryx, Field Notes, Peak Design, Teenage Engineering): exact numbers in the same order on every product. In 2026 the same structured data also feeds AI shopping agents through Shopify.
- **Honest price architecture** (Bombas, Who Gives A Crap, Sticker Mule, MOO): pack savings and unit price in plain view; no MSRP strike-throughs, pop-ups or countdowns (Asket, McMaster-Carr).
- **Guided choice** (The Ordinary's regimen builder, Branch's headcount tools for office managers): a short finder that turns "230 people, kids, three groups" into a pack mix.
- **One owned colour as a signal** (Tiffany): teal on actions, selection and focus; surfaces stay white, glass and black.
- **Wrong for Corpafly:** model-led editorial, WebGL try-ons, founder imagery, joke copy, quirky tech styling, warm amber palettes.

### 3. Tools and licences

- **Fonts:** every Google Fonts candidate is SIL OFL 1.1 and can be self-hosted. Avoid faces that are another company's identity (Geist, Mona Sans, Red Hat, IBM Plex) and Fontshare's ITF licence, which bans subsetting and redistribution, a problem for a public repo. Pangram Pangram is personal-use only.
- **Picked for the prototypes:** Instrument Sans with Fragment Mono; Archivo (width axis) with Martian Mono; Atkinson Hyperlegible Next with its Mono. All OFL, licence files in `prototypes/shared/fonts/`.
- **Icons:** Phosphor (MIT), functional icons only. Remix Icon changed to a restrictive licence in Jan 2026; Lucide and Heroicons carry the default shadcn and Tailwind look.
- **Components:** shadcn, Radix, Magic UI and friends need React: ideas only. Origin UI moved to AGPL-3.0. Horizon's web components are the best code source, licensed for Shopify themes.
- **AI and design tools:** none output Liquid except Shopify's own. Sidekick can generate theme blocks where sections accept `@theme` blocks; Canvas edits make a theme non-downloadable, so duplicate first.
- **Image clean-up:** rembg's default model needs a paid licence; use BiRefNet (MIT) or U2-Net (Apache-2.0). Only the Real-ESRGAN and HFA2k upscalers are commercially usable.

### 4. Shopify foundations

- **Skeleton v1 is the right base** for a fully custom design: JSON templates, header and footer section groups, theme blocks, no JavaScript, 2.4 KB of CSS. Do not use Skeleton `main`: since 1 Oct 2026 it is a block-first release candidate that only runs on preview stores.
- **Dawn 16** (Aug 2026) is the reference for cart drawer, quantity rules and price-per-item logic; its licence allows porting parts with credit.
- **Platform facts that shape the build:**
  - Variants: two options, Pack size and Colour. Treat a missing combination as "not made", not "sold out".
  - Price per lanyard: computed by the theme from a variant metafield (`custom.units_per_pack`).
  - Colour settings: use the new `color_palette` setting (Jun 2026) for brand colours.
  - Accounts: put `<shopify-account>` in the header. Legacy customer accounts are deprecated.
  - Cart events: Shopify's standard storefront events and actions let apps refresh the cart drawer without a reload.
- **Not available on Basic for retail buyers:** combined listings (Plus), quantity rules and volume pricing (B2B companies only). Retail tiers, if wanted, are automatic discounts with a minimum quantity.
- **Import zip:** only `layout/theme.liquid` is required; standard folders only; 50 MB zip, 256 KB per Liquid file. Package with `shopify theme package` after Theme Check is clean.
- **Performance rules:** first-paint CSS and fonts above `content_for_header`; at most 10 preloads; the LCP image must be a real eager `<img>` with high fetch priority, never a CSS background; self-hosted WOFF2 or Shopify's font library, never Google Fonts at runtime.

### 5. Bulk-buying UX

- **Buy box at 390 px, top to bottom:**
  1. Title and one confirmed spec line.
  2. Pack price with "$0.27 per lanyard" beside it.
  3. A 48 px pack segmented control showing per-lanyard prices.
  4. 44 px named swatches.
  5. A pack stepper with a live line ("2 packs · 200 lanyards · $53.74").
  6. "Mix colours" rows.
  7. Full-width Add to cart and the wallet button.
  8. The trust row, then the break-away explainer and specs.
- **Savings shown only when true:** within one product line, from real current prices, rounded down, and only at 5% or more. Compare-at prices must be genuine former prices (16 CFR 233.1).
- **Reorder:**
  - New customer accounts show "Buy again" by default.
  - Cart permalinks (`/cart/ID:QTY,...`) let the drawer offer "Copy order link", useful when an office manager needs approval.
  - A permalink "Order the same again" can go in shipping emails.
- **Mobile checkout:** a cart drawer with wallet buttons, plus a `/cart` page that works without JavaScript. Extra costs are the top abandonment reason, so offer a ZIP shipping estimate. Keep delivery-date promises off until shipping speeds are confirmed.

### Where the streams disagree

- **Native unit pricing.** Stream 4 quotes shopify.dev: native unit prices are "available only for stores located in the EU or Switzerland". Stream 5 quotes an Oct 2025 changelog saying unit pricing went global. **Decision:** the theme computes price per lanyard from a variant metafield. That works either way, and it can read `variant.unit_price` if Muneeb turns the native feature on.

## Top 15 references

Ideas only. Never assets, code or copy.

| # | Reference | Industry | What Corpafly borrows |
|---|---|---|---|
| 1 | [Apple Store, Watch bands](https://www.apple.com/shop/watch/bands) | Consumer tech | Identical renders for every variant; only valid combinations offered; glass only on the nav and buy bar |
| 2 | [NOMOS Glashütte](https://nomos-glashuette.com/en/store/watches) | Watches | Type-led grid and white space; colour filters as named chips |
| 3 | [Tiffany & Co.](https://www.tiffany.com/) | Jewellery | One owned colour used as a signal: teal on actions, selection, focus |
| 4 | [Arc'teryx](https://arcteryx.com/us/en/shop/mens/alpha-jacket-0932) | Technical apparel | The same spec block, in the same order, on every product |
| 5 | [Peak Design](https://www.peakdesign.com/products/anchor-4-pack) | Tech accessories | Hardware as hero: macro detail of the J-hook and clasp, ratings as numbers |
| 6 | [Field Notes](https://fieldnotesbrand.com/products/pitch-black-memo-book) | DTC stationery | Cheap utility sold in packs; specs used as decoration |
| 7 | [Mejuri](https://mejuri.com/support/gold-vermeil-jewelry) | Jewellery | One plain explainer page for the hero feature: "How break-away works" |
| 8 | [The Ordinary](https://theordinary.com/en-us/regimen-builder.html) | Beauty | A three-question finder that returns a type, pack mix and colours |
| 9 | [Branch](https://www.branchfurniture.com/pages/for-teams) | Office furniture | Built for office managers: headcount to order in one tap |
| 10 | [Bombas](https://shop.bombas.com/collections/mens-pack-discounts) | Premium DTC | Real pack savings stated under each pack option |
| 11 | [Who Gives A Crap](https://us.whogivesacrap.org/products/premium-100-bamboo-toilet-paper-double-length-rolls) | Bulk DTC | Unit price on cards, product page and cart; bulk box as the hero |
| 12 | [Asket](https://www.asket.com/us/transparency) | Fashion | Stable prices, no strike-throughs, a "what's in the pack" panel |
| 13 | [Sticker Mule](https://www.stickermule.com/uses/photo-stickers) | B2B print | Quantity rows with total and price each; a fast, opinionated flow |
| 14 | [MOO](https://www.moo.com/us/business-cards/original) | B2B print | Clear tiers and a Reorder section in the account |
| 15 | [McMaster-Carr](https://www.mcmaster.com/products/badge-holder-lanyards/) | Industrial supply | Speed and certainty: no banners, pop-ups or carousels; spec tables |

Runners-up in stream 2: Aesop (sizes as plain text), Baltic and Christopher Ward (straps as products), USM (colour as a system), Teenage Engineering (datasheet precision), Uline (visible tiers, a competitor).

## Recommended theme base

**Shopify Skeleton theme v1, pinned to commit `a4f32d3` (26 Feb 2026), with Dawn 16 as the reference for commerce logic.**

| | |
|---|---|
| Why | The design is fully custom, so a base's CSS and markup add cost, not value. Skeleton is Theme Check clean and ships no JavaScript, which leaves the whole performance budget for glass and motion. With 2 products and 14 variants, the commerce code is small |
| Keep from Skeleton | Folder layout, `theme.liquid` shell, header and footer section groups, meta-tags, image and css-variables snippets, `<shopify-account>`, locales, Theme Check config |
| Port from Dawn (credited) | Cart drawer with Section Rendering updates, add-to-cart errors, quantity-rule and price-break Liquid, focus trap, `<details>` menus |
| Build new | Tokens and `color_palette`, glass header and mobile nav, hero, product section with static blocks (gallery, title, price per lanyard, pack and colour picker, quantity, buy buttons, break-away explainer, specs, `@app` reviews), quick-view dialog, collection, cart drawer and page, About, FAQ, Contact, 404, password |
| Skip | Horizon (JavaScript weight, off-platform licence clause), Skeleton `main`, predictive search (two products), localisation, combined listings |
| Risks | More to build than on Dawn: mitigated by porting Dawn's patterns and reusing prototype CSS. Skeleton v1 receives no further updates: low impact once forked. Keep Shopify's licence notice in `theme/LICENSE.md` |

## Facts needed from Muneeb

These are rendered as "To confirm" or "Placeholder" in every prototype until answered:

1. Real prices for all four pack sizes, and whether any volume tiers exist.
2. Lanyard length and strap width; break-away release force, if tested.
3. Shipping speeds and rates once Amazon MCF is set up; returns policy.
4. Photos of green, red, yellow and purple straps and of the break-away clasp; the product video file.
5. Whether the stock-style office photos in the Amazon banners are licensed for the website.

## Method and limits

- Sources are primary wherever possible: Apple docs and WWDC sessions, MDN compatibility data, Shopify's GitHub repos and LICENSE files, the shopify.dev docs index, Baymard, NN/g, the FTC and NIST.
- **The network policy blocked direct page loads for several streams**, so those streams verified facts through search extracts and Shopify's docs index. Claims that could not be confirmed are marked *(unverified)* in the stream files. The visual claims about reference sites should be checked by eye.
- The glass cost figures come from a headless Chromium proxy test (software GPU). The ratios hold; the absolute numbers need a check on a real mid-range Android phone in Phase 2 and Phase 4.
