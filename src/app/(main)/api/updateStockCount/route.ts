import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { ticker, number_of_stocks } = await req.json();

    if (!ticker || number_of_stocks === undefined) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user_id = session.user.id;

    const { data: stock, error: stockError } = await supabase
      .from("stocks")
      .select("stock_id")
      .eq("ticker", ticker)
      .single();

    if (stockError || !stock) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("user_follows")
      .update({ number_of_stocks })
      .eq("user_id", user_id)
      .eq("stock_id", stock.stock_id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ message: "Stock count updated" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
