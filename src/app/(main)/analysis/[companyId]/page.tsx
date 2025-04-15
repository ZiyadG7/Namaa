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
          <div>
            Market Cap: {prices?.[prices.length - 1]?.market_cap ?? "N/A"}
          </div>
          <div>
            Shares Outstanding: {company.shares_outstanding.toLocaleString()}
          </div>
          <div>
            Price: $
            {prices?.[prices.length - 1]?.share_price.toFixed(2) ?? "N/A"}
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      {metrics && (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Earnings Per Share (EPS)" value={metrics.eps} />
          <MetricCard title="(P/E) Ratio" value={metrics.return_on_equity} />
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

      {/* Price Chart Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Piechart (Coming Soon)</h2>
          <div className="text-sm text-gray-400">
            Visualization will be added here.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">
            Scatter polt (Coming Soon)
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
