import { createLLM } from "@/lib/llm";
import { getOrchestratorPrompt } from "./prompts/orchestrator";
import { streamConversationAgent } from "./conversation";
import { streamGrammarAgent } from "./grammar";
import { streamAssessmentAgent } from "./assessment";
import { streamCurriculumAgent } from "./curriculum";
import { streamVocabularyAgent } from "./vocabulary";
import { streamCultureAgent } from "./culture";
import type { Language, CEFRLevel, ChatMessage, SessionType } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

interface OrchestratorInput {
  userMessage: string;
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  sessionType: SessionType;
  history: ChatMessage[];
  knownWords?: string[];
  reviewWords?: string[];
  completedTopics?: string[];
}

type RouteDecision =
  | "conversation"
  | "grammar"
  | "assessment"
  | "curriculum"
  | "vocabulary"
  | "culture"
  | "general";

function routeMessage(
  userMessage: string,
  sessionType: SessionType
): RouteDecision {
  // Explicit session-type routing
  if (sessionType === "assessment") return "assessment";
  if (sessionType === "exercise") return "grammar";

  const lowerMsg = userMessage.toLowerCase();

  // Vocabulary keywords
  const vocabKeywords = [
    "vocabulary",
    "vocab",
    "word",
    "words",
    "meaning",
    "definition",
    "translate",
    "translation",
    "synonym",
    "antonym",
    "flashcard",
    "review words",
    "new words",
    "learn words",
    "vocabulario",
    "palabras",
    "Wortschatz",
    "Vokabeln",
  ];

  // Culture keywords
  const cultureKeywords = [
    "culture",
    "cultural",
    "tradition",
    "custom",
    "etiquette",
    "idiom",
    "expression",
    "slang",
    "formal vs informal",
    "polite",
    "register",
    "historia",
    "costumbre",
    "Kultur",
    "Tradition",
    "Brauch",
    "tú vs usted",
    "du vs sie",
  ];

  // Curriculum / lesson keywords
  const curriculumKeywords = [
    "lesson",
    "teach me",
    "start a lesson",
    "new lesson",
    "next lesson",
    "topic",
    "learn about",
    "lección",
    "Lektion",
    "structured lesson",
    "lesson plan",
  ];

  // Grammar keywords
  const grammarKeywords = [
    "grammar",
    "conjugat",
    "tense",
    "verb",
    "noun",
    "adjective",
    "pronoun",
    "article",
    "exercise",
    "practice",
    "drill",
    "rule",
    "explain",
    "how do you say",
    "what is the difference",
    "gramática",
    "Grammatik",
  ];

  // Assessment keywords
  const assessKeywords = [
    "quiz",
    "test",
    "assess",
    "evaluate",
    "check my level",
    "placement",
    "how good am i",
  ];

  if (assessKeywords.some((kw) => lowerMsg.includes(kw))) return "assessment";
  if (curriculumKeywords.some((kw) => lowerMsg.includes(kw))) return "curriculum";
  if (vocabKeywords.some((kw) => lowerMsg.includes(kw))) return "vocabulary";
  if (cultureKeywords.some((kw) => lowerMsg.includes(kw))) return "culture";
  if (grammarKeywords.some((kw) => lowerMsg.includes(kw))) return "grammar";

  // For lesson sessions, default to curriculum agent
  if (sessionType === "lesson") return "curriculum";

  return "conversation";
}

export async function* streamOrchestrator(
  input: OrchestratorInput
): AsyncGenerator<string> {
  const {
    userMessage,
    targetLanguage,
    cefrLevel,
    sessionType,
    history,
    knownWords,
    reviewWords,
    completedTopics,
  } = input;

  const route = routeMessage(userMessage, sessionType);

  switch (route) {
    case "conversation":
      yield* streamConversationAgent({
        userMessage,
        targetLanguage,
        cefrLevel,
        history,
      });
      break;

    case "grammar":
      yield* streamGrammarAgent({
        userMessage,
        targetLanguage,
        cefrLevel,
        history,
      });
      break;

    case "assessment":
      yield* streamAssessmentAgent({
        userMessage,
        targetLanguage,
        history,
      });
      break;

    case "curriculum":
      yield* streamCurriculumAgent({
        userMessage,
        targetLanguage,
        cefrLevel,
        history,
        completedTopics,
      });
      break;

    case "vocabulary":
      yield* streamVocabularyAgent({
        userMessage,
        targetLanguage,
        cefrLevel,
        history,
        knownWords,
        reviewWords,
      });
      break;

    case "culture":
      yield* streamCultureAgent({
        userMessage,
        targetLanguage,
        cefrLevel,
        history,
      });
      break;

    case "general": {
      const llm = createLLM();
      const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;
      const systemPrompt = getOrchestratorPrompt({
        targetLanguage,
        cefrLevel,
        sessionType,
        tutorName,
      });

      const stream = await llm.stream([
        new SystemMessage(systemPrompt),
        new HumanMessage(userMessage),
      ]);

      for await (const chunk of stream) {
        if (typeof chunk.content === "string") {
          yield chunk.content;
        }
      }
      break;
    }
  }
}
