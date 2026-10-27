// Corpafly catalogue for the prototypes. Structure is real (BRIEF.md section 2).
// PRICES ARE PLACEHOLDERS: the standard 100-pack uses the Amazon reference ($26.87); the rest are invented
// for layout only and must always render with a "placeholder" label until Muneeb sets real prices.

export const PRICES_ARE_PLACEHOLDERS = true;

export const COLORS = {
  black:  { name: 'Black',  hex: '#1F1F1F', source: 'sampled from product photo' },
  blue:   { name: 'Blue',   hex: '#1E45A8', source: 'sampled from product photos' },
  green:  { name: 'Green',  hex: '#1F7A45', source: 'approximate, no photo yet' },
  red:    { name: 'Red',    hex: '#C42B2B', source: 'approximate, no photo yet' },
  yellow: { name: 'Yellow', hex: '#F2C12E', source: 'approximate, no photo yet' },
  purple: { name: 'Purple', hex: '#5E2D8C', source: 'approximate, no photo yet' },
};

// Facts only. Length, width and release force are not confirmed yet: render them as "to confirm".
export const PRODUCTS = [
  {
    handle: 'lanyard',
    title: 'Lanyard',
    line: 'standard',
    summary: 'Flat polyester neck strap with a swivel metal J-hook.',
    specs: [
      ['Strap', 'Flat polyester'],
      ['Hook', 'Swivel metal J-hook'],
      ['Clasp', 'None (one piece)'],
      ['Length', null],
      ['Width', null],
    ],
    packs: [
      { size: 100, price: 26.87, colors: ['black', 'blue', 'green', 'red'] },
    ],
  },
  {
    handle: 'break-away-lanyard',
    title: 'Break-Away Lanyard',
    line: 'breakaway',
    summary: 'Safety clasp at the neck that releases when the strap is pulled.',
    specs: [
      ['Strap', 'Flat polyester'],
      ['Hook', 'Swivel metal J-hook'],
      ['Clasp', 'Safety break-away, at the neck'],
      ['Release force', null],
      ['Length', null],
      ['Width', null],
    ],
    packs: [
      { size: 25,  price: 10.87, colors: ['black', 'blue', 'green', 'red', 'yellow', 'purple'] },
      { size: 50,  price: 17.87, colors: ['black', 'blue'] },
      { size: 100, price: 29.87, colors: ['black', 'blue'] },
    ],
  },
];

// Price per lanyard, rounded half up to whole cents (the theme must use decimal division, never integer).
export function perUnit(price, size) {
  return Math.round((price / size) * 100 + Number.EPSILON) / 100;
}

export function money(value) {
  return '$' + value.toFixed(2);
}

// Saving of one pack size against the smallest pack of the same product line, rounded down.
// Only shown at 5% or more, and only within one line (the standard lanyard never shows one).
export function savingVsSmallest(product, size) {
  const smallest = product.packs.reduce((a, b) => (a.size < b.size ? a : b));
  const pack = product.packs.find((p) => p.size === size);
  if (!pack || pack === smallest) return 0;
  const pct = Math.floor((1 - perUnit(pack.price, pack.size) / perUnit(smallest.price, smallest.size)) * 100);
  return pct >= 5 ? pct : 0;
}

// Every colour sold anywhere, in a fixed order, with the packs that carry it.
export function colourAvailability() {
  return Object.keys(COLORS).map((key) => ({
    key,
    ...COLORS[key],
    offers: PRODUCTS.flatMap((p) => p.packs.filter((k) => k.colors.includes(key)).map((k) => ({ product: p.handle, size: k.size }))),
  }));
}
