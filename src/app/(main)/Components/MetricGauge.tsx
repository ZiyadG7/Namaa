"use client";

import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const RADIAN = Math.PI / 180;
const cx = 150;
const cy = 200;
const iR = 60;
const oR = 100;

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
  const r = 4;
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
      <path
        d={`M${xba} ${yba} L${xbb} ${ybb} L${xp} ${yp} Z`}
        fill={color}
        stroke="none"
      />
    </g>
  );
};

export default function CurrentRatioGauge({
  company,
  sector,
  market,
}: {
  company: number;
  sector: number | null;
  market: number | null;
}) {
  const max = 6; // max ratio range

  const zones = [
    { name: "Low", value: 1, color: "#dc2626" },     // Red
    { name: "Fair", value: 1, color: "#facc15" },    // Yellow
    { name: "Healthy", value: 3, color: "#22c55e" }, // Green
    { name: "Strong", value: 1, color: "#0ea5e9" },  // Blue ( extra zone)
  ];
  

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2 text-center">Current Ratio Gauge</h2>
      <PieChart width={300} height={250}>
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
        {sector && getNeedle("Sector", sector, max, "#f59e0b")}
        {market && getNeedle("Market", market, max, "#10b981")}
      </PieChart>

      <div className="flex justify-center gap-4 text-sm mt-2 text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#3b82f6] rounded-full" /> Company
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#f59e0b] rounded-full" /> Sector
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#10b981] rounded-full" /> Market
        </span>
      </div>
    </div>
  );
}
