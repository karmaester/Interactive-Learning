import { createLLM, MODELS } from "@/lib/llm";
import { getCulturePrompt } from "./prompts/culture";
import type { Language, CEFRLevel, ChatMessage } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

interface CultureInput {
  userMessage: string;
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  history: ChatMessage[];
  topic?: string;
}

export async function* streamCultureAgent(
  input: CultureInput
): AsyncGenerator<string> {
  const { userMessage, targetLanguage, cefrLevel, history, topic } = input;

  const llm = createLLM(MODELS.culture);
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getCulturePrompt({
    targetLanguage,
    cefrLevel,
    tutorName,
    topic,
  });

  const messages = [
    new SystemMessage(systemPrompt),
    ...history.slice(-8).map((msg) =>
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
