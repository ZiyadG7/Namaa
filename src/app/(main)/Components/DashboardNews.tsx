"use client";

import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import { Article } from '@/types/common' 

export default function DashboardNews(){
    const [news, setNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchFollowNews = async () =>{
          try{
            const res = await fetch("/api/fetchNews");
            const data = await res.json();
            setNews(data);
          }catch(err){
            console.error("Error fetching followed news :", err);
          }finally {
            setLoading(false);
          }
        }
        fetchFollowNews();
      }, []);  

    return(
        <div className="mb-8 bg-slate-100 dark:bg-gray-900 p-6 min-h-screen">
            <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
                News
            </h2>
            <div className="grid gap-4">
                {news.slice(0,3).map((article)=>(
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
                            <h2 className="text-lg font-semibold text-gray-200 dark:text-white">
                                {article.title}
                            </h2>
                        </div>
                    </a>
                ))

                }

            </div>
        </div>
    );  
}