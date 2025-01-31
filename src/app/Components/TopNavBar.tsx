"use client";
import { usePathname } from "next/navigation";
import { FaBell, FaUserCircle } from "react-icons/fa";

export default function TopHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/stocks":
        return "Stocks";
      case "/analysis":
        return "Analysis";
      case "/news":
        return "News";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-slate-50 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-blue-900">
            {getPageTitle()}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-blue-500">
            <FaBell className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-blue-500">
            <FaUserCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
