import { supabase } from "@/lib/supabaseClient";

export const getStockPrices = async (stockId: number, limit?: number) => {
  let query = supabase
    .from("stock_prices")
    .select("*")
    .eq("stock_id", stockId)
    .order("date", { ascending: true }); // or false for latest-first

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching stock prices:", error);
    return null;
  }

  return data;
};
