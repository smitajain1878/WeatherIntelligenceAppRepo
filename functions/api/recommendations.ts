export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const { current, daily, city } = await request.json();
    const apiKey = env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is missing. Please configure it in Cloudflare Pages Environment Variables.' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const prompt = `Based on the weather forecast for ${city}, provide 3-4 simple, actionable planning recommendations.
Current weather: ${current.temperature}°C, ${current.humidity}% humidity, wind ${current.windSpeed} km/h.
7-day forecast overview: Max temp ranges from ${Math.min(...daily.temperatureMax)}°C to ${Math.max(...daily.temperatureMax)}°C.
Format your response as a clean, simple JSON array of strings. Do not use markdown blocks. Example: ["Wear a jacket today.", "Good weather for a run on Tuesday.", "Bring an umbrella on Wednesday."]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'You are a helpful weather assistant providing short, practical planning recommendations based on conditions.' }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Failed to fetch from Gemini API' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    let recommendations = [];
    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text;
      try {
        recommendations = JSON.parse(text || '[]');
      } catch (e) {
        // parsing failed
      }
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
