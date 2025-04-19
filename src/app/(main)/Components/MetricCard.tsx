"use client";

import React from "react";

type Props = {
  title: string;
  value: number | string | null;
};

export default function MetricCard({ title, value }: Props) {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
      <div className="text-base font-semibold text-gray-400 dark:text-gray-300 mb-2">
        {title}
      </div>
      <div className="text-3xl font-bold text-white">
        {value !== null && value !== undefined ? value : "N/A"}
      </div>
    </div>
  );
}
