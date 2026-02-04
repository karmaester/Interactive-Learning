import { createLLM, MODELS } from "@/lib/llm";
import { getVocabularyPrompt, getReviewPrompt } from "./prompts/vocabulary";
import type { Language, CEFRLevel, ChatMessage } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

interface VocabularyInput {
  userMessage: string;
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  history: ChatMessage[];
  knownWords?: string[];
  reviewWords?: string[];
}

export async function* streamVocabularyAgent(
  input: VocabularyInput
): AsyncGenerator<string> {
  const {
    userMessage,
    targetLanguage,
    cefrLevel,
    history,
    knownWords,
    reviewWords,
  } = input;

  const llm = createLLM(MODELS.conversation); // vocabulary uses same model
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getVocabularyPrompt({
    targetLanguage,
    cefrLevel,
    tutorName,
    knownWords,
    reviewWords,
  });

  const messages = [
    new SystemMessage(systemPrompt),
    ...history.slice(-10).map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    ),
    new HumanMessage(userMessage),
  ];

  const stream = await llm.stream(messages);
  for await (const chunk of stream) {
    if (typeof chunk.content === "string") {
      yield chunk.content;
    }
  }
}

interface ReviewInput {
  userMessage: string;
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  history: ChatMessage[];
  wordsToReview: Array<{ word: string; translation: string; mastery: number }>;
}

export async function* streamVocabularyReviewAgent(
  input: ReviewInput
): AsyncGenerator<string> {
  const { userMessage, targetLanguage, cefrLevel, history, wordsToReview } =
    input;

  const llm = createLLM(MODELS.conversation);
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getReviewPrompt(
    targetLanguage,
    cefrLevel,
    tutorName,
    wordsToReview
  );

  const messages = [
    new SystemMessage(systemPrompt),
    ...history.slice(-10).map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    ),
    new HumanMessage(userMessage),
  ];

  const stream = await llm.stream(messages);
  for await (const chunk of stream) {
    if (typeof chunk.content === "string") {
      yield chunk.content;
    }
  }
}
