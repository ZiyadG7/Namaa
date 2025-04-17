 // Helper function to calculate price change over N days
  export const calculatePriceChange = (strLatestPrice: string, strHistoricalPrice: string): string => {
    const latestPrice = Number.parseFloat(strLatestPrice);
    const historicalPrice = Number.parseFloat(strHistoricalPrice);

    // console.log(latestPrice)

    if (!strLatestPrice || !strHistoricalPrice) return '0%';

    const change = ((latestPrice - historicalPrice) / historicalPrice) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };