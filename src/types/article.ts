export type Article = {
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
