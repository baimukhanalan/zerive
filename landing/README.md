# ZERIVE — landing

Production static landing page for **ZERIVE**, a health & longevity biomarker
membership adapted for Kazakhstan. Cinematic scroll-storytelling: full-bleed photo
scenes pinned with `position:sticky`, per-letter headline reveals, and light
content blocks (reviews / download / pricing) below. Trilingual — **RU / KK / EN**,
switched entirely client-side.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — 12 chapters + CTA and footer. |
| `styles.css` | Design tokens, scene scaffolding, component styles, motion. |
| `script.js` | i18n catalog + switcher, scroll engine (camera dolly, parallax, progress, chapter rail), split-text reveals, count-ups, early-access form. |
| `assets/` | Scene photography (`scene-*.jpg`). |

No build step, no dependencies. Fonts (**Manrope** + **IBM Plex Mono**, with the
Cyrillic subset) load from Google Fonts over `<link>`.

## Sections

1. Hero — Ken-Burns vial photo, display headline, early-access CTA
2. Проблема — dark text-only statement
3. Тело — eye photo, "language of data"
4. 100+ — warm scene with count-up bignum
5. Тест — lab photo + partner-labs strip (INVIVO · OLYMP · SYNEVO · KDL)
6. Приложение — blurred scene + CSS phone mock (Score ring, bio-age, grade pills)
7. Долголетие — nature photo, biological clock
8. Энергия — runner photo, "живи дольше"
9. Маркет — supplements photo, member discount
10. Отзывы — light section, two infinite testimonial ribbons
11. Скачать приложение — light section, App Store / Google Play badges
12. Тарифы — three-tier pricing grid

Plus the closing CTA (`#access`, early-access email) and the footer wordmark.

Fixed chrome: scroll-progress bar, sticky nav (wordmark + language switcher +
CTA) and the chapter rail (`≥1080px`, keyboard-navigable anchor list).

## Preview locally

From this folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open the printed URL (e.g. `http://localhost:3000` or `http://localhost:8000`).

You can also just double-click `index.html` to open it directly in a browser —
everything works from `file://` (fonts still load from Google Fonts, so keep a
network connection for the first load).

## Deploy

> **Never drag-and-drop this folder into a hosting dashboard.** Drag-and-drop
> uploads *everything* it finds, ignoring `.vercelignore` / `.gitignore` — which
> means `.env.local`, `.vercel/` and any other local-only files would be published
> alongside the page. Use one of the two methods below instead.

**1. Vercel CLI (recommended).** This folder is already linked to the Vercel
project `zerive`, and `.vercelignore` keeps local-only files out of the upload:

```bash
cd landing
vercel deploy --prod --yes
```

**2. Clean-folder upload (any static host: Netlify, Cloudflare Pages, S3…).**
Copy only the four things the page actually needs into an empty folder, then
upload *that* folder:

```bash
mkdir -p /tmp/zerive-dist
cp index.html styles.css script.js /tmp/zerive-dist/
cp -R assets /tmp/zerive-dist/
```

No build step, no configuration, no environment variables. `index.html` is served
as the entry point automatically.

## Design system (reference)

- **Fonts:** Manrope 400–800 (display / UI / numbers), IBM Plex Mono 400–600
  (eyebrows, data, `[ bracket ]` buttons).
- **Colors:** paper `#F3F1ED`, paper2 `#EAE5DC`, card `#FBFAF8`, ink `#17161A`,
  ink2 `#33312E`, muted `#67625A`, faint `#6E6A61`, hairline `#E4E0D8`,
  accent `#E1521B` (hover `#E8935A`, press `#CF4816`); bone `#F6F1E9` for text on
  photo scrims; health green `#57B07E`.
- `--muted` / `--faint` are body text on the light sections, so both are kept at
  **≥4.5:1 (WCAG AA)** against paper, paper2 and card. Do not lighten them — use
  `--line` for hairlines instead.
- Defined once as CSS custom properties in `:root` (`styles.css`).

## Accessibility notes

- Semantic landmarks (`nav`, `main`, `section`, `footer`), one `h1`, ordered
  heading levels. The chapter rail is a second labelled `<nav>` of real
  `href="#section"` links (JS only upgrades the jump to a smooth scroll).
- Keyboard-operable with a visible `:focus-visible` ring on every interactive
  element, including the rail dots and the early-access email field.
- Language buttons meet the 44×44 px touch-target minimum.
- Split headlines carry the full string in `aria-label`; the per-letter `<span>`s
  are `aria-hidden`. Decorative marquee duplicates are `aria-hidden` too.
- `applyLang()` also updates `<html lang>`, `<title>`, the meta description and
  the translated `aria-label`s.
- `prefers-reduced-motion` disables reveal animations, the Ken-Burns drift, the
  count-ups, the score-ring sweep, the marquees and smooth scrolling.

## Early-access form

There is **no backend**. Submitting the form composes a `mailto:` draft to
`hello@zerive.kz` in the visitor's own mail client, pre-filled with the address
they typed — nothing is transmitted until they press Send themselves. A consent
line under the form says so, in all three languages. If a real signup endpoint is
added later, replace the `submit` handler in `script.js` (search for
`accessForm`) and update `cta.consent` in the i18n catalog.
