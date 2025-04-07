import { NextResponse } from "next/server";

export async function GET() {
  const apiToken = process.env.MARKETAUX_API_TOKEN;
  const url = `https://api.marketaux.com/v1/news/all?countries=sa&filter_entities=true&api_token=${apiToken}`;
  try {
    const response = await fetch(url);
    const { data } = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
