export const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `\ue900${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `\ue900${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `\ue900${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `\ue900${(value / 1e3).toFixed(1)}K`;
    return `\ue900${value}`
  };