import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Recommendations
  app.post('/api/recommendations', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is missing. Please configure it in the Settings menu.' });
      }

      const { current, daily, city } = req.body;
      
      const ai = new GoogleGenAI({});

      const prompt = `Based on the weather forecast for ${city}, provide 3-4 simple, actionable planning recommendations.
Current weather: ${current.temperature}°C, ${current.humidity}% humidity, wind ${current.windSpeed} km/h.
7-day forecast overview: Max temp ranges from ${Math.min(...daily.temperatureMax)}°C to ${Math.max(...daily.temperatureMax)}°C.
Format your response as a clean, simple JSON array of strings. Do not use markdown blocks. Example: ["Wear a jacket today.", "Good weather for a run on Tuesday.", "Bring an umbrella on Wednesday."]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a helpful weather assistant providing short, practical planning recommendations based on conditions.',
          responseMimeType: 'application/json'
        }
      });

      const recommendations = JSON.parse(response.text || '[]');
      res.json({ recommendations });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
