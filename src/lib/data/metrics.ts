// ─────────────────────────────────────────────────────
// 1. Market Cap
// ─────────────────────────────────────────────────────

export function calculateMarketCap(sharePrice: number, totalSharesOutstanding: number): number {
    return sharePrice * totalSharesOutstanding;
  }
  
  // ─────────────────────────────────────────────────────
  // 2. Revenue & Earnings
  // ─────────────────────────────────────────────────────
  
  export function calculateRevenueAndEarnings(
    totalRevenue: number,
    costOfRevenue: number,
    otherExpenses: number
  ): [grossProfit: number, netIncome: number] {
    const grossProfit = totalRevenue - costOfRevenue;
    const netIncome = grossProfit - otherExpenses;
  
    return [grossProfit, netIncome];
  }
  
  // ─────────────────────────────────────────────────────
  // 3. EPS – Earnings Per Share
  // ─────────────────────────────────────────────────────
  
  export function calculateEPS(netIncome: number, totalSharesOutstanding: number): number {
    return netIncome / totalSharesOutstanding;
  }
  
  // ─────────────────────────────────────────────────────
  // 4. Margins – Gross and Net
  // ─────────────────────────────────────────────────────
  
  export function calculateMargins(
    totalRevenue: number,
    grossProfit?: number,
    netIncome?: number
  ): [grossMargin?: number, netProfitMargin?: number] {
    let grossMargin: number | undefined;
    let netProfitMargin: number | undefined;
  
    if (grossProfit !== undefined) {
      grossMargin = (grossProfit / totalRevenue) * 100;
    }
  
    if (netIncome !== undefined) {
      netProfitMargin = (netIncome / totalRevenue) * 100;
    }
  
    return [grossMargin, netProfitMargin];
  }

// ─────────────────────────────────────────────────────
// 5. Price-to-Earnings (P/E) Ratio
// ─────────────────────────────────────────────────────
export function calculatePE(sharePrice: number, eps: number): number {
    return eps !== 0 ? sharePrice / eps : 0;
  }
  
  // ─────────────────────────────────────────────────────
  // 6. Return on Assets (ROA)
  // ─────────────────────────────────────────────────────
  export function calculateROA(netIncome: number, totalAssets: number): number {
    return (netIncome / totalAssets) * 100;
  }
  
  // ─────────────────────────────────────────────────────
  // 7. Debt-to-Equity Ratio (D/E)
  // ─────────────────────────────────────────────────────
  export function calculateDebtToEquity(totalDebt: number, equity: number): number {
    return equity !== 0 ? totalDebt / equity : 0;
  }
  
  // ─────────────────────────────────────────────────────
  // 8. Dividend Yield (%)
  // ─────────────────────────────────────────────────────
  export function calculateDividendYield(dividendPerShare: number, sharePrice: number): number {
    return (dividendPerShare / sharePrice) * 100;
  }
  