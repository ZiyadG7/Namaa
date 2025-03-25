import { supabase } from "@/lib/supabaseClient";


export const getStockMetrics = async (stockId: number) => {
    const { data, error } = await supabase
      .from("stock_metrics")
      .select("*")
      .eq("stock_id", stockId)
      .single();
  
    if (error) {
      console.error("Error fetching stock metrics:", error);
      return null;
    }
  
    return data;
  };
  