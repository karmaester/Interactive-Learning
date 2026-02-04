"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, MessageCircle, Brain } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import type { Language } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { Avatar } from "@/components/characters/avatar";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { Logo, LogoAnimated } from "@/components/ui/logo";

export default function LandingPage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const { activeLanguage, profiles, setActiveLanguage, createProfile, onboarded } =
    useUserStore();

  const handleGetStarted = () => {
    if (!selectedLang) return;

    const existingProfile = profiles[selectedLang];

    if (existingProfile) {
      setActiveLanguage(selectedLang);
      router.push("/learn");
    } else {
      createProfile(selectedLang);
      router.push("/learn/assessment");
    }
  };

  const handleContinue = (lang: Language) => {
    setActiveLanguage(lang);
    router.push("/learn");
  };

  // Check if there are existing profiles to show "continue" option
  const existingProfiles = (["en", "es", "de"] as Language[]).filter(
    (l) => profiles[l] !== null
  );

  // Show onboarding for first-time users
  if (!onboarded && existingProfiles.length === 0) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex flex-col items-center gap-4 mb-6">
            <LogoAnimated />
            <h1 className="text-4xl md:text-5xl font-extrabold font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
              Lingua<span className="text-indigo-600">Agents</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Learn languages with AI tutors that adapt to your level.
            Practice conversation, master grammar, and build vocabulary — all
            powered by a multi-agent AI system.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-16"
        >
          {[
            {
              icon: MessageCircle,
              title: "AI Conversation",
              desc: "Practice real dialogue with an AI tutor that corrects you in real-time",
              color: "text-blue-600 bg-blue-50",
            },
            {
              icon: Brain,
              title: "Adaptive Learning",
              desc: "Content automatically adjusts to your CEFR level from A1 to C2",
              color: "text-purple-600 bg-purple-50",
            },
            {
              icon: BookOpen,
              title: "Multi-Agent System",
              desc: "Specialized agents for grammar, vocabulary, assessment, and culture",
              color: "text-emerald-600 bg-emerald-50",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-[var(--surface-primary)] rounded-[var(--radius-lg)] p-5 border border-slate-100 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-[var(--radius-md)] ${feature.color} flex items-center justify-center mb-3`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold font-[family-name:var(--font-heading)] text-slate-800 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Continue existing profiles */}
        {existingProfiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-center text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Continue Learning
            </h2>
            <div className="flex justify-center gap-3">
              {existingProfiles.map((lang) => {
                const profile = profiles[lang]!;
                const config = LANGUAGE_CONFIG[lang];
                return (
                  <motion.button
                    key={lang}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleContinue(lang)}
                    className="flex items-center gap-3 bg-[var(--surface-primary)] border border-slate-200 rounded-[var(--radius-lg)] px-5 py-3 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-[var(--shadow-md)] transition-all duration-200 cursor-pointer"
                  >
                    <Avatar language={lang} expression="neutral" size="sm" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-700">
                        {config.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {profile.cefrLevel} &middot; {profile.totalXP} XP
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Language selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] text-slate-800 mb-2">
            {existingProfiles.length > 0
              ? "Or start a new language"
              : "Choose your language"}
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Select the language you want to learn
          </p>

          <div className="flex justify-center mb-8">
            <LanguageSelector
              selected={selectedLang}
              onSelect={setSelectedLang}
            />
          </div>

          <AnimatePresence>
            {selectedLang && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button size="lg" onClick={handleGetStarted}>
                  {profiles[selectedLang]
                    ? `Continue ${LANGUAGE_CONFIG[selectedLang].name}`
                    : `Start Learning ${LANGUAGE_CONFIG[selectedLang].name}`}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {!profiles[selectedLang] && (
                  <p className="text-xs text-slate-400 mt-3">
                    You&apos;ll take a quick placement test to find your level
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tutor avatars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-8 mt-16"
        >
          {(["en", "es", "de"] as Language[]).map((lang, i) => (
            <motion.div
              key={lang}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.15 }}
              className="text-center"
            >
              <Avatar
                language={lang}
                expression={selectedLang === lang ? "celebrating" : "neutral"}
                size="lg"
              />
              <p className="text-xs text-slate-400 mt-2">
                {LANGUAGE_CONFIG[lang].tutorName}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
