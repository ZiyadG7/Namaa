export async function POST(request) {
    const body = await request.formData();
    const date = new Date()
    console.log(date)
  
    const response = await fetch("https://script.google.com/macros/s/AKfycbysWfcD8VsNk566bV5XpaywmYXt4W_KkX6UIJdBQ2z2n1jOOVcpo0tzgHr4AziM3nZn/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ date: `=DATE(${date.getFullYear()}, ${date.getMonth()+1}, ${date.getDay()})` }),
    });
  
    const data = await response.json();
    const priceDict = Object.fromEntries(data.map(p => [p.ticker, { price: p.price }]));
  
    // Return the formatted data
    return new Response(JSON.stringify(priceDict), {
      headers: { 'Content-Type': 'application/json' },
    });
    
  }
  