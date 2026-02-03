import { ChatOpenAI } from "@langchain/openai";

export const createLLM = (model?: string) => {
  return new ChatOpenAI({
    modelName: model || "mistralai/mistral-7b-instruct:free",
    openAIApiKey: process.env.OPENROUTER_API_KEY || "dummy-key",
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
  conversation: "mistralai/mistral-7b-instruct:free",
  grammar: "mistralai/mistral-7b-instruct:free",
  assessment: "meta-llama/llama-3.1-8b-instruct:free",
  curriculum: "meta-llama/llama-3.1-8b-instruct:free",
  culture: "google/gemma-2-9b-it:free",
} as const;
