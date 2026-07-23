import { CurrentWeather, DailyWeather, LocationData } from '../types';

export const searchLocation = async (query: string): Promise<LocationData[]> => {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    if (!res.ok) throw new Error('Failed to fetch location');
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchWeather = async (lat: number, lon: number) => {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();
    
    const current: CurrentWeather = {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    };

    const daily: DailyWeather = {
      dates: data.daily.time,
      weatherCodes: data.daily.weather_code,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
      precipitationProb: data.daily.precipitation_probability_max,
    };

    return { current, daily };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchRecommendations = async (city: string, current: CurrentWeather, daily: DailyWeather): Promise<string[]> => {
  try {
    const res = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city, current, daily }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch recommendations');
    }
    return data.recommendations || [];
  } catch (error: any) {
    console.error(error);
    return [error.message || 'Could not fetch recommendations.'];
  }
};
