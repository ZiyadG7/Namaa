"use client";
import { useEffect, useState } from "react";
import Loading from "./Components/Loading";
import StockTable from "./Components/StockTable";


export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedStocks = async () => {
      try {
        const res = await fetch("/api/followStock");
        const data = await res.json();
        if (res.ok) setPortfolio(data);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedStocks();
  }, []);

  const handleUpdateStockCount = async (
    ticker: string,
    newCount: number
  ) => {
    try {
      const res = await fetch("/api/updateStockCount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, number_of_stocks: newCount }),
      });

      const data = await res.json();
      if (!res.ok) console.error("Update failed:", data.error);
    } catch (err) {
      console.error("Error updating stock count:", err);
    }
  };

  return (
    <div className="p-8 bg-slate-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        Dashboard
      </h2>

      {loading ? (
        <Loading />
      ) : (
        <StockTable stocks={portfolio} onUpdate={handleUpdateStockCount} />
      )}
    </div>
  );
}

