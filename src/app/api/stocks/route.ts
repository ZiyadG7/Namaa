import yahooFinance from "yahoo-finance2";

const fetchStockData = async (ticker: string) => {
  try {
    // ✅ Fetch real-time stock data
    const stockData = await yahooFinance.quoteSummary(ticker, {
      modules: [
        "price",
        "summaryDetail",
        "financialData",
        "defaultKeyStatistics",
        "incomeStatementHistory",
        "balanceSheetHistory",
        "cashflowStatementHistory",
        "summaryProfile",
      ],
    });

    // ✅ Fetch historical prices for the last 2 days
    const chartData = await yahooFinance.chart(ticker, {
      period1: "2024-02-26",
      period2: "2024-02-28",
      interval: "1d",
    });

    // ✅ Extract financial statements
    const incomeStatements = stockData.incomeStatementHistory?.incomeStatementHistory || [];
    const balanceSheets = stockData.balanceSheetHistory?.balanceSheetStatements || [];
    const cashflowStatements = stockData.cashflowStatementHistory?.cashflowStatements || [];

    // ✅ Get cost of revenue (first non-null)
    let costOfRevenue: number | string = "N/A";
    for (const statement of incomeStatements) {
      if (statement.costOfRevenue !== undefined && statement.costOfRevenue !== null) {
        costOfRevenue = statement.costOfRevenue;
        break;
      }
    }

    // ✅ Get EBIT (fallback to EBITDA if missing)
    const latestIncomeStatement = incomeStatements[0] || {};
    const ebit =
      latestIncomeStatement.ebit && latestIncomeStatement.ebit !== 0
        ? latestIncomeStatement.ebit
        : stockData.financialData?.ebitda || "N/A"; // Fallback to EBITDA

    // ✅ Get sector
    const sector = stockData.summaryProfile?.sector || "N/A";

    // ✅ Extract balance sheet data (returns "N/A" if missing)
    const latestBalanceSheet = balanceSheets[0] || {};
    const totalAssets = latestBalanceSheet.totalAssets || "N/A";
    const shareholdersEquity = latestBalanceSheet.totalStockholderEquity || "N/A";
    const currentAssets = latestBalanceSheet.totalCurrentAssets || "N/A";
    const currentLiabilities = latestBalanceSheet.totalCurrentLiabilities || "N/A";
    const inventory = latestBalanceSheet.inventory || "N/A";

    // ✅ Extract capital expenditure and interest expenses (returns "N/A" if missing)
    const latestCashflowStatement = cashflowStatements[0] || {};
    const capitalExpenditure = latestCashflowStatement.capitalExpenditures || "N/A";
    const interestExpenses = latestIncomeStatement.interestExpense || "N/A";

    // ✅ Structure the response
    const response = {
      stockInfo: {
        ticker: ticker,
        companyName: stockData.price?.longName || stockData.price?.shortName || "N/A",
        sector: sector,
        currentPrice: stockData.price?.regularMarketPrice || "N/A",
        marketCap: stockData.price?.marketCap || "N/A",
        sharesOutstanding: stockData.defaultKeyStatistics?.sharesOutstanding || "N/A",
      },
      financialData: {
        totalRevenue: stockData.financialData?.totalRevenue || "N/A",
        costOfRevenue: costOfRevenue,
        netIncome: latestIncomeStatement.netIncome || "N/A",
        ebit: ebit,
        totalDebt: stockData.financialData?.totalDebt || "N/A",
        operatingCashFlow: stockData.financialData?.operatingCashflow || "N/A",
        debtToEquity: stockData.financialData?.debtToEquity || "N/A",
        returnOnAssets: stockData.financialData?.returnOnAssets || "N/A",
        returnOnEquity: stockData.financialData?.returnOnEquity || "N/A",
        eps: stockData.defaultKeyStatistics?.trailingEps || "N/A",
        payoutRatio: stockData.summaryDetail?.payoutRatio || "N/A",
        trailingAnnualDividendRate: stockData.summaryDetail?.trailingAnnualDividendRate || "N/A",
      },
      balanceSheetData: {
        totalAssets: totalAssets,
        shareholdersEquity: shareholdersEquity,
        currentAssets: currentAssets,
        currentLiabilities: currentLiabilities,
        inventory: inventory,
      },
      cashFlowData: {
        capitalExpenditure: capitalExpenditure,
        interestExpenses: interestExpenses,
      },
      priceHistory: chartData?.quotes.map((day: any) => ({
        date: day.date || "N/A",
        open: day.open || "N/A",
        high: day.high || "N/A",
        low: day.low || "N/A",
        close: day.close || "N/A",
        volume: day.volume || "N/A",
        marketCap:
          stockData.defaultKeyStatistics?.sharesOutstanding && day.close
            ? day.close * stockData.defaultKeyStatistics?.sharesOutstanding
            : "N/A",
      })),
    };

    return response;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return { error: "Failed to fetch stock data." };
  }
};

// ✅ Example usage
fetchStockData("2222.SR").then((data) => console.log(JSON.stringify(data, null, 2)));
