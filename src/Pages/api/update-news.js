import { supabase } from "../../lib/supabaseClient";
import { fetchSaudiStockNews } from "../../utils/fetchStockNews";

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const news = await fetchSaudiStockNews();

    // Save to database
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

    res.status(200).json({ message: `Updated ${news.length} articles` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
