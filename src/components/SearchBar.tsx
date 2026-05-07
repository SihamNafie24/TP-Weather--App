"use client";

import { useState, useRef, type FormEvent } from "react";
import { Search, MapPin, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  loading: boolean;
  unit: "metric" | "imperial";
  onUnitToggle: () => void;
}

const QUICK_CITIES = ["London", "Tokyo", "New York", "Paris", "Sydney", "Dubai"];

export default function SearchBar({
  onSearch,
  onLocationSearch,
  loading,
  unit,
  onUnitToggle,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search Row */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        {/* Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={18}
          />
          <input
            ref={inputRef}
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city (e.g. London, Paris...)"
            disabled={loading}
            className="
              w-full pl-11 pr-9 py-3.5
              bg-white/[0.07] backdrop-blur-xl
              border border-white/10
              rounded-xl
              text-white placeholder:text-slate-400
              focus:outline-none focus:border-sky-500/50 focus:bg-white/[0.10]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm
            "
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          id="search-btn"
          type="submit"
          disabled={loading || !query.trim()}
          className="
            px-5 py-3.5
            bg-sky-500 hover:bg-sky-400
            text-white font-semibold rounded-xl text-sm
            transition-all duration-200 hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
            shadow-lg shadow-sky-500/30
          "
        >
          Search
        </button>

        {/* Location button */}
        <button
          id="location-btn"
          type="button"
          onClick={onLocationSearch}
          disabled={loading}
          title="Use my location"
          className="
            p-3.5
            bg-white/[0.07] hover:bg-white/[0.12]
            border border-white/10 hover:border-sky-500/40
            text-slate-300 hover:text-sky-400
            rounded-xl transition-all duration-200 hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          <MapPin size={18} />
        </button>

        {/* °C / °F Toggle */}
        <div className="flex bg-white/[0.07] border border-white/10 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => unit === "imperial" && onUnitToggle()}
            className={`px-3 py-3.5 text-xs font-bold transition-all duration-200 ${
              unit === "metric"
                ? "bg-sky-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => unit === "metric" && onUnitToggle()}
            className={`px-3 py-3.5 text-xs font-bold transition-all duration-200 ${
              unit === "imperial"
                ? "bg-sky-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            °F
          </button>
        </div>
      </form>

      {/* Quick-pick cities */}
      <div className="flex flex-wrap gap-2">
        {QUICK_CITIES.map((city) => (
          <button
            key={city}
            id={`quick-city-${city.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => onSearch(city)}
            disabled={loading}
            className="
              px-4 py-1.5 rounded-full text-xs font-medium
              bg-white/[0.07] hover:bg-white/[0.13]
              border border-white/10 hover:border-sky-500/40
              text-slate-300 hover:text-white
              transition-all duration-200 hover:scale-105
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
