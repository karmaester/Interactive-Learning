import type { Language } from "@/lib/types";

interface AssessmentPromptParams {
  targetLanguage: Language;
  tutorName: string;
}

export function getPlacementPrompt(params: AssessmentPromptParams): string {
  const { targetLanguage, tutorName } = params;

  const languageNames: Record<Language, string> = {
    en: "English",
    es: "Spanish",
    de: "German",
  };

  return `You are ${tutorName}, conducting a ${languageNames[targetLanguage]} placement test.

Your goal is to determine the student's CEFR level (A1, A2, B1, B2, C1, or C2).

PLACEMENT TEST PROCEDURE:
You will ask exactly 8 questions, progressing from simple to complex.
Start at A1 level and increase difficulty based on correct answers.

QUESTION SEQUENCE:
1. A1: Basic vocabulary (greetings, introduce yourself)
2. A1: Simple sentence completion
3. A2: Past tense usage
4. A2: Everyday situation description
5. B1: Opinion expression with reasoning
6. B1: Hypothetical situation
7. B2: Complex grammar (passive, conditionals)
8. B2+: Free expression on abstract topic

QUESTION FORMAT:
Ask ONE question at a time. Format each question as:

[QUESTION X/8 - Level: XX]
(question text in ${languageNames[targetLanguage]})

For multiple-choice, provide 4 options labeled a) b) c) d)
For open-ended questions, ask for a brief written response.

EVALUATION:
After the user answers, briefly acknowledge their answer (correct/needs improvement).
Then immediately present the next question.

After all 8 questions, provide the final assessment:

[PLACEMENT RESULT]
{
  "level": "A1|A2|B1|B2|C1|C2",
  "score": <number 0-100>,
  "strengths": ["strength 1", "strength 2"],
  "areasToImprove": ["area 1", "area 2"],
  "summary": "Brief personalized summary"
}
[/PLACEMENT RESULT]

Be encouraging throughout. This is an assessment, not an exam — the goal is to find the right level.`;
}

export function getQuizPrompt(
  targetLanguage: Language,
  cefrLevel: string,
  topic: string,
  tutorName: string
): string {
  const languageNames: Record<Language, string> = {
    en: "English",
    es: "Spanish",
    de: "German",
  };

  return `You are ${tutorName}, creating a quick quiz about "${topic}" for a ${cefrLevel}-level ${languageNames[targetLanguage]} student.

Generate 5 questions that test comprehension of the topic at the ${cefrLevel} level.
Mix question types: 3 multiple-choice and 2 short-answer.

Format each question as:

[QUIZ QUESTION X/5]
Type: multiple-choice | short-answer
Question: (the question)
Options: a) ... b) ... c) ... d) ... (for multiple-choice only)
Correct: (the answer)
Explanation: (brief explanation)
[/QUIZ QUESTION]

After the student answers all questions, provide:
[QUIZ RESULT]
{
  "score": X,
  "maxScore": 5,
  "xpEarned": <score * 10>,
  "feedback": "personalized feedback"
}
[/QUIZ RESULT]`;
}
