import { createLLM, MODELS } from "@/lib/llm";
import { getPlacementPrompt } from "./prompts/assessment";
import type { Language, ChatMessage } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

interface AssessmentInput {
  userMessage: string;
  targetLanguage: Language;
  history: ChatMessage[];
}

export async function runAssessmentAgent(input: AssessmentInput): Promise<string> {
  const { userMessage, targetLanguage, history } = input;

  const llm = createLLM(MODELS.assessment);
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getPlacementPrompt({
    targetLanguage,
    tutorName,
  });

  const messages = [
    new SystemMessage(systemPrompt),
    ...history.map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    ),
    new HumanMessage(userMessage),
  ];

  const response = await llm.invoke(messages);
  return response.content as string;
}

export async function* streamAssessmentAgent(
  input: AssessmentInput
): AsyncGenerator<string> {
  const { userMessage, targetLanguage, history } = input;

  const llm = createLLM(MODELS.assessment);
  const tutorName = LANGUAGE_CONFIG[targetLanguage].tutorName;

  const systemPrompt = getPlacementPrompt({
    targetLanguage,
    tutorName,
  });

  const messages = [
    new SystemMessage(systemPrompt),
    ...history.map((msg) =>
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
