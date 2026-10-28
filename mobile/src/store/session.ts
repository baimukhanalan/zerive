// Session & profile state — drives the top-level navigation gate.
//
// Flow: welcome → (auth) sign in → onboarding → checkout → report.
// Three booleans gate it: signedIn, onboarded, hasReport. `hydrated` flips true
// once AsyncStorage has loaded, so the gate doesn't flash the wrong screen on
// cold start.

import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OnbAnswers = Record<string, string | string[]>;

interface Profile {
  name?: string;
  phone?: string;
  answers: OnbAnswers;
}

interface SessionState {
  hydrated: boolean;
  signedIn: boolean;
  onboarded: boolean;
  hasReport: boolean;
  profile: Profile;

  token: string | null;
  signIn: (phone: string, token?: string | null) => void;
  setFlags: (onboarded: boolean, hasReport: boolean) => void;
  setName: (name: string) => void;
  completeOnboarding: (answers: OnbAnswers, name?: string) => void;
  purchaseComplete: () => void;
  signOut: () => void;
  _setHydrated: () => void;
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

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      hydrated: false,
      signedIn: false,
      onboarded: false,
      hasReport: false,
      token: null,
      profile: { answers: {} },

      signIn: (phone, token) => set((s) => ({ signedIn: true, token: token ?? s.token, profile: { ...s.profile, phone } })),
      setFlags: (onboarded, hasReport) => set({ onboarded, hasReport }),
      setName: (name) => set((s) => ({ profile: { ...s.profile, name } })),
      completeOnboarding: (answers, name) =>
        set((s) => ({
          onboarded: true,
          profile: { ...s.profile, answers, name: name ?? s.profile.name },
        })),
      purchaseComplete: () => set({ hasReport: true }),
      signOut: () =>
        set({ signedIn: false, onboarded: false, hasReport: false, token: null, profile: { answers: {} } }),
      _setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'zerive.session',
      storage: createJSONStorage(() => backingStore),
      partialize: (s) => ({
        signedIn: s.signedIn,
        onboarded: s.onboarded,
        hasReport: s.hasReport,
        token: s.token,
        profile: s.profile,
      }),
      onRehydrateStorage: () => (state) => state?._setHydrated(),
    },
  ),
);
