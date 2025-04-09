import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

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
        prices:stock_prices(
          price_id,
          share_price,
          market_cap,
          date
        ),
        financials:financials(
          financial_id,
          total_assets,
          total_debt,
          shareholders_equity,
          date
        ),
        metrics:stock_metrics(
          metric_id,
          return_on_equity,
          eps,
          date
        )
      `
      )
      .limit(1, { foreignTable: "prices" })
      .limit(1, { foreignTable: "financials" })
      .limit(1, { foreignTable: "metrics" });

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

    // Fetch historical price data for change calculations
    const { data: historicalPrices } = await supabase
      .from("stock_price")
      .select("stock_id, share_price, date")
      .order("date", { ascending: false })
      .limit(365); // Get 1 year of data for calculations

    // Transform the data for the frontend
    const transformedStocks = stocks.map((stock) => {
      const latestPrice = stock.prices?.[0];
      const latestFinancial = stock.financials?.[0];
      const latestMetric = stock.metrics?.[0];

      // Get all prices for this stock
      const stockPrices =
        historicalPrices?.filter((p) => p.stock_id === stock.stock_id) || [];

      return {
        stock_id: stock.stock_id,
        ticker: stock.ticker,
        company_name: stock.company_name,
        company_name_arabic: stock.company_name_arabic,
        sector: stock.sector,
        sector_arabic: stock.sector_arabic,
        prices: stockPrices,
        latest_price: latestPrice,
        latest_financial: latestFinancial,
        latest_metric: latestMetric,
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
