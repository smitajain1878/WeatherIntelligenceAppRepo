import { DailyWeather } from '../types';
import { getWeatherInfo } from '../lib/weather-utils';
import { motion } from 'motion/react';

export default function ForecastList({ daily }: { daily: DailyWeather }) {
  // Get days starting from tomorrow
  const forecastDays = daily.dates.slice(1, 8).map((dateStr, i) => {
    const date = new Date(dateStr);
    return {
      dayName: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
      maxTemp: daily.temperatureMax[i + 1],
      minTemp: daily.temperatureMin[i + 1],
      code: daily.weatherCodes[i + 1],
      precip: daily.precipitationProb[i + 1],
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 h-full"
    >
      <h3 className="text-lg font-medium text-slate-700 mb-6">7-Day Forecast</h3>
      <div className="flex flex-col gap-4">
        {forecastDays.map((day, i) => {
          const { Icon } = getWeatherInfo(day.code);
          return (
            <div key={i} className="flex items-center justify-between text-slate-600">
              <div className="w-12 font-medium">{i === 0 ? 'Tmrw' : day.dayName}</div>
              <div className="flex items-center gap-4 flex-1 justify-center">
                <Icon size={24} className="text-slate-400" />
                <div className="text-xs text-blue-400 w-8 text-right">
                  {day.precip > 0 ? `${day.precip}%` : ''}
                </div>
              </div>
              <div className="flex gap-4 w-24 justify-end font-medium">
                <span className="text-slate-800">{Math.round(day.maxTemp)}°</span>
                <span className="text-slate-400">{Math.round(day.minTemp)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
