import { streamOrchestrator } from "@/agents/orchestrator";
import type { Language, CEFRLevel, SessionType, ChatMessage } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      message,
      targetLanguage,
      cefrLevel,
      sessionType,
      history,
      knownWords,
      reviewWords,
      completedTopics,
    }: {
      message: string;
      targetLanguage: Language;
      cefrLevel: CEFRLevel;
      sessionType: SessionType;
      history: ChatMessage[];
      knownWords?: string[];
      reviewWords?: string[];
      completedTopics?: string[];
    } = body;

    if (!message || !targetLanguage || !cefrLevel) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = streamOrchestrator({
            userMessage: message,
            targetLanguage,
            cefrLevel,
            sessionType: sessionType || "conversation",
            history: history || [],
            knownWords,
            reviewWords,
            completedTopics,
          });

          for await (const chunk of generator) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "Agent error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: errorMsg })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
