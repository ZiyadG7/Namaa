import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, ChevronDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";

type Price = {
  date: string;
  share_price: number;
};

type Stock = {
  ticker: string;
  company_name: string;
  stock_id: string;
  prices: Price[];
};

export default function StockPriceChart() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  // Fetch followed stocks when component mounts
  useEffect(() => {
    const fetchFollowedStocks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/followedprices");

        if (!response.ok) {
          throw new Error("Failed to fetch followed stocks");
        }

        const data = await response.json();

        if (data.length > 0) {
          setStocks(data);
          setSelectedStock(data[0]); // Select first stock by default
        } else {
          setError("No followed stocks found");
        }
      } catch (err) {
        setError("Error fetching stocks data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedStocks();
  }, []);

  // Chart configuration
  const chartConfig: ChartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
  };

  // Handle stock selection change
  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
  };

  // Prepare chart data if a stock is selected, ensuring dates are sorted chronologically
  const chartData =
    selectedStock?.prices
      .slice() // Create a copy of the array to avoid mutating the original
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort chronologically (oldest to newest)
      .map((p) => ({
        date: new Date(p.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: p.share_price,
      })) || [];

  if (loading) {
    return (
      <Card className="col-span-2 font-SaudiRiyal">
        <CardHeader>
          <CardTitle>Price Over Time</CardTitle>
          <CardDescription>Loading stock data...</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-pulse">Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-2 font-SaudiRiyal">
        <CardHeader>
          <CardTitle>Price Over Time</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 font-SaudiRiyal">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Price Over Time</CardTitle>
          <CardDescription>Based on recent historical prices</CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {selectedStock?.ticker || "Select Stock"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {stocks.map((stock) => (
              <DropdownMenuItem
                key={stock.ticker}
                onClick={() => handleSelectStock(stock)}
              >
                {stock.ticker} - {stock.company_name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        {selectedStock ? (
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
                interval="preserveStartEnd" // Only show first, last and some intermediate ticks
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                tick={{ fontSize: 12 }}
                tickMargin={6}
                domain={["auto", "auto"]} // Ensure y-axis scales properly
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
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p>Select a stock to view price chart</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          {selectedStock
            ? `Showing ${selectedStock.company_name} (${selectedStock.ticker}) stock prices`
            : "Select a stock to view price history"}
        </div>
      </CardFooter>
    </Card>
  );
}
