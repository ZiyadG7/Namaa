import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import yahooFinance from "yahoo-finance2";

// ✅ Export named GET function
export async function GET(req: NextRequest) {
  try {
    let { data: stocks, error } = await supabase.from("stocks").select("stock_id, ticker");

    if (error || !stocks) {
      console.error("❌ Error fetching tickers:", error);
      return NextResponse.json({ message: "Error fetching tickers" }, { status: 500 });
    }

    console.log(`📌 Found ${stocks.length} tickers`);
    let errorCount = 0; // 🔥 Counter for errors

    for (const stock of stocks) {
      const { stock_id, ticker } = stock;
      const yahooTicker = `${ticker}.SR`;

      // ✅ Fetch stock data using the provided function
      const stockData = await fetchStockData(yahooTicker);

      if (!stockData || "error" in stockData) {
        console.error(`❌ Failed to fetch data for ${yahooTicker}`);
        continue;
      }

      // ✅ Safe access with defaults
      const stockInfo = stockData.stockInfo ?? {};
      const financialData = stockData.financialData ?? {};
      const balanceSheetData = stockData.balanceSheetData ?? {};
      const cashFlowData = stockData.cashFlowData ?? {};
      const priceHistory = stockData.priceHistory ?? [];

      // ✅ Update `shares_outstanding`
      await supabase
        .from("stocks")
        .update({ shares_outstanding: stockInfo.sharesOutstanding ?? null })
        .eq("stock_id", stock_id);

      console.log(`✅ Updated shares_outstanding for ${ticker}`);

      // ✅ Insert financial data
      await supabase.from("financials").insert([
        {
          stock_id: stock_id,
          total_revenue: financialData.totalRevenue ?? "N/A",
          cost_of_revenue: financialData.costOfRevenue ?? "N/A",
          net_income: financialData.netIncome ?? "N/A",
          total_assets: balanceSheetData.totalAssets ?? "N/A",
          shareholders_equity: balanceSheetData.shareholdersEquity ?? "N/A",
          total_debt: financialData.totalDebt ?? "N/A",
          date: new Date().toISOString().split("T")[0],
          current_assets: balanceSheetData.currentAssets ?? "N/A",
          current_liabilities: balanceSheetData.currentLiabilities ?? "N/A",
          inventory: balanceSheetData.inventory ?? "N/A",
          ebit: financialData.ebit ?? "N/A",
          operating_cash_flow: financialData.operatingCashFlow ?? "N/A",
          capital_expenditures: cashFlowData.capitalExpenditure ?? "N/A",
          interest_expenses: cashFlowData.interestExpenses ?? "N/A",
        },
      ]);

      console.log(`✅ Inserted financial data for ${ticker}`);

      // ✅ Insert stock prices
      for (const price of priceHistory) {
        await supabase.from("stock_prices").insert([
          {
            stock_id: stock_id,
            share_price: price.close ?? "N/A",
            date: price.date ?? "N/A",
            market_cap: price.marketCap ?? "N/A",
          },
        ]);
      }
      console.log(`✅ Inserted stock prices for ${ticker}`);

      // ✅ Insert stock metrics (NEW)
      await supabase.from("stock_metrics").insert([
        {
          stock_id: stock_id,
          debt_to_equity: financialData.debtToEquity ?? "N/A",
          return_on_assets: financialData.returnOnAssets ?? "N/A",
          return_on_equity: financialData.returnOnEquity ?? "N/A",
          eps: financialData.eps ?? "N/A",
          payout_ratio: financialData.payoutRatio ?? "N/A",
          trailing_annual_dividend_rate: financialData.trailingAnnualDividendRate ?? "N/A",
          date: new Date().toISOString().split("T")[0],
        },
      ]);

      console.log(`✅ Inserted stock metrics for ${ticker}`);
    }

    console.log("🎉 Stock data updated successfully!");
    return NextResponse.json({ message: "Stock data updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ message: "Error updating stock data" }, { status: 500 });
  }
}

// ✅ Fetch Stock Data from Yahoo Finance
async function fetchStockData(ticker: string) {
  try {
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

    const chartData = await yahooFinance.chart(ticker, {
      period1: "2024-12-01",
      period2: "2025-03-01",
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
}
