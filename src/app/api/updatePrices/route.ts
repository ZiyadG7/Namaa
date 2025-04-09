import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
    let { data: stocks, error } = await supabase.from("stocks").select("stock_id, ticker");
    
        if (error || !stocks) {
          console.error("❌ Error fetching tickers:", error);
          return NextResponse.json({ message: "Error fetching tickers" }, { status: 500 });
        }
    
    console.log(`📌 Found ${stocks.length} tickers`);
    let errorCount = 0; // Counter for errors

    const currentDate = new Date();
    let date = new Date('2025-04-01T12:00:00');
    console.log(currentDate)
    while (date < currentDate) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/fetchGoogleSheet/historicalPrices`, {
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