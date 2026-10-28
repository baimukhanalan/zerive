# ZERIVE — mobile app

Preventive-health app for Kazakhstan. One blood draw → a clear picture of your
health (ZERIVE Score, biological age, 70+ biomarkers) → a personal action plan →
retest and track progress.

Built with **Expo SDK 57** · Expo Router · React Native 0.86 · TypeScript · Hermes.

## Run

```bash
npm install          # first time only
npx expo start       # dev server — press i / a, or scan the QR
npx expo start --web # browser preview
```

Type-check: `npx tsc --noEmit` · Production bundle check: `npx expo export --platform ios`.

## Product (MVP)

Superpower's business model + Ornament's data/UX intelligence, localized for KZ.
Core loop: **buy a check → give blood → results appear → understand → get a plan →
retest → see improvement.**

5 tabs + supporting flows:

| Tab | What |
| --- | --- |
| **Home** | ZERIVE Score, biological age, body-systems grid, top priorities, next step |
| **Data** | Every biomarker — search, status filters, grouped by system, rich detail screen |
| **Plan** | Personal action plan — prioritized, safe steps you check off (progress persists) |
| **AI** | Assistant grounded in your own results (mocked; educational, non-diagnostic) |
| **Profile** | Health Vault records, settings, language, logout |

Flows: `welcome → sign-in (phone/SMS + Apple/Google) → onboarding → checkout
(buy ZERIVE Check → order QR) → upload results (PDF / photo / manual)`.

## Architecture

```
src/
  app/            file-based routes (welcome, (auth), onboarding, (tabs), biomarker/[id], checkout, upload)
  theme/          design tokens — THE single place to re-skin the app (tokens.ts)
  i18n/           trilingual RU (source) / KK / EN typed catalog + persisted lang store
  store/          session + plan-progress (zustand + AsyncStorage)
  data/           types.ts · dataset.ts (AUTO-GENERATED) · health.ts (selectors)
  components/     UI kit — Screen, Text, Button, Card, ScoreRing, Sparkline, BiomarkerRow, icons…
  lib/            haptics, formatting
```

### Design system

Single **premium dark** theme (black + white + deep emerald). Screens never
hard-code colours/type — everything comes from `src/theme/tokens.ts`. When the
final design lands, edit that one file (and re-skin components as needed).
Fonts: **Manrope** (display/UI/numbers) + **IBM Plex Mono** (eyebrows/labels/data),
both cover Kazakh Cyrillic.

### Health data

`src/data/dataset.ts` holds **73 biomarkers across 8 body systems** plus the action
plan, AI Q&A and onboarding questionnaire — all trilingual. It's generated content
(a `gen-dataset.mjs` script assembles it from a multi-agent authoring run), typed
against `src/data/types.ts`. The ontology is intentionally **extensible** — add
markers/systems without schema changes. All copy is **educational and
non-diagnostic**: it can say a value is above range and explain it, but never names
a disease or prescribes medication.

## Not built yet (deliberately out of MVP scope)

Wearables (Apple Watch/Oura/CGM), marketplace, doctor review, family accounts,
B2B, prediction engine, real backend/labs API, real payments. The current app uses
seed data and mocked auth/payment/AI so the whole product loop is demoable end to end.
