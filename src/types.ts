export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

export interface DailyWeather {
  dates: string[];
  weatherCodes: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitationProb: number[];
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Region
}
