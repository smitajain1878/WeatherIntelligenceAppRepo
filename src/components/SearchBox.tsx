import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { searchLocation } from '../lib/api';
import { LocationData } from '../types';

interface SearchBoxProps {
  onLocationSelect: (loc: LocationData) => void;
}

const RECENT_SEARCHES_KEY = 'atmos_recent_searches';

export default function SearchBox({ onLocationSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 2) {
        const res = await searchLocation(query);
        setResults(res);
        setIsOpen(true);
      } else {
        setResults([]);
      }
    };
    
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (loc: LocationData) => {
    const updated = [loc, ...recentSearches.filter(r => r.latitude !== loc.latitude && r.longitude !== loc.longitude)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSelect = (loc: LocationData) => {
    setQuery('');
    setIsOpen(false);
    saveRecentSearch(loc);
    onLocationSelect(loc);
  };

  const displayItems = query.length > 2 ? results : recentSearches;
  const showDropdown = isOpen && displayItems.length > 0;

  return (
    <div className="relative w-full max-w-md mx-auto" ref={wrapperRef}>
      <div className="relative flex items-center w-full h-12 rounded-2xl focus-within:shadow-lg bg-white overflow-hidden shadow-sm border border-slate-100 transition-shadow">
        <div className="grid place-items-center h-full w-12 text-slate-400">
          <Search size={20} />
        </div>
        <input
          className="peer h-full w-full outline-none text-sm text-slate-700 pr-2 bg-transparent"
          type="text"
          id="search"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
      </div>

      {showDropdown && (
        <ul className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2">
          {query.length <= 2 && recentSearches.length > 0 && (
            <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Recent Searches
            </div>
          )}
          {displayItems.map((loc, i) => (
            <li 
              key={i}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors"
              onClick={() => handleSelect(loc)}
            >
              {query.length <= 2 ? (
                <Clock size={18} className="text-slate-400 mt-0.5 shrink-0" />
              ) : (
                <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">{loc.name}</span>
                <span className="text-xs text-slate-500">
                  {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
