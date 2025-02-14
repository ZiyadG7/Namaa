import { supabase } from "@/lib/supabaseClient";


export const saveNewsToSupabase = async (news: any[]): Promise<void> => {
  try {
    const { error } = await supabase.from("news_articles").upsert(
      news.map((article) => ({
        uuid: article.uuid,
        title: article.title,
        description: article.description,
        url: article.url,
        image_url: article.image_url,
        published_at: article.published_at,
        source: article.source,
        entities: article.entities,
        snippet: article.snippet,
      })),
      { onConflict: "uuid" }
    );

    if (error) throw error;
    console.log(`Saved ${news.length} articles to Supabase`);
  } catch (error) {
    console.error("Error saving news to Supabase:", error);
  }
};
