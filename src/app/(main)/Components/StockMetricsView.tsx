"use client";

import { useState } from "react";
import { MetricToggleBlock } from "./MetricToggleBlock";
import { MetricSet } from '@/types/common'

export default function StockMetricsView({ metrics }: { metrics: MetricSet[] }) {
  const [globalView, setGlobalView] = useState<"chart" | "card">("chart");
  const [overrides, setOverrides] = useState<Record<string, "chart" | "card">>({});

  const getView = (key: string) => overrides[key] || globalView;

  const toggleView = (key: string) => {
    setOverrides((prev) => ({
      ...prev,
      [key]: prev[key] === "card" ? "chart" : "card",
    }));
  };

  return (
    <div className="space-y-4">
      {/* Global View Toggle */}
      <div className="flex justify-end">
        <button
          className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
          onClick={() => setGlobalView(globalView === "chart" ? "card" : "chart")}
        >
          View as: {globalView === "chart" ? "Charts" : "Cards"}
        </button>
      </div>

      {/* All Metrics */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricToggleBlock
            key={metric.key}
            keyName={metric.key}
            title={metric.title}
            value={metric.value}
            sector={metric.sector}
            market={metric.market}
            isPercentage={metric.isPercentage}
            view={getView(metric.key)}
            onToggle={() => toggleView(metric.key)}
          />
        ))}
      </div>
    </div>
  );
}
