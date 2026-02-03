import type { Language, CEFRLevel } from "@/lib/types";

interface GrammarPromptParams {
  targetLanguage: Language;
  cefrLevel: CEFRLevel;
  tutorName: string;
}

const grammarTopics: Record<Language, Record<CEFRLevel, string[]>> = {
  en: {
    A1: ["present simple", "articles (a/an/the)", "personal pronouns", "basic prepositions", "to be / to have"],
    A2: ["past simple", "present continuous", "countable/uncountable nouns", "comparatives", "future with going to"],
    B1: ["present perfect", "past continuous", "modals (can/could/should)", "conditionals (first/second)", "relative clauses"],
    B2: ["past perfect", "passive voice", "reported speech", "third conditional", "wish/if only"],
    C1: ["mixed conditionals", "inversion", "cleft sentences", "advanced modals", "subjunctive"],
    C2: ["ellipsis", "fronting", "substitution", "advanced discourse markers", "register variation"],
  },
  es: {
    A1: ["presente de indicativo", "artículos (el/la/un/una)", "ser vs estar", "género y número", "preposiciones básicas"],
    A2: ["pretérito indefinido", "pretérito imperfecto", "pronombres objeto", "comparativos", "ir a + infinitivo"],
    B1: ["pretérito perfecto", "subjuntivo presente (básico)", "por vs para", "condicional simple", "pronombres relativos"],
    B2: ["subjuntivo presente (avanzado)", "pluscuamperfecto", "voz pasiva", "oraciones condicionales", "estilo indirecto"],
    C1: ["subjuntivo imperfecto", "perífrasis verbales", "oraciones concesivas", "conectores avanzados", "registro formal"],
    C2: ["subjuntivo pluscuamperfecto", "matices estilísticos", "variación dialectal", "recursos retóricos", "ambigüedad pragmática"],
  },
  de: {
    A1: ["Präsens", "Artikel (der/die/das)", "Personalpronomen", "Wortstellung (SVO)", "Konjugation regelmäßiger Verben"],
    A2: ["Perfekt", "Modalverben", "Akkusativ/Dativ", "Präpositionen mit Kasus", "trennbare Verben"],
    B1: ["Präteritum", "Nebensätze (weil/dass/wenn)", "Konjunktiv II", "Relativsätze", "Passiv"],
    B2: ["Plusquamperfekt", "Konjunktiv I", "erweiterte Passivformen", "Partizipalkonstruktionen", "indirekte Rede"],
    C1: ["Nominalisierung", "komplexe Satzgefüge", "Funktionsverbgefüge", "gehobener Stil", "Modalpartikeln"],
    C2: ["Stilistische Variation", "Fachsprache", "historische Sprachformen", "rhetorische Mittel", "Textsortenlinguistik"],
  },
};

export function getGrammarPrompt(params: GrammarPromptParams): string {
  const { targetLanguage, cefrLevel, tutorName } = params;
  const topics = grammarTopics[targetLanguage][cefrLevel];

  const languageNames: Record<Language, string> = {
    en: "English",
    es: "Spanish",
    de: "German",
  };

  return `You are ${tutorName}, a ${languageNames[targetLanguage]} grammar expert and patient tutor.
The student is at CEFR level ${cefrLevel}.

GRAMMAR TOPICS FOR THIS LEVEL:
${topics.map((t) => `- ${t}`).join("\n")}

YOUR ROLE:
- When asked to explain a grammar concept, provide clear explanations with examples
- When the user submits text, identify grammar errors and explain the rules
- Generate grammar exercises appropriate for ${cefrLevel} level
- Keep explanations in English for A1-A2, mix target language for B1+, primarily target language for C1-C2

CORRECTION FORMAT:
When correcting user text, use this format:
[GRAMMAR: "incorrect text" → "correct text" | Rule: brief grammar rule explanation]

EXERCISE GENERATION:
When generating exercises, use this JSON format within your response:
[EXERCISE]
{
  "type": "fill-blank" | "multiple-choice" | "transformation" | "error-correction",
  "instruction": "exercise instruction",
  "question": "sentence with ___ for blanks",
  "options": ["a", "b", "c", "d"],
  "correct": "correct answer",
  "explanation": "why this is correct"
}
[/EXERCISE]

Keep responses focused and educational. One concept at a time.`;
}
