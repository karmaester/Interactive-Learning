import { createLLM } from "@/lib/llm";
import { getOrchestratorPrompt } from "./prompts/orchestrator";
import { streamConversationAgent } from "./conversation";
import { streamGrammarAgent } from "./grammar";
import { streamAssessmentAgent } from "./assessment";
import type { Language, CEFRLevel, ChatMessage, SessionType } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

interface OrchestratorInput {
  userMessage: string;
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  sessionType: SessionType;
  history: ChatMessage[];
}

type RouteDecision = "conversation" | "grammar" | "assessment" | "general";

async function routeMessage(
  userMessage: string,
  sessionType: SessionType,
  targetLanguage: Language,
  cefrLevel: CEFRLevel
): Promise<RouteDecision> {
  // If the session type is explicitly set, use that for routing
  if (sessionType === "assessment") return "assessment";
  if (sessionType === "exercise") return "grammar";

  // For conversation and lesson sessions, use lightweight keyword routing
  // to avoid an extra LLM call. The orchestrator prompt handles nuanced routing.
  const lowerMsg = userMessage.toLowerCase();

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
  if (grammarKeywords.some((kw) => lowerMsg.includes(kw))) return "grammar";

  return "conversation";
}

export async function* streamOrchestrator(
  input: OrchestratorInput
): AsyncGenerator<string> {
  const { userMessage, targetLanguage, cefrLevel, sessionType, history } = input;

  const route = await routeMessage(
    userMessage,
    sessionType,
    targetLanguage,
    cefrLevel
  );

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
