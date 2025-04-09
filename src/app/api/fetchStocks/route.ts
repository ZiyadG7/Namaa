import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

async function getStockPriceByDate(date: Date) {
    const { data } = await supabase
        .from("stock_prices")
        .select("stock_id, share_price")
        .eq("date", date.toISOString().split("T")[0]) 

    console.log(date.toISOString().split("T")[0])
    return data;
}

export async function GET() {
  try {
    const { data: stocks, error } = await supabase
      .from("stocks")
      .select(
        `
        stock_id,
        ticker,
        company_name,
        sector,
        shares_outstanding,
        company_name_arabic,
        sector_arabic,
        financials:financials(
          financial_id,
          total_assets,
          total_debt,
          shareholders_equity,
          date
        )
      `
      )
      .limit(1, { foreignTable: "financials" })

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      );
    }

    if (!stocks || stocks.length === 0) {
      return NextResponse.json({ error: "No stocks found" }, { status: 404 });
    }

    const res = await fetch(`${process.env.SITE_URL}/api/fetchCurrentPrices`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
        
    const latestPrices = await res.json();

    // Calculate the date one year/month ago
    let oneYearAgoDate = new Date();
    let oneMonthAgoDate = new Date();
    oneYearAgoDate.setFullYear(oneYearAgoDate.getFullYear() - 1); 
    oneMonthAgoDate.setMonth(oneMonthAgoDate.getMonth() - 1)

    const oneYearAgoPrices = await getStockPriceByDate(oneYearAgoDate)
    const oneMonthAgoPrices  = await getStockPriceByDate(oneMonthAgoDate)

    // Transform the data for the frontend
    const transformedStocks = stocks.map((stock) => {
      const latestFinancial = stock.financials?.[0];

      const oneYearAgoPrice =
        oneYearAgoPrices?.find((p) => p.stock_id === stock.stock_id)?.share_price || null;
        
    const oneMonthAgoPrice =
        oneMonthAgoPrices?.find((p) => p.stock_id == stock.stock_id)?.share_price || null;

      return {
        stock_id: stock.stock_id,
        ticker: stock.ticker,
        company_name: stock.company_name,
        company_name_arabic: stock.company_name_arabic,
        sector: stock.sector,
        sector_arabic: stock.sector_arabic,
        oneYearAgoPrice: oneYearAgoPrice,
        oneMonthAgoPrice: oneMonthAgoPrice,
        latest_prices: latestPrices[stock.ticker],
        latest_financial: latestFinancial,
      };
    });

    return NextResponse.json(transformedStocks);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
