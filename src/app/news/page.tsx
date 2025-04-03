"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loading from "../Components/Loading";

type Article = {
  uuid: string;
  title: string;
  description: string;
  url: string;
  image_url: string | null;
  published_at: string;
  source: string;
  entities: {
    symbol: string;
    name: string;
    exchange: string;
    exchange_long: string;
    country: string;
    type: string;
    industry: string;
    match_score: number;
    sentiment_score: number;
    highlights: {
      highlight: string;
      sentiment: number;
      highlighted_in: string;
    }[];
  }[];
  snippet: string;
};

export default function News() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      setLoading(true);

      // Fetch news from Supabase
      const { data: news, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching news from Supabase:", error);
      } else {
        setNews(news || []);
      }

      setLoading(false);
    }

    getNews();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="mb-8 bg-slate-100 dark:bg-gray-900 p-6 min-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        News
      </h2>

      <div className="grid gap-4">
        {news.map((article) => (
          <a
            key={article.uuid}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4 hover:shadow-lg transition-shadow"
          >
            <img
              src={article.image_url || "/default-news.jpg"}
              alt={article.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {article.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                {article.snippet}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {new Date(article.published_at).toLocaleDateString("en-SA")}
                </span>
                <span className="mx-2">•</span>
                <span>{article.source}</span>
                {article.entities?.map((entity) => (
                  <span
                    key={entity.symbol}
                    className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full"
                  >
                    {entity.symbol}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
