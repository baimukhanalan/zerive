// Action-plan progress — which steps the user has checked off. Persisted so the
// Home "next step" and Plan progress bar survive restarts.

import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PlanState {
  done: Record<string, boolean>;
  toggle: (stepId: string) => void;
  isDone: (stepId: string) => boolean;
  reset: () => void;
}

const memoryStorage: StateStorage = (() => {
  const mem = new Map<string, string>();
  return {
    getItem: (k) => mem.get(k) ?? null,
    setItem: (k, v) => { mem.set(k, v); },
    removeItem: (k) => { mem.delete(k); },
  };
})();

const backingStore: StateStorage =
  Platform.OS === 'web' && typeof window === 'undefined' ? memoryStorage : AsyncStorage;

export const usePlanProgress = create<PlanState>()(
  persist(
    (set, get) => ({
      done: {},
      toggle: (stepId) => set((s) => ({ done: { ...s.done, [stepId]: !s.done[stepId] } })),
      isDone: (stepId) => !!get().done[stepId],
      reset: () => set({ done: {} }),
    }),
    {
      name: 'zerive.plan',
      storage: createJSONStorage(() => backingStore),
    },
  ),
);
