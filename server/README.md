# ZERIVE — backend (Neon Postgres)

Turns the app from a static frontend demo into a real, DB-backed product.

## Status

- ✅ `schema.sql` — full Postgres schema (users, profiles, check-ups, biomarker
  catalog + results, documents, action plan, sessions, OTP, AI history).
- ✅ `gen-seed.mjs` → `seed.sql` — loads the reference ontology (8 systems, 73
  biomarkers) + a demo user "Alan" with 3 check-ups (so trends come from real
  rows). Regenerate: `node server/gen-seed.mjs`.
- ⏳ API functions + app wiring — built next, against the live database.

## What I need from you to go live

1. **A Neon connection string** (`DATABASE_URL`). Either:
   - create a free project at neon.tech and paste the pooled connection string, **or**
   - in the Vercel dashboard for the `zerive-app` project: Storage → Create Database
     → **Neon** — this provisions it and sets `DATABASE_URL` automatically.
2. **Auth choice** for phone sign-in:
   - **Real SMS OTP** — needs an SMS provider (KZ: Mobizon / SMSC / Twilio) + its
     API key. Most production-like.
   - **Demo OTP for now** — any 4 digits log you in (as today), but backed by a real
     `users` row + session token. Apple/Google can be wired later. Fastest to ship.

## Once I have those, the remaining steps (I'll do them)

1. `psql "$DATABASE_URL" -f server/schema.sql` then `-f server/seed.sql`.
2. Add serverless API functions under `api/` on the same Vercel project:
   - `POST /api/auth/request-otp`, `POST /api/auth/verify-otp` → session token.
   - `GET /api/me`, `PUT /api/profile` (onboarding).
   - `GET /api/report` (score + systems + biomarkers with history), `GET /api/biomarker/:id`.
   - `GET /api/plan`, `POST /api/plan/toggle`.
   - `GET /api/documents`, `POST /api/documents` (upload stub → marker rows).
   - Neon access via `@neondatabase/serverless` (HTTP driver, ideal for serverless).
3. Swap the app's data layer from the static `dataset.ts` + AsyncStorage to the API
   (auth token in secure storage; the static dataset stays as an offline fallback).
4. Redeploy and verify end-to-end.

## Architecture

Single Vercel project = the static Expo web/PWA at the root + `/api/*` serverless
functions. The `dataset.ts` ontology becomes the seed for `biomarker_catalog`, so
the app's content and the DB stay in sync from one source.
