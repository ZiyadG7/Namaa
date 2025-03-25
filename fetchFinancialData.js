import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// // Initialize Supabase
const SUPABASE_URL = "https://juftxavwqjelpnkfpcdv.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1ZnR4YXZ3cWplbHBua2ZwY2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MDY3OTMsImV4cCI6MjA1NDE4Mjc5M30.hCjJcDiYabTlePnLYiEoZezaGdOr6MpoI31gMIhbhPE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
//import { supabase } from "NAMAA/src/lib/supabaseClient.js";  // ✅ Correct for a script outside `src/`


const API_KEY = process.env.API_KEY || "Vw5hHeLl3a66UbNiNMhyG9lVj1ijb23v";

async function fetchFinancialData(symbol, retries = 5) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`📡 Attempt ${attempt}: Fetching data for ${symbol}...`);

            const balanceSheetRes = await fetch(
                `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?apikey=${API_KEY}`
            );

            if (balanceSheetRes.status === 429) {
                console.warn(`⚠️ API Rate Limit Exceeded (429) for ${symbol}. Retrying immediately...`);
                continue;
            }

            if (!balanceSheetRes.ok) throw new Error(`Balance Sheet API Error: ${balanceSheetRes.status}`);
            const balanceSheet = await balanceSheetRes.json();

            const cashFlowRes = await fetch(
                `https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?apikey=${API_KEY}`
            );
            if (!cashFlowRes.ok) throw new Error(`Cash Flow API Error: ${cashFlowRes.status}`);
            const cashFlow = await cashFlowRes.json();

            const incomeStatementRes = await fetch(
                `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?apikey=${API_KEY}`
            );
            if (!incomeStatementRes.ok) throw new Error(`Income Statement API Error: ${incomeStatementRes.status}`);
            const incomeStatement = await incomeStatementRes.json();

            const latestBalance = balanceSheet[0] || {};
            const latestCashFlow = cashFlow[0] || {};
            const latestIncome = incomeStatement[0] || {};

            // ✅ Calculate `other_expenses` (operatingExpenses + interestExpense + incomeTaxExpense)
            const otherExpenses =
                (latestIncome.operatingExpenses || 0) +
                (latestIncome.interestExpense || 0) +
                (latestIncome.incomeTaxExpense || 0);

            return {
                total_assets: latestBalance.totalAssets?.toString() || null,
                interest_expenses: latestIncome.interestExpense?.toString() || null,
                capital_expenditures: latestCashFlow.capitalExpenditure?.toString() || null,
                inventory: latestBalance.inventory?.toString() || null,
                current_liabilities: latestBalance.totalCurrentLiabilities?.toString() || null,
                current_assets: latestBalance.totalCurrentAssets?.toString() || null,
                shareholders_equity: latestBalance.totalStockholdersEquity?.toString() || null,
                other_expenses: otherExpenses.toString() || null,
            };
        } catch (error) {
            console.error(`❌ Error fetching data for ${symbol}:`, error.message);
            return null;
        }
    }

    console.error(`❌ All retries failed for ${symbol}. Skipping update.`);
    return null;
}

async function updateFinancials() {
    console.log("🔍 Fetching stocks from Supabase...");

    // ✅ Fetch only stocks within Stock ID range 95 to 255
    const { data: stocks, error } = await supabase
        .from("stocks")
        .select("stock_id, ticker")
        .gte("stock_id", 173) // ✅ Start from Stock ID 95
        .lte("stock_id", 255) // ✅ End at Stock ID 255
        .order("stock_id", { ascending: true });

    if (error) {
        console.error("❌ Error fetching stocks:", error.message);
        return;
    }

    console.log(`✅ Found ${stocks.length} stocks. Processing...`);

    for (const stock of stocks) {
        const symbol = `${stock.ticker}.SR`;
        console.log(`📊 Fetching financials for: ${symbol} (Stock ID: ${stock.stock_id})`);

        const financialData = await fetchFinancialData(symbol);
        if (!financialData) {
            console.error(`❌ Skipping update for ${symbol} due to data fetch error.`);
            continue;
        }

        console.log(`⬆️ Updating financials for ${symbol} in Supabase...`);
        const { error: updateError } = await supabase
            .from("financials")
            .update(financialData) // ✅ Only update financial values, no timestamps
            .eq("stock_id", stock.stock_id);

        if (updateError) {
            console.error(`❌ Error updating financials for ${symbol}:`, updateError.message);
        } else {
            console.log(`✅ Successfully updated financials for ${symbol}`);
        }
    }

    console.log("🎯 Financial update process completed!");
}

// ✅ Run the update process
updateFinancials();