import { supabase } from "@/lib/supabaseClient";

export const getAllMetrics = async () => {
  const { data, error } = await supabase
    .from("stock_metrics")
    .select("stock_id, return_on_equity, return_on_assets, debt_to_equity");

  if (error) {
    console.error("❌ Error fetching all metrics:", error.message || error.details || error);
    return [];
  }

  return data;
};
