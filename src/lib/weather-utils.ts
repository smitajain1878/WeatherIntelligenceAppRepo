import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudRain, 
  CloudDrizzle, 
  CloudSnow, 
  CloudLightning,
  LucideIcon
} from 'lucide-react';

export function getWeatherInfo(code: number): { label: string; Icon: LucideIcon } {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  switch (code) {
    case 0:
      return { label: 'Clear sky', Icon: Sun };
    case 1:
    case 2:
    case 3:
      return { label: 'Partly cloudy', Icon: CloudSun };
    case 45:
    case 48:
      return { label: 'Fog', Icon: CloudFog };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { label: 'Drizzle', Icon: CloudDrizzle };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return { label: 'Rain', Icon: CloudRain };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { label: 'Snow', Icon: CloudSnow };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', Icon: CloudLightning };
    default:
      return { label: 'Unknown', Icon: Cloud };
  }
}

export function isSevereWeather(code: number, windSpeed: number): boolean {
  // Rough proxy for severe weather: thunderstorms, heavy snow/rain, or high wind (> 60km/h)
  const severeCodes = [65, 67, 75, 77, 82, 86, 95, 96, 99];
  return severeCodes.includes(code) || windSpeed > 60;
}
