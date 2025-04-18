"use client";

import MetricCard  from "./MetricCard";
import { MetricBarChart } from "./MetricBarChart";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  keyName: string; // e.g. "roe"
  value: number | null;
  sector: number | null;
  market: number | null;
  isPercentage?: boolean;
  view: "chart" | "card";
  onToggle?: () => void;
};

export const MetricToggleBlock = ({
  title,
  keyName,
  value,
  sector,
  market,
  isPercentage,
  view,
  onToggle,
}: Props) => {
  return (
    <div className="relative">
      {view === "chart" ? (
        <MetricBarChart
          title={title}
          company={value}
          sector={sector}
          market={market}
          isPercentage={isPercentage}
        />
      ) : (
        <MetricCard title={title} value={value} />
      )}

      {onToggle && (
        <div className="absolute top-2 right-2">
          <Button size="sm" variant="ghost" onClick={onToggle}>
            {view === "card" ? "Chart" : "Card"}
          </Button>
        </div>
      )}
    </div>
  );
};
