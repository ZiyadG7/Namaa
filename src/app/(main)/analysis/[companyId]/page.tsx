import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import MetricCard from "../../Components/MetricCard";

const Page = async ({ params }: { params: { companyId: string } }) => {
  const supabase = createServerComponentClient({ cookies });
  const { companyId } = params;

  // Fetch stock data
  const { data: company, error: stockError } = await supabase
    .from("stocks")
    .select("*")
    .eq("stock_id", companyId)
    .single();

  // Fetch latest stock metrics
  const { data: metrics, error: metricError } = await supabase
    .from("stock_metrics")
    .select("*")
    .eq("stock_id", companyId)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  // Fetch recent prices for charting
  const { data: prices, error: priceError } = await supabase
    .from("stock_prices")
    .select("*")
    .eq("stock_id", companyId)
    .order("date", { ascending: false })
    .limit(7);

  if (stockError || !company) {
    return (
      <div className="text-red-500 p-6">
        Failed to fetch data for company ID: {companyId}
      </div>
    );
  }

  const latestPrice = prices?.[0]?.share_price || 0;
  const sharesOutstanding = Number(company.shares_outstanding) || 0;
  const marketCap = latestPrice * sharesOutstanding;

  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `SAR ${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `SAR ${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `SAR ${(value / 1e6).toFixed(1)}M`;
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Company Overview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
            {company.ticker?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{company.company_name}</h1>
            <p className="text-sm text-gray-400">Ticker: {company.ticker}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <div>Sector: {company.sector}</div>
          <div>Market Cap: {formatCurrency(marketCap)}</div>
          <div>
            Shares Outstanding:{" "}
            {sharesOutstanding
              ? sharesOutstanding.toLocaleString()
              : "N/A"}
          </div>
          <div>
            Price:{" "}
            {latestPrice ? `${latestPrice.toFixed(2)} SAR` : "N/A"}
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      {metrics && (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Earnings Per Share (EPS)" value={metrics.eps} />
          <MetricCard
            title="(P/E) Ratio"
            value={
              metrics.eps && metrics.eps > 0
                ? (latestPrice / metrics.eps).toFixed(1)
                : "N/A"
            }
          />
          <MetricCard
            title="Dividend Yield"
            value={metrics.trailing_annual_dividend_rate}
          />
          <MetricCard
            title="Return on Equity"
            value={metrics.return_on_equity}
          />
        </div>
      )}

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Piechart (Coming Soon)</h2>
          <div className="text-sm text-gray-400">
            Visualization will be added here.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            Scatter plot (Coming Soon)
          </h2>
          <div className="text-sm text-gray-400">
            Visualization will be added here.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            Bar Chart (Coming Soon)
          </h2>
          <div className="text-sm text-gray-400">
            Visualization will be added here.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Heatmap (Coming Soon)</h2>
          <div className="text-sm text-gray-400">
            Visualization will be added here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
