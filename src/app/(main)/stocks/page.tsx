// app/stocks/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Loading from "../Components/Loading";

interface Company {
  id: number;
  ticker: string;
  name: string;
  marketCap: string;
  balance: string;
  price: string;
  change30D: string;
  change1Y: string;
  changeToday: string;
  category: "followed" | "notFollowed";
}

export default function CompaniesPage() {
  const router = useRouter();
  const [followed, setFollowed] = useState<Company[]>([]);
  const [notFollowed, setNotFollowed] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stocks data on mount
  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const response = await fetch("/api/fetchStocks");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const stocksData = await response.json();

        // Map and calculate additional data for each stock
        const companies: Company[] = stocksData.map((stock: any) => {
          const latestPrice = stock.latest_price || {
            share_price: 0,
            market_cap: 0,
          };
          const financials = stock.latest_financial || {
            total_assets: 0,
            total_debt: 0,
          };

          // Calculate changes over different periods
          const change30D = calculatePriceChange(stock.prices, 30);
          const change1Y = calculatePriceChange(stock.prices, 365);
          const changeToday = calculatePriceChange(stock.prices, 1);

          return {
            id: stock.stock_id,
            ticker: stock.ticker,
            name: stock.company_name,
            marketCap: formatCurrency(latestPrice.market_cap),
            balance: formatCurrency(
              financials.total_assets - financials.total_debt
            ),
            price: formatCurrency(latestPrice.share_price),
            change30D,
            change1Y,
            changeToday,
            // Assumes your API returns an `is_followed` flag for each stock.
            category: stock.is_followed ? "followed" : "notFollowed",
          };
        });

        setFollowed(
          companies.filter((c: Company) => c.category === "followed")
        );
        setNotFollowed(
          companies.filter((c: Company) => c.category === "notFollowed")
        );
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load stock data");
        setLoading(false);
      }
    };

    fetchStocksData();
  }, []);

  // Helper function to calculate price change over N days
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

  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Redirect to the company details page
  const handleRowClick = (companyId: number) => {
    router.push(`/analysis/${companyId}`);
  };

  // Toggle follow/unfollow state by calling respective API routes.
  const handleFollowToggle = async (company: Company) => {
    try {
      if (company.category === "followed") {
        // Unfollow action
        const response = await fetch("/api/unfollowStock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock_id: company.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to unfollow");
        }

        // Update local state: remove from followed list and add to notFollowed.
        setFollowed((prev) => prev.filter((c) => c.id !== company.id));
        setNotFollowed((prev) => [
          ...prev,
          { ...company, category: "notFollowed" },
        ]);
      } else {
        // Follow action
        const response = await fetch("/api/followStock", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock_id: company.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to follow");
        }

        // Update local state: remove from notFollowed and add to followed.
        setNotFollowed((prev) => prev.filter((c) => c.id !== company.id));
        setFollowed((prev) => [...prev, { ...company, category: "followed" }]);
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  // Render a table for a given stocks list with an Action button.
  const renderTable = (stocks: Company[], title: string) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        {title}
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                Name
              </th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                Market Cap
              </th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                Price
              </th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                30D
              </th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                1Y
              </th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                Today
              </th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {stocks.map((company) => (
              <tr
                key={company.id}
                onClick={() => handleRowClick(company.id)}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">
                  {company.name}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">
                  {company.marketCap}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">
                  {company.balance}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">
                  {company.price}
                </td>
                <td
                  className={`px-6 py-4 ${
                    company.change30D.startsWith("+")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {company.change30D}
                </td>
                <td
                  className={`px-6 py-4 ${
                    company.change1Y.startsWith("+")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {company.change1Y}
                </td>
                <td
                  className={`px-6 py-4 ${
                    company.changeToday.startsWith("+")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {company.changeToday}
                </td>
                <td className="px-6 py-4">
                  {/* Prevent the row click by stopping propagation */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(company);
                    }}
                    className="text-2xl transition-colors"
                  >
                    {company.category === "followed" ? (
                      <FaHeart className="text-red-500 hover:text-red-600" />
                    ) : (
                      <FaRegHeart className="text-gray-400 hover:text-pink-500" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="p-4 text-center text-red-500 dark:text-red-400">
        {error}
      </div>
    );

  return (
    <div className="p-4 bg-slate-100 dark:bg-gray-900 min-h-screen">
      {renderTable(followed, "Followed Stocks")}
      {renderTable(notFollowed, "Stocks")}
    </div>
  );
}
