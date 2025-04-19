import React from "react";
import { MetricCardProps } from '@/types/common'

const MetricCard: React.FC<MetricCardProps> = ({ title, value, suffix = "" }) => {
  const number = typeof value === "number" ? value : parseFloat(value ?? "0");

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </span>
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        {isNaN(number) ? "N/A" : `${number.toLocaleString()}${suffix}`}
      </span>
    </div>
  );
};

export default MetricCard;
