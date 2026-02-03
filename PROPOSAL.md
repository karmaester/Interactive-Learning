# LinguaAgents: Multi-Agent AI Language Learning Platform

## Proposal for Interactive-Learning v2

---

## 1. Analysis of the Current Application

### What Exists Today

The current application is a vanilla HTML/CSS/JavaScript language learning tool with:

- **Static Q&A system**: 4 hardcoded questions stored in a JS array, each with 1 correct and 2 invalid options
- **Two animated SVG characters** (Dani & Nicky) that deliver dialogue with letter-by-letter animation and mouth/eye state toggling
- **Linear progression**: Users move through a fixed sequence of questions with a progress bar
- **Basic scoring**: A global `mistakes` counter with threshold-based feedback
- **Single language direction**: English questions with Spanish hints — no language selection
- **No persistence**: All state resets on page reload
- **No adaptivity**: Every user gets the same questions in the same order regardless of level

### Key Limitations

| Area | Current State | Impact |
|------|--------------|--------|
| Content | 4 hardcoded questions | Zero replayability |
| Languages | English only (Spanish hints) | Single audience |
| Adaptivity | None | No personalization |
| Interaction | Multiple-choice only | Shallow learning |
| Persistence | None | No progress tracking |
| Architecture | Single HTML file (1200 lines) | Unmaintainable |
| AI/NLP | None | No dynamic content |

### What to Preserve

- **Character-driven dialogue** — the animated characters create engagement and personality. This concept should evolve into AI-powered conversational avatars.
- **Immediate feedback loop** — the instant correct/incorrect response with hints is pedagogically sound.
- **Visual progress tracking** — the segmented progress bar gives clear advancement signals.
- **Approachable, clean UI** — low visual noise, focused interaction.

---

## 2. Vision: LinguaAgents

**LinguaAgents** is a multi-agent AI-powered language learning platform where specialized AI agents collaborate to deliver a personalized, adaptive learning experience across English, Spanish, and German.

Instead of static questions, a system of cooperating AI agents dynamically generates lessons, conversations, exercises, and assessments tailored to each learner's proficiency level, learning pace, and interests.

### Core Principles

1. **Agent Specialization** — Each agent excels at one pedagogical function
2. **Adaptive Difficulty** — Content adjusts in real-time to learner performance
3. **Immersive Interaction** — Beyond multiple-choice: free-form conversation, writing exercises, contextual scenarios
4. **Three Languages** — English, Spanish, and German with cross-language support
5. **Single Deployable App** — Everything lives in one Next.js application

---

## 3. Multi-Agent Architecture

### 3.1 Agent Overview

```
                    ┌─────────────────────┐
                    │   Orchestrator      │
                    │   Agent             │
                    │   (Router/Planner)  │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Curriculum      │ │  Conversation   │ │  Assessment     │
│  Agent           │ │  Agent          │ │  Agent          │
│                  │ │                 │ │                 │
│  - Lesson plans  │ │  - Free chat    │ │  - Quizzes      │
│  - Topic select  │ │  - Role-play    │ │  - Scoring      │
│  - Difficulty    │ │  - Scenarios    │ │  - Proficiency   │
│    calibration   │ │  - Corrections  │ │    estimation   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Grammar         │ │  Vocabulary     │ │  Culture        │
│  Agent           │ │  Agent          │ │  Agent          │
│                  │ │                 │ │                 │
│  - Explanations  │ │  - Contextual   │ │  - Cultural     │
│  - Exercises     │ │    word intro   │ │    context      │
│  - Pattern       │ │  - Spaced       │ │  - Idioms       │
│    recognition   │ │    repetition   │ │  - Usage norms  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 3.2 Agent Specifications

#### Orchestrator Agent
- **Role**: Central router that receives all user interactions and delegates to the appropriate specialist agent
- **Responsibilities**:
  - Maintains session context and learner state
  - Decides which agent to invoke based on the current learning phase
  - Merges outputs from multiple agents into a coherent response
  - Manages turn-taking and conversation flow
- **Implementation**: LangChain.js `AgentExecutor` with tool-calling, where each specialist agent is exposed as a tool

#### Curriculum Agent
- **Role**: Designs and adapts the learning path
- **Responsibilities**:
  - Determines the learner's current CEFR level (A1-C2) based on assessment results
  - Selects topics and lesson themes appropriate to the level
  - Adjusts difficulty dynamically based on performance trends
  - Structures sessions: warm-up → lesson → practice → assessment
- **Prompt Engineering**: System prompt includes CEFR descriptors, topic taxonomies per level, and pedagogical sequencing rules

#### Conversation Agent
- **Role**: Facilitates free-form dialogue practice
- **Responsibilities**:
  - Engages the learner in natural conversation in the target language
  - Adopts personas and scenarios (ordering at a restaurant, job interview, travel)
  - Provides inline corrections with explanations
  - Adjusts vocabulary and grammar complexity to match learner level
- **Key Feature**: Can switch between "supportive mode" (gentle corrections) and "immersion mode" (target-language only)

#### Grammar Agent
- **Role**: Teaches and drills grammar concepts
- **Responsibilities**:
  - Explains grammar rules with examples in the target language
  - Generates fill-in-the-blank, transformation, and error-correction exercises
  - Identifies recurring grammar mistakes from conversation history
  - Provides contrastive analysis (comparing grammar between native and target language)

#### Vocabulary Agent
- **Role**: Builds and reinforces vocabulary
- **Responsibilities**:
  - Introduces new words in context (sentences, mini-stories)
  - Tracks which words the learner has encountered and mastered
  - Generates contextual exercises: definition matching, sentence completion, synonym/antonym
  - Implements spaced repetition logic for review scheduling

#### Assessment Agent
- **Role**: Evaluates learner proficiency and progress
- **Responsibilities**:
  - Conducts placement tests for new learners
  - Generates level-appropriate quizzes after lessons
  - Scores free-form responses for grammar, vocabulary, and fluency
  - Produces progress reports with strengths/weaknesses analysis
  - Feeds performance data back to the Curriculum Agent

#### Culture Agent
- **Role**: Provides cultural context for language usage
- **Responsibilities**:
  - Explains cultural norms, idioms, and colloquialisms
  - Provides context for formal vs. informal register
  - Shares relevant cultural notes when topics arise naturally
  - Handles language-specific nuances (e.g., German formal "Sie" vs. informal "du", Spanish regional variations)

### 3.3 Agent Communication Flow

```
User Input
    │
    ▼
┌──────────────┐     ┌──────────────────────────────────────┐
│ Orchestrator │────▶│ Shared Context (LangChain Memory)    │
│              │◀────│ - User profile & CEFR level          │
└──────┬───────┘     │ - Session history                    │
       │             │ - Performance metrics                │
       │             │ - Current lesson plan                │
       ▼             │ - Vocabulary mastery map             │
  Route to Agent     └──────────────────────────────────────┘
       │
       ├──▶ Curriculum Agent ──▶ returns lesson plan
       ├──▶ Conversation Agent ──▶ returns dialogue + corrections
       ├──▶ Grammar Agent ──▶ returns exercises + explanations
       ├──▶ Vocabulary Agent ──▶ returns word exercises
       ├──▶ Assessment Agent ──▶ returns quiz + score
       └──▶ Culture Agent ──▶ returns cultural notes
       │
       ▼
  Orchestrator merges response
       │
       ▼
  Rendered in UI
```

---

## 4. Technical Architecture

### 4.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 14+ (App Router) | Server components, API routes, streaming, SSR |
| **Language** | TypeScript | Type safety across the agent system |
| **AI Orchestration** | LangChain.js | Agent framework with tool-calling, memory, chains |
| **LLM Provider** | OpenRouter | Free-tier access to models (Mistral, Llama 3, Gemma) |
| **Styling** | Tailwind CSS + shadcn/ui | Modern, accessible component library |
| **Animation** | Framer Motion | Character animations, page transitions |
| **State Management** | Zustand | Lightweight, TypeScript-friendly client state |
| **Database** | SQLite via Prisma | Zero-config persistence for user progress |
| **Auth** | NextAuth.js | Optional — for saving progress across devices |
| **Streaming** | Vercel AI SDK | Server-sent events for real-time agent responses |
| **Testing** | Vitest + Playwright | Unit and E2E testing |

### 4.2 Why LangChain.js over Google ADK

| Criteria | LangChain.js | Google ADK |
|----------|-------------|------------|
| JS/TS maturity | Production-ready, large ecosystem | Newer, primarily Python-focused |
| Next.js integration | Native — runs in API routes, supports streaming | Requires adapter layer |
| OpenRouter support | First-class via `ChatOpenAI` with custom base URL | Manual HTTP integration |
| Agent primitives | `AgentExecutor`, `Tool`, `Memory`, `Chain` | `Agent`, `Tool`, but less JS tooling |
| Community | Extensive JS/TS examples and docs | Growing, but mostly Python community |

LangChain.js is recommended as the primary framework. The architecture is modular enough that individual agents could be swapped to Google ADK implementations later if desired.

### 4.3 OpenRouter Integration

```typescript
// lib/llm.ts
import { ChatOpenAI } from "@langchain/openai";

export const createLLM = (model?: string) => {
  return new ChatOpenAI({
    modelName: model || "mistralai/mistral-7b-instruct:free",
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
        "X-Title": "LinguaAgents",
      },
    },
    temperature: 0.7,
    streaming: true,
  });
};
```

**Free-tier models via OpenRouter**:
- `mistralai/mistral-7b-instruct:free` — General conversation and grammar
- `meta-llama/llama-3.1-8b-instruct:free` — Assessment and curriculum planning
- `google/gemma-2-9b-it:free` — Vocabulary and cultural context

Different agents can use different models optimized for their task.

---

## 5. Application Structure

### 5.1 Project Layout

```
lingua-agents/
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Landing / language selection
│   ├── globals.css                   # Tailwind base styles
│   │
│   ├── learn/
│   │   ├── layout.tsx                # Learning session layout (sidebar + main)
│   │   ├── page.tsx                  # Session dashboard
│   │   ├── conversation/
│   │   │   └── page.tsx              # Free conversation practice
│   │   ├── lesson/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Structured lesson view
│   │   ├── exercise/
│   │   │   └── page.tsx              # Grammar & vocabulary exercises
│   │   └── assessment/
│   │       └── page.tsx              # Quizzes and placement tests
│   │
│   ├── progress/
│   │   └── page.tsx                  # Progress dashboard & analytics
│   │
│   └── api/
│       ├── chat/
│       │   └── route.ts              # Streaming chat endpoint
│       ├── assess/
│       │   └── route.ts              # Assessment endpoint
│       ├── lesson/
│       │   └── route.ts              # Lesson generation endpoint
│       └── progress/
│           └── route.ts              # Progress data endpoint
│
├── agents/
│   ├── orchestrator.ts               # Main agent router
│   ├── curriculum.ts                 # Curriculum planning agent
│   ├── conversation.ts               # Dialogue practice agent
│   ├── grammar.ts                    # Grammar teaching agent
│   ├── vocabulary.ts                 # Vocabulary building agent
│   ├── assessment.ts                 # Testing & scoring agent
│   ├── culture.ts                    # Cultural context agent
│   ├── tools/
│   │   ├── get-user-profile.ts       # Retrieve learner profile
│   │   ├── update-progress.ts        # Write progress to DB
│   │   ├── get-vocabulary-list.ts    # Fetch mastered vocabulary
│   │   ├── generate-exercise.ts      # Create exercises dynamically
│   │   └── score-response.ts         # Evaluate free-form answers
│   └── prompts/
│       ├── orchestrator.ts           # System prompts for orchestrator
│       ├── curriculum.ts             # Curriculum agent prompts
│       ├── conversation.ts           # Conversation agent prompts
│       ├── grammar.ts                # Grammar agent prompts
│       ├── vocabulary.ts             # Vocabulary agent prompts
│       ├── assessment.ts             # Assessment agent prompts
│       └── culture.ts                # Culture agent prompts
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── chat/
│   │   ├── chat-container.tsx        # Main chat interface
│   │   ├── message-bubble.tsx        # Individual message display
│   │   ├── typing-indicator.tsx      # Agent "thinking" animation
│   │   └── input-bar.tsx             # User input with send button
│   ├── characters/
│   │   ├── avatar.tsx                # Animated character avatar
│   │   ├── character-panel.tsx       # Character display with dialogue
│   │   └── expressions.ts           # Expression state definitions
│   ├── exercises/
│   │   ├── multiple-choice.tsx       # Multiple-choice exercise
│   │   ├── fill-blank.tsx            # Fill-in-the-blank exercise
│   │   ├── free-response.tsx         # Open-ended response exercise
│   │   ├── matching.tsx              # Word/phrase matching exercise
│   │   └── exercise-result.tsx       # Feedback display
│   ├── progress/
│   │   ├── level-badge.tsx           # CEFR level display
│   │   ├── progress-ring.tsx         # Circular progress indicator
│   │   ├── streak-counter.tsx        # Daily streak display
│   │   └── skill-radar.tsx           # Radar chart for skill areas
│   ├── language-selector.tsx         # EN / ES / DE selector
│   ├── session-sidebar.tsx           # Navigation sidebar
│   └── onboarding-flow.tsx           # Initial placement flow
│
├── lib/
│   ├── llm.ts                        # OpenRouter LLM configuration
│   ├── memory.ts                     # LangChain memory setup
│   ├── types.ts                      # Shared TypeScript types
│   ├── constants.ts                  # CEFR levels, languages, topics
│   └── utils.ts                      # Utility functions
│
├── stores/
│   ├── session-store.ts              # Current session state (Zustand)
│   ├── user-store.ts                 # User profile & preferences
│   └── chat-store.ts                 # Chat history state
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Initial data seeding
│
├── public/
│   ├── characters/                   # SVG character assets
│   └── sounds/                       # Optional audio feedback
│
├── .env.example                      # Environment variable template
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
└── README.md                         # Project documentation
```

### 5.2 Database Schema

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  profiles      LearnerProfile[]
  sessions      LearningSession[]
}

model LearnerProfile {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  targetLanguage  String   // "en", "es", "de"
  nativeLanguage  String
  cefrLevel       String   @default("A1") // A1, A2, B1, B2, C1, C2
  totalXP         Int      @default(0)
  streak          Int      @default(0)
  lastActiveAt    DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  vocabulary      VocabularyEntry[]
  assessments     Assessment[]
  sessions        LearningSession[]

  @@unique([userId, targetLanguage])
}

model LearningSession {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  profileId       String
  profile         LearnerProfile @relation(fields: [profileId], references: [id])
  sessionType     String   // "conversation", "lesson", "exercise", "assessment"
  topic           String?
  messages        Message[]
  xpEarned        Int      @default(0)
  startedAt       DateTime @default(now())
  endedAt         DateTime?
}

model Message {
  id          String   @id @default(cuid())
  sessionId   String
  session     LearningSession @relation(fields: [sessionId], references: [id])
  role        String   // "user", "assistant", "system"
  content     String
  agentType   String?  // Which agent generated this message
  metadata    String?  // JSON: corrections, scores, etc.
  createdAt   DateTime @default(now())
}

model VocabularyEntry {
  id              String   @id @default(cuid())
  profileId       String
  profile         LearnerProfile @relation(fields: [profileId], references: [id])
  word            String
  translation     String
  context         String?  // Example sentence
  mastery         Float    @default(0) // 0.0 to 1.0
  nextReviewAt    DateTime @default(now())
  reviewCount     Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([profileId, word])
}

model Assessment {
  id          String   @id @default(cuid())
  profileId   String
  profile     LearnerProfile @relation(fields: [profileId], references: [id])
  type        String   // "placement", "lesson_quiz", "level_test"
  score       Float
  maxScore    Float
  cefrLevel   String
  details     String?  // JSON: per-question breakdown
  createdAt   DateTime @default(now())
}
```

---

## 6. User Experience Design

### 6.1 User Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     LANDING PAGE                              │
│                                                              │
│  "Welcome to LinguaAgents"                                   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ English  │  │ Español  │  │ Deutsch  │                    │
│  │  🇬🇧/🇺🇸   │  │   🇪🇸     │  │   🇩🇪     │                    │
│  └──────────┘  └──────────┘  └──────────┘                   │
│                                                              │
│  [ Get Started ]                                             │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   PLACEMENT TEST                              │
│                                                              │
│  The Assessment Agent conducts a short adaptive test          │
│  (5-10 questions) to estimate the user's CEFR level.         │
│                                                              │
│  Mix of: multiple-choice, fill-blank, short response          │
│                                                              │
│  Result: "Your level: B1 - Intermediate"                      │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   LEARNING DASHBOARD                          │
│                                                              │
│  ┌─────────┐  ┌────────────────────────────────────────┐     │
│  │ Sidebar │  │  Main Content Area                     │     │
│  │         │  │                                        │     │
│  │ 📚 Lessons│  │  Today's Lesson: "At the Restaurant"  │     │
│  │ 💬 Chat  │  │                                        │     │
│  │ ✏️ Drill │  │  ┌──────────────────────────────┐      │     │
│  │ 📊 Quiz  │  │  │  Character Avatar + Dialogue │      │     │
│  │ 📈 Progress│ │  └──────────────────────────────┘      │     │
│  │         │  │                                        │     │
│  │ Level:  │  │  [ Start Lesson ]                      │     │
│  │  B1     │  │  [ Free Conversation ]                 │     │
│  │ XP: 450 │  │  [ Quick Exercise ]                    │     │
│  │ 🔥 5 day│  │                                        │     │
│  └─────────┘  └────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Learning Modes

#### Mode 1: Structured Lesson
The Curriculum Agent selects a topic and the session flows through phases:

1. **Introduction** — Culture Agent provides context; Vocabulary Agent introduces key words
2. **Presentation** — Grammar Agent explains relevant structures with examples
3. **Practice** — Mix of exercises: fill-blank, matching, multiple-choice
4. **Conversation** — Conversation Agent runs a role-play using lesson vocabulary/grammar
5. **Review** — Assessment Agent quizzes on the lesson content

#### Mode 2: Free Conversation
The Conversation Agent engages in open-ended dialogue:
- User chooses a topic or lets the agent pick one
- Agent speaks in the target language, adjusting complexity to CEFR level
- Inline corrections appear as subtle highlights the user can expand
- Grammar Agent is consulted when the user makes structural errors
- Vocabulary Agent flags and records new words encountered

#### Mode 3: Quick Exercise
Targeted practice generated by Grammar or Vocabulary agents:
- 5-minute drills on weak areas identified by the Assessment Agent
- Spaced repetition vocabulary review
- Grammar pattern exercises

#### Mode 4: Assessment
Formal evaluation by the Assessment Agent:
- Placement test (initial)
- Lesson quizzes (after each lesson)
- Level tests (periodic, to unlock next CEFR level)

### 6.3 UI Components

#### Animated Characters (Evolution from Original)
The original SVG characters (Dani & Nicky) evolve into **AI tutor avatars**:
- Modern illustrated characters rendered with Framer Motion animations
- Expression states: neutral, speaking, thinking, celebrating, encouraging
- Each character adopts a persona tied to the target language:
  - **English**: Native English tutor character
  - **Spanish**: Native Spanish tutor character
  - **German**: Native German tutor character
- Characters appear in a panel alongside the chat, reacting to the conversation

#### Chat Interface
- Clean message bubbles with clear user/agent distinction
- Agent messages show a subtle label indicating which agent responded
- Streaming text display (real-time token output)
- Inline correction highlights: tappable underlines that expand to show the correction and explanation
- Voice input button (future: Web Speech API)

#### Exercise Components
- **Multiple Choice**: Cards with hover effects, animated feedback
- **Fill in the Blank**: Inline text inputs within sentences
- **Free Response**: Text area with real-time character count and submit
- **Matching**: Drag-and-drop or tap-to-connect word pairs
- **All exercises**: Animated result feedback with XP reward display

#### Progress Dashboard
- **CEFR Level Badge**: Prominent display with progress to next level
- **Skill Radar Chart**: Grammar, Vocabulary, Listening, Reading, Writing axes
- **Streak Counter**: Daily engagement tracking
- **Vocabulary Mastery**: List of learned words with mastery percentages
- **Session History**: Past lessons with scores and topics

---

## 7. API Design

### 7.1 Streaming Chat Endpoint

```typescript
// app/api/chat/route.ts
import { StreamingTextResponse } from "ai";
import { orchestrator } from "@/agents/orchestrator";

export async function POST(req: Request) {
  const { messages, sessionId, profileId } = await req.json();

  // The orchestrator routes to the appropriate agent
  // and returns a streaming response
  const stream = await orchestrator.streamResponse({
    messages,
    sessionId,
    profileId,
  });

  return new StreamingTextResponse(stream);
}
```

### 7.2 Assessment Endpoint

```typescript
// app/api/assess/route.ts
export async function POST(req: Request) {
  const { profileId, type, responses } = await req.json();

  // Assessment agent scores the responses
  // and returns results + updated CEFR level
  const result = await assessmentAgent.evaluate({
    profileId,
    type,
    responses,
  });

  return Response.json(result);
}
```

### 7.3 Lesson Generation Endpoint

```typescript
// app/api/lesson/route.ts
export async function POST(req: Request) {
  const { profileId, topic } = await req.json();

  // Curriculum agent generates a lesson plan
  // coordinating with grammar, vocabulary, and culture agents
  const lesson = await curriculumAgent.generateLesson({
    profileId,
    topic,
  });

  return Response.json(lesson);
}
```

---

## 8. Agent Implementation Detail

### 8.1 Orchestrator Agent

```typescript
// agents/orchestrator.ts
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BufferWindowMemory } from "langchain/memory";

import { conversationTool } from "./tools/conversation-tool";
import { grammarTool } from "./tools/grammar-tool";
import { vocabularyTool } from "./tools/vocabulary-tool";
import { assessmentTool } from "./tools/assessment-tool";
import { cultureTool } from "./tools/culture-tool";
import { curriculumTool } from "./tools/curriculum-tool";
import { userProfileTool } from "./tools/get-user-profile";

const tools = [
  conversationTool,
  grammarTool,
  vocabularyTool,
  assessmentTool,
  cultureTool,
  curriculumTool,
  userProfileTool,
];

const prompt = ChatPromptTemplate.fromMessages([
  ["system", `You are the orchestrator of a language learning platform.
Your role is to analyze the user's message and current learning context,
then delegate to the appropriate specialist agent.

Current learner profile: {learnerProfile}
Current session type: {sessionType}
Target language: {targetLanguage}

Guidelines:
- For lesson flow, use the curriculum tool
- For free conversation, use the conversation tool
- For grammar questions or errors, use the grammar tool
- For vocabulary practice, use the vocabulary tool
- For quizzes and tests, use the assessment tool
- For cultural context, use the culture tool
- You may call multiple tools in sequence for rich responses`],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

export const createOrchestrator = async (config: OrchestratorConfig) => {
  const llm = new ChatOpenAI({
    modelName: "mistralai/mistral-7b-instruct:free",
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
    streaming: true,
  });

  const agent = await createToolCallingAgent({ llm, tools, prompt });

  return new AgentExecutor({
    agent,
    tools,
    memory: new BufferWindowMemory({
      k: 20,
      memoryKey: "chat_history",
      returnMessages: true,
    }),
    verbose: process.env.NODE_ENV === "development",
  });
};
```

### 8.2 Specialist Agent Example (Conversation Agent)

```typescript
// agents/conversation.ts
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { createLLM } from "@/lib/llm";
import { conversationPrompt } from "./prompts/conversation";

export const conversationTool = new DynamicStructuredTool({
  name: "conversation_agent",
  description:
    "Engages the learner in free-form conversation practice in the target language. " +
    "Use this for dialogue practice, role-play scenarios, and conversational exercises.",
  schema: z.object({
    userMessage: z.string().describe("The user's message"),
    targetLanguage: z.string().describe("Target language code: en, es, or de"),
    cefrLevel: z.string().describe("Current CEFR level: A1-C2"),
    scenario: z.string().optional().describe("Optional conversation scenario"),
    mode: z.enum(["supportive", "immersion"]).default("supportive"),
  }),
  func: async ({ userMessage, targetLanguage, cefrLevel, scenario, mode }) => {
    const llm = createLLM();

    const response = await llm.invoke([
      {
        role: "system",
        content: conversationPrompt({ targetLanguage, cefrLevel, scenario, mode }),
      },
      { role: "user", content: userMessage },
    ]);

    return response.content;
  },
});
```

---

## 9. Key Features Summary

### MVP (Phase 1)
- [ ] Language selection (English, Spanish, German)
- [ ] Placement test (Assessment Agent)
- [ ] Free conversation mode (Conversation Agent + Grammar Agent)
- [ ] Inline corrections with explanations
- [ ] Basic progress tracking (XP, CEFR level)
- [ ] Animated character avatars
- [ ] Streaming AI responses
- [ ] Session persistence (SQLite)

### Phase 2
- [ ] Structured lessons (Curriculum Agent)
- [ ] Grammar exercises (Grammar Agent)
- [ ] Vocabulary builder with spaced repetition (Vocabulary Agent)
- [ ] Cultural context notes (Culture Agent)
- [ ] Progress dashboard with skill radar
- [ ] Multiple exercise types (fill-blank, matching, free-response)

### Phase 3
- [ ] Voice input/output (Web Speech API)
- [ ] Multi-device sync (NextAuth + cloud DB)
- [ ] Leaderboards and social features
- [ ] Custom topic selection
- [ ] Export progress reports
- [ ] Native tutor character per language

---

## 10. Environment Configuration

```env
# .env.example

# OpenRouter API Key (get free key at https://openrouter.ai)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# Optional: NextAuth (for multi-device sync)
# NEXTAUTH_SECRET=your-secret-here
# NEXTAUTH_URL=http://localhost:3000
```

---

## 11. Getting Started (Post-Implementation)

```bash
# Clone and install
git clone <repo-url>
cd lingua-agents
npm install

# Set up environment
cp .env.example .env
# Add your OpenRouter API key to .env

# Initialize database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

---

## 12. Migration from Current Application

| Original Element | New Implementation |
|-----------------|-------------------|
| Inline SVG characters | Framer Motion animated avatar components |
| `module[]` question array | AI-generated content via Curriculum + Grammar agents |
| `answerValidation()` | Assessment Agent with LLM-powered evaluation |
| `displayLetterByLetter()` | Streaming token display via Vercel AI SDK |
| `talk()` / `blink()` | Framer Motion expression state machine |
| Progress bar segments | CEFR-based progress ring + XP system |
| Bootstrap grid | Tailwind CSS + shadcn/ui responsive layout |
| Global `mistakes` var | Zustand store + Prisma persistence |
| Single HTML file | Next.js App Router with modular pages |
| Spanish hints | Multi-language support via agent prompts |

---

## 13. Conclusion

LinguaAgents transforms the original static Q&A language tool into a dynamic, AI-driven learning platform. The multi-agent architecture ensures each aspect of language learning — curriculum design, conversation practice, grammar instruction, vocabulary building, assessment, and cultural context — is handled by a specialized agent optimized for that task.

By using Next.js as the unified platform, LangChain.js for agent orchestration, and OpenRouter for free LLM access, the entire system lives in a single deployable application with no external service dependencies beyond the LLM API.

The result is a personalized, adaptive learning experience that scales from absolute beginner (A1) to advanced (C2) across three languages, while preserving the engaging character-driven interaction that made the original application approachable.
