# 05 · Bulk-buying UX

Stream 5, 27 Oct 2026. Direct page loads were blocked in this session, so facts come from search extracts of primary pages and Shopify's docs index. "(unverified)" means re-check live.

## 1. Summary

1. Show pack and colour as visible buttons and named swatches, never drop-downs. Three packs and six colours fit on a phone.
2. Price per lanyard is our strongest true claim, and almost no lanyard seller shows it. Put it beside every pack price.
3. Shopify unit pricing went global on 2 Oct 2025. B2B volume pricing reached Basic on 2 Apr 2026 for B2B company accounts only, so public tiers use automatic discounts.
4. Mixed colours: colour rows with steppers, added in one call. Since 27 Feb 2026 the product-page wallet button can carry them too.
5. Reorder via native "Buy again" and cart permalinks. The trust row carries checkable facts only. Reviews stay hidden until real ones exist.

## 2. Findings

### 2.1 Pack and colour selection
- Baymard: users overlook drop-downs and find unavailable options only after opening them. Drop-downs fit poorly under 5 options. NN/g: radio buttons show every choice in one tap.
- Pack is a segmented radio group. Colour uses swatches with visible names (colour alone fails WCAG 1.4.1) and a 3:1 selected ring (1.4.11), under the legend "Colour: Blue".
- There are two unavailable states. `product_option_value.variant` is nil when a combination does not exist (Yellow 100-pack): show "25-pack only". `available` is false when sold out: show a strike plus "Sold out".
- Targets: WCAG 2.2 AA requires 24 × 24 px (SC 2.5.8); design to 44 px. Phone grips vary (Hoober), so keep the main button full width and low.
- Sticky add to cart: vendor A/B tests show both gains and revenue drops, and I found no primary Baymard guideline. Use a slim bar that appears once the main button scrolls away.
- Collections: one card per product with colour dots. Baymard 2026: 42% of mobile sites fail this.

### 2.2 Price per unit
- Baymard (2023): 86% of sites omit price per unit on multi-quantity items. Show it next to the total, smaller, never instead of it.
- NIST Handbook 130 allows unit prices under $1 in whole cents or tenths, used consistently. Few states require unit pricing, but shown prices must be accurate (Walmart paid New Jersey $1.64M in 2024).
- Shopify's 2 Oct 2025 changelog adds "price per quantity" ("$2.99 each") in all countries, shown through to checkout and order emails. The Storefront API lists an `ITEM` unit. Themes read `variant.unit_price`. The US admin flow is unverified.
- Fallback: a variant metafield `custom.pack_count`. Trap: integer `divided_by` rounds down, so 2687 ÷ 100 renders $0.26.
- Show "Save X%" only within one product line, from real current prices. Compare-at must be a genuine former price (16 CFR 233.1).

### 2.3 Quantity tiers and mixed colours
- Native on Basic: automatic discounts with a minimum quantity, up to 25 active including app discounts. The best eligible one applies. Tiers should count packs across colours (re-test in admin).
- Shopify Functions run on any plan via public App Store apps; custom-app Functions stay Plus-only.
- B2B on Basic since 2 Apr 2026: 3 catalogs, volume pricing, payment terms and US ACH, for buyers set up as companies only. Useful later for a school district wanting terms.
- Shopify's Quick order list is documented for B2B, and whether ordinary visitors see it is unverified. Our own grid needs only `/cart/add.js` with an `items` array.
- Product-page wallets accept extra variants via `shopify-additional-items[i][id|quantity]` (27 Feb 2026).
- Liquid cannot read discount settings, so keep tier copy in one metaobject and let the cart show the applied discount.

### 2.4 Quick reorder
- New customer accounts show "Buy again" on orders by default, and the theme cannot edit it. Legacy accounts closed to new stores on 26 Feb 2026.
- Cart permalinks: `/cart/ID:QTY,ID:QTY`, with optional `discount=CODE`, `storefront=true` (opens the cart) or `payment=shop_pay`. They cannot bypass the store password.
- Theme additions: "Copy reorder link" in the drawer (office managers forward orders to approvers), and an "Order the same again" permalink in the shipping email (test in preview).
- Shop Pay: Shopify claims up to 50% higher conversion than guest checkout, from its own 2023 study.

### 2.5 True trust signals
- Baymard 2026: cart abandonment averages 70.22%. Top causes are extra costs (about 40%), slow delivery (about 20%) and card-trust worries (about 19%), quoted secondhand.
- True today:
  - checkout runs on Shopify, which is PCI DSS Level 1 certified
  - payment icons come from `shop.enabled_payment_types`
  - CORPAFLY LLC is a Texas company, and orders ship from US warehouses
  - specs from the brief: flat polyester strap and swivel metal J-hook (standard); break-away clasp that releases under pull
- Leave out length, width and release force until confirmed.
- FTC rule 16 CFR 465 (from 21 Oct 2024) bans fake or AI-written reviews and testimonials, bought reviews and review suppression. Reviews sit in a theme app block that renders nothing at zero.

### 2.6 Mobile checkout speed
- `{{ form | payment_button }}` renders one dynamic wallet button on the product page. `content_for_additional_checkout_buttons` renders all enabled wallets in the drawer. Style them only via Shopify's CSS properties (height 25–55 px, radius); a closed shadow DOM blocks the rest.
- Use the drawer for speed, with a `/cart` page as the no-JavaScript fallback. Baymard: confirmations should show the added item and clear next steps.
- The Ajax API estimates real shipping by ZIP (`prepare_shipping_rates`). Baymard prefers delivery dates to speeds (41% of checkouts show none). Keep that module off until MCF speeds are confirmed.

### 2.7 Competitor scan (search extracts, not inspected live)

| Site | Seen | Borrow | Beat |
|---|---|---|---|
| Uline | 24/pack; per-pack price falls at 5 and 10 packs; "snaps apart under stress" | Tier table, plain clasp line | No per-lanyard price |
| Staples | "25/Pack" titles; a listing per colour; IDville ≈ $1.61 each | Pack in title | Split colours |
| Grainger (CA) | "PK10"; "your price may be different" | Pack code | Price doubt |
| ID Card Group | 10–12 colours; MSRP strike-through; code banner | Colours on one page | Anchoring |
| MyBinding | Page per colour; "Starting at" | Nothing | Split colours |
| Wristbands.com | 100 minimum; nine colours, one page | Single page | "Pricing may vary" |
| ID&C Band | "From $0.30 per lanyard" headline | Per-unit headline | Code banners |
| Specialist ID | White-only 100-pack, other colours in 25s | Our pack shape | Not checked |

McMaster-Carr: no data.

## 3. Corpafly product page and cart spec

### Buy box at 390 px, top to bottom
1. Title and one confirmed spec line, such as "Break-away clasp · J-hook".
2. Pack price, large, with "$0.27 per lanyard · 100 lanyards" beside it. Add a "Save X% vs 25-pack" chip only when true.
3. Pack size: a 48 px segmented control, each segment showing count and per-lanyard price (static text for a single size).
4. Colour: 44 px named swatches for the colours made in that pack, plus the link "4 more colours in the 25-pack".
5. Packs: a 44 px stepper with a live line, "2 packs · 200 lanyards · $53.74".
6. A "Mix colours" link that turns the swatches into colour rows with steppers.
7. Add to cart: full width, 52 px, "Add to cart · $53.74".
8. Dynamic wallet button, carrying any extra colour rows.
9. Trust row.
10. Accordions (break-away explainer, specs), then reviews (hidden at zero).

Once item 7 leaves view, a sticky bar shows "Black · 100-pack × 2 · $53.74 [Add]". A repeat buyer needs three taps: pack, colour, Shop Pay.

### Price per unit
- Source: Shopify's unit price where set, otherwise `custom.pack_count`.
- `{% assign pu = variant.price | times: 1.0 | divided_by: pack_count | round %}{{ pu | money }} per lanyard` turns $26.87 ÷ 100 into $0.27. Round half up to whole cents, site-wide.
- Savings = 1 − (unit ÷ smallest-pack unit), same line only, rounded down, shown at 5% or more. The standard lanyard (one pack size) never shows a chip.
- Cart line: "2 × Black 100-pack · $0.27 per lanyard". Footer: "400 lanyards".

### Multi-colour pattern
- Rows: swatch, name, pack price and stepper. All start at 0 except the selected colour.
- Summary: "6 packs · 150 lanyards · $X". One button makes one `/cart/add.js` call, and a 422 error shows on its row.
- The same rows feed `shopify-additional-items` for the wallet button.
- Stepper labels read like "Blue, packs", and an `aria-live` region reads the totals.

### Cart drawer
Lines with per-unit price and a stepper, real discount lines, subtotal, a ZIP shipping estimate (or "Shipping calculated at checkout"), Check out, wallet buttons and "Copy reorder link".

### Trust row (true claims only)
"Secure checkout by Shopify" · "Ships from US warehouses" · "Returns: see policy" (once written) · "Questions? Contact us". No badges, seals, stock counts or delivery promises.

## 4. Sources

- Baymard: [Size buttons](https://baymard.com/blog/use-buttons-for-size-selection) · [Drop-downs](https://baymard.com/blog/drop-down-usability) · [Unit price](https://baymard.com/blog/price-per-unit) · [Mobile 2026](https://baymard.com/blog/mobile-ux-ecommerce) · [Abandonment](https://baymard.com/lists/cart-abandonment-rate) · [Delivery date](https://baymard.com/blog/shipping-speed-vs-delivery-date) · [Cart confirmation](https://baymard.com/ecommerce-design-examples/added-to-cart-confirmation)
- UX: [NN/g dropdowns](https://www.nngroup.com/articles/dropdown-list/) · [Hoober](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php) · [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) · [Sticky A/B](https://cleancommit.io/ab-tests/mobile-bottom-sticky-add-to-cart-button/)
- Shopify changelogs: [Unit pricing](https://changelog.shopify.com/posts/unit-pricing-is-now-available-globally) · [B2B non-Plus](https://changelog.shopify.com/posts/key-b2b-features-now-available-on-non-plus-plans) · [Multi-variant](https://shopify.dev/changelog/posts/accelerated-checkout-now-supports-addons-from-the-product-page) · [Legacy accounts](https://shopify.dev/changelog/legacy-customer-accounts-are-deprecated) · [Buy again](https://changelog.shopify.com/posts/drive-repeat-orders-for-b2b)
- shopify.dev: [Unit pricing](https://shopify.dev/docs/storefronts/themes/pricing-payments/unit-pricing) · [ITEM unit](https://shopify.dev/docs/api/storefront/2026-10/enums/UnitPriceMeasurementMeasuredUnit) · [Option values](https://shopify.dev/docs/api/liquid/objects/product_option_value) · [Cart API](https://shopify.dev/docs/api/ajax/reference/cart) · [Wallets](https://shopify.dev/docs/storefronts/themes/pricing-payments/accelerated-checkout) · [Multi-product](https://shopify.dev/docs/storefronts/themes/pricing-payments/accelerated-checkout/multiple-product-checkout) · [Permalinks](https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks) · [Functions](https://shopify.dev/docs/apps/build/functions) · [Accounts](https://shopify.dev/docs/apps/build/customer-accounts)
- Shopify: [Automatic discounts](https://help.shopify.com/en/manual/discounts/automatic-discounts) · [Combinations](https://help.shopify.com/manual/discounts/discount-combinations) · [Quick order](https://help.shopify.com/en/manual/b2b/theme-code/quick-order-list) · [Security](https://www.shopify.com/security) · [Shop Pay](https://www.shopify.com/enterprise/blog/shopify-checkout)
- Law: [FTC rule](https://www.hoganlovells.com/en/publications/ftc-publishes-final-rule-banning-fake-consumer-reviews-and-testimonials) · [16 CFR 233](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233) · [NIST HB 130](https://www.nist.gov/document/2026-hb-130-section-iv-c) · [Walmart NJ](https://couponsinthenews.com/2024/06/20/walmart-is-penalized-1-6-million-over-confusing-prices/)
- Sellers: [Uline](https://www.uline.com/Product/Detail/S-13756BL/Badges-and-ID-Cards/Breakaway-Lanyard-Black) · [Staples](https://www.staples.com/idville-36-blank-flat-woven-breakaway-lanyards-with-j-hook-yellow-25-pack-1343500ylh31/product_206252) · [Grainger CA](https://www.grainger.ca/en/product/BREAKAWAY-LANYARD-16-IN-H-BLUE-PK10/p/GUS34GN51) · [ID Card Group](https://www.idcardgroup.com/lanyards/breakaway-safety/round-breakaway-braided-nylon) · [MyBinding](https://www.mybinding.com/collections/mybinding-lanyards-for-id-accessories) · [Wristbands.com](https://www.wristbands.com/products/breakaway-round-braided-1-8-lanyard-2137-100-pack) · [ID&C Band](https://idcband.com/lanyards) · [Specialist ID](https://www.walmart.com/ip/240294544)
