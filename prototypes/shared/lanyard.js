// Code-built lanyard visuals for the prototypes (no photos exist for most colours yet).
// Geometry is generated once. Colour comes from the CSS custom property --strap (see lanyard.css), so a swatch
// can recolour a lanyard, and @property lets that change animate. Every function returns an SVG string.
//
//   hangingLanyard({ type: 'standard' | 'breakaway', uid })  -> { svg, anchor }  anchor = hook point in viewBox units
//   strand({ uid, length, bend })                            -> short strap piece, for swatch rails and cards
//   claspDetail({ uid })                                     -> close-up of the break-away clasp; halves have classes
//                                                              .ly-half-l / .ly-half-r so a page can pull them apart

const f = (n) => Math.round(n * 10) / 10;

// Weave: the strap is a stack of strokes along one centre line.
//   rim (full width, darker) -> body (slightly narrower) -> ribs (dashes = bands across the strap) -> sheen.
function strap(d, W, { ribs = true } = {}) {
  const pitch = Math.min(4, Math.max(2.2, W * 0.14)); // fine weave at any size
  return `<g class="ly-strap">
    <path class="ly-rim" d="${d}" stroke-width="${f(W)}"/>
    <path class="ly-body" d="${d}" stroke-width="${f(W - 1.6)}"/>
    ${ribs ? `<path class="ly-rib-d" d="${d}" stroke-width="${f(W - 2.4)}" stroke-dasharray="${f(pitch * 0.42)} ${f(pitch * 0.58)}"/>
    <path class="ly-rib-l" d="${d}" stroke-width="${f(W - 2.4)}" stroke-dasharray="${f(pitch * 0.3)} ${f(pitch * 0.7)}" stroke-dashoffset="${f(pitch * 0.55)}"/>` : ''}
    <path class="ly-sheen" d="${d}" stroke-width="${f(W * 0.26)}"/>
  </g>`;
}

function metalDefs(uid) {
  return `<linearGradient id="${uid}-metal" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#6F767B"/><stop offset=".28" stop-color="#E9EDEF"/><stop offset=".5" stop-color="#FFFFFF"/>
      <stop offset=".72" stop-color="#AEB5BA"/><stop offset="1" stop-color="#5E656A"/></linearGradient>
    <linearGradient id="${uid}-wire" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#F4F6F7"/><stop offset=".45" stop-color="#9BA3A8"/><stop offset=".6" stop-color="#E3E7E9"/><stop offset="1" stop-color="#7C8489"/></linearGradient>`;
}

// Crimp, swivel and J-hook, drawn downward from (x, y). u = strap width. Returns { svg, bottom }.
function hardware(uid, x, y, u) {
  const cw = u * 1.9, ch = u * 2.1;
  const sy = y + ch;                 // swivel top
  const ringY = sy + u * 1.3;        // swivel ring centre
  const hy = ringY + u * 0.44;       // hook top
  const w = u * 0.24;                // wire thickness
  // J-hook: shank down, round bottom, back up to an open tip; thin spring gate closes it.
  const hook = `M${f(x)} ${f(hy)} L${f(x)} ${f(hy + u * 2.3)}
    C${f(x)} ${f(hy + u * 3.6)} ${f(x - u * 0.25)} ${f(hy + u * 4.2)} ${f(x - u * 0.9)} ${f(hy + u * 4.2)}
    C${f(x - u * 1.6)} ${f(hy + u * 4.2)} ${f(x - u * 1.8)} ${f(hy + u * 3.5)} ${f(x - u * 1.74)} ${f(hy + u * 2.9)}
    L${f(x - u * 1.5)} ${f(hy + u * 1.75)}`;
  const gate = `M${f(x - u * 0.06)} ${f(hy + u * 1.35)} L${f(x - u * 1.42)} ${f(hy + u * 1.95)}`;
  const svg = `<g class="ly-hardware">
    <rect x="${f(x - cw / 2)}" y="${f(y)}" width="${f(cw)}" height="${f(ch)}" rx="${f(u * 0.28)}" fill="url(#${uid}-metal)"/>
    <rect x="${f(x - cw / 2)}" y="${f(y + ch * 0.3)}" width="${f(cw)}" height="${f(u * 0.1)}" fill="rgba(0,0,0,.16)"/>
    <rect x="${f(x - cw / 2)}" y="${f(y + ch * 0.66)}" width="${f(cw)}" height="${f(u * 0.1)}" fill="rgba(0,0,0,.16)"/>
    <rect x="${f(x - u * 0.38)}" y="${f(sy - 0.5)}" width="${f(u * 0.76)}" height="${f(u * 0.9)}" rx="${f(u * 0.14)}" fill="url(#${uid}-metal)"/>
    <circle cx="${f(x)}" cy="${f(ringY)}" r="${f(u * 0.42)}" fill="none" stroke="url(#${uid}-wire)" stroke-width="${f(w)}"/>
    <path d="${hook}" fill="none" stroke="url(#${uid}-wire)" stroke-width="${f(w * 1.15)}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${gate}" fill="none" stroke="#C5CBCF" stroke-width="${f(w * 0.55)}" stroke-linecap="round"/>
  </g>`;
  return { svg, bottom: hy + u * 4.2 + w };
}

// Break-away clasp centred on (x, y), lying along the strap (horizontal): one capsule split by a seam.
// Outer corners are rounded, seam corners square, so closed it reads as one part and open as two halves.
function clasp(x, y, u, open = 0) {
  const len = u * 1.3, h = u * 1.5, r = u * 0.42, gap = u * 0.06 + open;
  const half = (x0, dir) => {
    // dir = -1 for the left half (rounded on the left), +1 for the right half
    const xo = x0 + dir * len, t = y - h / 2, b = y + h / 2;
    return dir < 0
      ? `M${f(x0)} ${f(t)} H${f(xo + r)} Q${f(xo)} ${f(t)} ${f(xo)} ${f(t + r)} V${f(b - r)} Q${f(xo)} ${f(b)} ${f(xo + r)} ${f(b)} H${f(x0)} Z`
      : `M${f(x0)} ${f(t)} H${f(xo - r)} Q${f(xo)} ${f(t)} ${f(xo)} ${f(t + r)} V${f(b - r)} Q${f(xo)} ${f(b)} ${f(xo - r)} ${f(b)} H${f(x0)} Z`;
  };
  const ridge = (x0, dir) => `<path class="ly-plastic-hi" d="M${f(x0 + dir * u * 0.22)} ${f(y - h * 0.32)} V${f(y + h * 0.32)}" stroke-width="${f(u * 0.07)}"/>`;
  return `<g class="ly-clasp">
    <g class="ly-half-l"><path class="ly-plastic" d="${half(x - gap / 2, -1)}"/>${ridge(x - gap / 2, -1)}</g>
    <g class="ly-half-r"><path class="ly-plastic" d="${half(x + gap / 2, 1)}"/>${ridge(x + gap / 2, 1)}</g>
  </g>`;
}

let counter = 0;
const nextId = (p) => `${p}${(counter += 1).toString(36)}`;

// A lanyard hanging as worn: rounded loop at the top (around a neck), both sides converging to the crimp,
// swivel and J-hook. viewBox is 240 x 600. The badge (if any) hangs from `anchor`.
export function hangingLanyard({ type = 'standard', uid = nextId('ly'), title = 'Lanyard' } = {}) {
  const W = 13, cx = 120, top = 26, crimpY = 418;
  const left = `M${cx - 5} ${crimpY + 4} C${cx - 14} ${crimpY - 70} ${cx - 66} ${top + 170} ${cx - 76} ${top + 74}
    C${cx - 80} ${top + 26} ${cx - 46} ${top} ${cx} ${top}`;
  const right = `M${cx} ${top} C${cx + 46} ${top} ${cx + 80} ${top + 26} ${cx + 76} ${top + 74}
    C${cx + 66} ${top + 170} ${cx + 14} ${crimpY - 70} ${cx + 5} ${crimpY + 4}`;
  const hw = hardware(uid, cx, crimpY, W);
  const svg = `<svg class="ly ly-hanging" viewBox="0 0 240 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
    <defs>${metalDefs(uid)}</defs>
    ${strap(left, W)}${strap(right, W)}
    ${type === 'breakaway' ? clasp(cx, top, W) : ''}
    ${hw.svg}
  </svg>`;
  return { svg, anchor: { x: cx - W * 0.9, y: hw.bottom }, viewBox: [240, 600] };
}

// A short loose strap piece with a soft bend, ends cut square. viewBox is length x 60.
export function strand({ uid = nextId('st'), length = 260, bend = 0.22, title = '' } = {}) {
  const W = 14, y = 30, b = bend * 60;
  const d = `M8 ${y + b} C${length * 0.3} ${y - b} ${length * 0.62} ${y + b} ${length - 8} ${y - b * 0.4}`;
  return `<svg class="ly ly-strand" viewBox="0 0 ${length} 60" xmlns="http://www.w3.org/2000/svg" ${title ? `role="img" aria-label="${title}"` : 'aria-hidden="true"'}>
    <defs>${metalDefs(uid)}</defs>${strap(d, W)}
  </svg>`;
}

// Close-up of a break-away clasp joining two strap ends. viewBox 320 x 120.
// Halves are .ly-half-l / .ly-half-r and strap ends .ly-end-l / .ly-end-r, so a page can translate them apart.
export function claspDetail({ uid = nextId('cl'), title = 'Break-away clasp' } = {}) {
  const W = 34, y = 60, cx = 160;
  return `<svg class="ly ly-clasp-detail" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
    <defs>${metalDefs(uid)}</defs>
    <g class="ly-end-l">${strap(`M-6 ${y + 6} C40 ${y + 4} 80 ${y} ${cx - 30} ${y}`, W)}</g>
    <g class="ly-end-r">${strap(`M${cx + 30} ${y} C240 ${y} 280 ${y - 4} 326 ${y - 6}`, W)}</g>
    ${clasp(cx, y, W)}
  </svg>`;
}
