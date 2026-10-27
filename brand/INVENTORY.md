# Phase 0: Brand asset inventory

Checked 27 Oct 2026. Every image in `brand/assets/` was opened and looked at. Originals are untouched; web-ready crops live in `brand/assets/web/` and the vector logo set in `brand/logo/`.

## What is here

| File | Size | What it shows | Use on the new site |
|---|---|---|---|
| `Logo.png` | 3000 x 3000, RGBA | Full colour stacked logo: teal C behind black F, thin CORPAFLY wordmark | Source for the SVG trace. Use the SVGs instead |
| `logo (black).png` | 3000 x 3000, RGBA | Same, all black. C and F merge with no separation | Source only |
| `Logo.jpg` | 3000 x 3000 | JPG of `Logo.png` | Not needed |
| `Thankyou card (Front).jpg` | 1299 x 1063 | Teal card, white script "Thank You", line-icon school pattern, mark as white C + black F, bold CORPAFLY | Shows an existing "mark on teal" colourway |
| `Thankyou card (Back).jpg` | 1299 x 1063 | White panel, teal border, teal script, uppercase body copy | Reference only |
| `source-psd/Logo.psd`, `Logo (Black).psd` | 3000 x 3000 | C and F on separate pixel layers (no vectors). Wordmark is live text | Used to measure the hidden part of the C |
| `source-psd/Thankyou Card (Front/Back).psd` | 1299 x 1063 | Layered card files | Reference only |
| `storefront-images/Slide-01.jpg`, `Slide-01-02.jpg` | 1500 x 1500 | Branded box render with "100 PCS" and "COOL AND SWEAT-FREE EXPERIENCE" overlays, black / blue lanyard bundle, colour dots | Cropped to the J-hook bundle only (`web/hooks-*`). The box is left out because orders ship in plain boxes |
| `storefront-images/Slide-03.jpg` | 1206 x 241 | White mark and wordmark on dark petrol `#022430` | Shows how the brand already handles a one-colour mark (thin knockout between C and F) |
| `storefront-images/slide-4.png`, `slide-6.png` | 1176 x 118 | "Explore", "Shop Our Lanyards" title bars on petrol | Not used |
| `storefront-images/slide-5.png`, `slide-5-1.png` | 1176 x 588 | "Unlock a world of convenience" banner, blue panel, stock meeting photo | Photo side cropped (`web/meeting-room`). Copy not reused |
| `storefront-images/Slide-07-1.jpg`, `Slide-08-1.jpg` | 581 x 581 | Blue and black lanyard coiled with a badge holder, on a white disc | Cut out as product discs (`web/coil-*`) |
| `storefront-images/slide-9.png` | 1176 x 588 | Woman in a suit with black lanyard; "Elevating Convenience" text panel | Photo half cropped (`web/office-black-lanyard`) |
| `storefront-images/slide-10.png` | 1176 x 588 | Two people walking, "BLACK LANYARDS" type behind them | Not used: type is baked into the photo |
| `storefront-images/slide-11.png` | 1176 x 588 | Man presenting with blue lanyard; text panel | Photo half cropped (`web/office-blue-lanyard`) |
| `storefront-images/slide-12.png` | 1176 x 588 | Children running with blue lanyards, "BLUE LANYARDS" type behind | Not used: type baked in, and child imagery needs care |
| `storefront-images/slide-13.png` | 1176 x 235 | Six round line icons (Durable, Comfortable, Secure, Heavy-Duty, Fade-Resistant, Versatile) | Not used: generic icon set |
| `storefront-images/slide-14.png`, `slide-14-01.png` | 581 x 283 | Five fanned lanyards on white, "Shop now" button | Lanyards cut out on transparency (`web/fan-*`) |
| `storefront-images/slide-15.png` | 1176 x 588 | "About us" text on petrol | Copy not reused (hype words, long sentences) |

Not in the repo: the product video (lives on Amazon). Every design keeps a video slot.

## Colours sampled from the files

| Colour | Hex | Where |
|---|---|---|
| Brand teal | `#1E806F` | Logo C (37% of logo pixels). The card JPG reads `#1E816F`, a compression shift |
| Brand black | `#050301` | Logo F |
| Wordmark black | `#000000` | Wordmark in `Logo.png` |
| Amazon petrol (derived, not core) | `#022330` | Store title bars and banners |
| Amazon blue (old, not carried over) | `#148AB2` | Store banners |
| Amazon mint (old) | `#C3FBF0` | "Explore Now" button |
| Real strap: blue | about `#123C98` | Average of three product photos (royal blue) |
| Real strap: black | about `#1F1F1F` | Product photo |

## Type found in the source files

| Use | Font | Licence status |
|---|---|---|
| Wordmark | Antipasto Pro Hairline (Zetafonts) | Commercial. Not shipped as a web font. The SVG logo has it outlined |
| Card wordmark | Antipasto Pro DemiBold | Commercial |
| Card line | Bahnschrift | Microsoft system font, not for web embedding |
| Card body | Century Gothic | Commercial |
| Card script | Chiesty | Unknown licence, not used |
| Amazon banners | Appears to be Manrope (OFL) | Free |

## Gaps that shape Phase 2

1. **No product photos for green, red, yellow or purple**, and none of the break-away clasp. Designs show these with clearly labelled code-built visuals, not fake photos.
2. **Existing product photos are small** (581 px discs, 1500 px box shots). Fine for cards and details, too soft for a full-bleed hero. Heroes lead with type, the code-built lanyard and glass, not a stretched photo.
3. **Lifestyle photos are stock-style** and some have type baked in. Used sparingly as crops. Assumed licensed for Corpafly's own channels (logged in `DECISIONS.md`).
4. **The box render shows branded packaging.** Orders ship in plain boxes, so the box is never shown.
5. **The hairline wordmark gets very thin at header sizes** (stroke is 6% of cap height). The logo set adds a small-size lockup with a heavier stroke for review.
