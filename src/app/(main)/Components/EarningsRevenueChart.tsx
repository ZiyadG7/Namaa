"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Rectangle,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type EarningsRevenueChartProps = {
  revenue: number;
  costOfRevenue: number;
  otherExpenses: number;
};

const formatSAR = (value: number): string => {
  if (value >= 1e12) return `SAR${(value / 1e12).toFixed(2)}t`;
  if (value >= 1e9) return `SAR${(value / 1e9).toFixed(2)}b`;
  if (value >= 1e6) return `SAR${(value / 1e6).toFixed(2)}m`;
  return `SAR${value.toLocaleString()}`;
};

export function EarningsRevenueChart({
  revenue,
  costOfRevenue,
  otherExpenses,
}: EarningsRevenueChartProps) {
  const grossProfit = revenue - costOfRevenue;
  const netIncome = grossProfit - otherExpenses;

  // Custom tooltip to display the actual values
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{item.label}</p>
          <p className="text-sm">{formatSAR(item.actualValue || item.value)}</p>
        </div>
      );
    }
    return null;
  };

  // Create data for a waterfall-style chart
  const data = [
    {
      label: "Revenue",
      value: revenue,
      actualValue: revenue,
      fill: "#3b82f6",
      type: "normal",
      // Starting point for the first bar
      y0: 0,
      y1: revenue,
    },
    {
      label: "Cost of Revenue",
      // For visualization, we use negative value
      value: -costOfRevenue,
      actualValue: costOfRevenue, 
      fill: "#dc2626",
      type: "negative",
      // The cost starts from the top of revenue and goes down by costOfRevenue
      y0: revenue,
      y1: revenue - costOfRevenue,
    },
    {
      label: "Gross Profit",
      value: grossProfit,
      actualValue: grossProfit,
      fill: "#22c55e",
      type: "normal",
      // Gross profit starts from where cost of revenue ended
      y0: revenue - costOfRevenue,
      y1: revenue - costOfRevenue,
    },
    {
      label: "Other Expenses",
      // For visualization, we use negative value
      value: -otherExpenses, 
      actualValue: otherExpenses,
      fill: "#b91c1c",
      type: "negative",
      // Other expenses start from gross profit and go down by otherExpenses
      y0: grossProfit,
      y1: grossProfit - otherExpenses,
    },
    {
      label: "Net Income",
      value: netIncome,
      actualValue: netIncome,
      fill: "#67e8f9",
      type: "normal", 
      // Net income starts from where other expenses ended
      y0: grossProfit - otherExpenses,
      y1: grossProfit - otherExpenses,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings & Revenue</CardTitle>
        <CardDescription>
          Visual breakdown of key financial metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
            barGap={0}
            barCategoryGap={20}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis 
              dataKey="label" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatSAR} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#666" />
            <Bar
              dataKey="value"
              shape={({ x, y, width, height, payload }: any) => {
                // Base position for the bar
                let barY, barHeight;
                
                switch (payload.label) {
                  case "Revenue":
                    // Regular bar from 0 to revenue
                    barY = y;
                    barHeight = height;
                    break;
                  
                  case "Cost of Revenue":
                    // Negative bar starting from Revenue level
                    barY = 0; // Start from Revenue level (top)
                    barHeight = Math.abs(-height); // Height = costOfRevenue
                    break;
                  
                  case "Gross Profit":
                    // Regular bar at Gross Profit level (Revenue - Cost)
                    barY = y;
                    barHeight = height;
                    break;
                  
                  case "Other Expenses":
                    // Negative bar starting from Gross Profit level
                    barY = 0; // Start from Gross Profit level
                    barHeight = Math.abs(-height); // Height = otherExpenses
                    break;
                  
                  case "Net Income":
                    // Regular bar at Net Income level
                    barY = y;
                    barHeight = height;
                    break;
                  
                  default:
                    barY = y;
                    barHeight = height;
                }
                
                return (
                  <Rectangle
                    x={x}
                    y={barY}
                    width={width}
                    height={barHeight}
                    fill={payload.fill}
                    stroke="none"
                    radius={[4, 4, 0, 0]}
                  />
                );
              }}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-sm" 
                style={{ backgroundColor: item.fill }}
              />
              <span>{item.label}: {formatSAR(item.actualValue || item.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}