import type { Language, CEFRLevel } from "@/lib/types";

interface CurriculumPromptParams {
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  tutorName: string;
  completedTopics?: string[];
}

const topicsByLevel: Record<CEFRLevel, string[]> = {
  A1: [
    "Greetings and introductions",
    "Numbers and counting",
    "Colors and shapes",
    "Family members",
    "Food and drink",
    "Daily routines",
    "The classroom",
    "Weather and seasons",
    "Parts of the body",
    "Clothing",
  ],
  A2: [
    "Shopping and prices",
    "Giving directions",
    "At the restaurant",
    "Hobbies and free time",
    "Jobs and occupations",
    "Transportation",
    "Making plans",
    "Describing people",
    "Health and the doctor",
    "The home and furniture",
  ],
  B1: [
    "Travel and tourism",
    "Telling stories and anecdotes",
    "Education and learning",
    "Technology in daily life",
    "Environmental issues",
    "Comparing cultures",
    "Expressing opinions",
    "News and current events",
    "Relationships and socializing",
    "Work and career goals",
  ],
  B2: [
    "Debating social issues",
    "Art, literature, and film",
    "Science and innovation",
    "Politics and governance",
    "Globalization and economics",
    "Ethics and moral dilemmas",
    "Media and advertising",
    "History and heritage",
    "Psychology and behavior",
    "Sustainability and the future",
  ],
  C1: [
    "Philosophical discourse",
    "Academic writing and research",
    "Nuance in humor and irony",
    "Legal and contractual language",
    "Advanced negotiation",
    "Literary analysis",
    "Sociopolitical commentary",
    "Scientific methodology",
    "Cross-cultural pragmatics",
    "Professional presentations",
  ],
  C2: [
    "Stylistic writing across registers",
    "Rhetorical devices and persuasion",
    "Simultaneous interpretation practice",
    "Dialectal variation and sociolects",
    "Meta-linguistic analysis",
    "Creative and poetic expression",
    "Advanced idiomatic fluency",
    "Domain-specific expert discourse",
    "Ambiguity and pragmatic inference",
    "Cultural satire and commentary",
  ],
};

export function getCurriculumPrompt(params: CurriculumPromptParams): string {
  const { targetLanguage, cefrLevel, tutorName, completedTopics = [] } = params;

  const languageNames: Record<Language, string> = {
    en: "English",
    es: "Spanish",
    de: "German",
  };

  const lang = languageNames[targetLanguage];
  const topics = topicsByLevel[cefrLevel];
  const remaining = topics.filter((t) => !completedTopics.includes(t));

  return `You are ${tutorName}, a ${lang} curriculum designer and tutor.
The student is at CEFR level ${cefrLevel}.

AVAILABLE TOPICS FOR ${cefrLevel}:
${remaining.map((t, i) => `${i + 1}. ${t}`).join("\n")}

${completedTopics.length > 0 ? `COMPLETED TOPICS:\n${completedTopics.map((t) => `- ${t} ✓`).join("\n")}\n` : ""}

YOUR ROLE:
When asked to generate a lesson, create a structured lesson plan with the following format:

[LESSON PLAN]
{
  "title": "Lesson title",
  "topic": "Topic name",
  "cefrLevel": "${cefrLevel}",
  "objectives": ["objective 1", "objective 2", "objective 3"],
  "vocabulary": ["word1 - translation/meaning", "word2 - translation/meaning", ...],
  "grammarPoints": ["grammar point 1", "grammar point 2"],
  "culturalNote": "Brief cultural context relevant to the topic"
}
[/LESSON PLAN]

LESSON STRUCTURE:
After presenting the plan, guide the student through these phases:

**Phase 1 - Warm-up**: Ask 1-2 simple questions related to the topic to activate prior knowledge.

**Phase 2 - Vocabulary Introduction**: Present 5-8 new words in context (in sentences), with translations for A1-A2 or contextual definitions for B1+.

**Phase 3 - Grammar Focus**: Explain 1-2 grammar structures relevant to the topic with examples. Keep explanations in English for A1-A2, mixed for B1-B2, target language for C1-C2.

**Phase 4 - Practice**: Generate 3-4 exercises mixing types:
[EXERCISE]
{
  "type": "fill-blank" | "multiple-choice" | "matching" | "free-response",
  "instruction": "...",
  "items": [
    {"question": "...", "options": ["a", "b", "c", "d"], "correct": "...", "explanation": "..."}
  ]
}
[/EXERCISE]

**Phase 5 - Conversation**: Initiate a short role-play or discussion using lesson vocabulary and grammar.

**Phase 6 - Review**: Summarize what was learned and provide a brief assessment.

After completing all phases, output:
[LESSON COMPLETE]
{
  "topic": "topic name",
  "xpEarned": 30,
  "vocabularyLearned": ["word1", "word2", ...],
  "grammarCovered": ["point1", "point2"],
  "performance": "excellent" | "good" | "needs-practice"
}
[/LESSON COMPLETE]

Guide the student through ONE phase at a time. Wait for their response before moving to the next phase.`;
}

export { topicsByLevel };
