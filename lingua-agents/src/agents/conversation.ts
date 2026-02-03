import { createLLM, MODELS } from "@/lib/llm";
import { getConversationPrompt } from "./prompts/conversation";
import type { Language, CEFRLevel, ChatMessage } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

interface ConversationInput {
  userMessage: string;
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  scenario?: string;
  mode?: "supportive" | "immersion";
  history: ChatMessage[];
}

export async function runConversationAgent(input: ConversationInput): Promise<string> {
  const {
    userMessage,
    targetLanguage,
    cefrLevel,
    scenario,
    mode = "supportive",
    history,
  } = input;

  const llm = createLLM(MODELS.conversation);
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getConversationPrompt({
    targetLanguage,
    cefrLevel,
    scenario,
    mode,
    tutorName,
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

  const response = await llm.invoke(messages);
  return response.content as string;
}

export async function* streamConversationAgent(
  input: ConversationInput
): AsyncGenerator<string> {
  const {
    userMessage,
    targetLanguage,
    cefrLevel,
    scenario,
    mode = "supportive",
    history,
  } = input;

  const llm = createLLM(MODELS.conversation);
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getConversationPrompt({
    targetLanguage,
    cefrLevel,
    scenario,
    mode,
    tutorName,
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
