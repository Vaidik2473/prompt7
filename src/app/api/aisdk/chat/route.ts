// app/api/aisdk/chat/route.ts
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { generateSystemPrompt } from "@/lib/system-prompts";

export const config = {
  runtime: "edge",
};

// Zod schema to ensure we only return a string
const EnhancedPromptSchema = z.object({
  enhancedPrompt: z.string().min(1, "Enhanced prompt cannot be empty"),
});

export async function POST(req: Request) {
  try {
    const { prompt, selectedBadges = [] } = await req.json();

    // Validate input
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: "Prompt is required and must be a non-empty string",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate dynamic system prompt based on selected badges
    const systemPrompt = generateSystemPrompt(selectedBadges);

    const { object } = await generateObject({
      model: google("gemini-2.5-flash-preview-04-17"),
      temperature: 1.1,
      prompt: `Original prompt to enhance: "${prompt}"`,
      schema: EnhancedPromptSchema,
      system: systemPrompt,
    });

    // Validate the response using Zod
    const validatedResponse = EnhancedPromptSchema.parse(object);

    // Return only the enhanced prompt string
    return new Response(JSON.stringify(validatedResponse.enhancedPrompt), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid response format",
          details: error.errors,
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle other errors
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
