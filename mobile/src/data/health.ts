// Health data access layer. Prefers live API data (cached in the data store)
// and falls back to the bundled static dataset when the API hasn't loaded
// (offline / error). Screens read these selectors and stay unchanged.

import type {
  Biomarker, BodySystem, PlanPriority, AiContent, OnbStep, HealthRecord,
  Report, Status, SystemKey,
} from './types';
import { META, SYSTEMS_META, BIOMARKERS, PLAN, AI, ONBOARDING, RECORDS } from './dataset';
import { useDataStore } from '@/store/data';

export const USER = { name: 'Alan', initials: 'A' };

const emptyCounts = (): Record<Status, number> => ({ optimal: 0, normal: 0, attention: 0, high: 0 });

function countBy(markers: Biomarker[]): Record<Status, number> {
  const c = emptyCounts();
  for (const m of markers) c[m.status] += 1;
  return c;
}

// Whichever source is active: live API cache if loaded, else static bundle.
const live = () => useDataStore.getState();

/** All biomarkers. */
export function getBiomarkers(): Biomarker[] {
  const s = live();
  return s.usingApi ? (s.biomarkers ?? []) : BIOMARKERS;
}

export function getBiomarker(id: string): Biomarker | undefined {
  return getBiomarkers().find((m) => m.id === id);
}

export function getBiomarkersBySystem(key: SystemKey): Biomarker[] {
  return getBiomarkers().filter((m) => m.system === key);
}

/** Body systems, enriched with live marker counts. */
export function getSystems(): BodySystem[] {
  const s = live();
  if (s.usingApi) return s.systems ?? [];
  return SYSTEMS_META.map((sm) => {
    const markers = BIOMARKERS.filter((m) => m.system === sm.key);
    return { ...sm, markerCount: markers.length, counts: countBy(markers) };
  });
}

/** Top-level report summary for Home. */
export function getReport(): Report {
  const s = live();
  if (s.usingApi) {
    return s.report ?? { score: 0, scoreDelta: 0, bioAge: 0, realAge: 0, updatedAt: '', counts: emptyCounts() };
  }
  return {
    score: META.score,
    scoreDelta: META.scoreDelta,
    bioAge: META.bioAge,
    realAge: META.realAge,
    updatedAt: META.updatedAt,
    counts: countBy(BIOMARKERS),
  };
}

/** Markers needing attention, worst-first. */
export function getPriorities(): Biomarker[] {
  const weight: Record<Status, number> = { high: 0, attention: 1, normal: 2, optimal: 3 };
  return getBiomarkers()
    .filter((m) => m.status === 'high' || m.status === 'attention')
    .sort((a, b) => weight[a.status] - weight[b.status]);
}

export function getPlan(): PlanPriority[] {
  const s = live();
  return s.usingApi ? (s.plan ?? []) : PLAN;
}

export function getRecords(): HealthRecord[] {
  const s = live();
  return s.usingApi ? (s.documents ?? []) : RECORDS;
}

/** AI content + onboarding are app-static (not user data). */
export function getAi(): AiContent { return AI; }
export function getOnboarding(): OnbStep[] { return ONBOARDING; }

/** All step ids across the plan. */
export function getAllPlanStepIds(): string[] {
  return getPlan().flatMap((p) => p.steps.map((s) => s.id));
}
