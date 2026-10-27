/* Corpafly prototype, Direction C: "Order Desk".
   One ES module, no libraries. Prices and per-lanyard maths come from ../shared/products.js and every
   lanyard drawing from ../shared/lanyard.js. Sections:
     1. Helpers           5. Cart drawer           9. Use cases and compare loaders
     2. Rolling digits    6. Order links           10. Header and menu
     3. Order builder     7. Phone summary bar     11. Start
     4. Preview desk      8. Finder, pull demo                                                    */

import { PRODUCTS, COLORS, perUnit } from '../shared/products.js';
import { hangingLanyard, strand, claspDetail } from '../shared/lanyard.js';

/* ---------- 1. Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="../shared/icons.svg#${id}"/></svg>`;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const motionPref = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => motionPref.matches;
const rootStyle = getComputedStyle(document.documentElement);
const token = (name, fallback) => rootStyle.getPropertyValue(name).trim() || fallback;
const EASE = {
  standard: token('--ease-standard', 'ease'),
  out: token('--ease-out', 'ease-out'),
  in: token('--ease-in', 'ease-in'),
};
// The spring is a linear() curve from tokens.css; browsers without linear() get the entrance curve.
const SPRING = CSS.supports('transition-timing-function', 'linear(0, 1)') ? token('--ease-spring', EASE.out) : EASE.out;

// Money is kept in whole cents so sums never drift; per-lanyard prices use perUnit() (rounded half up).
const toCents = (dollars) => Math.round(dollars * 100);
const usd = (cents) => (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const num = (n) => n.toLocaleString('en-US');
const plural = (n, word) => `${num(n)} ${word}${n === 1 ? '' : 's'}`;
const listNames = (keys) => {
  const names = keys.map((k) => COLORS[k].name);
  return names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
};

const TYPE_NAME = { standard: 'Lanyard', breakaway: 'Break-Away Lanyard' };
// "Break-Away" must never split across lines; Hanken has no non-breaking hyphen glyph, so wrap it in a nowrap span.
const nb = (text) => text.replace(/Break-Away|[Bb]reak-away/g, '<span class="nb">$&</span>');
const COLOR_KEYS = Object.keys(COLORS);
const MAX_PACKS = 999; // covers the finder's largest answer (134 packs per color at 9,999 people in 3 groups)
const productOf = (type) => PRODUCTS.find((p) => p.line === type);
const packOf = (type, size) => productOf(type).packs.find((p) => p.size === size);
const unitCents = (pack) => toCents(perUnit(pack.price, pack.size));

/* Steppers: the same markup in the builder, the cart and the finder. Buttons carry data-step; the field is a
   text input with role="spinbutton" so it accepts typing and arrow keys. aria-disabled (not disabled) keeps focus
   on a button that reaches its limit. */
function stepperHTML({ value, label, thing, min = 0, max = MAX_PACKS }) {
  return `<div class="stepper">
    <button type="button" class="stepper__btn" data-step="-1" aria-label="Fewer ${thing}"${value <= min ? ' aria-disabled="true"' : ''}>${icon('i-minus')}</button>
    <input class="stepper__val num" type="text" inputmode="numeric" autocomplete="off" value="${value}" aria-label="${label}" role="spinbutton" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${value}">
    <button type="button" class="stepper__btn" data-step="1" aria-label="More ${thing}"${value >= max ? ' aria-disabled="true"' : ''}>${icon('i-plus')}</button>
  </div>`;
}
function syncStepper(stepper, n, { min = 0, max = MAX_PACKS, write = true } = {}) {
  const input = $('.stepper__val', stepper);
  if (write) input.value = String(n);
  input.setAttribute('aria-valuenow', n);
  const [less, more] = $$('.stepper__btn', stepper);
  setFlag(less, 'aria-disabled', n <= min);
  setFlag(more, 'aria-disabled', n >= max);
}
// ARIA states need the literal "true"; toggleAttribute would write an empty value.
function setFlag(el, attr, on) {
  if (on) el.setAttribute(attr, 'true');
  else el.removeAttribute(attr);
}
// Wires every stepper inside `root`. get(stepper) reads the stored value, set(stepper, n, typing) stores a new one.
function wireSteppers(root, { min, max, get, set }) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.stepper__btn');
    if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
    const st = btn.closest('.stepper');
    set(st, clamp(get(st) + Number(btn.dataset.step), min, max), false);
  });
  root.addEventListener('input', (e) => {
    const input = e.target.closest('.stepper__val');
    if (!input) return;
    const clean = input.value.replace(/\D/g, '').slice(0, String(max).length);
    if (clean !== input.value) input.value = clean;
    if (clean !== '') set(input.closest('.stepper'), clamp(Number(clean), min, max), true);
  });
  root.addEventListener('keydown', (e) => {
    const input = e.target.closest('.stepper__val');
    const step = { ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key];
    if (!input || !step) return;
    e.preventDefault();
    const st = input.closest('.stepper');
    set(st, clamp(get(st) + step, min, max), false);
  });
  // Leaving a field rewrites it from the stored value ("" becomes the minimum, "07" becomes "7").
  root.addEventListener('focusout', (e) => {
    const input = e.target.closest('.stepper__val');
    if (!input) return;
    const st = input.closest('.stepper');
    if (input.value === '') set(st, min, false);
    else input.value = String(get(st));
  });
}

/* ---------- 2. Rolling digits ----------
   Each digit is a 0-9 strip in a one-line window; changing the value slides every strip to its digit (240ms).
   Under reduced motion the CSS transition is off, so values change instantly. Screen readers get plain text. */
const isDigit = (ch) => ch >= '0' && ch <= '9';
const digitsOf = (s) => [...s].filter(isDigit).map(Number);
class Roller {
  constructor(host) {
    this.text = host.textContent.trim();
    this.vis = document.createElement('span');
    this.vis.className = 'roll';
    this.vis.setAttribute('aria-hidden', 'true');
    this.sr = document.createElement('span');
    this.sr.className = 'visually-hidden';
    host.replaceChildren(this.vis, this.sr);
    this.build(this.text, this.text); // start on the final digits: nothing rolls on load
    this.paint();
  }
  set(text) {
    if (text === this.text) return;
    const prev = this.text;
    this.text = text;
    const shape = (s) => s.replace(/\d/g, '0');
    if (shape(prev) !== shape(text)) this.build(text, prev);
    this.paint();
  }
  // Rebuild when the number changes shape ($9.99 to $10.00). New columns start from the digit that sat in the
  // same place before, counted from the right, so the change still reads as a roll.
  build(text, prev) {
    const before = digitsOf(prev);
    const count = digitsOf(text).length;
    this.strips = [];
    this.vis.replaceChildren(...[...text].map((ch) => {
      const cell = document.createElement('span');
      if (!isDigit(ch)) {
        cell.className = 'roll__ch';
        cell.textContent = ch;
        return cell;
      }
      cell.className = 'roll__col';
      const strip = document.createElement('span');
      strip.className = 'roll__strip';
      strip.textContent = '0\n1\n2\n3\n4\n5\n6\n7\n8\n9';
      strip.style.transition = 'none';
      strip.style.setProperty('--d', before[before.length - count + this.strips.length] ?? 0);
      this.strips.push(strip);
      cell.append(strip);
      return cell;
    }));
    this.vis.getBoundingClientRect(); // commit the start positions before rolling
    this.strips.forEach((s) => { s.style.transition = ''; });
  }
  paint() {
    this.sr.textContent = this.text;
    const d = digitsOf(this.text);
    this.strips.forEach((s, i) => s.style.setProperty('--d', d[i]));
  }
}
const rollers = Object.fromEntries($$('[data-roll]').map((el) => [el.dataset.roll, new Roller(el)]));

// ?capture puts sticky and fixed parts back in the flow for full-page screenshots (see styles.css).
document.documentElement.classList.toggle('is-capture', new URLSearchParams(location.search).has('capture'));

/* ---------- 3. Order builder ---------- */
const order = { type: 'standard', size: 100, qty: { black: 1 } };

function summarize({ type, size, qty } = order) {
  const pack = packOf(type, size);
  const lines = pack.colors.filter((c) => qty[c] > 0).map((c) => ({
    color: c, packs: qty[c], lanyards: qty[c] * size, cents: qty[c] * toCents(pack.price),
  }));
  const packs = lines.reduce((sum, l) => sum + l.packs, 0);
  return { type, size, pack, lines, packs, lanyards: packs * size, cents: packs * toCents(pack.price), unit: unitCents(pack) };
}

const builder = $('#builder');
const rowsEl = $('#rows');
const notice = $('#color-notice');
const moreBtn = $('#more-colors');
const copyStatus = $('#copy-status');
const COPY_HELP = copyStatus.textContent;

function renderPacks() {
  const product = productOf(order.type);
  for (const input of $$('input[name="pack"]', builder)) {
    const pack = product.packs.find((p) => p.size === Number(input.value));
    input.disabled = !pack;
    input.checked = pack?.size === order.size;
    $('.seg__sub', input.parentElement).innerHTML = pack ? `<span class="num">${usd(unitCents(pack))}</span> each` : 'Break-Away only';
  }
  $('#pack-note').textContent = order.type === 'standard' ? 'Lanyard comes in the 100 pack only.' : '';
}

function renderRows() {
  const { colors } = packOf(order.type, order.size);
  rowsEl.innerHTML = colors.map((c) => {
    const n = order.qty[c] || 0;
    const { name, hex } = COLORS[c];
    return `<li class="row${n ? ' is-on' : ''}" data-color="${c}" style="--strap:${hex}">
      <span class="chip" aria-hidden="true"></span>
      <span class="row__text"><span class="row__name">${name}</span><span class="row__meta num">${plural(n * order.size, 'lanyard')}</span></span>
      ${stepperHTML({ value: n, label: `${name}, packs`, thing: `${name} packs` })}
    </li>`;
  }).join('');
  // Point to the colours this pack does not come in, with a one-tap switch to the pack that has them.
  const wide = packOf('breakaway', 25);
  const extra = wide.colors.filter((c) => !colors.includes(c));
  moreBtn.hidden = extra.length === 0;
  moreBtn.innerHTML = order.type === 'standard'
    ? `${listNames(extra)} come in the ${nb('break-away')} 25 pack`
    : `${listNames(extra)} come in the 25 pack`;
}

// Switch type or pack. Colours the new pack is not made in come off the order, and the notice says so.
function reconfigure(type, size) {
  const { colors } = packOf(type, size);
  const dropped = COLOR_KEYS.filter((c) => order.qty[c] > 0 && !colors.includes(c));
  const qty = {};
  for (const c of colors) if (order.qty[c] > 0) qty[c] = order.qty[c];
  if (!Object.keys(qty).length) qty[colors[0]] = 1;
  Object.assign(order, { type, size, qty });
  renderPacks();
  renderRows();
  notice.textContent = dropped.length
    ? `${listNames(dropped)} ${dropped.length === 1 ? 'is' : 'are'} not made in this pack, so ${dropped.length === 1 ? 'it' : 'they'} came off the order.`
    : '';
  update();
}

builder.addEventListener('change', (e) => {
  if (e.target.name === 'type') {
    const sizes = productOf(e.target.value).packs.map((p) => p.size);
    reconfigure(e.target.value, sizes.includes(order.size) ? order.size : Math.max(...sizes));
  } else if (e.target.name === 'pack') {
    reconfigure(order.type, Number(e.target.value));
  }
});

moreBtn.addEventListener('click', () => {
  const before = packOf(order.type, order.size).colors;
  $('input[name="type"][value="breakaway"]', builder).checked = true;
  reconfigure('breakaway', 25);
  // The link disappears in the 25 pack, so move focus to the first colour it added.
  const first = packOf('breakaway', 25).colors.find((c) => !before.includes(c));
  $(`.row[data-color="${first}"] .stepper__val`, rowsEl)?.focus();
});

wireSteppers(rowsEl, {
  min: 0,
  max: MAX_PACKS,
  get: (st) => order.qty[st.closest('.row').dataset.color] || 0,
  set: (st, n, typing) => {
    const row = st.closest('.row');
    order.qty[row.dataset.color] = n;
    syncStepper(st, n, { write: !typing });
    row.classList.toggle('is-on', n > 0);
    $('.row__meta', row).textContent = plural(n * order.size, 'lanyard');
    update();
  },
});

let announceTimer = 0;
function update({ announce = true } = {}) {
  const s = summarize();
  rollers.unit.set(usd(s.unit));
  rollers.packs.set(num(s.packs));
  rollers.lanyards.set(num(s.lanyards));
  rollers.total.set(usd(s.cents));
  rollers['ticket-unit'].set(usd(s.unit));
  rollers['ticket-total'].set(usd(s.cents));
  rollers['bar-total'].set(usd(s.cents));
  $('#bar-unit').textContent = usd(s.unit);
  $('#ticket-count').textContent = `${plural(s.packs, 'pack')}, ${plural(s.lanyards, 'lanyard')}`;
  $('#ticket-product').innerHTML = $('#desk-product').innerHTML = `${nb(TYPE_NAME[s.type])}, ${s.size} pack`;
  for (const btn of [$('#add'), $('#bar-add')]) btn.setAttribute('aria-disabled', String(s.packs === 0));
  if (copyStatus.classList.contains('is-active')) { // a copied link no longer matches the order
    copyStatus.textContent = COPY_HELP;
    copyStatus.classList.remove('is-active');
  }
  renderTicket(s);
  renderStage(s);
  if (!announce) return;
  clearTimeout(announceTimer);
  announceTimer = setTimeout(() => {
    $('#order-live').textContent = s.packs
      ? `${plural(s.packs, 'pack')}, ${plural(s.lanyards, 'lanyard')}. Total ${usd(s.cents)}, ${usd(s.unit)} per lanyard.`
      : 'No packs in this order yet.';
  }, 450);
}

// Load a whole order into the builder (order links, finder, use cases, compare table).
function applyOrder(o, { announce = true } = {}) {
  Object.assign(order, { type: o.type, size: o.size, qty: { ...o.qty } });
  $$('input[name="type"]', builder).forEach((r) => { r.checked = r.value === o.type; });
  renderPacks();
  renderRows();
  update({ announce });
}
function loadOrder(o, label) {
  applyOrder(o);
  notice.textContent = `${label} loaded. Change anything, then add to cart.`;
  $('#order-title').focus({ preventScroll: true });
  $('#order').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
}

/* ---------- 4. Preview desk: hanging lanyards and the glass receipt ---------- */
const stage = $('#stage');

function hangEl(color, type) {
  const el = document.createElement('div');
  el.className = 'hang is-ghost';
  el.dataset.color = color;
  el.style.setProperty('--strap', COLORS[color].hex);
  el.innerHTML = `<div class="hang__tag"><span class="hang__count num"></span><span class="hang__name">${COLORS[color].name}</span></div>
    <div class="hang__body"><span class="hang__peg"></span><div class="hang__ly"></div></div>`;
  drawLanyard(el, type, false);
  return el;
}
function drawLanyard(el, type, animate = true) {
  el.dataset.type = type;
  const box = $('.hang__ly', el);
  box.innerHTML = hangingLanyard({ type, title: TYPE_NAME[type] }).svg;
  if (animate && !reduced()) box.animate([{ opacity: 0.3 }, { opacity: 1 }], { duration: 240, easing: EASE.standard });
}
const liveHangs = () => $$('.hang:not(.is-out)', stage)
  .sort((a, b) => COLOR_KEYS.indexOf(a.dataset.color) - COLOR_KEYS.indexOf(b.dataset.color));

// Every colour the current type and pack comes in hangs on its own peg: ordered colours solid with their pack count,
// the rest as faint ghosts, so the desk shows what is possible. Slots move only when the type or pack changes.
function renderStage(s) {
  const qty = new Map(s.lines.map((l) => [l.color, l.packs]));
  const live = new Map(liveHangs().map((el) => [el.dataset.color, el]));
  for (const [color, el] of live) {
    if (s.pack.colors.includes(color)) continue;
    el.classList.add('is-out'); // the new pack is not made in this colour: it lifts out and leaves the DOM
    setTimeout(() => el.remove(), reduced() ? 160 : 360);
  }
  const motion = 'ready' in stage.dataset && !reduced();
  const items = s.pack.colors.map((color, i) => {
    let el = live.get(color);
    if (!el) {
      // Place a new lanyard on its peg before it enters the DOM, so it drops in there instead of gliding from x = 0.
      el = hangEl(color, s.type);
      el.style.setProperty('--x', slotX(i, s.pack.colors.length));
      stage.append(el);
    } else if (el.dataset.type !== s.type) drawLanyard(el, s.type);
    const n = qty.get(color) || 0;
    const wasGhost = el.classList.contains('is-ghost');
    el.classList.toggle('is-ghost', !n);
    $('.hang__count', el).textContent = n ? `×${n}` : '';
    if (motion && wasGhost !== !n) {
      // Ordered: it drops onto its peg as it firms up. Removed: a small unhooking lift as it fades back to a ghost.
      $('.hang__ly', el).animate(n
        ? [{ transform: 'translateY(-22px)' }, { transform: 'none' }]
        : [{ transform: 'none' }, { transform: 'translateY(-8px)' }, { transform: 'none' }],
      { duration: 320, easing: n ? SPRING : EASE.standard });
    }
    return el;
  });
  layoutStage(items);
}
// Peg i of n, spread evenly. Few slots sit left of centre, clear of the receipt; more slots spread to the full width,
// so the right-hand lanyards hang behind the glass and colour it.
function slotX(i, n) {
  const cs = getComputedStyle(stage);
  const W = stage.clientWidth;
  const w = parseFloat(cs.getPropertyValue('--w')) || 136;
  const c0 = parseFloat(cs.getPropertyValue('--center')) || 0.5;
  const center = W * (c0 + (0.5 - c0) * Math.min(1, (n - 1) / 4));
  const room = Math.min(center, W - center) - 20 - w / 2;
  const gap = n > 1 ? Math.min(w * 0.95, (2 * room) / (n - 1)) : 0;
  return `${(center + (i - (n - 1) / 2) * gap).toFixed(1)}px`;
}
// Lanyards already on the desk glide to their new pegs (the CSS transform transition).
function layoutStage(items = liveHangs()) {
  const n = items.length;
  if (!n) return;
  items.forEach((el, i) => el.style.setProperty('--x', slotX(i, n)));
}
new ResizeObserver(() => layoutStage()).observe(stage);

// Receipt lines: keyed by colour. New lines fade down into their slot, removed lines fade out, and lines that move
// glide to their new slot (FLIP).
const ticketLines = $('#ticket-lines');
function renderTicket(s) {
  const motion = !reduced() && ticketLines.getClientRects().length > 0;
  const first = new Map();
  if (motion) for (const el of ticketLines.children) first.set(el, el.getBoundingClientRect().top);
  const current = new Map([...ticketLines.children].filter((el) => !el.classList.contains('is-out')).map((el) => [el.dataset.key, el]));
  const keep = new Set(s.lines.map((l) => l.color));
  for (const [key, el] of current) {
    if (keep.has(key)) continue;
    if (motion) {
      el.classList.add('is-out');
      Object.assign(el.style, { position: 'absolute', top: `${el.offsetTop}px`, left: 0, right: 0 });
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'linear', fill: 'forwards' });
      setTimeout(() => el.remove(), 160);
    } else el.remove();
  }
  let prev = null;
  for (const l of s.lines) {
    let el = current.get(l.color);
    const fresh = !el;
    if (fresh) {
      el = document.createElement('li');
      el.className = 'ticket__line';
      el.dataset.key = l.color;
      el.style.setProperty('--strap', COLORS[l.color].hex);
      el.innerHTML = `<span class="ticket__name"><span class="chip" aria-hidden="true"></span>${COLORS[l.color].name}</span><span class="ticket__qty num"></span><span class="ticket__sub num"></span>`;
    }
    $('.ticket__qty', el).textContent = `${l.packs} × ${usd(toCents(s.pack.price))}`;
    $('.ticket__sub', el).textContent = usd(l.cents);
    const ref = prev ? prev.nextElementSibling : ticketLines.firstElementChild;
    if (el !== ref) ticketLines.insertBefore(el, ref);
    prev = el;
    if (fresh && motion) el.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: EASE.out });
  }
  if (motion) {
    for (const [el, top] of first) {
      if (!el.isConnected || el.classList.contains('is-out')) continue;
      const dy = top - el.getBoundingClientRect().top;
      if (Math.abs(dy) > 0.5) el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 240, easing: EASE.standard });
    }
  }
  $('#ticket-empty').hidden = s.lines.length > 0;
}

/* ---------- 5. Cart drawer ---------- */
const cart = []; // { type, size, color, packs }
const dialog = $('#cart');
const cartList = $('#cart-lines');
let returnFocus = null;
let drawerOpen = false;
let headerPending = false;

function cartTotals() {
  return cart.reduce((t, item) => {
    const pack = packOf(item.type, item.size);
    t.packs += item.packs;
    t.lanyards += item.packs * item.size;
    t.cents += item.packs * toCents(pack.price);
    return t;
  }, { packs: 0, lanyards: 0, cents: 0 });
}
function renderCart() {
  cartList.innerHTML = cart.map((item, i) => {
    const pack = packOf(item.type, item.size);
    const { name, hex } = COLORS[item.color];
    const what = `${name} ${TYPE_NAME[item.type]}, ${item.size} pack`;
    return `<li class="cline" data-i="${i}" style="--strap:${hex}">
      <span class="chip" aria-hidden="true"></span>
      <div>
        <p class="cline__title">${nb(TYPE_NAME[item.type])}</p>
        <p class="cline__meta">${name}, ${item.size} pack</p>
        <p class="cline__unit"><span class="num">${usd(unitCents(pack))}</span> per lanyard, <span class="num cline__count">${num(item.packs * item.size)}</span> lanyards</p>
      </div>
      <p class="cline__price num">${usd(item.packs * toCents(pack.price))}</p>
      <div class="cline__ctl">
        ${stepperHTML({ value: item.packs, label: `Packs of ${what}`, thing: `${name} packs`, min: 1 })}
        <button type="button" class="link-btn" data-remove>Remove<span class="visually-hidden"> ${what}</span></button>
      </div>
    </li>`;
  }).join('');
  refreshCartTotals();
}
function refreshCartTotals() {
  const t = cartTotals();
  $('#cart-empty').hidden = cart.length > 0;
  $('#cart-sum').textContent = cart.length ? `${plural(t.packs, 'pack')}, ${plural(t.lanyards, 'lanyard')}` : 'Empty';
  $('#cart-subtotal').textContent = usd(t.cents);
  $('#cart-state').textContent = cart.length ? `${plural(t.packs, 'pack')}, ${usd(t.cents)}` : 'Empty';
  // The header total rolls once the drawer closes, so the buyer sees it change.
  if (drawerOpen) headerPending = true;
  else paintHeader();
}
function paintHeader() {
  const t = cartTotals();
  rollers.cart.set(usd(t.cents));
  $('#cart-count').textContent = num(t.packs);
  headerPending = false;
}
// The drawer's own live region: focus stays on a + or Remove button whose label never changes, so say what changed.
let cartLiveTimer = 0;
function announceCart(text) {
  clearTimeout(cartLiveTimer);
  cartLiveTimer = setTimeout(() => { $('#cart-live').textContent = text; }, 450);
}

wireSteppers(cartList, {
  min: 1,
  max: MAX_PACKS,
  get: (st) => cart[st.closest('.cline').dataset.i].packs,
  set: (st, n, typing) => {
    const line = st.closest('.cline');
    const item = cart[line.dataset.i];
    item.packs = n;
    syncStepper(st, n, { min: 1, write: !typing });
    $('.cline__price', line).textContent = usd(n * toCents(packOf(item.type, item.size).price));
    $('.cline__count', line).textContent = num(n * item.size);
    refreshCartTotals();
    announceCart(`${COLORS[item.color].name} ${TYPE_NAME[item.type]}, ${item.size} pack: ${plural(n, 'pack')}, ${usd(n * toCents(packOf(item.type, item.size).price))}. Subtotal ${usd(cartTotals().cents)}.`);
  },
});
cartList.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  const i = Number(btn.closest('.cline').dataset.i);
  const [gone] = cart.splice(i, 1);
  renderCart();
  announceCart(cart.length
    ? `Removed ${COLORS[gone.color].name} ${TYPE_NAME[gone.type]}, ${gone.size} pack. Subtotal ${usd(cartTotals().cents)}.`
    : 'Removed. Your cart is empty.');
  // Keep focus in the drawer: the next line's Remove, else the previous one, else the close button.
  const next = $$('[data-remove]', cartList)[Math.min(i, cart.length - 1)];
  (next || $('[data-close]', dialog)).focus();
});

function addOrderToCart(trigger) {
  const s = summarize();
  if (!s.packs) {
    notice.textContent = 'Set at least 1 pack, then add to cart.';
    $('.stepper__val', rowsEl).focus();
    return;
  }
  for (const l of s.lines) {
    const hit = cart.find((c) => c.type === s.type && c.size === s.size && c.color === l.color);
    if (hit) hit.packs = Math.min(MAX_PACKS, hit.packs + l.packs);
    else cart.push({ type: s.type, size: s.size, color: l.color, packs: l.packs });
  }
  openCart(trigger);
  renderCart();
}

function openCart(trigger) {
  if (dialog.open) return;
  returnFocus = trigger;
  drawerOpen = true;
  dialog.showModal();
  document.documentElement.classList.add('is-locked'); // nothing scrolls behind the glass, so it never re-blurs
  syncBar();
  dialog.animate(
    reduced() ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: 'translateX(100%)' }, { transform: 'none' }],
    { duration: reduced() ? 150 : 320, easing: EASE.out },
  );
}
function closeCart() {
  if (!dialog.open || dialog.dataset.closing) return;
  dialog.dataset.closing = '1';
  const ms = reduced() ? 150 : 200;
  dialog.animate(
    reduced() ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'none' }, { transform: 'translateX(100%)' }],
    { duration: ms, easing: EASE.in, fill: 'forwards' },
  );
  // Close on a timer rather than the animation's finish event, which a busy or background tab can hold back.
  setTimeout(() => {
    delete dialog.dataset.closing;
    dialog.getAnimations().forEach((a) => a.cancel());
    dialog.close();
    document.documentElement.classList.remove('is-locked');
    drawerOpen = false;
    syncBar();
    returnFocus?.focus();
    if (headerPending) setTimeout(paintHeader, 120);
  }, ms);
}
dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeCart(); }); // Escape
dialog.addEventListener('click', (e) => {
  // The inner wrapper fills the dialog, so a click whose target is the dialog itself landed on the backdrop.
  if (e.target === dialog || e.target.closest('[data-close]')) closeCart();
});
$('#cart-open').addEventListener('click', (e) => openCart(e.currentTarget));
builder.addEventListener('submit', (e) => { e.preventDefault(); addOrderToCart($('#add')); });
$('#bar-add').addEventListener('click', (e) => addOrderToCart(e.currentTarget));
$('#checkout').addEventListener('click', (e) => {
  e.preventDefault();
  $('#cart-status').textContent = 'In the live store this opens Shopify\'s own secure checkout.';
});

/* ---------- 6. Order links ----------
   "Copy order link" makes a link to this page with the order in the hash, so a colleague who opens it gets the
   same order in their builder. In the theme this becomes a Shopify cart permalink (/cart/ID:QTY,...). */
const encodeOrder = ({ type, size, qty }) => `${type}-${size}:${COLOR_KEYS.filter((c) => qty[c] > 0).map((c) => `${c}.${qty[c]}`).join(',')}`;
function decodeOrder(str) {
  const m = /^(standard|breakaway)-(\d+):([a-z0-9.,]*)$/.exec(str);
  const pack = m && packOf(m[1], Number(m[2]));
  if (!pack) return null;
  const qty = {};
  for (const part of m[3].split(',')) {
    const [c, n] = part.split('.');
    if (pack.colors.includes(c)) qty[c] = clamp(parseInt(n, 10) || 0, 0, MAX_PACKS);
  }
  return { type: m[1], size: pack.size, qty };
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false; // no clipboard permission: the link is shown instead, to copy by hand
  }
}
$('#copy-link').addEventListener('click', async () => {
  const s = summarize();
  copyStatus.classList.add('is-active');
  if (!s.packs) {
    copyStatus.textContent = 'Set at least 1 pack first.';
    return;
  }
  const url = `${location.origin}${location.pathname}#order=${encodeOrder(order)}`;
  const ok = await copyText(url);
  copyStatus.textContent = ok
    ? `Link copied. It opens this order: ${plural(s.packs, 'pack')} of ${TYPE_NAME[s.type]}, ${s.size} pack.`
    : `Copy this link: ${url}`;
});
$('#cart-copy').addEventListener('click', async () => {
  const status = $('#cart-status');
  if (!cart.length) {
    status.textContent = 'Your cart is empty.';
    return;
  }
  // Mock permalink: real variant IDs replace these handles in the theme.
  const url = `https://corpafly.com/cart/${cart.map((c) => `${c.type}-${c.size}-${c.color}:${c.packs}`).join(',')}`;
  status.textContent = (await copyText(url)) ? 'Reorder link copied (a mock link in this prototype).' : `Copy this link: ${url}`;
});
function loadFromHash() {
  const m = /^#order=(.+)$/.exec(location.hash);
  const o = m && decodeOrder(decodeURIComponent(m[1]));
  if (!o) return false;
  applyOrder(o, { announce: false });
  notice.textContent = 'Loaded from an order link. Check it, then add to cart.';
  return true;
}
addEventListener('hashchange', loadFromHash);

/* ---------- 7. Phone and tablet summary bar ----------
   Shown while the order desk is on screen and the builder's own tally (with its Add button) is not. Hidden in the
   sections below, where it would sit beside other totals and buttons, and under the open drawer. */
const bar = $('#buybar');
const wideQuery = matchMedia('(min-width: 1100px)');
let tallyInView = false;
let deskInView = true;
function syncBar() {
  const hide = wideQuery.matches || tallyInView || drawerOpen || !deskInView;
  bar.classList.toggle('is-hidden', hide);
  bar.inert = hide;
}
new IntersectionObserver(([e]) => { tallyInView = e.isIntersecting; syncBar(); }).observe($('#tally'));
new IntersectionObserver(([e]) => { deskInView = e.isIntersecting; syncBar(); }).observe($('#order'));
wideQuery.addEventListener('change', syncBar);
// WCAG 2.4.11: a focused control must never sit under the phone bar. The browser only scrolls for controls it
// thinks are off screen, so after it has done its own scrolling, nudge the page (keyboard focus only).
document.addEventListener('focusin', (e) => {
  const el = e.target;
  if (!(el instanceof Element) || el.closest('#buybar, dialog')) return;
  requestAnimationFrame(() => {
    if (!el.matches(':focus-visible') || bar.classList.contains('is-hidden')) return;
    const overlap = el.getBoundingClientRect().bottom - bar.getBoundingClientRect().top;
    if (overlap > -8) scrollBy({ top: overlap + 24, behavior: 'instant' });
  });
});

/* ---------- 8a. Finder ----------
   Honest maths, shown in full: packs per colour = ceil(people per colour group / pack size), and colour groups split
   the packs across colours. No discounts are implied.
   - Adults at work: the standard Lanyard in 100 packs (rounded up), with Break-Away as the alternative. Under 60 people
     per colour group the 25 and 50 Break-Away packs fit better, so they lead and the Lanyard becomes the alternative.
     5 or 6 groups need the Break-Away 25 pack, the only pack made in more than 4 colors.
   - Kids, or anywhere a caught strap is a risk: always Break-Away, the cheapest pack size that covers the groups. */
const finderForm = $('#finder-form');
const peopleStepper = $('#people').closest('.stepper');
let people = 80;
let currentRec = null;
let lastSig = '';

const SMALL_GROUP = 60; // below this many people per colour, a 100 pack leaves too many spare
function recommend({ people: n, wear, groups }) {
  const colorsNeeded = Math.max(1, groups);
  const perColor = Math.ceil(n / colorsNeeded);
  const option = (type, pack) => {
    const each = Math.ceil(perColor / pack.size);
    const packs = each * colorsNeeded;
    return { type, pack, each, packs, lanyards: packs * pack.size, cents: packs * toCents(pack.price), colors: pack.colors.slice(0, colorsNeeded) };
  };
  // Break-Away packs made in enough colours, cheapest first (ties: fewer spare lanyards).
  const breakaway = (maxSize = Infinity) => productOf('breakaway').packs
    .filter((pack) => pack.colors.length >= colorsNeeded && pack.size <= maxSize)
    .map((pack) => option('breakaway', pack))
    .sort((a, b) => a.cents - b.cents || a.lanyards - b.lanyards);
  const lanyard = productOf('standard').packs[0]; // the 100 pack, in 4 colors
  const scope = groups ? `${groups} groups of about ${num(perColor)}` : (n === 1 ? '1 person' : `${num(n)} people`);
  const why = [];
  let best;
  let alt = null;
  if (wear === 'safety') {
    const options = breakaway();
    [best, alt = null] = options;
    why.push('Break-away, because the clasp opens if the strap is caught.', `Lowest total that covers ${scope}.`);
    if (options.length === 1 && colorsNeeded > 2) why.push(`Only the 25 pack comes in ${colorsNeeded} colors.`);
  } else if (colorsNeeded > lanyard.colors.length) {
    [best] = breakaway();
    why.push(`The Lanyard comes in ${lanyard.colors.length} colors. For ${colorsNeeded} groups, the break-away 25 pack has all 6.`);
  } else if (perColor < SMALL_GROUP) {
    [best] = breakaway(50);
    alt = option('standard', lanyard);
    why.push(`The Lanyard only comes in 100 packs, so for ${scope} the break-away ${best.pack.size} pack fits better.`);
  } else {
    best = option('standard', lanyard);
    [alt] = breakaway();
    why.push(`The standard Lanyard, in 100 packs rounded up to cover ${scope}.`);
  }
  return { ...best, people: n, spare: best.lanyards - n, why, alt };
}

function renderResult({ animate = true } = {}) {
  const r = recommend({ people, wear: finderForm.elements.wear.value, groups: Number(finderForm.elements.groups.value) });
  const sig = [r.type, r.pack.size, r.each, r.colors.join(), r.people].join('|');
  if (sig === lastSig) return;
  lastSig = sig;
  currentRec = r;
  const chips = r.colors.map((c) => `<span class="result__color" style="--strap:${COLORS[c].hex}"><span class="chip chip--sm" aria-hidden="true"></span>${COLORS[c].name}</span>`).join('');
  const who = r.people === 1 ? '1 person' : `${num(r.people)} people`;
  $('#result-body').innerHTML = `
    <p class="result__order"><span class="num">${r.packs} ×</span> ${nb(TYPE_NAME[r.type])}, ${r.pack.size} pack</p>
    <p class="result__colors"><span>${r.colors.length > 1 ? `${plural(r.each, 'pack')} each in` : 'in'}</span>${chips}</p>
    <dl class="result__facts">
      <div><dt>Lanyards</dt><dd><span class="num">${num(r.lanyards)}</span> for ${who}${r.spare ? `, <span class="num">${num(r.spare)}</span> spare` : ''}</dd></div>
      <div><dt>Per lanyard</dt><dd class="num">${usd(unitCents(r.pack))}</dd></div>
      <div><dt>Total</dt><dd class="num result__total">${usd(r.cents)}</dd></div>
    </dl>
    <p class="result__why">${nb(r.why.join(' '))}</p>
    ${r.alt ? `<p class="result__alt">Also fits: ${r.alt.packs} × ${nb(TYPE_NAME[r.alt.type])}, ${r.alt.pack.size} pack. ${usd(r.alt.cents)}, ${num(r.alt.lanyards - r.people)} spare.</p>` : ''}`;
  renderStrands(r.colors);
  if (!animate) return;
  const rise = reduced() ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }];
  $('#result-body').animate(rise, { duration: reduced() ? 150 : 320, easing: EASE.out });
  $('#finder-strands').animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: reduced() ? 150 : 320, easing: EASE.standard });
}
// Straps in the suggested colours cross the panel on a diagonal and run behind the glass card, so the card picks
// up their colour. The strand's viewBox length is set from the panel width so the strap stays about 28px wide.
function renderStrands(colors) {
  const box = $('#finder-strands');
  const width = box.clientWidth || 760;
  const length = Math.round((19.6 * width) / (width > 600 ? 28 : 18));
  const count = Math.max(2, colors.length);
  box.innerHTML = Array.from({ length: count }, (_, i) => {
    const c = colors[i % colors.length];
    return `<div class="strand-row" style="--strap:${COLORS[c].hex}; top:${((i + 0.5) / count) * 100}%">${strand({ length, bend: 0.2 + (i % 3) * 0.06 })}</div>`;
  }).join('');
}

let finderTimer = 0;
const scheduleResult = () => { clearTimeout(finderTimer); finderTimer = setTimeout(renderResult, 250); };
finderForm.addEventListener('change', (e) => { if (e.target.type === 'radio') renderResult(); });
finderForm.addEventListener('submit', (e) => e.preventDefault());
wireSteppers(peopleStepper, {
  min: 1,
  max: 9999,
  get: () => people,
  set: (st, n, typing) => {
    people = n;
    syncStepper(st, n, { min: 1, max: 9999, write: !typing });
    scheduleResult();
  },
});
$('#use-rec').addEventListener('click', () => {
  const r = currentRec;
  loadOrder({ type: r.type, size: r.pack.size, qty: Object.fromEntries(r.colors.map((c) => [c, r.each])) }, 'Suggested order');
});

/* ---------- 8b. Break-away pull demo ----------
   Drag the right strap end, or focus it and hold the right arrow (Enter pulls all the way). Tension fills a bar;
   at 100% the clasp halves spring apart. Reduced motion swaps the drag for a Before / After toggle. */
function initPull() {
  const bench = $('#pull');
  const art = $('#pull-art');
  art.innerHTML = claspDetail({ title: 'A break-away clasp joining two strap ends' });
  const svg = $('svg', art);
  const leftParts = [$('.ly-end-l', svg), $('.ly-half-l', svg)];
  const rightParts = [$('.ly-end-r', svg), $('.ly-half-r', svg)];
  const handle = $('#pull-handle');
  const fill = $('#pull-fill');
  const caption = $('#pull-caption');
  const CLOSED = caption.textContent;
  // Reduced motion has no strap to pull, only the Before / After toggle, so the caption must not ask for a pull.
  const closedText = () => (reduced() ? 'Before and after the clasp opens.' : CLOSED);
  const OPENED = 'If the strap is caught or pulled, the clasp opens.';
  let t = 0;
  let open = false;
  let raf = 0;
  let relaxTimer = 0;
  let startX = null;

  const place = (parts, x) => parts.forEach((p) => { p.style.transform = `translateX(${x}px)`; });
  const setValue = (text) => {
    handle.setAttribute('aria-valuenow', Math.round(t * 100));
    handle.setAttribute('aria-valuetext', text);
  };
  // Tension stretches the strap a few units (right end more than left) before the clasp gives.
  function setTension(v) {
    if (open) return;
    t = clamp(v, 0, 1);
    place(rightParts, 7 * t);
    place(leftParts, 2 * t);
    fill.style.transform = `scaleX(${t})`;
    setValue(t ? `Pulling, ${Math.round(t * 100)} percent` : 'Not pulled');
    if (t >= 1) release();
  }
  function tween(to, ms) {
    cancelAnimationFrame(raf);
    if (ms <= 0 || reduced()) return setTension(to);
    const from = t;
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / ms);
      setTension(from + (to - from) * (1 - (1 - k) ** 3));
      if (k < 1 && !open) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  function slide(parts, x, easing, duration) {
    for (const p of parts) {
      const from = p.style.transform || 'translateX(0px)';
      p.style.transform = `translateX(${x}px)`;
      if (!reduced()) p.animate([{ transform: from }, { transform: `translateX(${x}px)` }], { duration, easing });
    }
  }
  function release() {
    open = true;
    cancelAnimationFrame(raf);
    clearTimeout(relaxTimer);
    t = 1;
    fill.style.transform = 'scaleX(1)';
    caption.textContent = OPENED;
    bench.classList.add('is-open');
    setValue('Clasp open');
    slide(leftParts, -22, SPRING, 720);
    slide(rightParts, 66, SPRING, 720);
    $('input[value="after"]', bench).checked = true;
  }
  function reset() {
    cancelAnimationFrame(raf);
    clearTimeout(relaxTimer);
    open = false;
    t = 0;
    bench.classList.remove('is-open');
    caption.textContent = closedText();
    fill.style.transform = 'scaleX(0)';
    slide(leftParts, 0, EASE.standard, 320);
    slide(rightParts, 0, EASE.standard, 320);
    setValue('Not pulled');
    $('input[value="before"]', bench).checked = true;
  }

  handle.addEventListener('pointerdown', (e) => {
    if (open || reduced()) return;
    startX = e.clientX;
    handle.setPointerCapture(e.pointerId);
    cancelAnimationFrame(raf);
    clearTimeout(relaxTimer);
    bench.classList.add('is-dragging');
  });
  handle.addEventListener('pointermove', (e) => {
    if (startX !== null) setTension((e.clientX - startX) / (art.clientWidth * 0.3));
  });
  const endDrag = () => {
    if (startX === null) return;
    startX = null;
    bench.classList.remove('is-dragging');
    if (!open) tween(0, 260); // let go early and the strap relaxes
  };
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);

  handle.addEventListener('keydown', (e) => {
    const k = e.key;
    if (!['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Enter', ' ', 'Home', 'End'].includes(k)) return;
    e.preventDefault();
    if (open) return;
    clearTimeout(relaxTimer);
    if (k === 'ArrowRight' || k === 'ArrowUp') { cancelAnimationFrame(raf); setTension(t + 0.07); }
    else if (k === 'ArrowLeft' || k === 'ArrowDown') { cancelAnimationFrame(raf); setTension(t - 0.07); }
    else if (k === 'Home') tween(0, 240);
    else tween(1, 520); // Enter, Space or End pulls all the way
  });
  // Holding the key builds tension; let go and it relaxes after a moment, as a real strap would.
  handle.addEventListener('keyup', (e) => {
    if (open || !['ArrowRight', 'ArrowUp'].includes(e.key)) return;
    relaxTimer = setTimeout(() => tween(0, 320), 700);
  });
  $('#pull-reset').addEventListener('click', reset);
  $('#pull-states').addEventListener('change', (e) => (e.target.value === 'after' ? release() : reset()));

  // Under reduced motion the strap is not draggable, so take it out of the tab order.
  const syncMotion = () => {
    handle.tabIndex = reduced() ? -1 : 0;
    setFlag(handle, 'aria-hidden', reduced());
    if (!open) caption.textContent = closedText();
  };
  motionPref.addEventListener('change', syncMotion);
  syncMotion();
}

/* ---------- 9. Use cases and compare: load a ready-made order ---------- */
for (const btn of $$('[data-load]')) {
  btn.addEventListener('click', () => {
    const o = decodeOrder(btn.dataset.load);
    const use = btn.closest('.use');
    loadOrder(o, use ? `${$('.use__name', use).textContent} order` : `${TYPE_NAME[o.type]}, ${o.size} pack`);
  });
}
// A one-piece strap drawn exactly like lanyard.js's strap(), so it sits beside claspDetail() in the compare table.
function plainStrap() {
  const W = 34;
  const d = 'M-6 66 C40 64 80 60 160 60 C240 60 280 56 326 54';
  const pitch = Math.min(4, Math.max(2.2, W * 0.14));
  return `<svg class="ly" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg"><g class="ly-strap">
    <path class="ly-rim" d="${d}" stroke-width="${W}"/>
    <path class="ly-body" d="${d}" stroke-width="${W - 1.6}"/>
    <path class="ly-rib-d" d="${d}" stroke-width="${W - 2.4}" stroke-dasharray="${pitch * 0.42} ${pitch * 0.58}"/>
    <path class="ly-rib-l" d="${d}" stroke-width="${W - 2.4}" stroke-dasharray="${pitch * 0.3} ${pitch * 0.7}" stroke-dashoffset="${pitch * 0.55}"/>
    <path class="ly-sheen" d="${d}" stroke-width="${W * 0.26}"/>
  </g></svg>`;
}
for (const el of $$('[data-art]')) {
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = el.dataset.art === 'clasp' ? claspDetail() : plainStrap();
}

/* ---------- 10. Header and menu ---------- */
// Browsers without scroll-driven animations get the same tint step from a class.
if (!CSS.supports('animation-timeline: scroll()')) {
  const hdr = $('.hdr');
  const onScroll = () => hdr.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
const menuBtn = $('#menu-btn');
const menu = $('#menu');
const setMenu = (open) => {
  menuBtn.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
};
menuBtn.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menu.hidden) {
    setMenu(false);
    menuBtn.focus();
  }
});

/* ---------- 11. Start ---------- */
renderPacks();
renderRows();
if (!loadFromHash()) update({ announce: false });
stage.getBoundingClientRect(); // first lanyards are styled now, so they do not play the add animation on load
stage.dataset.ready = '';
renderResult({ animate: false });
initPull();
syncBar();
