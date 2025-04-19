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
      //risk per stock 
      // risk :"Evaluate the positive and negative risk of each stock in this portfolio",
      risk: "I have a list of stocks, each with the fields: name, ticker, and sector. Please: 1-Assign a risk level to each stock: Low, Medium, or High, based on general market perception and sector volatility. 2-Format the result as an array of objects with fields: name, ticker, sector, and risk. 3-After categorizing the stocks, analyze the portfolio and tell me: Whether my stock risk distribution is balanced. If not, recommend which risk category I should invest more in to achieve better balance. Just provide me with the list and the recommendation text in the form of [{},{},...]-text.",
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
