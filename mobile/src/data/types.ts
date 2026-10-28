// ZERIVE health domain model.
//
// Designed to be EXTENSIBLE from day one (per the Ornament insight: don't hard-
// code 100 markers — model an ontology that grows). Every biomarker belongs to
// a body `system`, carries lab + optimal ranges, a trend history and trilingual
// educational copy. Nothing here diagnoses disease or prescribes drugs.

/** A localized string. `ru` is the source language; `kk` (Kazakh) + `en` mirror it. */
export interface L10n {
  ru: string;
  kk: string;
  en: string;
}

export type Lang = keyof L10n;

/** 4-tier result status. Drives the colour semantics across the app. */
export type Status = 'optimal' | 'normal' | 'attention' | 'high';

/** The body systems a biomarker can belong to. Stable ids used as keys. */
export type SystemKey =
  | 'heart'
  | 'metabolic'
  | 'hormones'
  | 'inflammation'
  | 'nutrients'
  | 'liver'
  | 'kidney'
  | 'blood';

export interface TrendPoint {
  /** ISO-ish "YYYY-MM". */
  date: string;
  value: number;
}

export interface Biomarker {
  id: string;              // stable slug, e.g. 'apob'
  system: SystemKey;
  abbr: string;            // lab abbreviation, e.g. 'ApoB'
  name: L10n;
  value: number;
  unit: string;
  status: Status;
  /** Lab reference range. Either bound may be null for an open-ended side. */
  refLow: number | null;
  refHigh: number | null;
  /** Tighter "optimal" target where a validated consensus exists — else null. */
  optimalLow: number | null;
  optimalHigh: number | null;
  history: TrendPoint[];   // last point's value === `value`
  what: L10n;              // plain-language "what is this"
  why: L10n;               // "why it matters"
  related: string[];       // ids of related biomarkers
  actions: L10n[];         // safe lifestyle next-steps
}

export interface BodySystem {
  key: SystemKey;
  name: L10n;
  score: number;           // 0–100
  summary: L10n;
  /** Derived at load time from the system's biomarkers. */
  markerCount: number;
  counts: Record<Status, number>;
}

/** Top-level report summary shown on Home. */
export interface Report {
  score: number;           // ZERIVE Score 0–100
  scoreDelta: number;      // vs previous test
  bioAge: number;
  realAge: number;
  updatedAt: string;       // ISO "YYYY-MM-DD"
  counts: Record<Status, number>;
}

// ── Action Plan ──────────────────────────────────────────────────────────────

export type StepKind = 'diet' | 'lifestyle' | 'activity' | 'supplement' | 'retest' | 'discuss';

export interface PlanStep {
  id: string;
  kind: StepKind;
  title: L10n;
  detail: L10n;
  done?: boolean; // present when the plan comes from the API
}

export interface PlanPriority {
  id: string;
  rank: number;
  title: L10n;
  goal: L10n;
  why: L10n;
  marker: string;          // biomarker id this priority targets
  retestWeeks: number;
  steps: PlanStep[];
}

// ── AI assistant ─────────────────────────────────────────────────────────────

export interface AiSuggestion {
  id: string;
  q: L10n;
  a: L10n;
}

export interface AiContent {
  greeting: L10n;
  placeholder: L10n;
  suggestions: AiSuggestion[];
  fallback: L10n;
  disclaimer: L10n;
}

// ── Onboarding questionnaire ─────────────────────────────────────────────────

export type OnbKind = 'number' | 'single' | 'multi' | 'segmented';

export interface OnbOption {
  id: string;
  label: L10n;
}

export interface OnbStep {
  id: string;
  kind: OnbKind;
  title: L10n;
  subtitle?: L10n;
  unit?: string;
  options?: OnbOption[];
}

// ── Health Vault records ─────────────────────────────────────────────────────

export type RecordSource = 'zerive' | 'upload';

export interface HealthRecord {
  id: string;
  title: string;
  date: string;            // ISO
  source: RecordSource;
  lab?: string;
  markerCount: number;
}

/** The full generated dataset (produced by the content workflow). */
export interface HealthDataset {
  systems: BodySystem[];
  biomarkers: Biomarker[];
  plan: PlanPriority[];
  ai: AiContent;
  onboarding: OnbStep[];
}
