// Direction A: Clear Sleeve.
// Content lives in index.html and reads without script. This module only enhances it: it draws the
// code-built lanyards, plays the hero moment, tilts the badge, and runs the buy panel, the sticky bar
// and the cart drawer. Catalogue and prices come from the shared products.js (prices are placeholders).
import { hangingLanyard, strand, claspDetail } from '../shared/lanyard.js';
import { PRODUCTS, COLORS, perUnit, savingVsSmallest } from '../shared/products.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const motionOK = () => matchMedia('(prefers-reduced-motion: no-preference)').matches;
const byHandle = (handle) => PRODUCTS.find((p) => p.handle === handle);
const packOf = (product, size) => product.packs.find((k) => k.size === size);
const smallestPack = (product) => product.packs.reduce((a, b) => (a.size < b.size ? a : b));
const cents = (n) => Math.round(n * 100) / 100;
// US formats with thousands separators ($26,843.13, 99,900), as in Direction C.
const money = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const num = (n) => n.toLocaleString('en-US');
const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const clampQty = (n) => Math.min(999, Math.max(1, Math.round(n) || 1));   // packs per line; 999 fits both steppers
const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="../shared/icons.svg#${id}"/></svg>`;

/* A quiet "tick" when a price changes: 240ms, transform and opacity only, skipped under reduced motion. */
function tick(el) {
  if (!motionOK()) return;
  el.animate(
    [{ opacity: 0.35, transform: 'translateY(3px)' }, { opacity: 1, transform: 'none' }],
    { duration: 240, easing: 'cubic-bezier(0.2, 0, 0.38, 0.9)' },
  );
}

/* ---------- Header: scroll tint fallback and the mobile menu ---------- */
function initHeader() {
  const header = $('[data-header]');
  if (!CSS.supports('animation-timeline: scroll()')) {
    const update = () => header.classList.toggle('is-scrolled', scrollY > 40);
    addEventListener('scroll', update, { passive: true });
    update();
  }

  const btn = $('[data-menu-btn]');
  const menu = $('[data-menu]');
  const setOpen = (open) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    $('use', btn).setAttribute('href', `../shared/icons.svg#${open ? 'i-close' : 'i-menu'}`);
  };
  btn.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); }
  });
}

/* ---------- Hero: lanyard, strands, badge colours, the drop and the tilt ---------- */
function initHero() {
  const hang = $('[data-hang]');
  $('[data-hero-lanyard]').innerHTML = hangingLanyard({ type: 'standard', title: 'Lanyard' }).svg;
  // Four strands with the same length and bend, so they lie as one parallel set under the badge.
  $('[data-hero-strands]').innerHTML = [1, 2, 3, 4]
    .map((n) => `<span class="hero-strand hero-strand--${n}">${strand({ length: 480, bend: 0.06 })}</span>`)
    .join('');
  // The drop waits on its first frame (see styles.css) until the lanyard exists; start it on the next frame.
  requestAnimationFrame(() => document.documentElement.classList.add('hero-go'));

  const meta = $('[data-badge-meta]');
  $$('input[name="badge-color"]').forEach((input) => {
    input.addEventListener('change', () => {
      hang.style.setProperty('--strap', `var(--strap-${input.value})`);   // glides via @property --strap
      meta.textContent = `100 pack · ${COLORS[input.value].name}`;
      buy.followBadge(input.value);
    });
  });

  initTilt();
}

/* Desktop pointer only: the badge tilts up to 4deg toward the pointer and a highlight follows it.
   The only continuous interaction on the page. It stops when the pointer leaves the hero. */
function initTilt() {
  const hero = $('[data-hero]');
  const tilt = $('[data-badge-tilt]');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let raf = 0;
  let x = 0;
  let y = 0;

  const frame = () => {
    raf = 0;
    const r = tilt.parentElement.getBoundingClientRect();   // the hanger is never tilted itself
    const nx = Math.max(-1, Math.min(1, (x - (r.left + r.width / 2)) / (r.width * 1.6)));
    const ny = Math.max(-1, Math.min(1, (y - (r.top + r.height / 2)) / (r.height * 1.2)));
    tilt.style.setProperty('--ry', `${(nx * 4).toFixed(2)}deg`);
    tilt.style.setProperty('--rx', `${(-ny * 4).toFixed(2)}deg`);
    tilt.style.setProperty('--hx', `${(((x - r.left) / r.width) * 100).toFixed(1)}%`);
    tilt.style.setProperty('--hy', `${(((y - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !fine.matches || !motionOK()) return;
    x = e.clientX;
    y = e.clientY;
    tilt.classList.add('is-tilting');
    if (!raf) raf = requestAnimationFrame(frame);
  });
  hero.addEventListener('pointerleave', () => {
    cancelAnimationFrame(raf);
    raf = 0;
    tilt.classList.remove('is-tilting');
    tilt.style.setProperty('--rx', '0deg');
    tilt.style.setProperty('--ry', '0deg');
  });
}

/* ---------- Buy panel ---------- */
const buy = (() => {
  const form = $('[data-buy]');
  const el = {
    colorName: $('[data-color-name]', form),
    colorNote: $('[data-color-note]', form),
    hintPacks: $('[data-hint="smaller-packs"]', form),
    hintColors: $('[data-hint="more-colors"]', form),
    moreColors: $('[data-more-colors]', form),
    qty: $('[data-qty]', form),
    count: $('[data-summary-count]', form),
    total: $('[data-summary-total]', form),
    unit: $('[data-summary-unit]', form),
    save: $('[data-summary-save]', form),
    addPrice: $('[data-add-price]', form),
    stickyDot: $('[data-sticky-dot]'),
    stickyDesc: $('[data-sticky-desc]'),
    stickyTotal: $('[data-sticky-total]'),
  };
  const state = { product: 'lanyard', size: 100, color: 'black', qty: 1 };
  let touched = false;   // until the buyer uses the panel, the hero badge's colour carries over

  // Keep the choice valid: a pack the product has, a colour the pack comes in. Returns a note when the
  // colour had to change, so the buyer is told instead of finding out at checkout.
  function resolve() {
    const product = byHandle(state.product);
    if (!packOf(product, state.size)) state.size = Math.max(...product.packs.map((k) => k.size));
    const pack = packOf(product, state.size);
    let note = '';
    if (!pack.colors.includes(state.color)) {
      note = `${COLORS[state.color].name} is not made in this pack. Showing ${COLORS[pack.colors[0]].name}.`;
      state.color = pack.colors[0];
    }
    return { product, pack, note };
  }

  function render() {
    const { product, pack, note } = resolve();
    const prevTotal = el.addPrice.textContent;

    form.elements.product.value = state.product;
    $$('[data-pack]', form).forEach((label) => {
      const k = packOf(product, Number(label.dataset.pack));
      label.hidden = !k;
      if (k) $('[data-pack-each]', label).textContent = `${money(perUnit(k.price, k.size))} each`;
    });
    form.elements.pack.value = String(state.size);
    $$('[data-color]', form).forEach((label) => { label.hidden = !pack.colors.includes(label.dataset.color); });
    form.elements.color.value = state.color;
    el.colorName.textContent = COLORS[state.color].name;
    el.colorNote.textContent = note;

    // Hints point to what the other pack or product offers, and switch to it in one tap.
    el.hintPacks.hidden = product.packs.length > 1;
    const extra = smallestPack(product).colors.length - pack.colors.length;
    el.hintColors.hidden = extra <= 0;
    el.moreColors.textContent = `${extra} more colors in the ${smallestPack(product).size} pack`;

    if (document.activeElement !== el.qty) el.qty.value = state.qty;

    const total = money(cents(pack.price * state.qty));
    const each = money(perUnit(pack.price, pack.size));
    const save = savingVsSmallest(product, pack.size);
    el.count.textContent = `${count(state.qty, 'pack', 'packs')} · ${num(state.qty * pack.size)} lanyards`;
    el.total.textContent = total;
    el.unit.textContent = each;
    el.save.hidden = !save;
    el.save.textContent = `Save ${save}% vs ${smallestPack(product).size} pack`;
    // Only rewrite the Add price when it changes: replacing the span under a press would swallow the click.
    if (el.addPrice.textContent !== total) el.addPrice.textContent = total;

    el.stickyDot.style.setProperty('--strap', `var(--strap-${state.color})`);
    // Color, pack and quantity first: on a narrow phone only the trailing product name can be clipped.
    el.stickyDesc.textContent = `${COLORS[state.color].name} · ${pack.size} pack × ${state.qty} · ${product.title}`;
    el.stickyTotal.textContent = total;

    if (prevTotal !== total) { tick(el.total); tick(el.stickyTotal); }
  }

  form.addEventListener('change', (e) => {
    const t = e.target;
    touched = true;
    if (t.name === 'product') state.product = t.value;
    else if (t.name === 'pack') state.size = Number(t.value);
    else if (t.name === 'color') state.color = t.value;
    else if (t.name === 'qty') state.qty = clampQty(Number(t.value));
    render();
  });
  // Typing in the quantity field updates the total live, clamped to the cap, so the summary and the Add
  // price always match what Add will put in the cart; the field itself is tidied on change (blur).
  el.qty.addEventListener('input', () => {
    const n = Number(el.qty.value);
    if (n >= 1) { touched = true; state.qty = clampQty(n); render(); }
  });
  $$('[data-step]', form).forEach((btn) => btn.addEventListener('click', () => {
    touched = true;
    state.qty = clampQty(state.qty + Number(btn.dataset.step));
    render();
  }));
  el.hintPacks.addEventListener('click', () => {
    touched = true;
    state.product = 'break-away-lanyard';
    render();
    form.querySelector('input[name="pack"]:checked').focus();   // arrow keys now reach 25 and 50
  });
  el.hintColors.addEventListener('click', () => {
    touched = true;
    state.size = smallestPack(byHandle(state.product)).size;
    render();
    form.querySelector('input[name="color"]:checked').focus();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    cart.add({ ...state });
  });

  // "Choose" in the range and the break-away section loads a product here and brings the panel into view.
  $$('[data-choose]').forEach((btn) => btn.addEventListener('click', () => {
    touched = true;
    state.product = btn.dataset.choose;
    render();
    form.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'start' });   // the panel, so Add lands on screen
    form.querySelector('input[name="product"]:checked').focus({ preventScroll: true });
  }));

  render();
  return {
    state,
    followBadge(color) {
      if (touched) return;
      Object.assign(state, { product: 'lanyard', size: 100, color });
      render();
    },
  };
})();

/* ---------- Sticky bar: shown once the panel's Add button has scrolled up under the header ----------
   A passive scroll check (one rect read per frame) rather than IntersectionObserver, which misses a jump
   from below the button straight to above it (for example the Home key, or an anchor link). */
const sticky = (() => {
  const bar = $('[data-sticky]');
  const add = $('[data-add]');
  const header = $('[data-header]');
  let hiddenByCart = false;
  let raf = 0;
  const update = () => {
    raf = 0;
    const passed = add.getBoundingClientRect().bottom < header.offsetHeight;
    const show = passed && !hiddenByCart;
    bar.classList.toggle('is-visible', show);
    bar.toggleAttribute('inert', !show);
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });
  $('[data-sticky-add]').addEventListener('click', () => cart.add({ ...buy.state }));
  update();
  return { setCartOpen(open) { hiddenByCart = open; update(); } };
})();

/* ---------- Cart drawer (prototype: lines live in memory) ---------- */
const cart = (() => {
  const dialog = $('[data-cart]');
  const el = {
    lines: $('[data-cart-lines]', dialog),
    empty: $('[data-cart-empty]', dialog),
    status: $('[data-cart-status]', dialog),
    lanyards: $('[data-cart-lanyards]', dialog),
    subtotal: $('[data-cart-subtotal]', dialog),
    copyStatus: $('[data-copy-status]', dialog),
    button: $('[data-open-cart]'),
    count: $('[data-cart-count]'),
  };
  const lines = [];
  let opener = null;

  const describe = (l) => `${byHandle(l.product).title}, ${COLORS[l.color].name}, ${l.size} pack`;

  function render() {
    el.lines.innerHTML = lines.map((l, i) => {
      const product = byHandle(l.product);
      const pack = packOf(product, l.size);
      return `<li class="cart-line" style="--strap: var(--strap-${l.color})">
        <span class="swatch-dot" aria-hidden="true"></span>
        <p class="cart-line__name">${product.title}</p>
        <p class="cart-line__total mono">${money(cents(pack.price * l.qty))}</p>
        <p class="cart-line__meta">${COLORS[l.color].name} · ${l.size} pack</p>
        <p class="cart-line__unit"><span class="mono">${money(perUnit(pack.price, pack.size))}</span> per lanyard · ${num(l.qty * l.size)} lanyards</p>
        <div class="cart-line__controls">
          <div class="stepper" role="group" aria-label="Packs: ${describe(l)}">
            <button type="button" data-line="${i}" data-delta="-1" aria-label="One pack fewer">${icon('i-minus')}</button>
            <output class="mono">${l.qty}</output>
            <button type="button" data-line="${i}" data-delta="1" aria-label="One pack more">${icon('i-plus')}</button>
          </div>
          <button class="cart-line__remove" type="button" data-remove="${i}">Remove<span class="visually-hidden"> ${describe(l)}</span></button>
        </div>
      </li>`;
    }).join('');

    const packs = lines.reduce((n, l) => n + l.qty, 0);
    const lanyards = lines.reduce((n, l) => n + l.qty * l.size, 0);
    const subtotal = lines.reduce((n, l) => n + packOf(byHandle(l.product), l.size).price * l.qty, 0);
    el.empty.hidden = lines.length > 0;
    el.lanyards.textContent = num(lanyards);
    el.subtotal.textContent = money(cents(subtotal));
    el.count.textContent = String(packs);
    el.button.dataset.count = String(packs);
    el.button.setAttribute('aria-label', `Cart, ${count(packs, 'pack', 'packs')}`);
  }

  function open(message = '') {
    opener = document.activeElement;
    el.status.textContent = message;
    el.copyStatus.textContent = '';
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('is-locked');   // the glass never redraws over a scrolling page
    sticky.setCartOpen(true);
  }

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('is-locked');
    sticky.setCartOpen(false);
    if (opener && document.contains(opener)) opener.focus();
  });
  // Clicks on the backdrop land on the dialog element itself, outside its box.
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  $('[data-close-cart]', dialog).addEventListener('click', () => dialog.close());
  el.button.addEventListener('click', () => open());

  el.lines.addEventListener('click', (e) => {
    const step = e.target.closest('[data-delta]');
    const remove = e.target.closest('[data-remove]');
    if (step) {
      const i = Number(step.dataset.line);
      const delta = step.dataset.delta;
      lines[i].qty = clampQty(lines[i].qty + Number(delta));
      render();
      // render() replaced the line and its <output>, so say the new quantity, line price and subtotal here.
      const l = lines[i];
      el.status.textContent = `${describe(l)}: ${count(l.qty, 'pack', 'packs')}, ${money(cents(packOf(byHandle(l.product), l.size).price * l.qty))}. Subtotal ${el.subtotal.textContent}.`;
      $(`[data-line="${i}"][data-delta="${delta}"]`, el.lines).focus();   // keep focus on the same button
    } else if (remove) {
      const [gone] = lines.splice(Number(remove.dataset.remove), 1);
      render();
      el.status.textContent = `Removed ${describe(gone)}.`;
      ($('[data-remove]', el.lines) || $('[data-close-cart]', dialog)).focus();
    }
  });

  $('[data-copy-reorder]', dialog).addEventListener('click', () => {
    el.copyStatus.textContent = lines.length
      ? 'Prototype: in the store this copies a link that refills this cart, ready to send to an approver.'
      : 'Add a pack first.';
  });

  render();
  return {
    add({ product, size, color, qty }) {
      const line = lines.find((l) => l.product === product && l.size === size && l.color === color);
      const before = line ? line.qty : 0;
      if (line) line.qty = clampQty(line.qty + qty);
      else lines.push({ product, size, color, qty });
      const added = (line ? line.qty : qty) - before;   // what the cap let in, so the message never overstates
      render();
      open(added
        ? `Added ${count(added, 'pack', 'packs')}: ${describe({ product, size, color })}.`
        : `${describe({ product, size, color })} is already at the 999-pack limit.`);
    },
  };
})();

/* ---------- Drawings below the fold ---------- */
function initDrawings() {
  $$('[data-plinth]').forEach((node) => { node.innerHTML = hangingLanyard({ type: node.dataset.plinth }).svg; });
  $$('[data-samples] .sample__strand').forEach((node) => { node.innerHTML = strand({ length: 250, bend: 0.04 }); });
  $('[data-video-poster]').innerHTML = [1, 2]
    .map((n) => `<span class="poster-strand poster-strand--${n}">${strand({ length: 520, bend: 0.1 })}</span>`)
    .join('');

  // Break-away clasp: CSS opens it on a view timeline; without scroll-driven animations, a class does it once.
  const figure = $('[data-clasp-figure]');
  $('[data-clasp]', figure).innerHTML = claspDetail({ title: 'Break-away clasp. Its two halves pull apart.' });
  if (!CSS.supports('animation-timeline: view()')) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { figure.classList.add('is-open'); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(figure);
  }

  $('[data-play]').addEventListener('click', () => {
    $('[data-video-status]').textContent = 'The product video will play here. It is not in the prototype yet.';
  });
}

initHeader();
initHero();
initDrawings();
