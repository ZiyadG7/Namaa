"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

type MetricBarChartProps = {
  title: string;
  company: number | null;
  sector: number | null;
  market: number | null;
  isPercentage?: boolean;
};

export function MetricBarChart({
  title,
  company,
  sector,
  market,
  isPercentage = false,
}: MetricBarChartProps) {
  const format = (v: number | null) =>
    typeof v === "number" && !isNaN(v) ? Number(v.toFixed(2)) : 0;

  const chartData = [
    {
      label: "This Company",
      value: format(isPercentage ? company! * 100 : company),
      fill: "hsl(var(--chart-1))",
    },
    {
      label: "Sector Avg",
      value: format(isPercentage ? sector! * 100 : sector),
      fill: "hsl(var(--chart-2))",
    },
    {
      label: "Market Avg",
      value: format(isPercentage ? market! * 100 : market),
      fill: "hsl(var(--chart-3))",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Value",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Comparison with Sector & Market</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={350} height={250} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="value"
              strokeWidth={2}
              radius={8}
              activeIndex={0}
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending metric <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {isPercentage && "Values shown as percentage (%)"}
        </div>
      </CardFooter>
    </Card>
  );
}
