"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Stock {
  ticker: string;
  company_name: string;
  share_price: number;
  number_of_stocks: number;
  sector?: string;
}

interface StockTableProps {
  stocks: Stock[];
  onUpdate: (ticker: string, newCount: number) => Promise<void>;
}

export default function StockTable({ stocks, onUpdate }: StockTableProps) {
  const [localStocks, setLocalStocks] = useState(stocks);

  const handleChange = (ticker: string, value: number) => {
    setLocalStocks((prev) =>
      prev.map((stock) =>
        stock.ticker === ticker ? { ...stock, number_of_stocks: value } : stock
      )
    );
  };

  return (
    <div className="max-w-xl overflow-x-auto shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        Stocks Table
      </h2>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2">Company</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2"># of Stocks</th>
          </tr>
        </thead>
        <tbody>
          {localStocks.map((item, index) => (
            <tr
              key={index}
              className="text-center border-t dark:border-gray-600"
            >
              <td className="px-4 py-2">{item.company_name}</td>
              <td className="px-4 py-2">${item.share_price}</td>
              <td className="px-4 py-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdate(item.ticker, item.number_of_stocks);
                  }}
                  className="flex items-center gap-2 justify-center"
                >
                  <input
                    type="number"
                    min={0}
                    value={item.number_of_stocks}
                    onChange={(e) =>
                      handleChange(item.ticker, parseInt(e.target.value) || 0)
                    }
                    className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-center"
                  />
                  <Button type="submit" className="hover:underline text-sm">
                    Save
                  </Button>
                </form>
              </td>
            </tr>
          ))}
          {localStocks.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-gray-500">
                You haven't followed any stocks yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
