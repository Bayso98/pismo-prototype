/* ============================================================
   PISMO — icon library + data-driven product-card renderer.
   Card TEXT is live DOM in Bettoni; only cover art is an image.
   ============================================================ */

const ICON = {
  arrow: '<svg viewBox="0 0 26 20" fill="none"><path d="M1 10h23M16 2l8 8-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  basket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 9h13l-1.2 9.2a2 2 0 0 1-2 1.8H8.7a2 2 0 0 1-2-1.8L5.5 9Z"/><path d="M3 9h18"/><path d="M9.2 9l2.4-5M14.8 9l-2.4-5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.7-10-9.3C.5 8 2.6 4.5 6.2 4.5c2 0 3.6 1 4.6 2.6.2.4.9.4 1.1 0 1-1.6 2.7-2.6 4.7-2.6 3.6 0 5.7 3.5 4.2 7.2C18.5 16.3 12 21 12 21Z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.2-3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  heartline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-9.3-8.6C1.2 8.4 3 5.3 6.2 5.3c1.9 0 3.4 1 4.5 2.5.2.3.4.3.6 0 1.1-1.5 2.6-2.5 4.5-2.5 3.2 0 5 3.1 3.5 6.1C19 15.6 12 20 12 20Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5" stroke-linecap="round"/><circle cx="12" cy="7.6" r="1.15" fill="currentColor" stroke="none"/></svg>',
};
window.ICON = ICON; // shared with js/interactions.js

// Discount-badge hover tooltips (content from the Figma states)
const BADGE_TIP = {
  red: `<span class="badge-tip badge-tip--red" role="tooltip">
    <span class="badge-tip__head">Pismo card | Čitalački klub</span>
    <span class="badge-tip__body">Popust za članove Čitalački klub programa lojalnosti.</span>
    <span class="badge-tip__foot">Za više informacija klikni na ${ICON.info}</span>
  </span>`,
  navy: `<span class="badge-tip badge-tip--navy" role="tooltip">
    <span class="badge-tip__head">Količinski popust</span>
    <span class="badge-tip__body">Ostvarite količinski popust kupovinom 3 ili više artikala.</span>
    <span class="badge-tip__foot">Za više informacija klikni na ${ICON.info}</span>
  </span>`,
};

function badges() {
  return `<div class="badges">
    <span class="badge badge--red">15%</span>
    <span class="badge badge--navy">10%<small>Za 3</small></span>
  </div>`;
}

// variant: 'default' (button row) | 'quick' (circle actions, no author omitted unless noAuthor)
// The author line is always rendered (empty when missing) and titles sit in a
// fixed two-line slot, so prices and buttons align across every card in a row.
function cardHTML(p, variant) {
  const author = `<p class="p-card__author">${p.author ?? ''}</p>`;
  const price = `<p class="p-card__price">${p.price} <s>${p.old || '39.90 KM'}</s></p>`;
  if (variant === 'quick') {
    return `<article class="p-card p-card--quick">
      <div class="p-card__media">
        <img class="p-card__cover" src="${p.img}" alt="${p.title}">
        ${badges()}
        <div class="quick-actions">
          <button class="icon-circle icon-circle--heart" data-fav aria-label="Dodaj u želje">${ICON.heartline}</button>
          <button class="icon-circle icon-circle--basket" data-cart aria-label="Dodaj u korpu">${ICON.basket}</button>
        </div>
      </div>
      <h3 class="p-card__title"><span>${p.title}</span></h3>
      ${author}${price}
      <div class="p-card__actions p-card__actions--m">
        <button class="btn btn--outline" data-cart data-added="Dodano">${ICON.basket} Dodaj u Korpu</button>
      </div>
    </article>`;
  }
  return `<article class="p-card">
    <div class="p-card__media">
      <img class="p-card__cover" src="${p.img}" alt="${p.title}">
      ${badges()}
    </div>
    <h3 class="p-card__title"><span>${p.title}</span></h3>
    ${author}${price}
    <div class="p-card__actions">
      <button class="btn btn--outline" data-cart data-added="Dodano">${ICON.basket} Dodaj u Korpu</button>
      <button class="heart-btn" data-fav aria-label="Dodaj u želje">${ICON.heart}</button>
    </div>
  </article>`;
}

const ROWS = {
  novo: { variant: 'default', items: [
    { title: 'Such a Fun Age', author: 'James Sulivan', price: '18.90 KM', img: 'assets/03-novo-cover-1.png' },
    { title: 'Crna ptica', author: 'James Sulivan', price: '18.90 KM', img: 'assets/03-novo-cover-2.png' },
    { title: 'Minesote', author: 'Ju Nesbe', price: '18.90 KM', img: 'assets/03-novo-cover-3.png' },
    { title: '1984 - ŽIVOTINJSKA FARMA', author: 'Džordž Orvel', price: '18.90 KM', img: 'assets/03-novo-cover-4.png' },
    { title: 'Chinook', author: 'Sejranović Bekim', price: '18.90 KM', img: 'assets/03-novo-cover-5.png' },
  ]},
  djeca: { variant: 'default', items: [
    { title: 'Gdje je Mica Maca?', author: 'Marijke Klompmaker', price: '18.90 KM', img: 'assets/07-djeca-cover-1.png' },
    { title: 'Sjajni svijet Toma Gatesa', author: 'Liz Pichon', price: '18.90 KM', img: 'assets/07-djeca-cover-2.png' },
    { title: 'Neverovatan svet dinosaurusa', author: 'Grupa autora', price: '18.90 KM', img: 'assets/07-djeca-cover-3.png' },
    { title: 'Crvenkapica - Mala lektira', author: 'Grupa autora', price: '18.90 KM', img: 'assets/07-djeca-cover-4.png' },
    { title: 'Velike svjetske rijeke', author: 'V. Mehnert, M. Haake', price: '18.90 KM', img: 'assets/07-djeca-cover-5.png' },
  ]},
  psiho: { variant: 'quick', items: [
    { title: 'Moć podsvijesti', author: 'Joseph Murphy', price: '19.00 KM', img: 'assets/08-psiho-cover-1.png' },
    { title: 'Odrasla deca emocionalno nezrelih roditelja', author: 'Lindzi Gibson', price: '26.00 KM', img: 'assets/08-psiho-cover-2.png' },
    { title: 'Održiva prehrana za svaki dan', author: 'Marizela Šabanović', price: '58.50 KM', old: '69.90 KM', img: 'assets/08-psiho-cover-3.png' },
    { title: 'Počni sa zašto', author: 'Simon Sinek', price: '22.00 KM', img: 'assets/08-psiho-cover-4.png' },
    { title: 'Razoružavanje narcisa', author: 'Vendi Bahari', price: '27.00 KM', img: 'assets/08-psiho-cover-5.png' },
  ]},
  hist: { variant: 'default', items: [
    { title: 'Bosanski muslimani u Drugom svjetskom ratu', author: 'Marko Attila Hoare', price: '35.00 KM', old: '45.90 KM', img: 'assets/09-hist-cover-1.png' },
    { title: 'Bosna i Bošnjaci', author: 'Enes Durmišević', price: '45.00 KM', old: '64.90 KM', img: 'assets/09-hist-cover-2.png' },
    { title: 'Bosna i Hercegovina u spisima Ahmeda Dževdet-paše', author: 'Kerima Filan - priredila i prevela', price: '19.50 KM', img: 'assets/09-hist-cover-3.png' },
    { title: 'Sarajevski dugi pucnji 1914.', author: 'V. Preljević, C. R. priredili', price: '18.90 KM', img: 'assets/09-hist-cover-4.png' },
    { title: 'Such a Fun Age', author: 'James Sulivan', price: '18.90 KM', img: 'assets/09-hist-cover-5.png' },
  ]},
  naucna: { variant: 'quick', items: [
    { title: 'Kulturno pamćenje', author: 'Jan Assman', price: '18.90 KM', img: 'assets/10-naucna-cover-1.png' },
    { title: 'Izborni sistemi u Jugoslaviji', author: 'Hamdija Ćemerlić', price: '18.90 KM', img: 'assets/10-naucna-cover-2.png' },
    { title: 'Između vere i nacije', author: 'Ivan Ejub Kostić', price: '18.90 KM', img: 'assets/10-naucna-cover-3.png' },
    { title: 'Osnove ekonomije:', author: 'Ivan Ejub Kostić', price: '18.90 KM', img: 'assets/10-naucna-cover-4.png' },
    { title: 'Pax Americana', author: 'Zijad Šehić', price: '18.90 KM', img: 'assets/10-naucna-cover-5.png' },
  ]},
  klasici: { variant: 'default', items: [
    { title: 'Such a Fun Age', author: 'Jane Austen', price: '18.90 KM', img: 'assets/11-klasici-cover-1.png' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', price: '18.90 KM', img: 'assets/11-klasici-cover-2.png' },
    { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', price: '18.90 KM', img: 'assets/11-klasici-cover-3.png' },
    { title: 'Brave New World', author: 'Aldous Huxley', price: '18.90 KM', img: 'assets/11-klasici-cover-4.png' },
    { title: 'I Capture The Castle', author: 'Dodie Smith', price: '18.90 KM', img: 'assets/11-klasici-cover-5.png' },
  ]},
  pokloni: { variant: 'quick', items: [
    { title: 'Uno Flip', author: undefined, price: '18.90 KM', img: 'assets/11-pokloni-cover-1.png' },
    { title: 'Tabu XL', author: undefined, price: '18.90 KM', img: 'assets/11-pokloni-cover-2.png' },
    { title: 'Baby Yoda figure', author: undefined, price: '18.90 KM', img: 'assets/11-pokloni-cover-3.png' },
    { title: 'Harry Potter Prop', author: undefined, price: '18.90 KM', img: 'assets/11-pokloni-cover-4.png' },
    { title: 'Yume Spy X Family Squish', author: undefined, price: '18.90 KM', img: 'assets/11-pokloni-cover-5.png' },
  ]},
};

// Each section carries a second "page" of titles (cross-listed from another
// collection, as in a real shop) so the row arrows have somewhere to go.
const MORE = { novo: 'klasici', djeca: 'pokloni', psiho: 'naucna', hist: 'psiho', naucna: 'hist', klasici: 'novo', pokloni: 'djeca' };
{
  const first = Object.fromEntries(Object.entries(ROWS).map(([k, v]) => [k, v.items.slice()]));
  Object.entries(MORE).forEach(([k, src]) => { ROWS[k].items = first[k].concat(first[src]); });
}

document.querySelectorAll('[data-row]').forEach((el) => {
  const row = ROWS[el.dataset.row];
  if (row) el.innerHTML = row.items.map((p) => cardHTML(p, row.variant)).join('');
});

// inject named icons used outside cards: <i data-icon="arrow"></i>
document.querySelectorAll('[data-icon]').forEach((el) => {
  el.innerHTML = ICON[el.dataset.icon] || '';
});

// inject the hover tooltip into every discount badge (rendered + hardcoded)
document.querySelectorAll('.badge--red').forEach((b) => {
  if (!b.querySelector('.badge-tip')) b.insertAdjacentHTML('beforeend', BADGE_TIP.red);
});
document.querySelectorAll('.badge--navy').forEach((b) => {
  if (!b.querySelector('.badge-tip')) b.insertAdjacentHTML('beforeend', BADGE_TIP.navy);
});
