/* ============================================================
   PISMO — cart & favorite micro-interactions.
   Loaded AFTER render.js so cards + window.ICON exist.
   ============================================================ */
(function () {
  const ICONS = window.ICON || {};
  const check = ICONS.check || '✓';

  // ---- Add to cart ----
  document.querySelectorAll('[data-cart]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Text buttons ("Dodaj u Korpu" / "Add to cart"): swap to a check + label.
      if (btn.classList.contains('btn')) {
        // Lock the width ONCE so the shorter "Dodano" label never reflows it.
        if (!btn.dataset.locked) {
          btn.style.minWidth = btn.offsetWidth + 'px';
          btn.dataset.orig = btn.innerHTML;
          btn.dataset.locked = '1';
        }
        const added = btn.classList.toggle('is-added');
        btn.setAttribute('aria-pressed', added);
        btn.innerHTML = added ? `${check} ${btn.dataset.added || 'Dodano'}` : btn.dataset.orig;
      }

      // Quick-action basket circle: flash a green check, then revert.
      if (btn.classList.contains('icon-circle--basket')) {
        if (btn.dataset.busy) return;
        btn.dataset.busy = '1';
        const orig = btn.innerHTML;
        btn.innerHTML = check;
        btn.classList.add('is-added-circle');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove('is-added-circle');
          delete btn.dataset.busy;
        }, 1100);
      }
    });
  });

  // ---- Favorite (heart): toggle + one-shot ring ripple (no bounce) ----
  document.querySelectorAll('[data-fav]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const on = btn.classList.toggle('is-fav');
      btn.setAttribute('aria-pressed', on);
      if (on) {
        btn.classList.remove('fav-burst');
        void btn.offsetWidth; // restart the animation
        btn.classList.add('fav-burst');
      }
    });
  });
})();
