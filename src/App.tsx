import { useState, useEffect } from 'react';
import SearchBox from './components/SearchBox';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastList from './components/ForecastList';
import RecommendationsPanel from './components/RecommendationsPanel';
import { fetchWeather, fetchRecommendations } from './lib/api';
import { CurrentWeather, DailyWeather, LocationData } from './types';
import { isSevereWeather } from './lib/weather-utils';
import { Bell, BellOff, CloudLightning } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<{ current: CurrentWeather; daily: DailyWeather } | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  
  // Simulated Notification State
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Default city on load
  useEffect(() => {
    handleLocationSelect({
      name: 'London',
      country: 'United Kingdom',
      latitude: 51.5085,
      longitude: -0.1257
    });
  }, []);

  const handleLocationSelect = async (loc: LocationData) => {
    setLocation(loc);
    setLoadingWeather(true);
    setWeatherData(null);
    setRecommendations([]);
    setActiveAlert(null);

    const data = await fetchWeather(loc.latitude, loc.longitude);
    setWeatherData(data);
    setLoadingWeather(false);

    if (data) {
      // Check for severe weather if alerts are enabled
      if (alertsEnabled && isSevereWeather(data.current.weatherCode, data.current.windSpeed)) {
        setActiveAlert(`Severe weather conditions detected in ${loc.name}. Please take precautions.`);
        // Also trigger browser notification if supported and granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Weather Alert', { body: `Severe conditions in ${loc.name}` });
        }
      }

      setLoadingRecs(true);
      const recs = await fetchRecommendations(loc.name, data.current, data.daily);
      setRecommendations(recs);
      setLoadingRecs(false);
    }
  };

  const toggleAlerts = () => {
    if (!alertsEnabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setAlertsEnabled(true);
        } else {
          alert('Please allow notifications in your browser settings to enable alerts.');
        }
      });
    } else {
      setAlertsEnabled(!alertsEnabled);
      if (alertsEnabled) setActiveAlert(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-blue-600/20">
              <CloudLightning size={24} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Atmos</h1>
          </div>
          
          <div className="flex-1 w-full flex justify-center">
            <SearchBox onLocationSelect={handleLocationSelect} />
          </div>

          <button 
            onClick={toggleAlerts}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              alertsEnabled 
                ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' 
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {alertsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            <span className="hidden sm:inline">Alerts {alertsEnabled ? 'On' : 'Off'}</span>
          </button>
        </header>

        {/* Severe Alert Banner */}
        <AnimatePresence>
          {activeAlert && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-rose-500 text-white p-4 rounded-2xl shadow-sm flex items-start gap-3 overflow-hidden"
            >
              <Bell className="mt-0.5 shrink-0" size={20} />
              <p className="font-medium text-rose-50 leading-relaxed">{activeAlert}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main>
          {loadingWeather ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <div className="animate-pulse flex items-center gap-3">
                <div className="w-2 h-2 bg-slate-400 rounded-full" />
                <div className="w-2 h-2 bg-slate-400 rounded-full" />
                <div className="w-2 h-2 bg-slate-400 rounded-full" />
              </div>
            </div>
          ) : location && weatherData ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 flex flex-col gap-8">
                <CurrentWeatherCard location={location} weather={weatherData.current} />
                <RecommendationsPanel recommendations={recommendations} loading={loadingRecs} />
              </div>
              
              <div className="lg:col-span-4">
                <ForecastList daily={weatherData.daily} />
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              Search for a location to view weather intelligence.
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
}
