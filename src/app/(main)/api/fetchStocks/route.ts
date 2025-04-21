import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

let cachedSupabaseData: any = null;
let cachedSheetData: any = null;
let lastSupabaseFetched = 0;
let lastSheetFetch = 0;
const SUPABASE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const SHEET_CACHE_DURATION = 60 * 1000; // 60 seconds

let cachedResponse: any = null;
let lastResponseFetch = 0;
const RESPONSE_CACHE_DURATION = 60 * 1000; // Cache the full response for 1 minute

export async function GET() {
  const now = Date.now();
  const supabase = await createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError) {
    console.error("Session error:", sessionError);
    // Proceed without a user id if desired, but note no follows will be marked
  }
  const user_id = session?.user?.id;

  const fetchSupabaseData = async () => {

  // Serve from cache if within cache duration
  if (cachedSupabaseData && now - lastSupabaseFetched < SUPABASE_CACHE_DURATION) {
    return { source: 'cache', data: cachedSupabaseData };
  }

    // Get the current session to determine the user id

    // Fetch stocks including the join to user_follows using the foreign table name (ensure the relationship exists)
    const { data, error } = await supabase
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

    if (error) throw new Error(error.message);

    cachedSupabaseData = data;
    lastSupabaseFetched = now;
    return { source: 'fresh', data: data ?? [] };
  }

  const fetchGoogleSheetData = async () => {
    if (cachedSheetData && now - lastSheetFetch < SHEET_CACHE_DURATION) {
      return cachedSheetData;
    }
    const res = await fetch(`${process.env.SITE_URL}/api/fetchCurrentPrices`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!res.ok) throw new Error('Google Sheets fetch failed');

    const sheetData = await res.json();

    cachedSheetData = sheetData;
    lastSheetFetch = now;

    return sheetData;
  };

  if (cachedResponse && now - lastResponseFetch < RESPONSE_CACHE_DURATION) {
    return NextResponse.json(cachedResponse.data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120', // Cache for 60 seconds and allow stale content for 120 seconds
      },
    });
  }

  try {
    // Fetch both in parallel
    const [supabaseData, googleSheetData] = await Promise.all([
      fetchSupabaseData(),
      fetchGoogleSheetData(),
    ]);


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
    const transformedStocks = supabaseData.data.map((stock:any) => {
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
          latest_price: googleSheetData[stock.ticker],
          latest_financial: latestFinancial,
          latest_metric: latestMetric,
          is_followed, // This flag indicates if the current user follows the stock
        };
      });

      cachedResponse = {
        source: 'fresh',
        data: transformedStocks,
      };
      lastResponseFetch = now;
  
      return NextResponse.json(cachedResponse.data, {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        },
      });
    } catch (err: any) {
      return NextResponse.json({ error: 'Failed to load data', details: err.message }, { status: 500 });
    }
}
