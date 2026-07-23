import { CurrentWeather, LocationData } from '../types';
import { getWeatherInfo } from '../lib/weather-utils';
import { Droplets, Wind, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface CurrentWeatherCardProps {
  location: LocationData;
  weather: CurrentWeather;
}

export default function CurrentWeatherCard({ location, weather }: CurrentWeatherCardProps) {
  const { label, Icon } = getWeatherInfo(weather.weatherCode);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-8"
    >
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center gap-2 text-slate-500 mb-6">
          <MapPin size={18} />
          <h2 className="text-lg font-medium">{location.name}, {location.country}</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <Icon size={64} className="text-slate-700" strokeWidth={1.5} />
          <div>
            <div className="text-6xl font-light text-slate-800 tracking-tighter">
              {Math.round(weather.temperature)}°
            </div>
            <div className="text-lg font-medium text-slate-500 mt-1">{label}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 md:flex-col md:gap-4 md:mt-14">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-full">
            <Droplets size={20} />
          </div>
          <div>
            <div className="text-sm text-slate-400">Humidity</div>
            <div className="font-medium">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <div className="p-3 bg-teal-50 text-teal-500 rounded-full">
            <Wind size={20} />
          </div>
          <div>
            <div className="text-sm text-slate-400">Wind</div>
            <div className="font-medium">{weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
