import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";


export async function POST(request) {
  const body = await request.formData();
  const date = body.get("date");

  const response = await fetch("https://script.google.com/macros/s/AKfycbzzXb_RflEnbLFKe7S0HDtkf7PD7z8XgXrDpyfNlLb5VJFKv78xJ4t1Rq70pe8BqpmU_Q/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ date }),
  });

  const data = await response.json();
  const priceDict = Object.fromEntries(data.map(p => [p.ticker, { price: p.price }]));

  // Return the formatted data
  return new Response(JSON.stringify(priceDict), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // return Response.json(data);
}


export async function GET() {
    let { data: stocks, error } = await supabase.from("stocks").select("stock_id, ticker");
    
        if (error || !stocks) {
          console.error("❌ Error fetching tickers:", error);
          return NextResponse.json({ message: "Error fetching tickers" }, { status: 500 });
        }
    
    console.log(`📌 Found ${stocks.length} tickers`);
    let errorCount = 0; // Counter for errors

    const currentDate = new Date();
    let date = new Date('2025-03-08T12:00:00');
    currentDate.setDate(currentDate.getDate() - 8);

    // console.log(currentDate)

    while (date < currentDate) {
        const res = await fetch(`${process.env.SITE_URL}/api/updateHistoricalPrices`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ date: `=DATE(${date.getFullYear()}, ${date.getMonth()+1}, ${date.getDay()})` }),
        });
            
        const prices = await res.json();
        // console.log("Prices:", prices);
    
        for (const stock of stocks) {
            const { stock_id, ticker } = stock;
    
            await supabase.from("stock_prices").insert([
                {
                    stock_id: stock_id,
                    share_price: prices[ticker].price ?? "N/A",
                    date: date,
                },
            ]);
            
      
            console.log(`✅ Inserted stock prices for ${ticker} date ${date}`);
        }    
        date.setDate(date.getDate() + 1)
    }

}