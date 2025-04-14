import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
}

const SimpleMetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </span>
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        ${parseFloat(value || "0").toLocaleString()}
      </span>
    </div>
  );
};

export default SimpleMetricCard;
