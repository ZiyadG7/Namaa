export interface Stock {
  ticker: string;
  company_name: string;
  share_price: number;
  number_of_stocks: number;
  sector?: string;
}
export interface StockMetric {
    title: string;
    key: string;
    value: number | null;
    sector: number | null;
    market: number | null;
    isPercentage: boolean;
  }

  export interface StockMetricsData {
    stock_id?: string;
    return_on_equity: number;
    return_on_assets: number;
    payout_ratio: number;
    eps: number;
    trailing_annual_dividend_rate: number;
  }

  export interface Financial {
    stock_id: string;
    total_revenue: number;
    total_assets: number;
    cost_of_revenue: number;
    current_assets: number;
    current_liabilities: number;
    inventory: number;
    ebit: number;
    interest_expenses: number;
    other_expenses: number;
  }


  export type StockRisk = {
    name: string;
    ticker: string;
    sector: string;
    risk: "Low" | "Medium" | "High";
  };

  export type Article = {
    uuid: string;
    title: string;
    description: string;
    url: string;
    image_url: string | null;
    published_at: string;
    source: string;
    entities: {
      symbol: string;
      name: string;
      exchange: string;
      exchange_long: string;
      country: string;
      type: string;
      industry: string;
      match_score: number;
      sentiment_score: number;
      highlights: {
        highlight: string;
        sentiment: number;
        highlighted_in: string;
      }[];
    }[];
    snippet: string;
  };

  export interface Company {
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

  export type EarningsRevenueChartProps = {
    revenue: number;
    costOfRevenue: number;
    otherExpenses: number;
  };

  export type MetricBarChartProps = {
    title: string;
    company: number | null;
    sector: number | null;
    market: number | null;
    isPercentage?: boolean;
  };

  export interface MetricCardProps {
    title: string;
    value: string | number | null | undefined;
    suffix?: string;
  }

  export type MetricRadialChartProps = {
    title: string;
    description?: string;
    company: number | null;
    sector: number | null;
    market: number | null;
    isPercentage?: boolean;
  };

  export type MetricToggleBlockProps = {
    title: string;
    keyName: string; // e.g. "roe"
    value: number | null;
    sector: number | null;
    market: number | null;
    isPercentage?: boolean;
    view: "chart" | "card";
    onToggle?: () => void;
  };

  export type MetricSet = {
    title: string;
    key: string;
    value: number | null;
    sector: number | null;
    market: number | null;
    isPercentage?: boolean;
  };