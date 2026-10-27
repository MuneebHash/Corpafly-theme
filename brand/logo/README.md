# Corpafly logo set (SVG)

Traced from the real logo, not redrawn. Use these files everywhere instead of the PNGs.

## How it was built

- **Mark.** The C and F sit on separate layers in `source-psd/Logo.psd`, so the hidden part of the C could be measured too. Every edge of both letters is a straight line at 45 degrees. Each edge position was measured from the 3000 px layers, then the shapes were rebuilt as clean polygons with four rounded outer corners (radius about 30% of the stroke). Result: 8 points for the C, 10 for the F.
- **Wordmark.** Set in Antipasto Pro Hairline (a commercial Zetafonts typeface) in the PSD. It is a monoline face with round ends, so it was rebuilt as centre lines (straight strokes and elliptical arcs) with a 14 px round-capped stroke on the 3000 px canvas. No font file is needed.
- **Check.** Rendered in Chromium at 3000 px and compared pixel by pixel with `Logo.png`: the mark overlaps the original by 98.9%, the hairline wordmark by 93.9% (the gap is anti-aliasing on 14 px strokes, under half a pixel on average).

## Files

| File | Use |
|---|---|
| `corpafly-logo.svg` | Stacked logo, full colour. The master |
| `corpafly-logo-black.svg`, `-white.svg` | Stacked, one colour |
| `corpafly-logo-black-solid.svg` | Exactly as `logo (black).png`: C and F merge with no gap. Kept for reference |
| `corpafly-mark.svg` | Mark only, full colour |
| `corpafly-mark-black.svg`, `-white.svg` | Mark, one colour |
| `corpafly-mark-reverse.svg` | Teal C, white F, for dark surfaces (proposed) |
| `corpafly-mark-on-teal.svg` | White C, black F, as on the thank-you card |
| `corpafly-lockup*.svg` | Horizontal lockup for headers (new arrangement of the original parts, needs approval) |
| `corpafly-lockup-small*.svg` | Same, wordmark stroke 1.7x heavier so it survives below about 20 px cap height (needs approval) |
| `corpafly-wordmark.svg`, `-white.svg` | Wordmark only |
| `favicon.svg` | Mark; the F turns white when the browser is in dark mode |
| `favicon-32.png`, `apple-touch-icon.png` | Raster fallbacks for older browsers and iOS home screens |

## Rules worth knowing

- **One-colour versions have a knockout.** Where the F stem crosses the C, the C stops 36 px (on the 3000 px canvas) short on both sides. The brand's own white-on-petrol banner and the box print already do this; without it the two letters merge into one shape.
- **Full colour only on white or very light surfaces.** On dark surfaces use white or reverse. On brand teal use on-teal or white.
- Clear space, minimum sizes and misuse rules are in `brand/BRAND-BOOK.md`.
