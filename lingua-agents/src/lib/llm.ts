import { ChatOpenAI } from "@langchain/openai";

export const createLLM = (model?: string) => {
  return new ChatOpenAI({
    modelName: model || "nvidia/nemotron-nano-12b-v2-vl:free",
    apiKey: process.env.OPENROUTER_API_KEY || "dummy-key",
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "LinguaAgents",
      },
    },
    temperature: 0.7,
    streaming: true,
  });
};

export const MODELS = {
  conversation: "nvidia/nemotron-nano-12b-v2-vl:free",
  grammar: "nvidia/nemotron-nano-12b-v2-vl:free",
  assessment: "nvidia/nemotron-3-nano-30b-a3b:free",
  curriculum: "nvidia/nemotron-3-nano-30b-a3b:free",
  culture: "stepfun/step-3.5-flash:free",
} as const;
