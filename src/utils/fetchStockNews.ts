import { fetchSaudiSymbols } from './fetchSaudiSymbols';

export const fetchStockNews = async (): Promise<any[]> => {
  const apiToken = process.env.MARKETAUX_API_TOKEN;
  const saudiSymbols = await fetchSaudiSymbols(); // Get all Saudi symbols

  if (saudiSymbols.length === 0) {
    console.error('No Saudi symbols found');
    return [];
  }

  const url = `https://api.marketaux.com/v1/news/all?api_token=${apiToken}&countries=sa&symbols=${saudiSymbols.join(',')}&filter_entities=true`;

  try {
    const response = await fetch(url);
    const { data } = await response.json();
    return data; // Return news articles
  } catch (error) {
    console.error('Error fetching Saudi stock news:', error);
    return [];
  }
};
