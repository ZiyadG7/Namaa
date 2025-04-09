export async function POST(request) {
  const body = await request.formData();
  const date = body.get("date");

  const response = await fetch("https://script.google.com/macros/s/AKfycbzzXb_RflEnbLFKe7S0HDtkf7PD7z8XgXrDpyfNlLb5VJFKv78xJ4t1Rq70pe8BqpmU_Q/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ date }),
  });

  const data = await response.json();
  const priceDict = Object.fromEntries(data.map(p => [p.ticker, { price: p.price }]));

  // Return the formatted data
  return new Response(JSON.stringify(priceDict), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // return Response.json(data);
}
