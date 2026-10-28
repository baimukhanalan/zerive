-- ZERIVE — Postgres schema (Neon-compatible).
-- Run once against your Neon database:  psql "$DATABASE_URL" -f schema.sql
-- All user-facing text is trilingual → stored as jsonb {"ru","kk","en"}.

create extension if not exists pgcrypto;   -- gen_random_uuid()

-- ── Reference ontology (shared, not per-user) ──────────────────────────────

create table if not exists body_systems (
  key   text primary key,                       -- heart, metabolic, …
  name  jsonb not null,                          -- {"ru","kk","en"}
  sort  int  not null default 0
);

create table if not exists biomarker_catalog (
  id            text primary key,                -- apob, vitamin_d, …
  system_key    text not null references body_systems(key),
  abbr          text not null,
  name          jsonb not null,
  unit          text not null,
  ref_low       numeric,                          -- null = open-ended side
  ref_high      numeric,
  optimal_low   numeric,
  optimal_high  numeric,
  what          jsonb not null,
  why           jsonb not null,
  related       jsonb not null default '[]',      -- [id, …]
  actions       jsonb not null default '[]'       -- [{"ru","kk","en"}, …]
);

-- ── Users & auth ────────────────────────────────────────────────────────────

create table if not exists users (
  id          uuid primary key default gen_random_uuid(),
  phone       text unique not null,
  name        text,
  created_at  timestamptz not null default now()
);

-- Onboarding intake (1:1 with user).
create table if not exists profiles (
  user_id     uuid primary key references users(id) on delete cascade,
  sex         text,
  age_range   text,
  city        text,
  goals       jsonb not null default '[]',
  sleep       text,
  activity    text,
  smoking     text,
  alcohol     text,
  real_age    int,
  updated_at  timestamptz not null default now()
);

-- Short-lived SMS one-time codes (demo issues any code; swap for a real provider).
create table if not exists otp_codes (
  phone       text primary key,
  code        text not null,
  expires_at  timestamptz not null
);

-- Opaque session tokens (hashed). One row per active login.
create table if not exists sessions (
  token_hash  text primary key,
  user_id     uuid not null references users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);

-- ── Check-ups & results ─────────────────────────────────────────────────────

create table if not exists checkups (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  drawn_at    date not null,
  lab         text,
  city        text,
  status      text not null default 'ready',      -- ordered | drawn | ready
  score       int,                                -- ZERIVE Score for this checkup
  bio_age     numeric,
  real_age    int,
  created_at  timestamptz not null default now()
);

-- One measured value per marker per check-up. Trend = a marker across check-ups.
create table if not exists biomarker_results (
  id          uuid primary key default gen_random_uuid(),
  checkup_id  uuid not null references checkups(id) on delete cascade,
  marker_id   text not null references biomarker_catalog(id),
  value       numeric not null,
  status      text not null,                      -- optimal | normal | attention | high
  unique (checkup_id, marker_id)
);
create index if not exists biomarker_results_marker_idx on biomarker_results(marker_id);

-- Per-system score snapshot per check-up (denormalized for the dashboard).
create table if not exists system_scores (
  checkup_id  uuid not null references checkups(id) on delete cascade,
  system_key  text not null references body_systems(key),
  score       int  not null,
  summary     jsonb,
  primary key (checkup_id, system_key)
);

-- ── Health Vault documents ──────────────────────────────────────────────────

create table if not exists documents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  title         text not null,
  doc_date      date not null,
  source        text not null default 'upload',   -- zerive | upload
  lab           text,
  marker_count  int not null default 0,
  created_at    timestamptz not null default now()
);

-- ── Action plan ─────────────────────────────────────────────────────────────

create table if not exists plan_priorities (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  rank          int not null,
  marker_id     text references biomarker_catalog(id),
  title         jsonb not null,
  goal          jsonb not null,
  why           jsonb not null,
  retest_weeks  int not null default 12
);

create table if not exists plan_steps (
  id           uuid primary key default gen_random_uuid(),
  priority_id  uuid not null references plan_priorities(id) on delete cascade,
  kind         text not null,                     -- diet|lifestyle|activity|supplement|retest|discuss
  title        jsonb not null,
  detail       jsonb not null,
  sort         int not null default 0
);

create table if not exists plan_progress (
  user_id     uuid not null references users(id) on delete cascade,
  step_id     uuid not null references plan_steps(id) on delete cascade,
  done        boolean not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, step_id)
);

-- ── AI chat history (optional) ──────────────────────────────────────────────

create table if not exists ai_messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  role        text not null,                       -- user | ai
  text        text not null,
  created_at  timestamptz not null default now()
);
