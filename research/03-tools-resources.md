# 03. Tools and resources

Stream 3, 27 Oct 2026. Licences read at source unless flagged in section 4; sizes measured here (npm latest, esbuild, gzip).

## 1. Summary

1. Native CSS covers our motion. Scroll-driven animations reach every engine with Firefox 159 (27 Oct 2026). Same-document View Transitions, `@starting-style` and `linear()` springs already do. Default: no motion library.
2. GSAP is free but proprietary and revocable: 45 KB gz with ScrollTrigger. A fallback helper, Motion `mini` + `inView`, is about 4 KB gz and MIT.
3. Popular component kits run on React, so ideas only. Origin UI is now AGPL-3.0. Horizon's web components are the best code source, licensed for Shopify themes.
4. Google Fonts candidates are all OFL and can be self-hosted. Fontshare's FFL v2.0 bans subsetting and redistribution, which is bad for a public repo. Pangram Pangram is for personal use only.
5. Icons: Phosphor (MIT). Only Shopify's own tools output Liquid. Images use Shopify's CDN (AVIF/WebP automatically). rembg needs a non-default model for commercial use.

## 2. Findings

### 2.1 Motion

| Option | Cost (min + gz) | Verdict |
|---|---|---|
| GSAP 3.15 | 28 KB; 45 KB with ScrollTrigger | Skip |
| Motion 14.6, vanilla | `animate` 24 KB; `mini` 3.4 KB; `inView` 0.5 KB | `mini` only if needed |
| anime.js 4.5 | `animate` 13 KB; full 41 KB | Skip |
| Lenis 1.3 | 5.4 KB | Skip: it takes over scrolling |
| Rive 2.47 / dotLottie 0.81 | 443 / 529 KB with WASM | Skip |
| Scroll-driven animations | 0 | Use: Chrome 115, Safari 26, Firefox 159 |
| View Transitions | 0 | Use: same-document everywhere; cross-document Chrome 126 and Safari 18.2 |
| WAAPI, `@starting-style`, `linear()` | 0 | Use: every engine |

- **GSAP licence (30 Apr 2025):** it allows use "on any website, web application, or digital interface". It bars use "in tools that allow users to build visual animations without code" that compete with Webflow. Webflow "may terminate" or amend it.
- **Horizon** ships a card-to-product cross-document image transition inside `prefers-reduced-motion: no-preference`. Copy it.
- **New, Chrome-only:** `animation-trigger` (146). Avoid it.
- **Theme Check:** `RemoteAsset` flags scripts loaded from a CDN, so host libraries in `assets/`. The optional `AssetSizeJavaScript` check (10,000 raw bytes) fails GSAP (73 KB) and passes `motion/mini` (8.4 KB).

### 2.2 UI components

- **Usable as code:**
  - **Horizon 4.3 web components** (`cart-drawer.js`, `price-per-item.js`, `quick-order-list.js`, `product-form.js`, `dialog.js`), licensed "to develop themes that integrate or interoperate with Shopify software or services".
  - **Uiverse:** MIT HTML/CSS of uneven quality.
  - **Web Awesome and Open Props (MIT):** work without React but add a second visual language. Native `<dialog>`, popover and anchor positioning, now in every engine, are enough.
- **Ideas only (React):**
  - **shadcn/ui, Radix, Magic UI, Motion Primitives:** MIT. Read Radix for keyboard and ARIA behaviour.
  - **Aceternity:** no template resale.
  - **React Bits:** its Commons Clause bans redistribution "as a ported version".
  - **coss ui (formerly Origin UI):** AGPL-3.0.
  - **21st.dev:** licences are per component.
  - **Framer and Webflow templates:** single-site licences.

### 2.3 Type

- **OFL 1.1, checked in google/fonts:** Manrope, Hanken Grotesk, Albert Sans, Outfit, Urbanist, Figtree, Onest, Geist (and Mono), Mona and Hubot Sans, Instrument Sans, Host Grotesk, Funnel Sans and Display, Schibsted Grotesk, Red Hat Display and Text, Bricolage Grotesque, Google Sans Flex, Atkinson Hyperlegible Next, JetBrains Mono, IBM Plex Mono, Martian Mono, Fragment Mono. Commit Mono fonts are also OFL.
  - The OFL allows use "as long as they are not sold by themselves".
  - Mona and Hubot have Reserved Font Names, so ship them unmodified.
- **Google Sans Flex** became OFL in Nov 2025 and has a roundness axis. But it is Google's voice, and the file is 1.4 MB.
- **Avoid as the lead face:** Geist (the Next.js and v0 default, so it reads as generated), Mona and Hubot (GitHub), Red Hat, IBM Plex.
- **ITF FFL v2.0, 17 Aug 2026** (Fontshare's Satoshi, General Sans, Switzer, Supreme, Cabinet Grotesk):
  - Free for commercial use, and self-hosting on your own site is allowed.
  - No altering "including ... subsetting, format conversion", and no redistribution. That conflicts with our public repo.
- **Foundries:** Velvetyne (mostly OFL, credit requested) and Collletttivo (OFL) are safe. Uncut.wtf mixes licences. Pangram Pangram: "Licenses are available to purchase for commercial projects".
- **Shopify:**
  - The font library is "system fonts and a selection of Google fonts".
  - Monotype faces were deprecated in Nov 2024. Avenir Next went to Figtree, Univers Next to Instrument Sans, Twentieth Century to Outfit.
  - Self-hosting WOFF2 in `assets/` is documented and advised when "the typeface is fixed by brand guidelines".

### 2.4 Icons (counts from npm)

- **Phosphor 2.1:** 1,512 icons in 6 weights, round joins.
- **Lucide 1.62:** 1,908; the shadcn default.
- **Tabler 3.49:** 5,184 outline and 1,054 filled.
- **Iconoir 7.12:** 1,383.
- **Heroicons 2.2:** 324; Tailwind's look.
- **Material Symbols:** Google's look.
- **Hugeicons free:** 6,000+ in one rounded style.
- **Streamline free sets:** need a credit link.
- **Remix Icon:** moved in Jan 2026 to the "Remix Icon License v1.0". It bars use "as a logo, trademark, or brand identifier". npm still says Apache-2.0.

### 2.5 Design-to-code and AI tools

- **Shopify:**
  - Sidekick generates theme blocks wherever a section accepts `@theme` blocks.
  - Canvas (1 Oct 2026, early access) lets Sidekick edit theme files from chat. An edited theme loses updates and can't be downloaded, so duplicate it first.
  - The Shopify AI Toolkit plugin for Claude Code helps in Phase 4.
- **Figma:** Dev Mode and MCP for handoff; Make outputs React.
- **Claude Design** (Apr 2026, preview): exports standalone HTML, fine for sketches.
- **Others:** v0, Lovable and Bolt build React apps (Lovable's Shopify link is headless). Framer has no code export; Webflow exports on paid plans; Relume, Locofy and Anima give wireframes or verbose code. None output Liquid.

### 2.6 Images

- **Product photos:** upload them to Shopify, because images in `assets/` are never resized.
  - `{{ image | image_url: width: 1600 | image_tag: widths: '400, 800, 1200, 1600', sizes: '(min-width: 990px) 50vw, 100vw' }}` writes the srcset and dimensions.
  - The CDN "automatically serves WebP or AVIF".
  - Add `preload: true` on the LCP image.
- **Background removal:** Shopify's media editor, or rembg with `-m birefnet-general` (MIT) or `-m u2net` (Apache-2.0). rembg's default, BRIA RMBG-2.0, "requires a paid agreement for commercial use".
- **Upscaling:** Upscayl with Real-ESRGAN (BSD-3) or HFA2k (CC BY 4.0). Its UltraSharp and Remacri models are non-commercial. It invents strap detail, so 2x at most.
- **Prototypes:** sharp or Squoosh for AVIF and WebP.

## 3. Licence table

| Name | Type | Licence | Commercial web use? | Self-host OK? | Link |
|---|---|---|---|---|---|
| GSAP 3.15 | JS animation | GSAP Standard "No Charge", proprietary | Yes; not in builders that compete with Webflow | Yes | [text](https://github.com/aboutcode-org/scancode-toolkit/blob/develop/src/licensedcode/data/licenses/gsap-standard-no-charge-2025.LICENSE) |
| Motion, anime.js, Lenis | JS animation | MIT | Yes | Yes | [motion](https://github.com/motiondivision/motion) |
| Rive, Lottie runtimes | Animation | MIT (Rive export is a paid plan) | Yes | Yes | [rive-wasm](https://github.com/rive-app/rive-wasm) |
| Horizon, Dawn | Theme code | Shopify theme licence | Shopify themes only | Yes | [horizon](https://github.com/Shopify/horizon) |
| shadcn/ui, Radix, Magic UI, Motion Primitives | React UI | MIT | Yes | React only | [shadcn](https://github.com/shadcn-ui/ui) |
| React Bits | React UI | MIT + Commons Clause | Yes; no redistribution | React only | [react-bits](https://github.com/DavidHDev/react-bits) |
| coss ui | React UI | AGPL-3.0 | Copyleft; avoid | React only | [originui](https://github.com/origin-space/originui) |
| Aceternity UI | React UI | Own licence | Yes; no resale | React only | [licence](https://ui.aceternity.com/licence) |
| Uiverse, Web Awesome, Open Props | HTML/CSS | MIT | Yes | Yes | [galaxy](https://github.com/uiverse-io/galaxy) |
| Google Fonts families above, Commit Mono | Fonts | SIL OFL 1.1 | Yes | Yes | [google/fonts](https://github.com/google/fonts) |
| Fontshare ITF fonts | Fonts | ITF FFL v2.0 | Yes | Own site; no subsetting | [FFL](https://www.fontshare.com/licenses/itf-ffl) |
| Velvetyne, Collletttivo | Fonts | Mostly OFL | Yes | Yes | [FAQ](https://velvetyne.fr/about/faq/) |
| Pangram Pangram | Fonts | Trial EULA | No | No | [about](https://pangrampangram.com/pages/about) |
| Phosphor, Tabler, Iconoir, Heroicons, Hugeicons free | Icons | MIT | Yes | Yes | [phosphor](https://github.com/phosphor-icons/core) |
| Lucide | Icons | ISC | Yes | Yes | [lucide](https://github.com/lucide-icons/lucide) |
| Material Symbols | Icons | Apache-2.0 | Yes | Yes | [repo](https://github.com/google/material-design-icons) |
| Remix Icon | Icons | Remix Icon License v1.0 | Yes; not as a logo | Yes | [License](https://github.com/Remix-Design/RemixIcon/blob/master/License) |
| Streamline free sets | Icons | CC BY 4.0 | Yes, with credit | Yes | [licence](https://help.streamlinehq.com/en/articles/5354376-streamline-free-license) |
| rembg + BiRefNet or U2-Net | Image tool | MIT; MIT or Apache-2.0 | Yes, but not the BRIA model | Local | [rembg](https://github.com/danielgatis/rembg) |
| Upscayl | Image tool | AGPL-3.0; models vary | Output yes; avoid non-commercial models | Local | [upscayl](https://github.com/upscayl/upscayl) |
| sharp, Squoosh | Encoders | Apache-2.0 | Yes | Local | [sharp](https://github.com/lovell/sharp) |

## 4. Recommendations for Corpafly

**Use**

- **Motion:** CSS transitions and `@starting-style` for the drawer and dialogs; scroll-driven reveals and header glass behind `@supports`; cross-document View Transitions; WAAPI for the hero product moment. All of it is gated by `prefers-reduced-motion`. If we need a helper, bundle `motion/mini` and `inView` into one file.
- **Components:** our own custom elements, borrowing Horizon's patterns for the cart drawer, price per unit and quick order.
- **Icons:**
  - Phosphor, functional icons only: Light at large sizes, Regular at 16–20 px.
  - Draw the J-hook and break-away clasp pictograms on the same grid.
  - Store them as `assets/icon-*.svg` with `fill="currentColor"`. `inline_asset_content` accepts SVG files under 15 KB.
  - Every icon button gets text.

```liquid
{%- # snippets/icon.liquid  usage: {% render 'icon', name: 'cart' %} -%}
<span class="icon" aria-hidden="true">{{ 'icon-' | append: name | append: '.svg' | inline_asset_content }}</span>
```

- **Type pairings:** all OFL, one variable WOFF2 per family. Sizes are Fontsource's Latin files.

| Direction | Pairing | Size |
|---|---|---|
| Neutral precise grotesk | Instrument Sans (weight 400–700, width 75–100) + Fragment Mono for pack counts and unit prices | 30 + 25 KB |
| Geometric, echoing the thin round wordmark | Outfit at weight 200–300 for display + Figtree for UI. Both are in Shopify's library, so they work with `font_picker` | 32 + 20 KB |
| Characterful | Funnel Display + Funnel Sans (NORD ID, 2024). Alternative: Bricolage Grotesque | 18 + 17 KB |

**Skip:** GSAP, anime.js, Lenis, Rive, Lottie; React kits as code; FFL and Pangram fonts; Geist, Google Sans Flex, Mona Sans; Lucide, Heroicons, Remix Icon; AI builders for production code.

**Not verified**

- gsap.com and fontshare.com were blocked from this session. GSAP's terms come from the ScanCode copy and the 3.15 file header. The FFL's terms come from search extracts.
- Canvas, Claude Design, Aceternity, Pangram, Rive and Framer come from secondary sources.

## 5. Sources

- Browser support, MDN compat data 8.1.7: https://github.com/mdn/browser-compat-data
- Horizon: https://github.com/Shopify/horizon
- Theme Check: https://shopify.dev/docs/storefronts/themes/best-practices/performance/theme-check-tool
- Fonts: https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts
- Self-hosted fonts: https://shopify.dev/docs/storefronts/themes/best-practices/performance/self-host-web-fonts
- Font library changes: https://shopify.dev/changelog/posts/changes-to-our-font-library
- Images: https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-filter-chains
- `inline_asset_content`: https://shopify.dev/docs/api/liquid/filters/inline_asset_content
- AI blocks: https://shopify.dev/docs/storefronts/themes/architecture/blocks/ai-generated-theme-blocks
- Canvas: https://www.shopify.com/news/introducing-canvas
- Canvas limits: https://www.eesel.ai/blog/shopify-canvas
- AI Toolkit: https://shopify.dev/docs/storefronts/themes/getting-started/create
- FFL: https://www.fontshare.com/licenses/itf-ffl
- Google Sans Flex: https://www.omgubuntu.co.uk/2025/11/google-sans-flex-font-ubuntu
- Font sizes: https://github.com/fontsource/font-files
- Upscale model licences: https://github.com/OpenModelDB/open-model-database
- Figma MCP: https://help.figma.com/hc/en-us/articles/32132100833559
- Webflow export: https://help.webflow.com/hc/en-us/articles/33961386739347
- Claude Design: https://datanorth.ai/blog/claude-design-what-it-is-and-the-possible-use-cases
- Rive pricing: https://rive.app/docs/account-admin/pricing
- Media editor: https://help.shopify.com/en/manual/shopify-admin/productivity-tools/shopify-magic/media-generation
