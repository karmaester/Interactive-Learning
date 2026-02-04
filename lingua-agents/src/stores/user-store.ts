"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language, CEFRLevel, LearnerProfile, SkillScores } from "@/lib/types";
import { generateId } from "@/lib/utils";

const DEFAULT_SKILLS: SkillScores = {
  grammar: 0,
  vocabulary: 0,
  conversation: 0,
  reading: 0,
  culture: 0,
};

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
  addCompletedTopic: (lang: Language, topic: string) => void;
  updateSkill: (lang: Language, skill: keyof SkillScores, delta: number) => void;
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
          completedTopics: [],
          skillScores: { ...DEFAULT_SKILLS },
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

      addCompletedTopic: (lang, topic) =>
        set((state) => {
          const profile = state.profiles[lang];
          if (!profile) return state;
          if (profile.completedTopics.includes(topic)) return state;
          return {
            profiles: {
              ...state.profiles,
              [lang]: {
                ...profile,
                completedTopics: [...profile.completedTopics, topic],
              },
            },
          };
        }),

      updateSkill: (lang, skill, delta) =>
        set((state) => {
          const profile = state.profiles[lang];
          if (!profile) return state;
          const current = profile.skillScores[skill];
          const newValue = Math.max(0, Math.min(100, current + delta));
          return {
            profiles: {
              ...state.profiles,
              [lang]: {
                ...profile,
                skillScores: { ...profile.skillScores, [skill]: newValue },
              },
            },
          };
        }),

      getActiveProfile: () => {
        const state = get();
        if (!state.activeLanguage) return null;
        const profile = state.profiles[state.activeLanguage];
        if (!profile) return null;
        // Ensure backward compat with profiles missing new fields
        return {
          ...profile,
          completedTopics: profile.completedTopics ?? [],
          skillScores: profile.skillScores ?? { ...DEFAULT_SKILLS },
        };
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
