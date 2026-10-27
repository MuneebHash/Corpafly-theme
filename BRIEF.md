# Corpafly: Brand and Store Brief

Facts only. Where something is unknown it says so. Do not fill gaps with guesses; ask Muneeb.

## 1. The business

| Item | Fact |
|---|---|
| Brand | **Corpafly** |
| Company | CORPAFLY LLC, a Texas LLC |
| Owner and decision maker | Muneeb (based in Sydney, Australia). All design approvals come from him |
| What we sell | Lanyards in bulk packs: plain lanyards and safety break-away lanyards |
| Main channel today | Amazon US (Fulfilled by Amazon). Brand store: https://www.amazon.com/stores/Corpafly/page/A22E6A07-3E26-4917-A490-E97BC2BA9DB0 |
| New channel | Shopify store at **corpafly.com** (this repo builds its theme) |

## 2. Products

Current line (14 variants). Final list and prices for Shopify are still being set by Muneeb, so use these as structure and use placeholder prices marked as placeholders.

| Product | Pack | Colours | Notes |
|---|---|---|---|
| Lanyard (standard) | 100 pack | Black, Blue, Green, Red | Flat polyester neck strap, swivel metal J-hook |
| Break-Away Lanyard | 100 pack | Black, Blue | Safety break-away clasp at the neck, J-hook |
| Break-Away Lanyard | 50 pack | Black, Blue | Same |
| Break-Away Lanyard | 25 pack | Black, Blue, Green, Red, Yellow, Purple | Same |

- Real Amazon reference price: 100 pack, Black, standard lanyard is about **$26.87**.
- Amazon listing titles position the product as: for ID badges, keys, card holders, whistles; ideal for offices, teachers, kids and cruise ship cards.
- Break-away matters for safety: the clasp releases under pull. This is a real selling point for schools, hospitals, warehouses and kids.

## 3. Who buys

| Buyer | What they care about |
|---|---|
| Office managers, HR, admin | Bulk quantity, clean professional look, fast delivery, easy reorder |
| Schools and teachers | Safety break-away, colour coding by class or role, price per unit |
| Events and conferences | Volume, colour coding, arrives on time |
| Cruise passengers and travellers | Small packs, practical, cheap |

They are practical buyers. The site must feel premium and trustworthy, and buying must stay fast and obvious.

## 4. Brand identity today (what exists)

Seen on the Amazon brand store and in the brand files:

- **Logo mark:** a "CF" monogram of two overlapping bold chevron shapes: a teal "C" behind a black "F", set on a 45 degree diamond grid.
- **Wordmark:** CORPAFLY in uppercase, thin-weight geometric sans with round O and C, wide letter spacing.
- **Logo variants:** full colour (teal and black on white) in `Logo.png`, all black in `logo (black).png`, and white on black on the Amazon store.
- **Brand colours, sampled from the real files:**
  - Brand teal: **#1E806F** (logo "C", thank-you card border)
  - Brand black: **#050301** (logo "F", wordmark)
  - White
  - The Amazon store banners also use a dark teal or petrol tone. Treat it as derived, not core.
- **Photography in use:** office and corporate people wearing lanyards, product shots on solid colour circles, bold black and white type banners (for example "BLACK LANYARDS").
- **Print:** a thank-you card (front and back) in `brand/assets/`. Teal border, white panel, teal script "Thank You", uppercase body text.
- **Amazon brand store banners:** `brand/assets/storefront-images/`. Useful to see the current look; the new site should feel a clear step up from it.
- **Source files:** layered PSDs of the logo and card in `brand/assets/source-psd/`.
- **Video:** a short product video exists on the Amazon listings but is not in this repo. Leave a video slot in the designs.
- **Brand book:** none worth keeping. A new one is part of this project.

## 5. Store setup (already done, do not change)

| Item | Setting |
|---|---|
| Platform | Shopify, Basic plan |
| Market | United States only |
| Currency | USD |
| Fulfilment | Amazon Multi-Channel Fulfillment (MCF) from FBA stock. Orders ship in plain, unbranded boxes, standard or expedited speeds |
| Checkout | Shopify's own checkout. The theme never touches checkout |
| Store access | Password protected until launch |

Consequences for design:
- Do not promise branded packaging or unboxing. Boxes are plain.
- Shipping messaging must stay generic ("Ships from US warehouses", "Fast US delivery") until Muneeb confirms exact speeds and rates.

## 6. Hard rules

- **No fake content.** No invented reviews, testimonials, customer logos, award badges, stock counts, or "X people bought this". Design review and testimonial areas as empty-state ready modules.
- **No Amazon branding.** No Amazon logos, no "Prime", no Amazon review stars or copied Amazon reviews.
- **No copied assets.** Use references for ideas only. Never copy another site's images, code, illustrations or copy. Fonts and libraries must have licences that allow commercial use on a website.
- **No sensitive business data in this repo.** It is public. No addresses, tax numbers, bank details, emails or Shopify admin URLs.
- **Copy style:** plain, direct, confident. Short sentences. No filler, no hype words, no em dashes.

## 7. Deadlines

- Claude Code free credit expires **5 Nov 2026, 6:59 PM Sydney time**. All build work should land before then.
- Muneeb's target for design and theme: **1 Nov 2026**.
