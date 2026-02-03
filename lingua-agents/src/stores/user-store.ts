"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language, CEFRLevel, LearnerProfile } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface UserState {
  userId: string;
  profiles: Record<Language, LearnerProfile | null>;
  activeLanguage: Language | null;
  onboarded: boolean;

  // Actions
  setActiveLanguage: (lang: Language) => void;
  createProfile: (lang: Language, cefrLevel?: CEFRLevel) => void;
  updateLevel: (lang: Language, level: CEFRLevel) => void;
  addXP: (lang: Language, xp: number) => void;
  incrementStreak: (lang: Language) => void;
  getActiveProfile: () => LearnerProfile | null;
  setOnboarded: (value: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: generateId(),
      profiles: { en: null, es: null, de: null },
      activeLanguage: null,
      onboarded: false,

      setActiveLanguage: (lang) => set({ activeLanguage: lang }),

      createProfile: (lang, cefrLevel = "A1") => {
        const profile: LearnerProfile = {
          id: generateId(),
          targetLanguage: lang,
          nativeLanguage: "en",
          cefrLevel,
          totalXP: 0,
          streak: 0,
        };
        set((state) => ({
          profiles: { ...state.profiles, [lang]: profile },
          activeLanguage: lang,
        }));
      },

      updateLevel: (lang, level) =>
        set((state) => {
          const profile = state.profiles[lang];
          if (!profile) return state;
          return {
            profiles: {
              ...state.profiles,
              [lang]: { ...profile, cefrLevel: level },
            },
          };
        }),

      addXP: (lang, xp) =>
        set((state) => {
          const profile = state.profiles[lang];
          if (!profile) return state;
          return {
            profiles: {
              ...state.profiles,
              [lang]: { ...profile, totalXP: profile.totalXP + xp },
            },
          };
        }),

      incrementStreak: (lang) =>
        set((state) => {
          const profile = state.profiles[lang];
          if (!profile) return state;
          return {
            profiles: {
              ...state.profiles,
              [lang]: { ...profile, streak: profile.streak + 1 },
            },
          };
        }),

      getActiveProfile: () => {
        const state = get();
        if (!state.activeLanguage) return null;
        return state.profiles[state.activeLanguage];
      },

      setOnboarded: (value) => set({ onboarded: value }),

      reset: () =>
        set({
          userId: generateId(),
          profiles: { en: null, es: null, de: null },
          activeLanguage: null,
          onboarded: false,
        }),
    }),
    {
      name: "lingua-agents-user",
    }
  )
);
