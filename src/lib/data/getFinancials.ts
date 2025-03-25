import { supabase } from "@/lib/supabaseClient";

export const getFinancials = async (stockId: number) => {
    const { data, error } = await supabase
      .from("financials")
      .select("*")
      .eq("stock_id", stockId)
      .single();
  
    if (error) {
      console.error("Error fetching financials:", error);
      return null;
    }
  
    return data;
  };
  