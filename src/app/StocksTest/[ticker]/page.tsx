"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStockInfo } from "@/lib/data/getStockInfo";
import { getStockMetrics } from "@/lib/data/getStockMetrics";
import { getFinancials } from "@/lib/data/getFinancials";
import { getStockPrices } from "@/lib/data/getStockPrices";

const StockPage = () => {
  const { ticker } = useParams();

  const [stock, setStock] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [prices, setPrices] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!ticker || typeof ticker !== "string") return;

      const stockInfo = await getStockInfo(ticker);
      if (!stockInfo) return;

      const stockId = stockInfo.stock_id;
      const [metrics, financials, prices] = await Promise.all([
        getStockMetrics(stockId),
        getFinancials(stockId),
        getStockPrices(stockId, 10),
      ]);
      console.log("🔍 Prices:", prices); // <--- Add this line


      setStock(stockInfo);
      setMetrics(metrics);
      setFinancials(financials);
      setPrices(prices || []);
    };

    fetchData();
  }, [ticker]);

  if (!stock) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{stock.company_name}</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">📈 Latest Price</h2>
      <p>{prices?.at(-1)?.share_price} SAR</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">💹 Metrics</h2>
      <p>EPS: {metrics?.eps}</p>
      <p>ROE: {metrics?.return_on_equity}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">📊 Financials</h2>
      <p>Total Revenue: {financials?.total_revenue}</p>
      <p>Net Income: {financials?.net_income}</p>
    </div>
  );
};

export default StockPage;





























































// import { getStockInfo } from "@/lib/data/getStockInfo";
// import { getStockMetrics } from "@/lib/data/getStockMetrics";
// import { getFinancials } from "@/lib/data/getFinancials";
// import { getStockPrices } from "@/lib/data/getStockPrices";

// type Props = {
//   params: {
//     ticker: string;
//   };
// };

// const StockPage = async ({ params }: Props) => {
//   const stock = await getStockInfo(params.ticker);
//   if (!stock) return <p>Not found</p>;

//   const stockId = stock.stock_id;
//   const priceLimit = 10; // <-- Set your desired limit here

//   const [metrics, financials, prices] = await Promise.all([
//     getStockMetrics(stockId),
//     getFinancials(stockId),
//     getStockPrices(stockId, priceLimit), // <-- Pass the limit here
//   ]);

//   return (
//     <div className="p-4">
//       <h1>{stock.company_name}</h1>

//       <h2>📈 Latest Price</h2>
//       <p>{prices?.at(-1)?.share_price} SAR</p>

//       <h2>💹 Metrics</h2>
//       <p>EPS: {metrics?.eps}</p>
//       <p>ROE: {metrics?.return_on_equity}</p>

//       <h2>📊 Financials</h2>
//       <p>Total Revenue: {financials?.total_revenue}</p>
//       <p>Net Income: {financials?.net_income}</p>
//     </div>
//   );
// };

// export default StockPage;
