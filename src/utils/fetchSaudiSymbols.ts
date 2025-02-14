export const fetchSaudiSymbols = async (): Promise<string[]> => {
  const apiToken = process.env.MARKETAUX_API_TOKEN;
  const url = `https://api.marketaux.com/v1/entity/search?api_token=${apiToken}&countries=sa&types=equity`;

  try {
    const response = await fetch(url);
    const { data } = await response.json();
    return data.map((entity: any) => entity.symbol); // Extract symbols
  } catch (error) {
    console.error('Error fetching Saudi symbols:', error);
    return [];
  }
};
