// Corpafly, Direction B: "Diamond Grid". Vanilla ES module, no libraries.
// Content is in the HTML and works without this file; this adds the drawings, the live prices, the planner,
// the cart drawer, the adaptive header and the motion (all motion respects prefers-reduced-motion).
import { PRODUCTS, COLORS, perUnit, money } from '../shared/products.js';
import { hangingLanyard, strand, claspDetail } from '../shared/lanyard.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const byHandle = Object.fromEntries(PRODUCTS.map((p) => [p.handle, p]));
const packOf = (handle, size) => byHandle[handle].packs.find((p) => p.size === size);
const f1 = (n) => Math.round(n * 10) / 10;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const ICON = (id) => `<svg class="icon" aria-hidden="true"><use href="../shared/icons.svg#${id}"/></svg>`;
// A lanyard.js drawing nested inside another SVG: position it and drop its own img role (the host figure has one).
const nest = (svg, attrs) => svg.replace('<svg class="ly', `<svg ${attrs} class="ly`).replace(/role="img" aria-label="[^"]*"/, 'aria-hidden="true"');

/* =========================================================================================
   Cart (prototype state) and the glass drawer
   ========================================================================================= */
const cart = { lines: [] }; // { handle, size, color, qty }

function addToCart(items) {
  for (const it of items) {
    if (it.qty < 1) continue;
    const line = cart.lines.find((l) => l.handle === it.handle && l.size === it.size && l.color === it.color);
    if (line) line.qty = Math.min(999, line.qty + it.qty);
    else cart.lines.push({ ...it });
  }
  renderCart();
}

function renderCart() {
  const list = $('[data-cart-lines]');
  const packs = cart.lines.reduce((n, l) => n + l.qty, 0);
  const lanyards = cart.lines.reduce((n, l) => n + l.qty * l.size, 0);
  const subtotal = cart.lines.reduce((n, l) => n + l.qty * packOf(l.handle, l.size).price, 0);

  list.innerHTML = cart.lines.map((l, i) => {
    const p = byHandle[l.handle];
    const pack = packOf(l.handle, l.size);
    const c = COLORS[l.color];
    return `<li class="cart-line" data-line="${i}">
      <div class="cart-line__vis" style="--strap:${c.hex}">${strand({ length: 140, bend: 0.12 })}</div>
      <p class="cart-line__title">${p.title}</p>
      <p class="cart-line__total">${money(pack.price * l.qty)}</p>
      <p class="cart-line__meta mono">${c.name} · ${l.size} pack</p>
      <p class="cart-line__each mono">${money(perUnit(pack.price, pack.size))} per lanyard · ${l.size * l.qty} lanyards</p>
      <div class="cart-line__ctrl">
        <div class="stepper stepper--sm">
          <button type="button" class="stepper__btn" data-line-step="-1" aria-label="One pack fewer of ${c.name} ${p.title}, ${l.size} pack">${ICON('i-minus')}</button>
          <input class="stepper__input mono" type="number" inputmode="numeric" min="1" max="999" value="${l.qty}" aria-label="${c.name} ${p.title}, ${l.size} pack, packs" data-line-qty>
          <button type="button" class="stepper__btn" data-line-step="1" aria-label="One pack more of ${c.name} ${p.title}, ${l.size} pack">${ICON('i-plus')}</button>
        </div>
        <button type="button" class="link-btn" data-line-remove aria-label="Remove ${c.name} ${p.title}, ${l.size} pack">Remove</button>
      </div>
    </li>`;
  }).join('');

  $('[data-cart-empty]').hidden = cart.lines.length > 0;
  $('[data-cart-packs]').textContent = plural(packs, 'pack');
  $('[data-cart-lanyards]').textContent = String(lanyards);
  $('[data-cart-subtotal]').textContent = money(subtotal);
  const count = $('[data-cart-count]');
  count.textContent = String(packs);
  count.toggleAttribute('data-empty', packs === 0);
  $('[data-open-cart]').setAttribute('aria-label', `Cart, ${plural(packs, 'pack')}`);
  const checkout = $('[data-checkout]');
  checkout.toggleAttribute('aria-disabled', packs === 0);
}

const drawer = $('[data-drawer]');
let drawerOpener = null;

function openCart() {
  if (drawer.open) return;
  drawerOpener = document.activeElement;
  drawer.showModal();
  document.documentElement.classList.add('is-locked'); // lock page scroll under the drawer
  dockSync();
}

function closeCart() {
  if (!drawer.open || drawer.classList.contains('is-closing')) return;
  drawer.classList.add('is-closing');
  const finish = () => {
    clearTimeout(timer);
    drawer.removeEventListener('animationend', onEnd);
    drawer.classList.remove('is-closing');
    drawer.close();
  };
  const onEnd = (e) => { if (e.target === drawer && !e.pseudoElement) finish(); };
  const timer = setTimeout(finish, 280); // in case no animation runs
  drawer.addEventListener('animationend', onEnd);
}

function initDrawer() {
  $('[data-open-cart]').addEventListener('click', openCart);
  $('[data-close-cart]').addEventListener('click', closeCart);
  drawer.addEventListener('cancel', (e) => { e.preventDefault(); closeCart(); }); // Esc animates out too
  drawer.addEventListener('close', () => {
    document.documentElement.classList.remove('is-locked');
    dockSync();
    if (drawerOpener && drawerOpener.isConnected && !drawerOpener.closest('[inert]')) drawerOpener.focus();
  });
  // A click on the backdrop lands on the <dialog> itself, outside its box
  drawer.addEventListener('click', (e) => {
    if (e.target !== drawer) return;
    const r = drawer.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeCart();
  });
  drawer.addEventListener('click', (e) => {
    const row = e.target.closest('[data-line]');
    if (!row) return;
    const line = cart.lines[+row.dataset.line];
    if (e.target.closest('[data-line-remove]')) {
      cart.lines.splice(+row.dataset.line, 1);
      renderCart();
      $('[data-close-cart]').focus();
    } else if (e.target.closest('[data-line-step]')) {
      const step = +e.target.closest('[data-line-step]').dataset.lineStep;
      line.qty = Math.max(1, Math.min(999, line.qty + step));
      renderCart();
      $(`[data-line="${row.dataset.line}"] [data-line-step="${step}"]`, drawer)?.focus();
    }
  });
  drawer.addEventListener('change', (e) => {
    const input = e.target.closest('[data-line-qty]');
    if (!input) return;
    const line = cart.lines[+input.closest('[data-line]').dataset.line];
    line.qty = Math.max(1, Math.min(999, Math.round(+input.value) || 1));
    renderCart();
  });
  // Prototype: checkout is Shopify's own and is not part of the theme
  $('[data-checkout]').addEventListener('click', (e) => e.preventDefault());
  renderCart();
}

/* =========================================================================================
   Header: adaptive tint (Liquid Glass "adaptive" idea), scroll fallback, mobile menu
   ========================================================================================= */
function initHeader() {
  const header = $('.site-header');

  // The tint rises over the first 80 px. CSS scroll-driven animation where supported; a class toggle elsewhere.
  if (!CSS.supports('animation-timeline: scroll()')) {
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 80);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Watch a 1 px line through the middle of the header; whichever section crosses it sets the tone.
  const zones = $$('main > [data-tone], .site-footer[data-tone]');
  let io;
  const build = () => {
    io?.disconnect();
    const mid = Math.round(header.offsetHeight / 2);
    io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) header.dataset.tone = e.target.dataset.tone;
    }, { rootMargin: `-${mid}px 0px -${Math.max(0, innerHeight - mid - 1)}px 0px` });
    zones.forEach((z) => io.observe(z));
  };
  build();
  addEventListener('resize', debounce(build, 150));

  // Mobile menu: a disclosure under the bar
  const toggle = $('[data-menu-toggle]');
  const menu = $('#mobile-menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    $('use', toggle).setAttribute('href', `../shared/icons.svg#i-${open ? 'close' : 'menu'}`);
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', (e) => { if (!menu.hidden && !header.contains(e.target)) setMenu(false); });
  matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
}

/* =========================================================================================
   Hero: the strap draws itself along the lattice, then the J-hook drops in.
   The lattice is a 24 px background anchored at the hero's top left, so its nodes sit at (12i, 12j) with i + j even.
   Every corner of the strap is snapped to a node, so each edge runs exactly on a lattice line.
   ========================================================================================= */
// Same strap build as lanyard.js (rim, body, weave ribs, sheen), so the hero strap matches the product drawings.
function strapLayers(d, W) {
  const pitch = Math.min(4, Math.max(2.2, W * 0.14));
  return `<g class="ly-strap">
    <path class="ly-rim" d="${d}" stroke-width="${f1(W)}"/>
    <path class="ly-body" d="${d}" stroke-width="${f1(W - 1.6)}"/>
    <path class="ly-rib-d" d="${d}" stroke-width="${f1(W - 2.4)}" stroke-dasharray="${f1(pitch * 0.42)} ${f1(pitch * 0.58)}"/>
    <path class="ly-rib-l" d="${d}" stroke-width="${f1(W - 2.4)}" stroke-dasharray="${f1(pitch * 0.3)} ${f1(pitch * 0.7)}" stroke-dashoffset="${f1(pitch * 0.55)}"/>
    <path class="ly-sheen" d="${d}" stroke-width="${f1(W * 0.26)}"/>
  </g>`;
}

// Crimp, swivel and J-hook from (x, y); geometry copied from lanyard.js hardware() (not exported there).
// tilt (degrees) turns the crimp in line with a diagonal strap; the swivel then lets the hook hang straight down.
function hookHardware(uid, x, y, u, tilt = 0) {
  const cw = u * 1.9, ch = u * 2.1, w = u * 0.24;
  const rad = (tilt * Math.PI) / 180;
  const cx = x + ch * Math.sin(rad), sy = y + ch * Math.cos(rad); // end of the crimp, where the swivel starts
  const ringY = sy + u * 1.3, hy = ringY + u * 0.44;
  const crimp = `<g transform="rotate(${-tilt} ${f1(x)} ${f1(y)})">
      <rect x="${f1(x - cw / 2)}" y="${f1(y)}" width="${f1(cw)}" height="${f1(ch)}" rx="${f1(u * 0.28)}" fill="url(#${uid}-metal)"/>
      <rect x="${f1(x - cw / 2)}" y="${f1(y + ch * 0.3)}" width="${f1(cw)}" height="${f1(u * 0.1)}" fill="rgba(0,0,0,.16)"/>
      <rect x="${f1(x - cw / 2)}" y="${f1(y + ch * 0.66)}" width="${f1(cw)}" height="${f1(u * 0.1)}" fill="rgba(0,0,0,.16)"/>
    </g>`;
  x = cx;
  const hook = `M${f1(x)} ${f1(hy)} L${f1(x)} ${f1(hy + u * 2.3)} C${f1(x)} ${f1(hy + u * 3.6)} ${f1(x - u * 0.25)} ${f1(hy + u * 4.2)} ${f1(x - u * 0.9)} ${f1(hy + u * 4.2)}
    C${f1(x - u * 1.6)} ${f1(hy + u * 4.2)} ${f1(x - u * 1.8)} ${f1(hy + u * 3.5)} ${f1(x - u * 1.74)} ${f1(hy + u * 2.9)} L${f1(x - u * 1.5)} ${f1(hy + u * 1.75)}`;
  const gate = `M${f1(x - u * 0.06)} ${f1(hy + u * 1.35)} L${f1(x - u * 1.42)} ${f1(hy + u * 1.95)}`;
  return `<defs>
      <linearGradient id="${uid}-metal" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6F767B"/><stop offset=".28" stop-color="#E9EDEF"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset=".72" stop-color="#AEB5BA"/><stop offset="1" stop-color="#5E656A"/></linearGradient>
      <linearGradient id="${uid}-wire" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F4F6F7"/><stop offset=".45" stop-color="#9BA3A8"/><stop offset=".6" stop-color="#E3E7E9"/><stop offset="1" stop-color="#7C8489"/></linearGradient>
    </defs>
    <g class="hs-hardware">
      ${crimp}
      <rect x="${f1(x - u * 0.38)}" y="${f1(sy - u * 0.25)}" width="${f1(u * 0.76)}" height="${f1(u * 1.05)}" rx="${f1(u * 0.14)}" fill="url(#${uid}-metal)"/>
      <circle cx="${f1(x)}" cy="${f1(ringY)}" r="${f1(u * 0.42)}" fill="none" stroke="url(#${uid}-wire)" stroke-width="${f1(w)}"/>
      <path d="${hook}" fill="none" stroke="url(#${uid}-wire)" stroke-width="${f1(w * 1.15)}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${gate}" fill="none" stroke="#C5CBCF" stroke-width="${f1(w * 0.55)}" stroke-linecap="round"/>
    </g>`;
}

// Geometry of the gap between the C and the F in corpafly-mark.svg (mark units, viewBox 201.95 x 196.53).
// The two letters leave a chevron-shaped channel: along the upper arms it is centred on x + y = 144.26
// (between the C's inner edge, 139.36, and the F's outer edge, 149.16); along the lower arms on y - x = 51.26
// (between 55.26 and 47.25). Both are 45-degree lines, so they can sit exactly on lattice lines.
const GAP = { upper: 144.26, lower: 51.26, endY: 122 }; // endY: the strap stops short of the C's lower arm (meets at y 127.8)

function initHeroStrap() {
  const hero = $('[data-hero]');
  const host = $('[data-hero-strap]');
  const mark = $('.hero__mark');
  if (!hero || !host || !mark) return;
  host.style.setProperty('--strap', COLORS.blue.hex);

  const build = () => {
    mark.style.translate = '';
    const H = hero.getBoundingClientRect();
    const M = mark.getBoundingClientRect();
    const s = M.height / 196.53;                       // px per mark unit
    let X0 = M.left - H.left, Y0 = M.top - H.top;
    // Nudge the mark (at most 12 px) so both centre lines of the gap land on lattice lines (x + y and y - x multiples of 24)
    const k1 = X0 + Y0 + s * GAP.upper, k2 = Y0 - X0 + s * GAP.lower;
    const r1 = Math.round(k1 / 24) * 24 - k1, r2 = Math.round(k2 / 24) * 24 - k2;
    const dx = (r1 - r2) / 2, dy = (r1 + r2) / 2;
    mark.style.translate = `${f1(dx)}px ${f1(dy)}px`;
    X0 += dx; Y0 += dy;
    const K1 = Math.round((k1 + r1) / 24) * 24, K2 = Math.round((k2 + r2) / 24) * 24;
    // Corner of the chevron (a lattice node), the end in the lower channel (snapped to a node), the entry above the hero
    const V = [(K1 - K2) / 2, (K1 + K2) / 2];
    const ey = Y0 + s * GAP.endY;
    const eSum = Math.round((2 * ey - K2) / 24) * 24;   // x + y at the end, on a lattice line
    const E = [(eSum - K2) / 2, (eSum + K2) / 2];
    const W = Math.max(8, Math.min(16, Math.round(s * 3)));   // strap width: about half the narrower channel
    const S = [K1 + W * 2, -W * 2];
    const P = (p) => `${f1(p[0])} ${f1(p[1])}`;
    const path = `M${P(S)} L${P(V)} L${P(E)}`;
    const reveal = `M${P(S)} L${P(V)} L${P(E)} L${P([E[0] + W, E[1] + W])}`; // overshoots so the butt end is fully drawn
    // Hardware: the crimp sits in line with the strap (down-right), overlapping its end; the hook hangs from the swivel.
    const u = W * 0.72;
    const back = u * 0.55 / Math.SQRT2;
    host.innerHTML = `<svg class="ly hs" aria-hidden="true" focusable="false">
      <defs><mask id="hs-mask" maskUnits="userSpaceOnUse" x="-100" y="-100" width="${Math.ceil(H.width) + 200}" height="${Math.ceil(H.height) + 200}">
        <path class="hs-draw" d="${reveal}" pathLength="1" stroke-dasharray="1 2" stroke="#fff" stroke-width="${W * 2.6}" stroke-linejoin="miter" fill="none"/>
      </mask></defs>
      <g mask="url(#hs-mask)">${strapLayers(path, W)}</g>
      ${hookHardware('hs', E[0] - back, E[1] - back, u, 45)}
    </svg>`;
    return host.querySelector('svg');
  };

  const play = async (svg) => {
    const draw = $('.hs-draw', svg);
    const hw = $('.hs-hardware', svg);
    if (reduceMotion.matches) return; // final state: the dash offset defaults to 0 and the hook is visible
    draw.setAttribute('stroke-dashoffset', '1');
    hw.style.opacity = '0';
    // Pin the strap to the CSS stroke sequence: it starts 520 ms after the first stroke's clock started, and the hook
    // lands 1.14 s after it (1.08 s after the first stroke moves), however late this module ran.
    const first = $('.mk-p')?.getAnimations()[0];
    if (first) { try { await first.ready; } catch { /* cancelled */ } }
    const anims = [
      draw.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 460, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'both' }),
      hw.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }],
        { duration: 200, delay: 420, easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)', fill: 'both' }),
    ];
    if (first && first.startTime != null) anims.forEach((a) => { a.startTime = first.startTime + 520; });
    draw.removeAttribute('stroke-dashoffset');
    hw.style.opacity = '';
  };

  play(build());
  // Re-snap on resize, without replaying the moment
  let lastW = innerWidth;
  addEventListener('resize', debounce(() => { if (innerWidth !== lastW) { lastW = innerWidth; build(); } }, 150));
}

/* =========================================================================================
   Range plates: a coloured drawing with 45-degree leaders, named chips, an Add per pack row
   ========================================================================================= */
// Lanyard placed at (20, -10) inside a 500 x 520 field. Leaders run at 45 degrees, then flat into the label column (x = 61%).
function plateDrawing(type) {
  const { svg } = hangingLanyard({ type, title: '' });
  const leaders = [
    [[148, 21], [174, 47], [296, 47]],    // clasp, at the top of the loop
    [[186, 259], [247, 198], [296, 198]], // strap, right leg
    [[126, 480], [159, 447], [296, 447]], // hook shank
  ];
  const lines = leaders.map((pts) => `<path class="leader" d="M${pts.map((p) => p.join(' ')).join(' L')}"/><circle class="leader-dot" cx="${pts[0][0]}" cy="${pts[0][1]}" r="3"/>`).join('');
  return `<svg viewBox="0 0 500 520" aria-hidden="true" focusable="false">${nest(svg, 'x="20" y="-10" width="240" height="600"')}${lines}</svg>`;
}

function initPlates() {
  for (const plate of $$('[data-plate]')) {
    const product = byHandle[plate.dataset.plate];
    const fig = $('[data-drawing]', plate);
    fig.insertAdjacentHTML('afterbegin', plateDrawing(fig.dataset.drawing));
    const chips = $$('.chip input', plate);
    const current = () => chips.find((c) => c.checked).value;

    const sync = () => {
      const key = current();
      fig.style.setProperty('--strap', COLORS[key].hex);
      $('[data-chip-name]', plate).textContent = COLORS[key].name;
      const smallest = product.packs.filter((p) => p.colors.includes(key)).map((p) => p.size).sort((x, y) => x - y)[0];
      for (const row of $$('[data-row]', plate)) {
        const btn = $('[data-add-row]', row);
        const ok = row.dataset.colors.split(' ').includes(key);
        btn.disabled = !ok;
        btn.textContent = ok ? 'Add' : `${smallest} pack only`;
        btn.setAttribute('aria-label', ok
          ? `Add ${product.title}, ${row.dataset.size} pack, ${COLORS[key].name}, to cart`
          : `${COLORS[key].name} comes in the ${smallest} pack only`);
      }
    };
    chips.forEach((c) => c.addEventListener('change', sync));
    plate.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add-row]');
      if (!btn || btn.disabled) return;
      addToCart([{ handle: product.handle, size: +btn.closest('[data-row]').dataset.size, color: current(), qty: 1 }]);
      openCart();
    });
    sync();
  }
}

/* =========================================================================================
   Order bar (pack, colour, packs, live price per lanyard) and its docked glass state
   ========================================================================================= */
const order = { handle: 'break-away-lanyard', size: 100, color: 'blue', qty: 1 };
const form = $('[data-order]');

function renderPackOptions() {
  const product = byHandle[order.handle];
  const host = $('[data-pack-options]', form);
  if (product.packs.length === 1) {
    // One size: static text, not a one-option radio group
    const p = product.packs[0];
    host.innerHTML = `<p class="seg__opt seg__opt--static"><span class="seg__main">${p.size} pack</span><span class="seg__sub mono">${money(perUnit(p.price, p.size))} each</span></p>`;
    return;
  }
  host.innerHTML = product.packs.map((p) => `<label class="seg__opt"><input type="radio" name="pack" value="${p.size}"${p.size === order.size ? ' checked' : ''}><span class="seg__main">${p.size} pack</span><span class="seg__sub mono">${money(perUnit(p.price, p.size))} each</span></label>`).join('');
}

function renderColorOptions() {
  const pack = packOf(order.handle, order.size);
  if (!pack.colors.includes(order.color)) order.color = pack.colors[0];
  $('[data-color-options]', form).innerHTML = pack.colors.map((k) => `<label class="swatch"><input type="radio" name="color" value="${k}"${k === order.color ? ' checked' : ''}><span class="swatch__dia" style="--strap:${COLORS[k].hex}"></span><span class="swatch__name">${COLORS[k].name}</span></label>`).join('');
  // "4 more colors in the 25 pack" when a bigger break-away pack carries fewer colours
  const product = byHandle[order.handle];
  const widest = product.packs.reduce((a, b) => (b.colors.length > a.colors.length ? b : a));
  const more = $('[data-more-colors]', form);
  const extra = widest.colors.length - pack.colors.length;
  more.hidden = extra <= 0;
  more.textContent = `${extra} more colors in the ${widest.size} pack`;
  more.dataset.size = widest.size;
}

function updateOrder() {
  const product = byHandle[order.handle];
  const pack = packOf(order.handle, order.size);
  const each = perUnit(pack.price, pack.size);
  const total = money(pack.price * order.qty);
  const name = COLORS[order.color].name;
  $('[data-order-color-name]', form).textContent = name;
  $('[data-order-summary]', form).textContent = `${product.title} · ${order.size} pack · ${name}`;
  $('[data-order-live]', form).innerHTML = `<span class="total__line mono">${plural(order.qty, 'pack')} · ${order.qty * order.size} lanyards</span><span class="total__price">${total}</span><span class="total__each mono">${money(each)} per lanyard</span>`;
  $('[data-order-add-price]', form).textContent = total;
  $('[data-order-qty]', form).value = order.qty;
  $('[data-step="-1"]', form).disabled = order.qty <= 1;
  // The docked copy
  $('[data-dock-line]').textContent = `${name} · ${order.handle === 'lanyard' ? 'Lanyard' : 'Break-Away'} · ${order.size} pack × ${order.qty}`;
  $('[data-dock-total]').textContent = total;
  $('[data-dock-each]').textContent = `${money(each)} each`;
  $('[data-dock-swatch]').style.setProperty('--strap', COLORS[order.color].hex);
}

function setProduct(handle) {
  order.handle = handle;
  const product = byHandle[handle];
  if (!product.packs.some((p) => p.size === order.size)) order.size = product.packs[product.packs.length - 1].size;
  $$('input[name="product"]', form).forEach((r) => { r.checked = r.value === handle; });
  renderPackOptions();
  renderColorOptions();
  updateOrder();
}

function initOrder() {
  form.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'product') setProduct(t.value);
    else if (t.name === 'pack') { order.size = +t.value; renderColorOptions(); updateOrder(); }
    else if (t.name === 'color') { order.color = t.value; updateOrder(); }
    else if (t.matches('[data-order-qty]')) { order.qty = Math.max(1, Math.min(999, Math.round(+t.value) || 1)); updateOrder(); }
  });
  form.addEventListener('click', (e) => {
    const step = e.target.closest('[data-step]');
    if (step) { order.qty = Math.max(1, Math.min(999, order.qty + +step.dataset.step)); updateOrder(); }
    const more = e.target.closest('[data-more-colors]');
    if (more) {
      order.size = +more.dataset.size;
      renderPackOptions(); renderColorOptions(); updateOrder();
      $('input[name="color"]:checked', form)?.focus();
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addToCart([{ handle: order.handle, size: order.size, color: order.color, qty: order.qty }]);
    openCart();
  });
  // Links elsewhere that preset the bar (for example "Order break-away")
  $$('[data-preset]').forEach((a) => a.addEventListener('click', () => setProduct(a.dataset.preset)));
  setProduct(order.handle);
}

// Dock: shown once the hero is gone and the full bar is out of view; hidden over the planner and footer.
const dock = $('[data-dock]');
const dockState = { hero: true, bar: false, hide: new Set() };
function dockSync() {
  const show = !dockState.hero && !dockState.bar && dockState.hide.size === 0 && !drawer.open;
  dock.classList.toggle('is-visible', show);
  dock.inert = !show;
  dock.setAttribute('aria-hidden', String(!show));
}
function initDock() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.target.matches('[data-hero]')) dockState.hero = e.isIntersecting;
      else if (e.target === form) dockState.bar = e.isIntersecting;
      else if (e.isIntersecting) dockState.hide.add(e.target); else dockState.hide.delete(e.target);
    }
    dockSync();
  });
  [$('[data-hero]'), form, ...$$('[data-dock-hide]'), $('.site-footer')].forEach((el) => io.observe(el));
  $('[data-dock-add]').addEventListener('click', () => {
    addToCart([{ handle: order.handle, size: order.size, color: order.color, qty: order.qty }]);
    openCart();
  });
  $('[data-dock-change]').addEventListener('click', () => {
    form.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
    $('input[name="pack"]:checked, input[name="color"]:checked', form)?.focus({ preventScroll: true });
  });
}

/* =========================================================================================
   Break-away detail: claspDetail() large, with a width dimension, pull arrows and leaders to numbered balloons
   ========================================================================================= */
function initClaspDrawing() {
  const host = $('[data-clasp-drawing]');
  if (!host) return;
  host.style.setProperty('--strap', COLORS.blue.hex);
  // Field 460 x 210. claspDetail() (320 x 120) sits at (90, 40): the left strap end is at x 84 with edges at y 89 and 123,
  // the clasp spans x 206 to 294 and y 74 to 126, and the seam is at x 250. Balloons and "Pull" labels are HTML,
  // placed in index.html at the matching percentages, so their text stays a readable size at any width.
  const X = 90, Y = 40;
  const tick = (x, y) => `M${x - 5} ${y + 5}L${x + 5} ${y - 5}`; // architectural 45-degree tick
  const arrowY = 186;
  const dims = `
    <path class="dim dim--ext" d="M${X - 10} 89H44M${X - 10} 123H44"/>
    <path class="dim" d="M52 81V131"/>
    <path class="dim" d="${tick(52, 89)}${tick(52, 123)}"/>
    <path class="dim" d="M200 ${arrowY}H120M128 ${arrowY - 8}L120 ${arrowY}L128 ${arrowY + 8}"/>
    <path class="dim" d="M300 ${arrowY}H380M372 ${arrowY - 8}L380 ${arrowY}L372 ${arrowY + 8}"/>
    <path class="leader" d="M37 59L52 74V81"/>
    <path class="leader" d="M203 33L220 50V76"/>
    <circle class="leader-dot" cx="220" cy="76" r="2.5"/>
    <path class="leader" d="M283 160L250 127"/>
    <circle class="leader-dot" cx="250" cy="127" r="2.5"/>
    <path class="leader" d="M412 ${arrowY}H384"/>`;
  host.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 460 210" aria-hidden="true" focusable="false">${nest(claspDetail({ title: '' }), `x="${X}" y="${Y}" width="320" height="120"`)}${dims}</svg>`);
}

/* =========================================================================================
   Colour coding planner: groups get colours (swap on clash), headcounts become the cheapest pack mix
   ========================================================================================= */
const planner = {
  handle: 'break-away-lanyard', // the only line made in all six colours
  selected: 'staff',
  groups: [
    { id: 'staff', name: 'Staff', count: 40, color: 'black' },
    { id: 'students', name: 'Students', count: 300, color: 'blue' },
    { id: 'visitors', name: 'Visitors', count: 50, color: 'yellow' },
    { id: 'volunteers', name: 'Volunteers', count: 25, color: 'green' },
  ],
};

// Cheapest set of packs (made in this colour) that covers n people. Ties go to fewer spares, then fewer packs.
// Every pack size is a multiple of 25, so the search runs in 25-lanyard units with exact cents.
function bestPacks(color, n) {
  if (n <= 0) return null;
  const packs = byHandle[planner.handle].packs.filter((p) => p.colors.includes(color)).map((p) => ({ size: p.size, u: p.size / 25, cents: Math.round(p.price * 100) }));
  const need = Math.ceil(n / 25);
  const maxU = need + Math.max(...packs.map((p) => p.u));
  const best = Array(maxU + 1).fill(null);
  best[0] = { cents: 0, count: 0, mix: {} };
  for (let u = 1; u <= maxU; u += 1) {
    for (const p of packs) {
      const prev = u >= p.u ? best[u - p.u] : null;
      if (!prev) continue;
      const cand = { cents: prev.cents + p.cents, count: prev.count + 1, mix: { ...prev.mix, [p.size]: (prev.mix[p.size] || 0) + 1 } };
      const cur = best[u];
      if (!cur || cand.cents < cur.cents || (cand.cents === cur.cents && cand.count < cur.count)) best[u] = cand;
    }
  }
  let pick = null;
  for (let u = need; u <= maxU; u += 1) {
    const b = best[u];
    if (b && (!pick || b.cents < pick.cents || (b.cents === pick.cents && u * 25 < pick.lanyards))) pick = { ...b, lanyards: u * 25 };
  }
  return { ...pick, spare: pick.lanyards - n };
}

function renderPlanner() {
  const root = $('[data-planner]');
  const sel = planner.groups.find((g) => g.id === planner.selected);
  for (const g of planner.groups) {
    const row = $(`[data-group="${g.id}"]`, root);
    $('[data-group-dia]', row).style.setProperty('--strap', COLORS[g.color].hex);
    $('[data-group-color]', row).textContent = COLORS[g.color].name;
    $('[data-gcount]', row).value = g.count;
    $('[data-gstep="-5"]', row).disabled = g.count <= 0;
    $('input[name="group"]', row).checked = g.id === planner.selected;
  }
  $('[data-tile-for]', root).textContent = `for ${sel.name}`;
  for (const input of $$('input[name="tile"]', root)) {
    input.checked = input.value === sel.color;
    const owner = planner.groups.find((g) => g.color === input.value);
    const tile = input.closest('.tile');
    $('[data-who]', tile).textContent = owner ? owner.name : '';
    input.setAttribute('aria-label', `${COLORS[input.value].name}${owner ? `, used by ${owner.name}` : ''}`);
  }

  // Line-up: one lanyard per group in its colour
  for (const g of planner.groups) {
    const item = $(`[data-lineup-item="${g.id}"]`, root);
    item.style.setProperty('--strap', COLORS[g.color].hex);
    $('.lineup__label', item).innerHTML = `<b>${g.name}</b>${COLORS[g.color].name} · ${g.count}`;
  }

  // Plan card
  const rows = planner.groups.map((g) => ({ g, plan: bestPacks(g.color, g.count) })).filter((r) => r.plan);
  const lines = $('[data-plan-lines]', root);
  lines.innerHTML = rows.length ? rows.map(({ g, plan }) => {
    const mix = Object.entries(plan.mix).sort((a, b) => b[0] - a[0]).map(([size, n]) => `${n} × ${size} pack`).join(', ');
    return `<li><span class="group__dia" style="--strap:${COLORS[g.color].hex}"></span>
      <span class="plan__who">${g.name} <span>· ${COLORS[g.color].name}</span></span>
      <span class="plan__packs">${mix}<small>${g.count} people${plan.spare ? ` · ${plan.spare} spare` : ''}</small></span></li>`;
  }).join('') : '<li class="plan__empty">Enter a headcount to see the packs.</li>';
  const packs = rows.reduce((n, r) => n + r.plan.count, 0);
  const lanyards = rows.reduce((n, r) => n + r.plan.lanyards, 0);
  const cents = rows.reduce((n, r) => n + r.plan.cents, 0);
  $('[data-plan-total]', root).innerHTML = `${plural(packs, 'pack')} · ${lanyards} lanyards<b>${money(cents / 100)}</b>`;
  $('[data-plan-add]', root).disabled = rows.length === 0;
}

function initPlanner() {
  const root = $('[data-planner]');
  if (!root) return;
  // Build the line-up once; colours and labels update in place so the strap colour can glide (@property --strap)
  $('[data-lineup]', root).innerHTML = planner.groups.map((g) => `<div class="lineup__item" data-lineup-item="${g.id}"><p class="lineup__label mono"></p>${hangingLanyard({ type: 'breakaway', title: '' }).svg}</div>`).join('');

  // Colour swaps are worked out against a snapshot taken when a group is picked. Arrow keys move through a radio
  // group by selecting each colour in turn, so without this, arrowing past a colour would reshuffle other groups.
  let snapshot = Object.fromEntries(planner.groups.map((g) => [g.id, g.color]));
  const takeSnapshot = () => { snapshot = Object.fromEntries(planner.groups.map((g) => [g.id, g.color])); };
  root.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'group') { planner.selected = t.value; takeSnapshot(); }
    else if (t.name === 'tile') {
      for (const g of planner.groups) g.color = snapshot[g.id];
      const sel = planner.groups.find((g) => g.id === planner.selected);
      const other = planner.groups.find((g) => g !== sel && g.color === t.value);
      if (other) other.color = sel.color; // swap, so every group keeps its own colour
      sel.color = t.value;
    } else if (t.matches('[data-gcount]')) {
      const g = planner.groups.find((x) => x.id === t.closest('[data-group]').dataset.group);
      g.count = Math.max(0, Math.min(5000, Math.round(+t.value) || 0));
    }
    renderPlanner();
  });
  root.addEventListener('click', (e) => {
    const step = e.target.closest('[data-gstep]');
    if (step) {
      const g = planner.groups.find((x) => x.id === step.closest('[data-group]').dataset.group);
      g.count = Math.max(0, Math.min(5000, g.count + +step.dataset.gstep));
      renderPlanner();
    }
    if (e.target.closest('[data-plan-add]')) {
      const items = [];
      for (const g of planner.groups) {
        const plan = bestPacks(g.color, g.count);
        if (!plan) continue;
        for (const [size, n] of Object.entries(plan.mix)) items.push({ handle: planner.handle, size: +size, color: g.color, qty: n });
      }
      addToCart(items);
      openCart();
    }
  });
  renderPlanner();
}

/* =========================================================================================
   45-degree wipe on first view. Nothing is hidden up front: the clip only exists while the animation runs,
   and anything already on screen at load is left alone.
   ========================================================================================= */
function initReveals() {
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target;
      if (!el.dataset.seen) { el.dataset.seen = '1'; if (e.isIntersecting) { io.unobserve(el); continue; } }
      if (!e.isIntersecting) continue;
      io.unobserve(el);
      el.style.setProperty('--wipe', `${Math.ceil(el.offsetWidth + el.offsetHeight)}px`);
      el.classList.add('is-wiping');
      el.addEventListener('animationend', () => el.classList.remove('is-wiping'), { once: true });
    }
  });
  $$('[data-reveal]').forEach((el) => io.observe(el));
}

/* ========================================================================================= */
initHeader();
initDrawer();
initHeroStrap();
initPlates();
initOrder();
initDock();
initClaspDrawing();
initPlanner();
initReveals();
