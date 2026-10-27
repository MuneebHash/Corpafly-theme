# Gate 1: pick a direction

27 Oct 2026. Phases 0, 1 and 2 are done. Start at the hub: https://muneebhash.github.io/Corpafly-theme/ (once GitHub Pages is on: Settings > Pages > Deploy from a branch > `main` / root).

## Research in ten lines

1. Glass belongs on chrome and focal moments only; Apple itself made Liquid Glass frostier twice after legibility complaints.
2. Legible glass has hard numbers: at least 72% white behind dark text, 64% ink behind white text.
3. Glass cost grows with area: a glass header held 59 fps, glass over a third of a phone screen fell to 33. No live refraction, no WebGL.
4. Native CSS now covers all the motion we need (scroll-driven animations reached every browser this week). No motion library.
5. Premium stores change one thing at a time: identical variant images, specs in a fixed order, honest pack savings, no pop-ups.
6. Lanyard competitors are weak: promo-code banners, "was" prices everywhere, part-number names, per-pack and per-lanyard prices mixed.
7. Price per lanyard is Corpafly's strongest true claim: 86% of sites leave unit prices out, and almost no lanyard seller shows them.
8. Buying: pack buttons and named swatches (never drop-downs), mixed colors in one cart call, a sticky add bar, three taps for a repeat order.
9. Trust means checkable facts only (Shopify checkout, US warehouses, Texas LLC). Fake reviews are illegal under the 2024 FTC rule; reviews stay empty until real.
10. Theme base: Shopify's Skeleton theme v1 (no JavaScript, theme blocks) with Dawn 16 as the cart reference. Not Horizon: 4x the JavaScript, and a licence that bars public derived themes.

Full report: [`research/REPORT.md`](research/REPORT.md).

## The three directions

| | Direction | One line | Page | Screens |
|---|---|---|---|---|
| A | **Clear Sleeve** (recommended) | A bright, calm product page: the lanyard hangs in the hero and its glass ID badge is the price card | [direction-a](https://muneebhash.github.io/Corpafly-theme/prototypes/direction-a/) | `prototypes/screens/direction-a-1440.jpg`, `-390.jpg` |
| B | **Diamond Grid** | The CF mark's 45 degree grid becomes the whole system: dark lattice hero, spec plates, a break-away detail drawing, a color-coding planner | [direction-b](https://muneebhash.github.io/Corpafly-theme/prototypes/direction-b/) | `prototypes/screens/direction-b-1440.jpg`, `-390.jpg` |
| C | **Order Desk** | The homepage is the order form: type, pack, colors and counts with the price per lanyard live, plus a finder and a pull-to-release demo | [direction-c](https://muneebhash.github.io/Corpafly-theme/prototypes/direction-c/) | `prototypes/screens/direction-c-1440.jpg`, `-390.jpg` |

First-screen images: `prototypes/screens/direction-*-1440-fold.png` and `-390-fold.png`. Brand book: [brand/brand-book.html](https://muneebhash.github.io/Corpafly-theme/brand/brand-book.html). Logo set: [`brand/logo/`](brand/logo/README.md).

All three:
- Lighthouse mobile: 96 to 97 performance, 100 accessibility, 100 best practices.
- axe accessibility checks: 0 violations.
- Keyboard and reduced motion: both work.
- Layout: no sideways scroll from 360 to 1920 px wide.
- Content: every price is labelled as a placeholder, and every unconfirmed spec says "To confirm".

## Recommendation: A, Clear Sleeve, with two borrowings

**Why A:**
- It is the most faithful "office glass": calm, light and precise, with glass used on one focal object instead of everywhere.
- Its hero sells the one true differentiator, the price per lanyard, in the first second.
- It works for all four buyers: office managers, teachers, event teams and travellers.
- It is the lightest to build and keep fast in Shopify.

**Borrow from C** for the product page and a "For teams" page:
- the mixed-color order rows
- the three-question finder
- "Copy order link" for approvals

**Borrow from B** for the product page and a "How break-away works" page:
- the spec-plate tables
- the break-away detail drawing

**The alternatives:**
- **B** is the boldest brand statement, but its dark, architectural mood is less calm than the brief asks.
- **C** converts fastest, but reads as a tool more than a brand.

## What I need from you

1. **Your pick** (A, B, C or a mix) and any notes.
2. **Approvals:**
   - The header lockup: mark and wordmark side by side, with a heavier wordmark at small sizes.
   - If you pick B: its use of the mark as a dark background graphic.
3. **Facts** (shown as placeholders until then):
   - real prices and any volume tiers
   - lanyard length and strap width
   - break-away release force
   - shipping speeds and rates
   - returns policy
4. **Images:**
   - Confirm the office photos from the Amazon banners are licensed for the website.
   - Send photos of green, red, yellow and purple straps and of the clasp, and the product video file.
5. **Turn on GitHub Pages** once (Settings > Pages > `main` / root) so the links above work.

Everything decided while you were away is in [`DECISIONS.md`](DECISIONS.md) (D1 to D16, with assumptions A1 to A11).
