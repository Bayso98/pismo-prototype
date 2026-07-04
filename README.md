# PISMO — accurate homepage prototype

A pixel-faithful rebuild of the PISMO homepage from the Figma design, with the
**Bettoni** typeface integrated the way the design intends. Static HTML/CSS/JS —
open `index.html` in a browser (fonts load from `fonts/`).

## Run it
```bash
cd PISMO-Prototype
python3 serve.py          # no-cache dev server on http://localhost:8090
```
Designed at a fixed **1920px** canvas (same as the Figma frame).

## Responsive (laptop + true mobile)
The design is authored at 1920px. Two layers, desktop untouched by the mobile work:

- **≥ 768px (laptop/desktop):** `js/main.js` scales the whole page to the
  viewport width via `body { zoom }` — down on laptops (0.75× at 1440px) and
  **up on big monitors** (1.33× at a 27" 2560px display), always with exact
  proportions, **no horizontal scroll**, no side gutters, a crisp
  (re-rasterised, not blurred) result, and a **working sticky header**.
  Resizing the window re-fits live.
- **< 768px (phones):** `css/mobile.css` re-lays-out the *same DOM* per the
  Figma mobile design (node 2777-47215): burger header (☰ pismo · Prijava ♡ 🧺)
  with a drop-down menu (search + links + Kreiraj račun), horizontally
  scrollable nav pills, full-bleed hero with prev/next arrows, **2-column
  product grids** (first 4 items) with the heart floating top-left of the cover
  and a full-width "Dodaj u Korpu" button on every card, stacked sections
  (Grmuša feature, Knjiga godine, USP, featured book, blog, newsletter, Pismo
  card) and horizontally scrollable video reels / categories. The dark promo
  banner is omitted on mobile, matching the design.

## Row sliders — arrows page every product section
Every product row (Novo u Ponudi, Knjige za djecu, Popularna psihologija,
Historija Bosne, Naučna knjiga, Klasici, Pokloni), the Najprodavanje strip and
Kategorije are horizontal sliders: circular ‹ › arrows page by whole cards
(5 per page), fading out at either end. Each section carries a second "page"
of titles (cross-listed from another collection) so there is more to see.
Wiring: the row-sliders block in `js/main.js`; extra items: the `MORE` map in
`js/render.js`; styles: the row-slider block in `css/main.css`. On mobile the
rows stay as the design's 2-column grid (arrows hidden).

## Hero — functional carousel (real banners)
The hero is a working carousel of the **7 real designed banners** (Grimm, Bijela
knjiga, Poraz Zapada, Put kojim se rjeđe ide, Između vere i nacije, Muškarci su s
Marsa, Bosanske basne). **Hovering** (or clicking) any thumbnail crossfades the
main banner to that title; the thumbnails show the actual banner artwork with a
title label. `index.html#slide3` deep-links to a slide. Assets: `02-banner-1..7.png`.
Logic: the hero block in `js/main.js`.

## Discount-badge hover tooltips (from the Figma states)
Hovering a badge reveals an explanatory tooltip (content taken from the design):
- **Red "15%"** → header *Pismo card | Čitalački klub*, "Popust za članove
  Čitalački klub programa lojalnosti."
- **Navy "10% Za 3"** → header *Količinski popust*, "Ostvarite količinski popust
  kupovinom 3 ili više artikala."
Both close with "Za više informacija klikni na ⓘ". Tooltips are injected into
every badge by `js/render.js`; styling is the `discount badge hover tooltip`
block in `css/main.css`.

## Micro-interactions (from the Figma states)
- **"Dodaj u Korpu"** — default (light border) → **hover** (teal border + soft
  glow) → **click** flips to a **✓ Dodano**: the checkmark *draws itself in* and
  the label eases (no bounce). The **button keeps its width** so nothing reflows.
  Click again toggles back. The quick-view basket circle flashes a green ✓.
- **Favorite ♥** — gray → **hover** (coral heart + red ring) → **click** locks to
  a **solid red (#ff2f2f)** heart, with a single **ring ripple** expanding out
  once (elegant, not bouncy); toggles off on re-click.
- Plus tasteful global hovers: product covers lift, "Saznaj više" arrows slide,
  buttons brighten/press. All respect `prefers-reduced-motion`.

Logic lives in `js/interactions.js`; the state styles are the
`MICRO-INTERACTIONS` block in `css/main.css`.

## "Najprodavanje" feature card — hover animation (from the Figma states)
The Grmuša feature card is layered (desk texture + faint mark + live heading +
book + button) so it can animate. On hover: the **card border turns teal**, the
**book scales up and lifts**, and the **"Saznaj više" button gains a teal border
and a → arrow** that slides in. Matches the Default/Variant2 states in Figma.
Assets: `04-feat-desk.png`, `04-feat-book.png`, `04-feat-shape.svg`; styles in
the `04 · NAJPRODAVANIJE` block of `css/page.css`.

---

## The font problem — what the dev team got wrong

This is the thing that was hard to explain. Bettoni is not one font; it ships as
**three optical sizes**, each with **nine weights** (27 files total):

| Optical size | Use it for |
|---|---|
| **Bettoni Display** | Big headings, hero, section titles (H1–H2) |
| **Bettoni Subhead** | Card titles, prices, nav, buttons (H3 / UI) |
| **Bettoni Text** | Body paragraphs, descriptions |

Optical sizes are *not* interchangeable. "Display" has fine, high-contrast
hairlines tuned for large sizes; "Text" has sturdier strokes tuned for small
body copy. Using the wrong one — or letting the browser substitute a fallback —
is exactly why the live test site "looks wrong."

**What test.pismo.ba actually does** (from its stylesheet):

```css
@font-face { font-family: bettoni;     src: url(...); font-weight: 400; }  /* + 500,600,700,900 */
@font-face { font-family: bettoniText; src: url(...); font-weight: 400; }  /* + 500,600,700   */
/* headings fall back like this: */
font-family: var(--font-bettoni), "Inter Display", system-ui, sans-serif;
font-family: var(--font-bettoni-text), Inter, system-ui, sans-serif;
```

Three concrete mistakes:

1. **Only two of the three optical families are wired up** ("bettoni" and
   "bettoniText"). There is **no Subhead** cut. So card titles, prices and nav —
   which should be Bettoni *Subhead* — are being drawn with the Display or Text
   cut, or with Inter.
2. **Missing weights.** They register 400/500/600/700/900 for one family and
   400–700 for the other. The design uses **200, 300, 350, 900** in places. When
   a requested weight isn't in the `@font-face` set, the browser **synthesises**
   it (fake-bolds/among the loaded weight) or **falls back to Inter** — either
   way the letterforms change.
3. **Inter is the fallback, and it shows.** `"Inter Display"` isn't a font that
   gets loaded, so it resolves to `system-ui`. With `font-display: swap`, any
   Bettoni file that is slow, missing, or mismatched renders as **Inter/system
   sans-serif** — which is why the headings read as a generic sans instead of
   Bettoni's serif character.

Net effect: the distinctive Bettoni look (the serif display headings, the
lowercase `pismo` wordmark feel) collapses into Inter for large parts of the
page. That's the "fonts are not formatted correctly" you were seeing.

### What this prototype does instead

`css/fonts.css` registers **all 27 cuts** — Display / Subhead / Text × 9 weights
— from the static files you provided, converted to `woff2`:

```css
@font-face { font-family:'Bettoni Display'; src:url(../fonts/Bettoni-DisplayBold.woff2) format('woff2'); font-weight:700; }
/* ...one @font-face per weight, for each of the three optical families... */
```

and the CSS uses the **right optical size for the right role**:

- `--f-display` → hero + section headings
- `--f-subhead` → card titles, prices, nav, buttons
- `--f-text` → body paragraphs

No Inter anywhere. Nothing is synthesised. Every weight the design calls for has
a real file behind it.

### Hand this to the dev team
1. Ship all three optical families (Display, **Subhead**, Text), not two.
2. Register every weight the design uses (incl. 200/300/350/900), so the browser
   never synthesises or falls back.
3. Map roles to optical sizes: Display=headings, Subhead=titles/UI, Text=body.
4. Drop `Inter`/`Inter Display` from the Bettoni stacks — use a serif fallback
   (`Georgia, serif`) only, so a fallback flash still looks like a serif.

---

## Project structure
```
index.html          Full page (14 sections)
css/fonts.css       All 27 Bettoni @font-face rules (the fix)
css/main.css        Design tokens + shared components (cards, badges, buttons)
css/page.css        Per-section layout
js/render.js        Product-card data + renderer (card text is live Bettoni)
js/main.js          Watermark fill + carousel scroll
fonts/              27 Bettoni woff2 files
assets/             Cropped imagery from the design (covers, hero, mockups)
```

## Notes / honest gaps
- Book covers, hero art, phone mockups, blog and category photos are cropped
  from the design render (they're photography/artwork, not type). **All text is
  live HTML** set in Bettoni.
- Carousels (hero thumbnails, best-sellers, featured, categories) are shown in
  their design state; horizontal scroll is wired but arrows are not scripted.
- Total page height is ~12,900px vs the design's 13,529px — a few sections run
  slightly tighter. Every section matches the design visually.
