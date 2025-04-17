import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(){
  try{
    const supabase = await createClient();


    const{
      data: {session},
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError){
      console.error("Session error: ", sessionError);

    }
    const user_id = session?.user?.id;

    const {data: stocks, error} = await supabase
      .from("user_follows")
      .select(
        `
        id,
        user_id,
        stock_id,
        prices:stock_prices(
        price_id,
        share_price,
        ),
        stocks:stocks(
        ticker,
        company_name,
        sector,
        )
        `
      )
      .order('id')
      .limit(1, { foreignTable: "prices" })
      .limit(1, { foreignTable: "stocks" })

    if (error){
      console.error("Supabase error:", error);
      return NextResponse.json(
        {error: "Database error", details: error.message},
        {status: 500}
      )
    }

    if(!stocks || stocks.length ===0){
      return NextResponse.json({error: "No stocks found"})
    }
    return{
      id: user_id,
    };

  }catch(err){
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
  


}



export async function POST(request: Request) {
  try {
    // Parse the JSON payload
    const { stock_id } = await request.json();

    if (!stock_id) {
      return NextResponse.json(
        { error: "stock_id is required" },
        { status: 400 }
      );
    }

    // Create the Supabase client instance (server-side)
    const supabase = await createClient();

    // Retrieve the current session to get the authenticated user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    const user_id = session.user.id;

    // Insert a new follow record into the user_follows table
    const { error } = await supabase
      .from("user_follows")
      .insert({ user_id, stock_id });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Followed successfully" });
  } catch (err) {
    console.error("Unexpected error in followStock:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//GET
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user_id = session.user.id;

    const { data: followedStocks, error } = await supabase
      .from("user_follows")
      .select(
        `
      number_of_stocks,
      stock_id,
      stocks(
        ticker,
        company_name,
        sector,
        stock_prices(share_price, date),
        financials(total_assets, total_debt)
      )
    `
      )
      .eq("user_id", user_id);

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const transformed = followedStocks.map((entry: any) => {
      const stock = entry.stocks;

      const sortedPrices = (stock?.stock_prices || []).sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      const latestPrice = sortedPrices[0] || {};
      const financials = stock?.financials?.[0] || {};

      return {
        ticker: stock.ticker,
        company_name: stock.company_name,
        sector: stock.sector,
        share_price: latestPrice.share_price,
        number_of_stocks: entry.number_of_stocks,
        total_assets: financials.total_assets,
        total_debt: financials.total_debt,
      };
    });

    return NextResponse.json(transformed);
  } catch (err) {
    console.error("Unexpected error in GET followed stocks:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
