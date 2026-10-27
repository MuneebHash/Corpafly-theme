# 04 Shopify theme foundations (state at 27 Oct 2026)

Primary sources: Shopify's GitHub repos (LICENSE files, release notes, source), shopify.dev docs and changelog (read through Shopify's docs index), npm registry. shopify.dev and performance.shopify.com could not be opened directly; third-party figures are marked *unverified*.

## 1. Summary

1. **Recommendation: Skeleton theme v1 (JSON-template line), pinned to commit `a4f32d3` (26 Feb 2026), not `main`.** It is Shopify's recommended start for custom themes, ships 0 KB of JavaScript, and gives sections, section groups and theme blocks with nothing to strip.
2. Use **Dawn 16** (same licence) as the reference for commerce logic and port small parts with credit.
3. **Horizon 4.3** is the most capable, but it loads about 4x Dawn's JavaScript and trails Dawn on mobile. Its licence also bans making a derived theme available "via ... any off-platform channel", a problem for our public repo.
4. **Skeleton `main` switched on 1 Oct 2026** to a block-first model with no JSON templates. Its tags only run on developer-preview stores.
5. On a US Basic store, native unit pricing is EU/Swiss only, combined listings need Plus, and quantity rules are B2B-only. **The theme must compute price per lanyard itself.**

## 2. Comparison

| Base | Licence | Last release | Architecture | Ships with | Weight/perf | Custom work for Corpafly |
|---|---|---|---|---|---|---|
| **Dawn 16.0.0** | Modify, derive, sell, "only ... to develop themes that integrate or interoperate with Shopify" | 10 Aug 2026 (fix 22 Oct) | JSON templates, section groups, section-local blocks only (no `blocks/`), colour schemes, deferred custom elements | Cart drawer, predictive search, swatches, quick add, quick order list, quantity rules, volume pricing, price per item, recommendations, account popover | Product-page JS 144 KB raw / 39 KB gz, CSS 32 KB gz. Demo mobile PSI 71 to 82 *(unverified)* | High: rewrite about 80 KB of base CSS around Dawn's markup; no theme blocks |
| **Horizon 4.3.0** (family of 10) | Same grant, plus no "Derived Theme" may be offered "via ... any off-platform channel (including your own website...)"; delivery "solely for those merchants' own use" allowed | 13 Oct 2026 (monthly) | Nested theme blocks (8 levels), static blocks, `color_palette`, ES-module web components, DOM morphing | All of Dawn's, plus sticky add-to-cart, view transitions, fly-to-cart | 58 modules referenced site-wide: 545 KB raw / 156 KB gz; CSS 11 KB gz plus per-section CSS. Demo mobile PSI 52 to 63 *(unverified)* | Highest: restyle 95+ blocks, cut JS to reach 85+, lose upstream merges |
| **Skeleton v1** (`v1.0.0`, `a4f32d3`) | Same as Dawn (README badge says MIT; the text adds the Shopify-only clause) | v1.0.0 20 May 2025; `a4f32d3` 26 Feb 2026 | JSON templates, header/footer groups, `blocks/` (group, text), `theme-check:recommended` | Bare sections (select-based product form, cart, search, 404, password); `a4f32d3` adds `<shopify-account>` | 0 KB JS, 2.4 KB CSS | Build all UI; nothing to remove |
| **Skeleton v2 RC** (`main`) | Same | ported 1 Oct 2026 | Liquid templates with `{% block %}`/`{% partial %}`; no sections or JSON templates | Five demo blocks | Tiny | Unusable: needs the `liquid_july_26_changes` dev-store preview |

Weights are gzip -9 of the unminified source each base loads; the CDN minifies and uses Brotli, so real transfer is smaller. Field data *(unverified)*: about 91.5% of Dawn stores vs 88.3% of Horizon stores passed all Core Web Vitals in Oct 2026.

## 3. Findings

### OS 2.0 features to use
- **Theme blocks** (`{% content_for 'blocks' %}`) for flexible areas. **Static blocks** (`{% content_for 'block', type:, id: %}`) for fixed product parts; Muneeb can edit or hide them but not delete them. Limits: 50 blocks per section, depth 8, 300 block files. Sections that accept `@theme` also allow Sidekick-generated blocks.
- **Section groups** for header and footer only. **App blocks** (`@app`) in the main product section, ready for a reviews app.
- **LiquidDoc** (`{% doc %}`) on every snippet and block. Theme Check validates `render` arguments against it (`MissingRenderSnippetArguments`). `include` is deprecated.
- **`color_palette`** (17 Jun 2026): one grid of 2 to 20 brand colours that all colour settings reference. Shopify now recommends it over colour schemes. Use it for teal #1E806F, black #050301, white and petrol.
- **Variants:** two options, Pack size and Colour.
  - Add a variant metafield `custom.units_per_pack`. Compute `price | times: 1.0 | divided_by: units | round | money` (shows $0.27 for $26.87 / 100). Native unit prices are "available only for stores located in the European Union (EU) or Switzerland".
  - Colours differ by pack, so treat `option_value.variant == nil` as a combination that does not exist.
- **Swatches:** link the Colour option to the category metafield (standard colour metaobjects) for `option_value.swatch.color`, with a fallback map. Whether the Lanyards category has a Color attribute is unverified.
- **Not for us:**
  - Combined listings (Plus only).
  - Quantity rules and volume pricing: these reached Basic on 2 Apr 2026 *(secondary)*, but apply only to B2B buyers. Render `quantity_rule`/`quantity_price_breaks` when present; retail tiers are discounts (stream 5).
- **Accounts:** legacy accounts were deprecated on 26 Feb 2026. Ship no `customers/*` templates and put `<shopify-account>` in the header (a Theme Store requirement since 30 Jul 2026).
- **Standard storefront events and actions:** configure `updateCart`/`openCart` so apps and AI agents refresh our drawer instead of reloading the page.
- **Tooling:**
  - Shopify CLI 4.9.4 (14 Oct 2026) bundles `theme check`, `dev` and `package`; Theme Check is at 3.31.0 (26 Oct 2026).
  - Strict Liquid parsing has been enforced since 13 Jan 2026.
  - Dev MCP 1.17.0 validates Liquid.
  - Non-interactive `shopify theme init` checks out the latest stable Skeleton release (v1.0.0), per the CLI source.

### Import zip requirements
- **Required:** only `layout/theme.liquid`.
- **Folders:** only `assets blocks config layout locales sections snippets templates` (plus `templates/customers`, `templates/metaobject`) are supported. Keep READMEs and prototypes out.
- **Limits:** zip 50 MB; Liquid file 256 KB; JSON template or group 512 KB; `settings_data.json` 1.5 MB; asset 20 MB; schema `name` 25 characters; 25 sections per template. Going over "results in an error ... when the theme is saved, uploaded, or synced".
- **Common failure:** no root `layout/theme.liquid`, usually because of a wrapper folder (community reports).
- **Process:** get Theme Check to zero errors, then run `shopify theme package`. It keeps only theme folders and names the zip from `settings_schema.json`.

### Performance (Shopify guidance)
- **Above `{{ content_for_header }}`:** first-paint CSS, `font_face` and the import map; Shopify streams that part first.
- **Preloads:** at most 10 Link preload headers, automatic ones first. Preload only 1 or 2 late-found files.
- **LCP image:** `image_tag` with `loading: 'eager'`, `fetchpriority: 'high'` and explicit `sizes`. Never lazy-load it and never use CSS `background-image`, so the glass hero needs a real `<img>` under the glass. Use `section.index` for position-aware loading.
- **Fonts:** Shopify library via `font_picker`, or self-hosted WOFF2 with `font-display: swap`, 1 or 2 families. Google Fonts trips `RemoteAsset`.
- **Budgets:** enable `AssetSizeJavaScript` (default 10 KB raw per file) and `AssetSizeCSS` (100 KB).
- **Theme Store bar:** Lighthouse performance 60+, accessibility 90+. Ours is 85.
- **Testing:** Shopify weights collection 43%, product 40%, home 17%, so test all three with its benchmark-shop method, then use the admin Web Performance report after launch.

## 4. Recommendation

**Base: Skeleton v1 at `a4f32d3`, with our own sections and blocks, and Dawn 16 as the reference.**

Why:
- The design is fully custom, so a base's CSS and markup add cost, not value.
- Skeleton is a clean, Theme Check-clean shell with zero JS. Glass and motion get the whole performance budget.
- With 4 products and 14 variants, the commerce code is small.

Risks:
1. **More to build than with Dawn** (drawer, picker, quick view). Mitigation: port Dawn's patterns and reuse the prototype CSS. Fits in 3 to 4 days if scope holds.
2. **Skeleton v1 gets no more updates.** Low impact once forked; JSON templates "continue to work".
3. **Edge cases Dawn already solves** (cart errors, inventory, quantity rules, accessibility). Test each against Dawn's behaviour.
4. **Licence:** keep Shopify's notice in `theme/LICENSE.md`. This is not legal advice.

**Keep from Skeleton:** folder layout, the `theme.liquid` shell, header/footer groups, the `meta-tags`, `image` and `css-variables` snippets, `<shopify-account>`, locales, `.theme-check.yml`, CI workflow.

**Port from Dawn (credited):** cart drawer with Section Rendering updates, add-to-cart errors, quantity-rule and price-break Liquid, focus trap, `<details>` menus.

**Build new:**
- Tokens and `color_palette`; glass header and mobile nav; image hero with glass overlay.
- Product section with static blocks: gallery, title, unit price, Pack/Colour picker, quantity, buy buttons, break-away explainer, accordion, `@app`.
- Quick-view `<dialog>`, collection, cart drawer and cart page.
- About, FAQ, contact, 404, password, search, gift card, basic blog.
- Empty-state reviews block and standard-actions config.

**Skip:** predictive search (4 products), localization (US only), combined listings, Horizon.

## 5. Sources

- Licences: [Dawn](https://github.com/Shopify/dawn/blob/main/LICENSE.md), [Horizon](https://github.com/Shopify/horizon/blob/main/LICENSE.md), [Skeleton](https://github.com/Shopify/skeleton-theme/blob/main/LICENSE.md)
- Repos: [Dawn releases](https://github.com/Shopify/dawn/releases), [Horizon commits](https://github.com/Shopify/horizon/commits/main), [Horizon release notes](https://github.com/Shopify/horizon/blob/main/release-notes.md), [Horizon README](https://github.com/Shopify/horizon), [Skeleton releases](https://github.com/Shopify/skeleton-theme/releases), [Skeleton README/AGENTS.md](https://github.com/Shopify/skeleton-theme), [commit a4f32d3](https://github.com/Shopify/skeleton-theme/commit/a4f32d3), [CLI init source](https://github.com/Shopify/cli/blob/main/packages/theme/src/cli/commands/theme/init.ts); npm: @shopify/cli, @shopify/theme-check-node, @shopify/dev-mcp
- Changelog: [block/partial preview](https://shopify.dev/changelog/developer-preview-liquid-block-and-partial-tags), [colour palettes](https://shopify.dev/changelog/color-palettes), [legacy accounts](https://shopify.dev/changelog/legacy-customer-accounts-are-deprecated), [shopify-account requirement](https://shopify.dev/changelog/the-shopify-account-component-for-customer-accounts-is-now-a-theme-store-requirement), [strict Liquid](https://shopify.dev/changelog/liquid-is-getting-faster-and-ready-to-evolve), [Dev MCP Liquid](https://shopify.dev/changelog/dev-mcp-now-supports-liquid), [unit price filter](https://shopify.dev/changelog/new-liquid-filter-for-displaying-unit-prices)
- Docs: [architecture](https://shopify.dev/docs/storefronts/themes/architecture), [limits](https://shopify.dev/docs/storefronts/themes/architecture/limits), [static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks), [input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings), [unit pricing](https://shopify.dev/docs/storefronts/themes/pricing-payments/unit-pricing), [combined listings](https://shopify.dev/docs/apps/build/product-merchandising/combined-listings/build-for-combined-listings), [feature previews](https://shopify.dev/docs/apps/build/stores/feature-previews), [events and actions](https://shopify.dev/docs/storefronts/themes/best-practices/standard-events-and-actions), [LiquidDoc](https://shopify.dev/docs/storefronts/themes/tools/liquid-doc), [theme package](https://shopify.dev/docs/api/shopify-cli/theme/theme-package), [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements), [testing](https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance), [content_for_header](https://shopify.dev/docs/storefronts/themes/best-practices/performance/load-critical-resources-before-content-for-header), [preload](https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-preload-resource-hints-sparingly), [LCP](https://shopify.dev/docs/storefronts/themes/best-practices/performance/set-fetchpriority-high-on-lcp-image), [fonts](https://shopify.dev/docs/storefronts/themes/best-practices/performance/self-host-web-fonts), [Theme Check](https://shopify.dev/docs/storefronts/themes/best-practices/performance/theme-check-tool), [CDN](https://shopify.dev/docs/storefronts/themes/best-practices/performance/platform)
- Secondary, *unverified*: [B2B for all](https://shopify.com/news/b2b-for-all) (via [Shopifreaks](https://www.shopifreaks.com/shopify-extends-key-native-b2b-features-to-all-merchants-at-no-extra-cost/)), [Craftshift Horizon vs Dawn](https://craftshift.com/shopify-horizon-vs-dawn-2026/), [Shop Theme Detector](https://shopthemedetector.com/blog/shopify-themes-for-dropshipping/), [Shopify theme CWV table](https://performance.shopify.com/pages/theme-performance-data-table)
