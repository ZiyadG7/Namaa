import { supabase } from "@/lib/supabaseClient";

export const getAllStocks = async () => {
  const { data, error } = await supabase
    .from("stocks")
    .select("stock_id, ticker, company_name, sector");

  if (error) {
    console.error("❌ Error fetching all stocks:", error.message || error.details || error);
    return [];
  }

  return data;
};
