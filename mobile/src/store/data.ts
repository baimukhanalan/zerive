// Remote data store. On sign-in we fetch the report / biomarkers / plan /
// documents once from the API and cache them here; the `health.ts` selectors
// read from this store when loaded, and fall back to the static dataset
// otherwise (offline / API error). Screens render behind a loading gate so they
// pick up the loaded data.

import { create } from 'zustand';
import { api, setApiToken } from '@/lib/api';
import type { Report, BodySystem, Biomarker, PlanPriority, HealthRecord } from '@/data/types';

interface DataState {
  loaded: boolean;
  usingApi: boolean;
  report: Report | null;
  systems: BodySystem[] | null;
  biomarkers: Biomarker[] | null;
  plan: PlanPriority[] | null;
  documents: HealthRecord[] | null;
  loadAll: (token: string | null) => Promise<void>;
  toggleStep: (stepId: string, token: string | null) => void;
  clear: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  loaded: false,
  usingApi: false,
  report: null,
  systems: null,
  biomarkers: null,
  plan: null,
  documents: null,

  loadAll: async (token) => {
    if (!token) { set({ loaded: true, usingApi: false }); return; }
    setApiToken(token);
    try {
      const [rep, bio, pl, docs] = await Promise.all([
        api.report(token), api.biomarkers(token), api.plan(token), api.documents(token),
      ]);
      set({
        loaded: true,
        usingApi: true,
        report: rep?.hasReport
          ? { score: rep.score, scoreDelta: rep.scoreDelta, bioAge: rep.bioAge, realAge: rep.realAge, updatedAt: rep.updatedAt, counts: rep.counts }
          : null,
        systems: rep?.systems ?? null,
        biomarkers: bio?.markers ?? null,
        plan: pl?.plan ?? null,
        documents: docs?.documents ?? null,
      });
    } catch {
      // network / API error → fall back to the bundled static dataset
      set({ loaded: true, usingApi: false });
    }
  },

  toggleStep: (stepId, token) => {
    // optimistic flip in cache
    const plan = get().plan;
    if (plan) {
      set({
        plan: plan.map((p) => ({
          ...p,
          steps: p.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)),
        })),
      });
    }
    if (token) api.togglePlan(stepId, token).catch(() => {});
  },

  clear: () => set({ loaded: false, usingApi: false, report: null, systems: null, biomarkers: null, plan: null, documents: null }),
}));
