"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Settings, Volume2, Globe, Trash2, Download, Upload, RotateCcw, Moon, Sun, Monitor, Sparkles,
} from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { useThemeStore } from "@/stores/theme-store";
import { useChatStore } from "@/stores/chat-store";
import { useVocabularyStore } from "@/stores/vocabulary-store";
import { useAchievementStore } from "@/stores/achievement-store";
import { LANGUAGE_CONFIG, CEFR_DESCRIPTIONS } from "@/lib/types";
import type { Language, CEFRLevel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportProfile, importProfile } from "@/lib/data-export";

const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function SettingsPage() {
  const router = useRouter();
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const profiles = useUserStore((s) => s.profiles);
  const updateLevel = useUserStore((s) => s.updateLevel);
  const reset = useUserStore((s) => s.reset);
  const profile = activeLanguage ? profiles[activeLanguage] : null;

  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const reducedMotion = useThemeStore((s) => s.reducedMotion);
  const setReducedMotion = useThemeStore((s) => s.setReducedMotion);

  const [confirmReset, setConfirmReset] = useState(false);
  const [ttsRate, setTtsRate] = useState(0.9);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleLevelChange = useCallback(
    (level: CEFRLevel) => {
      if (!activeLanguage) return;
      updateLevel(activeLanguage, level);
    },
    [activeLanguage, updateLevel]
  );

  const handleResetAll = useCallback(() => {
    reset();
    // Clear other stores
    localStorage.removeItem("lingua-agents-chat");
    localStorage.removeItem("lingua-agents-vocabulary");
    localStorage.removeItem("lingua-agents-achievements");
    router.push("/");
  }, [reset, router]);

  const handleImport = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const success = await importProfile(file);
      setImportStatus(success ? "Success! Reloading..." : "Import failed. Check file format.");
    };
    input.click();
  }, []);

  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Settings className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        </motion.div>

        {/* Language & Level */}
        {activeLanguage && profile && config && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" />
                  <CardTitle className="text-base">
                    Language &amp; Level
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">
                      Active Language
                    </label>
                    <div className="flex gap-2">
                      {(["en", "es", "de"] as Language[]).map((lang) => {
                        const lc = LANGUAGE_CONFIG[lang];
                        const hasProfile = profiles[lang] !== null;
                        return (
                          <button
                            key={lang}
                            onClick={() => {
                              if (hasProfile) {
                                useUserStore.getState().setActiveLanguage(lang);
                              }
                            }}
                            disabled={!hasProfile}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                              lang === activeLanguage
                                ? "bg-indigo-600 text-white"
                                : hasProfile
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-slate-50 text-slate-300 cursor-not-allowed"
                            }`}
                          >
                            {lc.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">
                      CEFR Level (currently{" "}
                      <span className="font-semibold">{profile.cefrLevel}</span>{" "}
                      - {CEFR_DESCRIPTIONS[profile.cefrLevel]})
                    </label>
                    <div className="flex gap-2">
                      {CEFR_LEVELS.map((level) => (
                        <button
                          key={level}
                          onClick={() => handleLevelChange(level)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            level === profile.cefrLevel
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Override your level manually. This changes the content difficulty.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Voice Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-500" />
                <CardTitle className="text-base">Voice &amp; Audio</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm text-slate-500 mb-2 block">
                  Text-to-Speech Speed
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Slow</span>
                  <input
                    type="range"
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    value={ttsRate}
                    onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="text-xs text-slate-400">Fast</span>
                  <span className="text-xs font-medium text-slate-600 w-8">
                    {ttsRate}x
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance & Accessibility */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-violet-500" />
                <CardTitle className="text-base">
                  Appearance &amp; Accessibility
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Theme toggle */}
                <div>
                  <label className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                    Theme
                  </label>
                  <div className="flex gap-2">
                    {([
                      { value: "light" as const, icon: Sun, label: "Light" },
                      { value: "dark" as const, icon: Moon, label: "Dark" },
                      { value: "system" as const, icon: Monitor, label: "System" },
                    ]).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          theme === opt.value
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reduced motion toggle */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm text-slate-500 dark:text-slate-400 block">
                        Reduce Animations
                      </label>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Minimize motion for accessibility or preference
                      </p>
                    </div>
                    <button
                      onClick={() => setReducedMotion(!reducedMotion)}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        reducedMotion ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                      role="switch"
                      aria-checked={reducedMotion}
                      aria-label="Toggle reduced animations"
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          reducedMotion ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-500" />
                <CardTitle className="text-base">Data Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={exportProfile}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Export Backup
                  </button>
                  <button
                    onClick={handleImport}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Import Backup
                  </button>
                </div>
                {importStatus && (
                  <p className="text-xs text-slate-500">{importStatus}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-red-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <CardTitle className="text-base text-red-700">
                  Danger Zone
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-3">
                This will permanently delete all your profiles, chat history,
                vocabulary, and achievements. This action cannot be undone.
              </p>
              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-sm text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All Data
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetAll}
                    className="px-4 py-2 rounded-lg bg-red-600 text-sm text-white hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Yes, delete everything
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-sm text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
