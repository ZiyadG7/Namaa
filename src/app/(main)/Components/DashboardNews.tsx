"use client";

import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import { Article, Stock } from '@/types/common';

interface DashboardNewsProps {
  stocks: Stock[];
}

export default function DashboardNews({ stocks }: DashboardNewsProps) {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowNews = async () => {
      try {
        const res = await fetch("/api/fetchNews");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error("Error fetching followed news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowNews();
  }, []);

  // Filter news based on followed stocks
  const followedCompanyNames = stocks.map(stock => stock.company_name.toLowerCase());
  const followedTickers = stocks.map(stock => stock.ticker.toLowerCase());

  const filteredNews = news.filter(article => {
    const lowerTitle = article.title.toLowerCase();
    return followedCompanyNames.some(name => lowerTitle.includes(name)) ||
           followedTickers.some(ticker => lowerTitle.includes(ticker));
  });

  return (
    <div className="mb-8 bg-slate-100 dark:bg-gray-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        News
      </h2>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-4">
          {filteredNews.length > 0 ? (
            filteredNews.slice(0, 3).map((article) => (
              <a
                key={article.uuid}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={article.image_url}
                  alt="News"
                  onError={(e) => (e.currentTarget.src = "/images/default-news.jpg")}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="ml-4 flex-1">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {article.title}
                  </h2>
                </div>
              </a>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No news found related to your stocks.</p>
          )}
        </div>
      )}
    </div>
  );
}
