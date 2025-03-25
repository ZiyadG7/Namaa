import { supabase } from "@/lib/supabaseClient"; 


export const getStockInfo = async (ticker: string) => {
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .eq("ticker", ticker)
    .single();

  if (error) {
    console.error("Error fetching stock info:", error);
    return null;
  }

  return data;
};
