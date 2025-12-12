import { stepCountIs, streamText } from "ai";
import { getSystemPrompt } from "@/lib/prompts";
import { getUserContext } from "@/services/context.service";
import { createTools } from "@/lib/tools";
import { UserService } from "@/services/user.service";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    // Get or create user from Clerk
    const user = await UserService.getOrCreateUser();

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    // Use internal user ID for all database operations
    const context = await getUserContext(user.id);

    // Get current date/time for the prompt
    const currentDateTime = new Date();

    const systemPrompt = getSystemPrompt({
      context,
      userName: user.name,
      currentDateTime,
    });

    const tools = createTools(user.id);

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages,
      tools,
      stopWhen: stepCountIs(20),
      maxOutputTokens: 24000,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return new Response("Unauthorized", { status: 401 });
    }

    return new Response(
      `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}
