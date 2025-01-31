"use client";
import {
  FaHome,
  FaChartLine,
  FaChartBar,
  FaNewspaper,
  FaCog,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

export default function LeftNavBar() {
  const pathname = usePathname();
  return (
    <nav className="w-56 bg-slate-50 text-gray-500 fixed h-full p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900 text-center">
          Namaan Insights
        </h1>
      </div>
      <div className="space-y-4 p-x4">
        <div className="group">
          <Link
            href="/"
            className={`flex items-center p-4 font-bold ${
              pathname === "/"
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            <FaHome className="mr-2" />
            Dashboard
          </Link>
          <Link
            href="/stocks"
            className={`flex items-center p-4 font-bold ${
              pathname === "/stocks"
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            <FaChartLine className="mr-2" />
            Stocks
          </Link>
          <Link
            href="/analysis"
            className={`flex items-center p-4 font-bold ${
              pathname === "/analysis"
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            <FaChartBar className="mr-2" />
            Analysis
          </Link>
          <Link
            href="/news"
            className={`flex items-center p-4 font-bold ${
              pathname === "/news"
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            <FaNewspaper className="mr-2" />
            News
          </Link>
          <Link
            href="/settings"
            className={`flex items-center p-4 font-bold ${
              pathname === "/settings"
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            <FaCog className="mr-2" />
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}
