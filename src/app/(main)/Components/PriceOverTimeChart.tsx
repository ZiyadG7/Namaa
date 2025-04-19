"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/formatters";

type Price = {
  date: string;
  share_price: number;
};

export default function PriceOverTimeChart({ prices }: { prices: Price[] }) {
  // Convert data to recharts format
  const chartData = prices.map((p) => ({
    date: new Date(p.date).toLocaleDateString("en-SA", {
      month: "short",
      day: "numeric",
    }),
    price: p.share_price,
  }));

  const chartConfig: ChartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card className="col-span-2 font-SaudiRiyal">
      <CardHeader>
        <CardTitle>Price Over Time</CardTitle>
        <CardDescription>Based on recent historical prices</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(v) => formatCurrency(v)}
              tick={{ fontSize: 12 }}
              tickMargin={6}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="price"
              type="natural"
              fill="var(--color-price)"
              fillOpacity={0.4}
              stroke="var(--color-price)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          Showing latest company stock prices
        </div>
      </CardFooter>
    </Card>
  );
}
