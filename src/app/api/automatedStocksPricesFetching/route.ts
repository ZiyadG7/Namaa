import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Authorization check
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Step 1: Get stocks with their tickers
    const { data: stocks, error: stockError } = await supabase
      .from('stocks')
      .select('stock_id, ticker')

    if (stockError || !stocks) throw new Error('Failed to fetch stocks')

    // Step 2: Fetch today’s prices from Google Apps Script
    const googleResponse = await fetch("https://script.google.com/macros/s/AKfycbwdr4OScwOHAqlknvITo6mqjcAZ6mdhRHGgze6RNGUd-oA9OYHqGh-xKvN_p0Fetc6Cfw/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    })

    const googleData = await googleResponse.json()

    // Step 3: Convert to a dictionary of { ticker: data }
    const priceDict = Object.fromEntries(
      googleData.map((p: any) => [
        p.ticker,
        {
          share_price: p.price,
          market_cap: p.marketcap
        }
      ])
    )

    // Step 4: Insert today’s prices
    const today = new Date().toISOString().split('T')[0] // e.g., "2025-04-10"

    const insertPayload = stocks
      .map(({ stock_id, ticker }) => {
        const priceData = priceDict[ticker]
        if (!priceData) return null

        const sharePrice = Number(priceData.share_price)
        const marketCap = Number(priceData.market_cap)

        // Skip the row entirely if share price is invalid
        if (isNaN(sharePrice)) return null

        return {
          stock_id,
          share_price: sharePrice,
          market_cap: isNaN(marketCap) ? null : marketCap,
          date: today
        }
      })
      .filter(Boolean)

    if (insertPayload.length === 0) {
      return NextResponse.json({ message: 'No prices matched today’s stocks' }, { status: 200 })
    }

    const { error: insertError } = await supabase
      .from('stock_prices')
      .insert(insertPayload)

    if (insertError) throw insertError

    return NextResponse.json(
      {
        message: 'Stock prices inserted successfully',
        insertedCount: insertPayload.length,
        // insertedStocks: insertPayload.map(p => p.stock_id)
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}
