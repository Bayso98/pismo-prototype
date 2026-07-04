// ---- Responsive: scale the fixed 1920px canvas to fit the viewport width ----
// `zoom` (unlike transform) keeps the sticky header working and auto-adjusts
// document height, so the whole design fits any laptop with no horizontal scroll.
// Below 768px css/mobile.css takes over with a true mobile layout — no zoom there.
const MOBILE_BP = window.matchMedia('(max-width: 767px)');
function fitToWidth() {
  if (MOBILE_BP.matches) { document.body.style.zoom = ''; return; }
  // scale both down (laptops) AND up (27"+ monitors) so the 1920px design
  // always fills the viewport width at exact proportions — no side gutters.
  const w = document.documentElement.clientWidth;
  document.body.style.zoom = String(w / 1920);
}
fitToWidth();
window.addEventListener('resize', () => { fitToWidth(); fillWatermarks(); });

// Fill watermark containers with rows of repeated "pismo".
// Matches the Figma pattern (nodes 2909-12216/17355/23791/28874):
//   · row pitch 18.7px, wordmark period ~46.4px
//   · alternate rows shifted by ~half a period (the zig-zag / brick look)
//   · row opacity fades edge → centre → edge (triangular profile), measured
//     0.025→0.09→0.025 for white-on-navy and roughly half for navy-on-light
function fillWatermarks() {
  const PITCH = 18.7;
  document.querySelectorAll('.wm').forEach((el) => {
    const light = el.dataset.wm === 'navy'; // navy text on a light band
    const [aMin, aMax] = light ? [0.007, 0.045] : [0.025, 0.095];
    const rows = Math.ceil(el.parentElement.offsetHeight / PITCH) + 1;
    let html = '';
    for (let i = 0; i < rows; i++) {
      const t = (i + 0.5) / rows;                       // 0..1 down the band
      // trapezoid: ramp over the outer 40%, plateau through the middle
      const ramp = Math.min(1, Math.min(t, 1 - t) / 0.4);
      const a = aMin + (aMax - aMin) * ramp;
      const off = i % 2 ? -45.5 : -18;                  // half-period stagger
      html += `<div style="opacity:${a.toFixed(3)};margin-left:${off}px">${'pismo '.repeat(60)}</div>`;
    }
    el.innerHTML = html;
  });
}
fillWatermarks();
// Re-fill once images have loaded and band heights are final.
window.addEventListener('load', fillWatermarks);

// ---- Hero carousel: hover (or click) a thumbnail to switch the banner ----
// On mobile the thumbnails are hidden and the side arrows step through slides.
(function () {
  const slides = document.querySelectorAll('.hero__slide');
  const thumbs = document.querySelectorAll('.hero__thumb');
  if (!slides.length) return;
  let cur = 0;
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.slide) === cur));
    thumbs.forEach((t) => t.classList.toggle('is-active', Number(t.dataset.go) === cur));
  }
  thumbs.forEach((t) => {
    const i = Number(t.dataset.go);
    t.addEventListener('mouseenter', () => go(i));
    t.addEventListener('click', () => go(i));
  });
  document.querySelectorAll('.hero__arrow').forEach((b) => {
    b.addEventListener('click', () => go(cur + Number(b.dataset.dir)));
  });
  // optional deep-link: index.html#slide3 opens on that slide
  const m = location.hash.match(/^#slide(\d)$/);
  if (m) go(Number(m[1]));
})();

// ---- Facebook-Reel facade ("Riječ - dvije o knjizi") ----
// Nothing loads from Facebook until a phone is clicked; then the FB player
// is injected into that phone's screen. One reel plays at a time; ✕ stops it.
(function () {
  const SRC = (id) =>
    'https://www.facebook.com/plugins/video.php?href=' +
    encodeURIComponent(`https://www.facebook.com/reel/${id}/`) +
    '&show_text=false&autoplay=1&width=280&height=500';
  let active = null;
  function stop(reel) {
    reel.querySelector('.reel__frame')?.remove();
    reel.querySelector('.reel__close')?.remove();
    reel.classList.remove('is-playing');
    if (active === reel) active = null;
  }
  function play(reel) {
    if (reel.classList.contains('is-playing')) return;
    if (active) stop(active);
    const f = document.createElement('iframe');
    f.className = 'reel__frame';
    f.src = SRC(reel.dataset.reel);
    f.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('title', 'Pismo video preporuka');
    const x = document.createElement('button');
    x.className = 'reel__close';
    x.setAttribute('aria-label', 'Zaustavi video');
    x.textContent = '✕';
    x.addEventListener('click', (e) => { e.stopPropagation(); stop(reel); });
    reel.append(f, x);
    reel.classList.add('is-playing');
    active = reel;
  }
  document.querySelectorAll('.reel[data-reel]').forEach((reel) => {
    reel.addEventListener('click', () => play(reel));
    reel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(reel); }
    });
  });
})();

// ---- Mobile burger: toggles the dropdown menu under the header ----
(function () {
  const burger = document.querySelector('.hdr-burger');
  const header = document.querySelector('.site-header');
  if (!burger || !header) return;
  burger.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
  });
})();

// Horizontal wheel-scroll for carousel strips
document.querySelectorAll('[data-carousel]').forEach((strip) => {
  strip.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      strip.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });
});

// ---- Row sliders: arrows page every product row / carousel strip ----
// Wraps each scroller in .row-slider, injects ‹ › arrows, scrolls by whole
// cards, and fades an arrow out at its end of the strip. Desktop-only
// (mobile keeps the design's 2-column grid; arrows are hidden there).
(function () {
  const CHEV_L = '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHEV_R = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const targets = [
    ...[...document.querySelectorAll('.card-row[data-row]')].map((el) => ({ el, item: '.p-card' })),
    ...[...document.querySelectorAll('.best__carousel')].map((el) => ({ el, item: '.p-card' })),
    ...[...document.querySelectorAll('.kat__stage')].map((el) => ({ el, item: '.kat__track img', kat: true })),
  ];
  targets.forEach(({ el, item, kat }) => {
    if (el.closest('.row-slider')) return;
    const wrap = document.createElement('div');
    wrap.className = 'row-slider' + (kat ? ' row-slider--kat' : '');
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    const mk = (side, svg) => {
      const b = document.createElement('button');
      b.className = `row-arrow row-arrow--${side}`;
      b.setAttribute('aria-label', side === 'l' ? 'Prethodno' : 'Sljedeće');
      b.innerHTML = svg;
      b.addEventListener('click', () => {
        const it = el.querySelector(item);
        if (!it) return;
        const gap = parseFloat(getComputedStyle(it.parentElement).columnGap) || 0;
        const step = it.offsetWidth + gap;
        const page = Math.max(step, Math.floor((el.clientWidth + gap) / step) * step);
        el.scrollBy({ left: (side === 'l' ? -1 : 1) * page, behavior: 'smooth' });
      });
      wrap.appendChild(b);
      return b;
    };
    const L = mk('l', CHEV_L), R = mk('r', CHEV_R);
    const update = () => {
      // 40px tolerance: the last card's discount badge overhangs the row by
      // ~27px, which pads scrollWidth — don't keep the arrow alive for it.
      const max = el.scrollWidth - el.clientWidth - 40;
      L.classList.toggle('is-off', el.scrollLeft <= 2);
      R.classList.toggle('is-off', el.scrollLeft >= max);
    };
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
