"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Brain, MessageCircle, Sparkles } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { Avatar } from "@/components/characters/avatar";
import { LanguageSelector } from "@/components/language-selector";
import { Button } from "@/components/ui/button";
import { LANGUAGE_CONFIG } from "@/lib/types";
import type { Language } from "@/lib/types";
import { LogoAnimated } from "@/components/ui/logo";

const STEPS = [
  { id: "welcome", title: "Welcome" },
  { id: "language", title: "Language" },
  { id: "preview", title: "Meet Your Tutor" },
  { id: "ready", title: "Get Started" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const { createProfile, setOnboarded } = useUserStore();

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleStart = () => {
    if (!selectedLang) return;
    createProfile(selectedLang);
    setOnboarded(true);
    router.push("/learn/assessment");
  };

  const config = selectedLang ? LANGUAGE_CONFIG[selectedLang] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step
                  ? "bg-indigo-600 w-6"
                  : i < step
                  ? "bg-indigo-300"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <LogoAnimated />
              </div>
              <h1 className="text-3xl font-extrabold font-[family-name:var(--font-heading)] text-slate-900 mb-3 tracking-tight">
                Welcome to Lingua<span className="text-indigo-600">Agents</span>
              </h1>
              <p className="text-slate-500 leading-relaxed mb-8">
                Learn languages with AI tutors powered by a multi-agent system.
                Each agent specializes in a different aspect of language
                learning.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: MessageCircle, label: "Conversation", color: "text-blue-600 bg-blue-50" },
                  { icon: Brain, label: "Adaptive", color: "text-purple-600 bg-purple-50" },
                  { icon: Sparkles, label: "6 AI Agents", color: "text-amber-600 bg-amber-50" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col items-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--surface-primary)] border border-slate-100">
                    <div className={`w-8 h-8 rounded-[var(--radius-sm)] ${f.color} flex items-center justify-center`}>
                      <f.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{f.label}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" onClick={handleNext}>
                Let&apos;s Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 1: Language Selection */}
          {step === 1 && (
            <motion.div
              key="language"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-slate-900 mb-2">
                What language do you want to learn?
              </h2>
              <p className="text-slate-500 mb-8">
                Choose your target language. You can add more later.
              </p>

              <div className="flex justify-center mb-8">
                <LanguageSelector
                  selected={selectedLang}
                  onSelect={setSelectedLang}
                />
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!selectedLang}
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Meet Your Tutor */}
          {step === 2 && selectedLang && config && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-slate-900 mb-2">
                Meet {config.tutorName}
              </h2>
              <p className="text-slate-500 mb-8">
                Your {config.name} tutor will guide you through lessons,
                conversations, and exercises.
              </p>

              <div className="flex justify-center mb-6">
                <Avatar
                  language={selectedLang}
                  expression="encouraging"
                  size="lg"
                />
              </div>

              <div className="bg-[var(--surface-primary)] rounded-[var(--radius-lg)] border border-slate-100 p-5 mb-8 text-left">
                <p className="text-slate-600 italic text-sm leading-relaxed">
                  &ldquo;{selectedLang === "en"
                    ? "Hello! I'm Emma, your English tutor. I'll help you improve your conversation skills, grammar, and vocabulary. Let's start with a quick assessment to find your level!"
                    : selectedLang === "es"
                    ? "¡Hola! Soy Carlos, tu tutor de español. Te ayudaré a mejorar tu conversación, gramática y vocabulario. ¡Empecemos con una evaluación rápida!"
                    : "Hallo! Ich bin Lena, deine Deutschlehrerin. Ich helfe dir, dein Gespräch, deine Grammatik und deinen Wortschatz zu verbessern. Lass uns mit einem kurzen Test beginnen!"
                  }&rdquo;
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Ready to start */}
          {step === 3 && selectedLang && config && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-slate-900 mb-2">
                You&apos;re all set!
              </h2>
              <p className="text-slate-500 mb-4">
                Here&apos;s what happens next:
              </p>

              <div className="space-y-3 text-left mb-8">
                {[
                  { num: "1", text: `Take a short placement test to find your ${config.name} level` },
                  { num: "2", text: "Get personalized lessons and exercises at your level" },
                  { num: "3", text: `Practice conversations with ${config.tutorName} and build vocabulary` },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--surface-primary)] border border-slate-100"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.num}
                    </div>
                    <span className="text-sm text-slate-600">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button size="lg" onClick={handleStart}>
                  Start Placement Test
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
