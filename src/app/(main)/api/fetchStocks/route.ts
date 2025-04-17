import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get the current session to determine the user id
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Session error:", sessionError);
      // Proceed without a user id if desired, but note no follows will be marked
    }
    const user_id = session?.user?.id;

    // Fetch stocks including the join to user_follows using the foreign table name (ensure the relationship exists)
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
        ),
        user_follows ( user_id )
      `
      )
      .order("date", { ascending: false, referencedTable: "stock_prices" })
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

    const res = await fetch(`${process.env.SITE_URL}/api/fetchCurrentPrices`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
      
  const latestPrices = await res.json();

  // Calculate the date one year/month ago
  let oneYearAgoDate = new Date();
  let oneMonthAgoDate = new Date();
  oneYearAgoDate.setFullYear(oneYearAgoDate.getFullYear() - 1); 
  oneYearAgoDate.setDate(1);
  oneMonthAgoDate.setMonth(oneMonthAgoDate.getMonth() - 1)

  const oneYearAgoPrices = await supabase
      .from("stock_prices")
      .select("stock_id, share_price")
      .eq("date", oneYearAgoDate.toISOString().split("T")[0]);

  const oneMonthAgoPrices = await supabase
      .from("stock_prices")
      .select("stock_id, share_price")
      .eq("date", oneMonthAgoDate.toISOString().split("T")[0]);

  // Transform the data for the frontend
  const transformedStocks = stocks.map((stock) => {
    const latestFinancial = stock.financials?.[0];
    const latestMetric = stock.metrics?.[0];

      const oneYearAgoPrice =
        oneYearAgoPrices.data?.find((p) => p.stock_id === stock.stock_id)?.share_price || null;
        
    const oneMonthAgoPrice =
        oneMonthAgoPrices.data?.find((p) => p.stock_id == stock.stock_id)?.share_price || null;


      // Determine if this stock is followed by the current user
      let is_followed = false;
      if (
        user_id &&
        Array.isArray(stock.user_follows) &&
        stock.user_follows.length > 0
      ) {
        is_followed = stock.user_follows.some(
          (follow: any) => follow.user_id === user_id
        );
      }

      return {
        stock_id: stock.stock_id,
        ticker: stock.ticker,
        company_name: stock.company_name,
        company_name_arabic: stock.company_name_arabic,
        sector: stock.sector,
        sector_arabic: stock.sector_arabic,
        shares_outstanding: stock.shares_outstanding,
        oneYearAgoPrice: oneYearAgoPrice,
        oneMonthAgoPrice: oneMonthAgoPrice,
        latest_price: latestPrices[stock.ticker],
        latest_financial: latestFinancial,
        latest_metric: latestMetric,
        is_followed, // This flag indicates if the current user follows the stock
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
