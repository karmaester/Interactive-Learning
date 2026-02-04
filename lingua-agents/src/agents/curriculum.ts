import { createLLM, MODELS } from "@/lib/llm";
import { getCurriculumPrompt } from "./prompts/curriculum";
import type { Language, CEFRLevel, ChatMessage } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

interface CurriculumInput {
  userMessage: string;
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  history: ChatMessage[];
  completedTopics?: string[];
}

export async function* streamCurriculumAgent(
  input: CurriculumInput
): AsyncGenerator<string> {
  const { userMessage, targetLanguage, cefrLevel, history, completedTopics } =
    input;

  const llm = createLLM(MODELS.curriculum);
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getCurriculumPrompt({
    targetLanguage,
    cefrLevel,
    tutorName,
    completedTopics,
  });

  const messages = [
    new SystemMessage(systemPrompt),
    ...history.slice(-12).map((msg) =>
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
