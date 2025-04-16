
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../(main)/Components/Loading";


interface Company {
  id: number;
  ticker: string;
  name: string;
  count: number;
  price: string;
  changeToday: string;
}

export default function Home() {
  
  const router = useRouter();
  const [followed, setFollowed] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetech follow stocks data
  useEffect(() =>{
    const fetchfollowStock = async () =>{
      try {
      
        const response = await fetch("/api/followStock",{
          method: "POST", 
        });
        if (!response.ok){
          console.log(response.body)
          throw new Error(`HTTP error! status: ${response.status}`)
        } 

        const followStockData = await response.json(); 


        const companies: Company[] = followStockData.map((stock: any)=>{
          const latestPrice = stock.latest_price || {
            share_price: 0,
            market_cap:0,
          };
          

          const changeToday = calculatePriceChange(stock.prices, 1);

          return{
            id: stock.stock_id,
            ticker: stock.ticker,
            name: stock.company_name,
            price: formatCurrency(latestPrice.share_price),
            changeToday,
          };
        });
        setLoading(false);
      } catch(error){
        console.error("Fetch error:", error);
        setError("Failed to load stock data");
        setLoading(false)
      }
    };
    fetchfollowStock();
  },[]);

  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };



  const calculatePriceChange = (prices: any[], days: number): string => {
    if (!prices || prices.length < 2) return "0%";

    const latestPrice = prices[0]?.share_price;
    if (!latestPrice) return "0%";

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - days);

    // Find the first price entry older than or equal to the target date
    const historicalPrice = prices.find((p: any) => {
      const priceDate = new Date(p.date);
      return priceDate <= targetDate;
    })?.share_price;

    if (!historicalPrice) return "0%";

    const change = ((latestPrice - historicalPrice) / historicalPrice) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  const handleRowClick = (companyId: number) => {
    router.push(`/analysis/${companyId}`);
  };

  const renderTable = (stocks: Company[]) =>(
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        My portfolio  
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
            <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                Name
            </th>
            <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                Price
            </th>
            <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                Count
            </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {stocks.map((company)=>(
              <tr
              key={company.id}
              onClick={() => handleRowClick(company.id)}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">
                  {company.name}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">
                  {company.price}
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <Loading/>;
  if (error)
    return(
      <div className="p-4 text-center text-red-500 dark:text-red-400">
      {error}
    </div>
  );

  return (
    <div className="p-4 bg-slate-100 dark:bg-gray-900 min-h-screen">
      {renderTable(followed)}
    </div>
  );
}
