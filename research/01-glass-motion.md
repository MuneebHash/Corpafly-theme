# 01 · Glass and motion on the web (27 Oct 2026)

Browser versions: MDN browser-compat-data 8.1.7 [[S11]](https://github.com/mdn/browser-compat-data) and web-features 3.44.0 [[S12]](https://www.npmjs.com/package/web-features). "Reported" means press I couldn't open.

## 1. Summary

1. Liquid Glass is navigation-layer only, never stacked; after legibility complaints Apple added Tinted (iOS 26.1) and an opacity slider (iOS 27).
2. Only `backdrop-filter` works everywhere. Refraction is Chromium-only and the WebGL libraries are heavy; use neither.
3. Cost tracks glass area, not blur radius: in my proxy test a glass header held 59 fps; 38% glass coverage fell to 33 fps.
4. Over the worst background, dark text needs ≥72% white tint and white text ≥62% dark tint. Safari ignores `prefers-reduced-transparency`.
5. Native CSS (scroll-driven animations, view transitions) covers the motion: 100–320ms, decelerating curves, fades under reduced motion.

## 2. Findings

### 2.1 Apple Liquid Glass

- **Principles.** Glass "bends, shapes, and concentrates light". Tint only "primary elements and actions", "always avoid glass on glass", and never mix Regular and Clear [[S1]](https://developer.apple.com/videos/play/wwdc2025/219/).
- **Rules.** "Don't use Liquid Glass in the content layer." Regular suits text; Clear only suits media, with a 35% dimming layer [[S2]](https://developer.apple.com/design/human-interface-guidelines/materials). Bars blur the content scrolling beneath them [[S3]](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass).
- **Criticism and fixes.** NN/g found iOS 26 less legible (reported, Oct 2025) [[S6]](https://anderegg.ca/2025/10/12/nielsen-norman-group-on-ios-26-usability). Tinted (iOS 26.1) "increases opacity and adds more contrast" [[S7]](https://tidbits.com/2025/10/21/ios-26-1-to-add-optional-opacity-to-liquid-glass/). iOS 27 swapped it for a slider; glass now "diffuses complex content behind it much more effectively" [[S8]](https://www.bgr.com/2191219/ios-27-liquid-glass-fix-customization/) [[S9]](https://www.gearpatrol.com/tech/iphone-ios-27-liquid-glass-slider/), with a uniform bar behind text over scrolling content (reported) [[S10]](https://macrumors.com/2026/06/10/how-liquid-glass-is-changing-in-ios-27).
- **Accessibility.** Reduce Transparency makes glass "frostier"; Increase Contrast makes it black or white with a border; Reduce Motion removes elastic effects [[S1]](https://developer.apple.com/videos/play/wwdc2025/219/). The HIG prefers fades to "animating into and out of blurs" [[S4]](https://developer.apple.com/design/human-interface-guidelines/accessibility).
- **For the web.** Borrow navigation-only glass, frosted by default, more opaque as content scrolls under, hairline edges, colour only on the main action. Skip lensing and elastic morphing.

### 2.2 Building glass in browsers

- `backdrop-filter` works in Chrome 76, Safari 18 (9 prefixed) and Firefox 103 (known GPU required before 123) [[S13]](https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/backdrop-filter).
- Blur samples only what is directly behind; Comeau widens it with `mask-image` [[S14]](https://www.joshwcomeau.com/css/backdrop-filter/). A parent with opacity, a filter, a mask or a clip-path limits what the glass sees, so glass inside glass breaks [[S15]](https://drafts.fxtf.org/filter-effects-2/#BackdropRoot).
- Refraction (`feDisplacementMap` applied through `backdrop-filter: url()`) renders only in Chromium [[S16]](https://kube.io/blog/liquid-glass-css-svg/) [[S17]](https://cdn.jsdelivr.net/npm/liquid-glass-js@0.1.0/README.md).
- **Libraries** (MIT; gzip sizes I measured): [liquidGL](https://github.com/naughtyduk/liquidGL) 3.0.0 (Sep 2026), WebGPU/WebGL, 61 KB, unstable in Safari past half the screen; [@ybouane/liquidglass](https://www.npmjs.com/package/@ybouane/liquidglass) 1.0.3 (Apr 2026), WebGL, 26 KB, 100–500ms start-up; [liquid-glass-js](https://www.npmjs.com/package/liquid-glass-js) 0.1.0 (Jun 2026), static background copy, 5 KB. liquid-glass-react is stale (Jun 2025).
- **Newer CSS.** `corner-shape: squircle` is Chrome-only. Anchor positioning works in Chrome 125, Firefox 147 and Safari 26. Popover and `@starting-style` are Baseline and suit glass drawers [[S11]](https://github.com/mdn/browser-compat-data).

### 2.3 Cost on mid-range phones

- I found no methodical phone or battery measurements. Chromium calls the feature "computationally intensive" [[S18]](https://groups.google.com/a/chromium.org/g/blink-dev/c/GRl1_Qy97jM/m/h7v1qIDsBwAJ).
- My proxy test: headless Chrome 153, 390×844 at 3×, 3,000px scroll, three runs each. No real GPU, so compare ratios; retest on a real Android in Phase 2.

| Scenario | ms per frame (CPU) | fps (SwiftShader) |
|---|---|---|
| Opaque header | 1.4 | 59 |
| Glass header, blur 12 / 40px | 4.1 / 5.8 | 59 |
| Header + SVG displacement | 6.8 | 40 |
| Header + 6 glass cards | 10.6 | 33 |
| Header + full-height drawer | 28.5 | 25 |

- Glass redraws whenever something behind it moves. Keep scrolling glass under about 10% of the screen, lock page scroll under open drawers, never animate blur, and use pre-blurred images behind hero overlays.

### 2.4 Accessibility on glass

- WCAG 2.2 AA needs 4.5:1 for text and 3:1 for large text and controls. Under 2.4.11 a sticky header must not hide the focused element; use `scroll-padding-top` [[S19]](https://www.w3.org/TR/WCAG22/).
- Worst-case contrast (my calculation): #050301 text on white tint over black scores 3.6:1 at 40%, 5.2:1 at 50% and 10.3:1 at 72%. White text on dark tint over white scores 4.6:1 at 55% and 6.0:1 at 62%. Apple's 35% dim gives white text only 2.4:1. White on solid teal #1E806F gets 4.8:1; teal text on glass usually fails.
- `prefers-reduced-transparency` works only in Chromium (Chrome/Edge 118+), so the iOS setting never reaches web pages [[S20]](https://developer.mozilla.org/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency). `prefers-contrast` works everywhere, and Apple's Increase Contrast setting reports `more` [[S21]](https://www.tempertemper.net/blog/using-the-increased-contrast-mode-css-media-query). `forced-colors` is Baseline [[S12]](https://www.npmjs.com/package/web-features).

### 2.5 Motion

- **Scroll-driven animations** work in Chrome 115 and Safari 26, off the main thread from Safari 26.4 [[S22]](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/). Firefox 159 adds them, due 27 Oct 2026 [[S23]](https://groups.google.com/a/mozilla.org/g/dev-platform/c/uLZPrpA5Ic0). Tokopedia's scroll CPU fell from 50% to 2% versus JavaScript [[S24]](https://developer.chrome.com/blog/css-ui-ecommerce-sda).
- **View transitions** within a page are Baseline. Transitions between pages work in Chrome 126 and Safari 18.2, with Firefox an Interop 2026 target [[S25]](https://web.dev/blog/interop-2026). Shopify pages are separate documents, so these come free.
- **Springs** need no library: WAAPI and `linear()` easing are widely supported [[S12]](https://www.npmjs.com/package/web-features).
- **Benchmarks.** Material 3: 50–1000ms, `cubic-bezier(0.2,0,0,1)` [[S26]](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs). Carbon: 70–700ms, productive `cubic-bezier(0.2,0,0.38,0.9)` [[S27]](https://carbondesignsystem.com/elements/motion/overview/). Apple: "Don't add motion for the sake of adding motion" [[S5]](https://developer.apple.com/design/human-interface-guidelines/motion). WCAG 2.2.2 requires a pause control for motion over 5 seconds, so nothing loops.

## 3. Recipe for Corpafly

**Where glass goes.** Header, cart drawer, quick-view, hero overlay. Never behind body text, prices, tier tables or forms; three layers at most, never nested. "Add to cart" is solid teal.

```css
:root {
  --glass-blur: 16px;  /* 12px <768px; 24px drawer, quick-view */
  --glass-sat: 150%;
  --glass-light: rgb(255 255 255 / .72);  /* .50 for icon-only */
  --glass-dark: rgb(5 3 1 / .64);
  --glass-solid: rgb(255 255 255 / .94);  /* dark: rgb(5 3 1 / .92) */
  --glass-border: 1px solid rgb(255 255 255 / .55);
  --glass-highlight: inset 0 1px 0 rgb(255 255 255 / .7);
  --glass-shadow: 0 0 0 1px rgb(5 3 1 / .06), 0 8px 24px rgb(5 3 1 / .08);
}
.glass { background: var(--glass-solid); border: var(--glass-border);
  box-shadow: var(--glass-highlight), var(--glass-shadow); }
@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .glass { background: var(--glass-light);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat)); }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .glass { background: #fff; backdrop-filter: none; -webkit-backdrop-filter: none; border-color: #050301; }
}
@media (forced-colors: active) {
  .glass { backdrop-filter: none; background: Canvas; border: 1px solid CanvasText; }
}
```

Dark glass: 14% white border, 12% white highlight, shadow `0 12px 32px rgb(0 0 0 / .28)`. The header tint rises from 56% to 72% over the first 80px of scroll (`animation-timeline: scroll()` on a pseudo-element's opacity).

**Fallback order:** live glass → 94% solid without `backdrop-filter` → solid white with a dark border for less transparency or more contrast → system colours in forced-colours mode. No refraction or WebGL.

**Browser support.** Desktop and mobile match; every US iOS browser uses Safari's engine [[S28]](https://developer.apple.com/app-store/review/guidelines/).

| Feature | Chrome/Edge | Safari and iOS | Firefox |
|---|---|---|---|
| `backdrop-filter` | 76 | 18 (9 prefixed) | 103 |
| `backdrop-filter: url()` | Yes | No | No |
| `prefers-reduced-transparency` | 118 | No | Flag |
| `prefers-contrast` / `forced-colors` | 96 / 89 | 14.1 (iOS 14.5) / 16 | 101 / 89 |
| Scroll-driven animations | 115 | 26 | 159 |
| View transitions, same page / across pages | 111 / 126 | 18 / 18.2 | 144 / No |

**Motion tokens.**
- Durations: press 100ms, hover 160ms, menus and price updates 240ms, drawer 320ms in, 200ms out, section reveal 480ms, hero moment 800ms once.
- Easings: standard `cubic-bezier(.2,0,0,1)`, enter `(.05,.7,.1,1)`, exit `(.3,0,.8,.15)`, small UI `(.2,0,.38,.9)`.

**Restraint.** Transform and opacity only. Sections reveal once: 12px rise plus fade, 40ms stagger, max four items. Presses scale buttons to 0.98. One hero moment per page. No parallax, loops, autoplay or blur animation.

**Reduced motion.** Put motion inside `@media (prefers-reduced-motion: no-preference)` with content visible by default, and gate reveals with `@supports (animation-timeline: view())`. Under `reduce`, drawers fade in over 150ms, reveals and smooth scrolling are off, view transitions cross-fade briefly, and the hero shows its final frame.

## 4. Sources

- S1 WWDC25 Meet Liquid Glass (Jun 2025): https://developer.apple.com/videos/play/wwdc2025/219/
- S2 HIG Materials (Sep 2025): https://developer.apple.com/design/human-interface-guidelines/materials
- S3 Adopting Liquid Glass: https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
- S4 HIG Accessibility (Jun 2025): https://developer.apple.com/design/human-interface-guidelines/accessibility
- S5 HIG Motion (Sep 2025): https://developer.apple.com/design/human-interface-guidelines/motion
- S6 Anderegg on NN/g (Oct 2025): https://anderegg.ca/2025/10/12/nielsen-norman-group-on-ios-26-usability
- S7 TidBITS (Oct 2025): https://tidbits.com/2025/10/21/ios-26-1-to-add-optional-opacity-to-liquid-glass/
- S8 BGR (2026): https://www.bgr.com/2191219/ios-27-liquid-glass-fix-customization/
- S9 Gear Patrol (2026): https://www.gearpatrol.com/tech/iphone-ios-27-liquid-glass-slider/
- S10 MacRumors (Jun 2026): https://macrumors.com/2026/06/10/how-liquid-glass-is-changing-in-ios-27
- S11 MDN browser-compat-data 8.1.7 (Oct 2026): https://github.com/mdn/browser-compat-data
- S12 web-features 3.44.0 (Oct 2026): https://www.npmjs.com/package/web-features
- S13 MDN backdrop-filter: https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/backdrop-filter
- S14 Josh Comeau: https://www.joshwcomeau.com/css/backdrop-filter/
- S15 Filter Effects 2: https://drafts.fxtf.org/filter-effects-2/#BackdropRoot
- S16 kube.io (2025): https://kube.io/blog/liquid-glass-css-svg/
- S17 liquid-glass-js (Jun 2026): https://cdn.jsdelivr.net/npm/liquid-glass-js@0.1.0/README.md
- S18 Blink intent (2019): https://groups.google.com/a/chromium.org/g/blink-dev/c/GRl1_Qy97jM/m/h7v1qIDsBwAJ
- S19 WCAG 2.2: https://www.w3.org/TR/WCAG22/
- S20 MDN prefers-reduced-transparency: https://developer.mozilla.org/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency
- S21 tempertemper: https://www.tempertemper.net/blog/using-the-increased-contrast-mode-css-media-query
- S22 WebKit Safari 26.4: https://webkit.org/blog/17862/webkit-features-for-safari-26-4/
- S23 Mozilla intent (Sep 2026): https://groups.google.com/a/mozilla.org/g/dev-platform/c/uLZPrpA5Ic0
- S24 Chrome case studies: https://developer.chrome.com/blog/css-ui-ecommerce-sda
- S25 Interop 2026: https://web.dev/blog/interop-2026
- S26 Material 3 tokens: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
- S27 Carbon motion: https://carbondesignsystem.com/elements/motion/overview/
- S28 Apple App Review 2.5.6: https://developer.apple.com/app-store/review/guidelines/
