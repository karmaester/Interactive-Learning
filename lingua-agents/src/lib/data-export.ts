"use client";

import { useUserStore } from "@/stores/user-store";
import { useChatStore } from "@/stores/chat-store";
import { useVocabularyStore } from "@/stores/vocabulary-store";
import { LANGUAGE_CONFIG, CEFR_DESCRIPTIONS } from "@/lib/types";
import type { Language, SkillScores } from "@/lib/types";

// --- Export Formats ---

interface ExportData {
  version: 1;
  exportedAt: string;
  user: ReturnType<typeof useUserStore.getState>;
  chat: ReturnType<typeof useChatStore.getState>;
  vocabulary: ReturnType<typeof useVocabularyStore.getState>;
}

export function exportAllData(): ExportData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    user: useUserStore.getState(),
    chat: useChatStore.getState(),
    vocabulary: useVocabularyStore.getState(),
  };
}

export function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportProfile() {
  const data = exportAllData();
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadJSON(`linguaagents-backup-${timestamp}.json`, data);
}

export async function importProfile(file: File): Promise<boolean> {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as ExportData;

    if (data.version !== 1) {
      throw new Error("Unsupported backup version");
    }

    // Restore stores by writing to localStorage directly and reloading
    if (data.user) {
      localStorage.setItem(
        "lingua-agents-user",
        JSON.stringify({ state: data.user, version: 0 })
      );
    }
    if (data.chat) {
      localStorage.setItem(
        "lingua-agents-chat",
        JSON.stringify({ state: data.chat, version: 0 })
      );
    }
    if (data.vocabulary) {
      localStorage.setItem(
        "lingua-agents-vocabulary",
        JSON.stringify({ state: data.vocabulary, version: 0 })
      );
    }

    // Reload to hydrate stores from localStorage
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}

// --- Progress Report Generation ---

interface ProgressReport {
  generatedAt: string;
  languages: LanguageReport[];
  totalStats: {
    totalXP: number;
    totalWords: number;
    totalSessions: number;
    totalMessages: number;
  };
}

interface LanguageReport {
  language: string;
  languageCode: Language;
  tutorName: string;
  cefrLevel: string;
  cefrDescription: string;
  xp: number;
  streak: number;
  completedTopics: string[];
  skillScores: SkillScores;
  vocabulary: {
    total: number;
    mastered: number;
    learning: number;
    dueForReview: number;
  };
  sessions: number;
  messages: number;
}

export function generateProgressReport(): ProgressReport {
  const userState = useUserStore.getState();
  const chatState = useChatStore.getState();
  const vocabState = useVocabularyStore.getState();

  const languages: LanguageReport[] = [];
  let totalXP = 0;
  let totalWords = 0;
  let totalSessions = 0;
  let totalMessages = 0;

  for (const lang of ["en", "es", "de"] as Language[]) {
    const profile = userState.profiles[lang];
    if (!profile) continue;

    const config = LANGUAGE_CONFIG[lang];
    const vocabStats = vocabState.getStats(lang);
    const sessionCount = Object.values(chatState.sessions).filter(
      (s) => s.messages.length > 0
    ).length;
    const messageCount = Object.values(chatState.sessions).reduce(
      (sum, s) => sum + s.messages.filter((m) => m.role === "user").length,
      0
    );

    totalXP += profile.totalXP;
    totalWords += vocabStats.total;
    totalSessions += sessionCount;
    totalMessages += messageCount;

    languages.push({
      language: config.name,
      languageCode: lang,
      tutorName: config.tutorName,
      cefrLevel: profile.cefrLevel,
      cefrDescription: CEFR_DESCRIPTIONS[profile.cefrLevel],
      xp: profile.totalXP,
      streak: profile.streak,
      completedTopics: profile.completedTopics ?? [],
      skillScores: profile.skillScores ?? {
        grammar: 0,
        vocabulary: 0,
        conversation: 0,
        reading: 0,
        culture: 0,
      },
      vocabulary: vocabStats,
      sessions: sessionCount,
      messages: messageCount,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    languages,
    totalStats: {
      totalXP,
      totalWords,
      totalSessions,
      totalMessages,
    },
  };
}

export function exportProgressReport() {
  const report = generateProgressReport();
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadJSON(`linguaagents-report-${timestamp}.json`, report);
}

export function exportProgressAsText(): string {
  const report = generateProgressReport();
  const lines: string[] = [];

  lines.push("=== LinguaAgents Progress Report ===");
  lines.push(`Generated: ${new Date(report.generatedAt).toLocaleDateString()}`);
  lines.push("");

  for (const lang of report.languages) {
    lines.push(`--- ${lang.language} (${lang.cefrLevel} - ${lang.cefrDescription}) ---`);
    lines.push(`Tutor: ${lang.tutorName}`);
    lines.push(`XP: ${lang.xp}  |  Streak: ${lang.streak} days`);
    lines.push(`Sessions: ${lang.sessions}  |  Messages: ${lang.messages}`);
    lines.push("");
    lines.push("Skills:");
    for (const [skill, score] of Object.entries(lang.skillScores)) {
      const bar = "█".repeat(Math.round(score / 5)) + "░".repeat(20 - Math.round(score / 5));
      lines.push(`  ${skill.padEnd(14)} ${bar} ${score}%`);
    }
    lines.push("");
    lines.push("Vocabulary:");
    lines.push(`  Total: ${lang.vocabulary.total}  |  Mastered: ${lang.vocabulary.mastered}  |  Learning: ${lang.vocabulary.learning}`);
    if (lang.completedTopics.length > 0) {
      lines.push("");
      lines.push(`Completed Topics (${lang.completedTopics.length}):`);
      lang.completedTopics.forEach((t) => lines.push(`  - ${t}`));
    }
    lines.push("");
  }

  lines.push("--- Overall ---");
  lines.push(`Total XP: ${report.totalStats.totalXP}`);
  lines.push(`Total Words: ${report.totalStats.totalWords}`);
  lines.push(`Total Sessions: ${report.totalStats.totalSessions}`);
  lines.push(`Total Messages: ${report.totalStats.totalMessages}`);

  return lines.join("\n");
}

export function downloadTextReport() {
  const text = exportProgressAsText();
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `linguaagents-report-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
