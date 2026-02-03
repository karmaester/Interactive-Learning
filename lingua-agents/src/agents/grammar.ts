import { createLLM, MODELS } from "@/lib/llm";
import { getGrammarPrompt } from "./prompts/grammar";
import type { Language, CEFRLevel, ChatMessage } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

interface GrammarInput {
  userMessage: string;
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  history: ChatMessage[];
}

export async function runGrammarAgent(input: GrammarInput): Promise<string> {
  const { userMessage, targetLanguage, cefrLevel, history } = input;

  const llm = createLLM(MODELS.grammar);
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getGrammarPrompt({
    targetLanguage,
    cefrLevel,
    tutorName,
  });

  const messages = [
    new SystemMessage(systemPrompt),
    ...history.slice(-6).map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    ),
    new HumanMessage(userMessage),
  ];

  const response = await llm.invoke(messages);
  return response.content as string;
}

export async function* streamGrammarAgent(
  input: GrammarInput
): AsyncGenerator<string> {
  const { userMessage, targetLanguage, cefrLevel, history } = input;

  const llm = createLLM(MODELS.grammar);
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getGrammarPrompt({
    targetLanguage,
    cefrLevel,
    tutorName,
  });

  const messages = [
    new SystemMessage(systemPrompt),
    ...history.slice(-6).map((msg) =>
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
