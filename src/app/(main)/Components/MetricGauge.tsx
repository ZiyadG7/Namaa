"use client";

import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const RADIAN = Math.PI / 180;
const cx = 150;
const cy = 120;
const iR = 45;
const oR = 75;

const getNeedle = (
  label: string,
  value: number,
  max: number,
  color: string
) => {
  const angle = 180 * (1 - value / max);
  const length = (iR + oR) / 2;
  const sin = Math.sin(-RADIAN * angle);
  const cos = Math.cos(-RADIAN * angle);
  const r = 3;
  const x0 = cx;
  const y0 = cy;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <g key={label}>
      <circle cx={x0} cy={y0} r={r} fill={color} />
      <path d={`M${xba} ${yba} L${xbb} ${ybb} L${xp} ${yp} Z`} fill={color} />
    </g>
  );
};

type MetricGaugeProps = {
  title?: string;
  company: number;
  sector: number | null;
  market: number | null;
  max: number;
};

export default function MetricGauge({
  title = "Metric Gauge",
  company,
  sector,
  market,
  max,
}: MetricGaugeProps) {
  const zones = [
    { name: "Low", value: 1, color: "#f87171" },
    { name: "Fair", value: 1, color: "#facc15" },
    { name: "Healthy", value: 3, color: "#34d399" },
    { name: "Strong", value: 1, color: "#60a5fa" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-sm">
      <h2 className="text-center text-base font-semibold mb-2">{title}</h2>
      <PieChart width={300} height={170}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={zones}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          paddingAngle={1}
          stroke="none"
        >
          {zones.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>

        {getNeedle("Company", company, max, "#3b82f6")}
        {sector != null && getNeedle("Sector", sector, max, "#f59e0b")}
        {market != null && getNeedle("Market", market, max, "#10b981")}
      </PieChart>

      <div className="flex justify-center gap-4 text-xs mt-1 text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-[#3b82f6] rounded-full" /> Company
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-full" /> Sector
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full" /> Market
        </span>
      </div>
    </div>
  );
}
