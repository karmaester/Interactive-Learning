"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, SessionType, AgentType } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface ChatSession {
  id: string;
  type: SessionType;
  messages: ChatMessage[];
  startedAt: number;
  topic?: string;
}

interface ChatState {
  sessions: Record<string, ChatSession>;
  activeSessionId: string | null;

  // Actions
  createSession: (type: SessionType, topic?: string) => string;
  addMessage: (
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    agentType?: AgentType
  ) => void;
  updateLastAssistantMessage: (sessionId: string, content: string) => void;
  getActiveSession: () => ChatSession | null;
  getSessionMessages: (sessionId: string) => ChatMessage[];
  setActiveSession: (sessionId: string) => void;
  clearSession: (sessionId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: {},
      activeSessionId: null,

      createSession: (type, topic) => {
        const id = generateId();
        const session: ChatSession = {
          id,
          type,
          messages: [],
          startedAt: Date.now(),
          topic,
        };
        set((state) => ({
          sessions: { ...state.sessions, [id]: session },
          activeSessionId: id,
        }));
        return id;
      },

      addMessage: (sessionId, role, content, agentType) => {
        const message: ChatMessage = {
          id: generateId(),
          role,
          content,
          agentType,
          timestamp: Date.now(),
        };
        set((state) => {
          const session = state.sessions[sessionId];
          if (!session) return state;
          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                messages: [...session.messages, message],
              },
            },
          };
        });
      },

      updateLastAssistantMessage: (sessionId, content) =>
        set((state) => {
          const session = state.sessions[sessionId];
          if (!session) return state;
          const messages = [...session.messages];
          const lastIdx = messages.length - 1;
          if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
            messages[lastIdx] = { ...messages[lastIdx], content };
          }
          return {
            sessions: {
              ...state.sessions,
              [sessionId]: { ...session, messages },
            },
          };
        }),

      getActiveSession: () => {
        const state = get();
        if (!state.activeSessionId) return null;
        return state.sessions[state.activeSessionId] || null;
      },

      getSessionMessages: (sessionId) => {
        const state = get();
        return state.sessions[sessionId]?.messages || [];
      },

      setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

      clearSession: (sessionId) =>
        set((state) => {
          const { [sessionId]: _, ...rest } = state.sessions;
          return {
            sessions: rest,
            activeSessionId:
              state.activeSessionId === sessionId
                ? null
                : state.activeSessionId,
          };
        }),
    }),
    {
      name: "lingua-agents-chat",
    }
  )
);
