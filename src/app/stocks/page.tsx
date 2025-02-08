"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../Components/Loading";

interface Company {
  id: string;
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

  const generateMockData = (): Company[] => {
    return [
      {
        id: "AAPL",
        name: "Apple Inc.",
        marketCap: "$2.8T",
        balance: "$123B",
        price: "$185.92",
        change30D: "+5.2%",
        change1Y: "+22.1%",
        changeToday: "-0.5%",
        category: "followed",
      },
      {
        id: "GOOGL",
        name: "Alphabet Inc.",
        marketCap: "$1.6T",
        balance: "$89B",
        price: "$135.45",
        change30D: "+3.1%",
        change1Y: "+18.4%",
        changeToday: "+1.2%",
        category: "followed",
      },
      {
        id: "MSFT",
        name: "Microsoft Corporation",
        marketCap: "$2.3T",
        balance: "$104B",
        price: "$310.65",
        change30D: "+2.8%",
        change1Y: "+25.7%",
        changeToday: "-0.3%",
        category: "notFollowed",
      },
    ];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const mockData = generateMockData();
        setFollowed(mockData.filter((stock) => stock.category === "followed"));
        setNotFollowed(
          mockData.filter((stock) => stock.category === "notFollowed")
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load mock data");
        setLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRowClick = (companyId: string) => {
    router.push(`/stocks/${companyId}`);
  };

  const renderTable = (stocks: Company[], title: string) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        {title}
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-00">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">Name</th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">Market Cap</th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">Balance</th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">Price</th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">30D</th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">1Y</th>
              <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300">Today</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {stocks.map((company) => (
              <tr
                key={company.id}
                onClick={() => handleRowClick(company.id)}
                className="hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{company.name}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{company.marketCap}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{company.balance}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{company.price}</td>
                <td className={`px-6 py-4 ${company.change30D.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{company.change30D}</td>
                <td className={`px-6 py-4 ${company.change1Y.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{company.change1Y}</td>
                <td className={`px-6 py-4 ${company.changeToday.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{company.changeToday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-center text-red-500 dark:text-red-400">{error}</div>;

  return (
    <div className="p-4 bg-slate-100 dark:bg-gray-900 min-h-screen">
      {renderTable(followed, "Followed Stocks")}
      {renderTable(notFollowed, "Stocks")}
    </div>
  );
}
