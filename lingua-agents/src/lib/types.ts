export type Language = "en" | "es" | "de";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type SessionType = "conversation" | "lesson" | "exercise" | "assessment" | "vocabulary" | "culture";

export type AgentType =
  | "orchestrator"
  | "curriculum"
  | "conversation"
  | "grammar"
  | "vocabulary"
  | "assessment"
  | "culture";

export type ExpressionState =
  | "neutral"
  | "speaking"
  | "thinking"
  | "celebrating"
  | "encouraging";

export interface SkillScores {
  grammar: number;   // 0-100
  vocabulary: number;
  conversation: number;
  reading: number;
  culture: number;
}

export interface LearnerProfile {
  id: string;
  targetLanguage: Language;
  nativeLanguage: string;
  cefrLevel: CEFRLevel;
  totalXP: number;
  streak: number;
  completedTopics: string[];
  skillScores: SkillScores;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  agentType?: AgentType;
  corrections?: Correction[];
  timestamp: number;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface PlacementQuestion {
  id: number;
  type: "multiple-choice" | "fill-blank" | "free-response";
  question: string;
  options?: string[];
  correctAnswer: string;
  cefrTarget: CEFRLevel;
}

export interface ExerciseResult {
  correct: boolean;
  xpEarned: number;
  feedback: string;
  correction?: Correction;
}

export interface LessonPlan {
  id: string;
  title: string;
  topic: string;
  cefrLevel: CEFRLevel;
  objectives: string[];
  vocabulary: string[];
  grammarPoints: string[];
}

export const LANGUAGE_CONFIG: Record<
  Language,
  { name: string; nativeName: string; flag: string; tutorName: string }
> = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "GB",
    tutorName: "Emma",
  },
  es: {
    name: "Spanish",
    nativeName: "Español",
    flag: "ES",
    tutorName: "Carlos",
  },
  de: {
    name: "German",
    nativeName: "Deutsch",
    flag: "DE",
    tutorName: "Lena",
  },
};

export const CEFR_DESCRIPTIONS: Record<CEFRLevel, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper Intermediate",
  C1: "Advanced",
  C2: "Proficient",
};
