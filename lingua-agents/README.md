# LinguaAgents

Multi-agent AI language learning platform built with Next.js, LangChain.js, and OpenRouter.

Learn English, Spanish, or German through adaptive AI-powered conversation, grammar instruction, and assessment — all driven by specialized AI agents.

## Features (Phase 1 MVP)

- **Language Selection** — Choose between English, Spanish, and German
- **Placement Test** — AI-driven adaptive assessment to determine your CEFR level (A1-C2)
- **Free Conversation** — Chat naturally with an AI tutor that corrects mistakes in real-time
- **Grammar Routing** — Ask about grammar rules and the system automatically routes to the Grammar Agent
- **Inline Corrections** — Mistakes are highlighted with explanations inline
- **Progress Tracking** — XP, streak, and CEFR level tracked with localStorage persistence
- **Animated Avatars** — Language-specific tutor characters with expression states
- **Streaming Responses** — Real-time token streaming via Server-Sent Events

## Architecture

```
User → API Route → Orchestrator Agent → routes to:
  ├── Conversation Agent (free dialogue with corrections)
  ├── Grammar Agent (rules, exercises, error analysis)
  └── Assessment Agent (placement tests, quizzes)
```

Each agent uses LangChain.js with OpenRouter to access free LLM models:
- `mistralai/mistral-7b-instruct:free` — Conversation & Grammar
- `meta-llama/llama-3.1-8b-instruct:free` — Assessment & Curriculum

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your OpenRouter API key to .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start learning.

## Getting an OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Create a free account
3. Generate an API key
4. Add it to your `.env` file as `OPENROUTER_API_KEY`

Free-tier models are used by default — no credit card required.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| AI Orchestration | LangChain.js |
| LLM Provider | OpenRouter (free tier) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand (localStorage persistence) |
| Components | Custom UI with CVA + tailwind-merge |

## Project Structure

```
src/
├── agents/           # AI agent implementations
│   ├── orchestrator.ts   # Routes to specialist agents
│   ├── conversation.ts   # Free dialogue practice
│   ├── grammar.ts        # Grammar teaching & exercises
│   ├── assessment.ts     # Placement tests & quizzes
│   └── prompts/          # System prompts per agent
├── app/
│   ├── page.tsx          # Landing page (language selection)
│   ├── api/              # Streaming API routes
│   └── learn/            # Learning pages
│       ├── page.tsx          # Dashboard
│       ├── conversation/     # Chat practice
│       ├── lesson/           # Guided lessons
│       └── assessment/       # Placement test
├── components/       # React components
│   ├── ui/               # Base UI (Button, Card, etc.)
│   ├── chat/             # Chat interface
│   ├── characters/       # Animated tutor avatars
│   └── progress/         # Level, XP, streak displays
├── stores/           # Zustand state stores
└── lib/              # Utilities, types, LLM config
```
