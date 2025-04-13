import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { action, portfolio, customPrompt } = await req.json();

    const actionPrompts: Record<string, string> = {
      summarize: "Summarize the following investment portfolio:",
      evaluate: "Evaluate the strengths and weaknesses of this portfolio:",
      suggest: "Provide suggestions to improve this portfolio:",
      
    };

    const prompt =
      customPrompt || actionPrompts[action] || "Analyze this portfolio:";

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a financial advisor assistant.",
      },
      {
        role: "user",
        content: `${prompt}\n\nPortfolio data:\n${JSON.stringify(
          portfolio,
          null,
          2
        )}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const reply = completion.choices[0].message?.content ?? "No reply.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[Chatbot Error]", err);
    return NextResponse.json(
      { error: "Something went wrong while talking to the assistant." },
      { status: 500 }
    );
  }
}
