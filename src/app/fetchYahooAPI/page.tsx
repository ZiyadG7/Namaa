"use client";

import { useEffect, useState } from "react";
import yahooFinance from "yahoo-finance2";

// ✅ Define TypeScript types

type StockInfo = {
  ticker: string;
  companyName: string;
  sector: string;
};

type Price = {
  date: string;
  sharePrice: number;
};

type FinancialData = {
  totalRevenue: number | null;
  netIncome: number | null;
  costOfRevenue: number | null;
  totalAssets: number | null;
  totalDebt: number | null;
  shareholdersEquity: number | null;
  date: string;
};

type Metrics = {
  debtToEquity: number | null;
  returnOnAssets: number | null;
  returnOnEquity: number | null;
  eps: number | null;
  payoutRatio: number | null;
  date: string;
};

type StockData = {
  stockInfo: StockInfo;
  prices: Price[];
  financialData: FinancialData;
  metrics: Metrics;
};

export default function FetchYahooAPI() {
  const [stocks, setStocks] = useState<StockData[]>([]);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const tickers = ["2222.SR", "1120.SR", "8230.SR"];
        const fetchedStocks: StockData[] = [];

        for (const ticker of tickers) {
          const result = await yahooFinance.quoteSummary(ticker, {
            modules: [
              "price",
              "summaryProfile",
              "summaryDetail",
              "financialData",
              "balanceSheetHistory",
              "incomeStatementHistory"
            ],
          });

          // ✅ DEBUG: Log the actual `financialData` response
          console.log(`API response for ${ticker}:`, result);

          // ✅ Handle missing `price` field safely
          const stockInfo: StockInfo = {
            ticker,
            companyName: result?.price?.longName || "Unknown",
            sector: result?.summaryProfile?.sector || "N/A",
          };

          // ✅ Ensure `date` is always a string
          const history = await yahooFinance.historical(ticker, {
            period1: "2023-06-01",
            period2: "2024-06-01",
            interval: "1d"
          });

          const prices: Price[] = history.map((entry) => ({
            date: new Date(entry.date).toISOString().split("T")[0], // Convert to string
            sharePrice: entry?.close ?? 0, // Default to 0 if undefined
          }));

          // ✅ Ensure financial fields exist using optional chaining (`?.`)
          const financials = (result?.incomeStatementHistory?.incomeStatementHistory?.[0] || {}) as any;
          const balanceSheet = (result?.balanceSheetHistory?.balanceSheetStatements?.[0] || {}) as any;

          const financialData: FinancialData = {
            totalRevenue: financials?.totalRevenue ?? null,
            netIncome: financials?.netIncome ?? null,
            costOfRevenue: financials?.costOfRevenue ?? null,
            totalAssets: balanceSheet?.totalAssets ?? null,
            totalDebt: balanceSheet?.totalDebt ?? null,
            shareholdersEquity: balanceSheet?.totalStockholderEquity ?? null,
            date: financials?.endDate ? new Date(financials.endDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          };

          // ✅ FIX: Ensure `financialData` exists before accessing its properties
          const metricsData = (result?.financialData || {}) as any;

          const metrics: Metrics = {
            debtToEquity: metricsData?.debtToEquity ?? null, // ✅ FIXED: Ensure this field exists
            returnOnAssets: metricsData?.returnOnAssets ?? null, // ✅ FIXED
            returnOnEquity: metricsData?.returnOnEquity ?? null, // ✅ FIXED
            eps: metricsData?.trailingEps ?? null, // ✅ FIXED
            payoutRatio: metricsData?.payoutRatio ?? null, // ✅ FIXED
            date: new Date().toISOString().split("T")[0], // Store today's date
          };

          fetchedStocks.push({ stockInfo, prices, financialData, metrics });
        }

        setStocks(fetchedStocks);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    }

    fetchStocks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📈 Saudi Stock Market (Tadawul)</h1>

      {stocks.map((stock) => (
        <div key={stock.stockInfo.ticker} className="border p-4 mb-4">
          <h2 className="text-xl font-semibold">{stock.stockInfo.companyName} ({stock.stockInfo.ticker})</h2>
          <p>Sector: {stock.stockInfo.sector}</p>

          <h3 className="mt-3 font-semibold">📉 Prices (Last 6 Months)</h3>
          <ul>
            {stock.prices.slice(0, 5).map((price) => (
              <li key={price.date}>{price.date}: {price.sharePrice} SAR</li>
            ))}
          </ul>

          <h3 className="mt-3 font-semibold">🏦 Financials</h3>
          <p><strong>Total Revenue:</strong> {stock.financialData.totalRevenue} SAR</p>
          <p><strong>Net Income:</strong> {stock.financialData.netIncome} SAR</p>
          <p><strong>Total Assets:</strong> {stock.financialData.totalAssets} SAR</p>

          <h3 className="mt-3 font-semibold">📊 Metrics</h3>
          <p><strong>Debt-to-Equity:</strong> {stock.metrics.debtToEquity}</p>
          <p><strong>Return on Assets:</strong> {stock.metrics.returnOnAssets}</p>
          <p><strong>EPS (Earnings Per Share):</strong> {stock.metrics.eps}</p>
        </div>
      ))}
    </div>
  );
}
