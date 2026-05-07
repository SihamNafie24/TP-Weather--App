"use client";

import dynamic from "next/dynamic";
import { AlertTriangle, Wind } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import SearchBar from "@/components/SearchBar";
import Loader from "@/components/Loader";

const WeatherCard = dynamic(() => import("@/components/WeatherCard"), {
  loading: () => <div className="h-64 rounded-3xl bg-white/[0.05] animate-pulse w-full max-w-2xl mx-auto" />,
});

const ForecastList = dynamic(() => import("@/components/ForecastList"), {
  loading: () => <div className="h-52 rounded-2xl bg-white/[0.05] animate-pulse w-full max-w-2xl mx-auto" />,
});

// ─── Error Banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="
        flex items-start gap-3
        bg-red-950/60 backdrop-blur-xl
        border border-red-500/20
        rounded-2xl p-5
      ">
        <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-red-300 font-semibold text-sm">Something went wrong</p>
          <p className="text-red-400/70 text-xs mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-sky-500/10 blur-2xl rounded-full scale-150" />
        <Wind className="relative text-sky-400/50 animate-float" size={56} />
      </div>
      <div>
        <h2 className="text-white font-bold text-xl mb-1">Discover the Weather</h2>
        <p className="text-slate-500 text-sm max-w-xs">
          Search for any city or use your location to get real-time conditions and a 5-day forecast.
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { weather, forecast, loading, error, unit, searchByCity, searchByLocation, toggleUnit } =
    useWeather();

  return (
    <main className="relative z-10 min-h-dvh flex flex-col">

      {/* ── Header ── */}
      <header className="w-full max-w-3xl mx-auto px-4 pt-6 pb-2 flex items-center">
        <div className="flex items-center gap-2.5">
          {/* Logo icon */}
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <span className="text-white text-sm font-black">S</span>
          </div>
          <span className="text-sky-400 font-black text-xl tracking-tight">SkyPulse</span>
        </div>
      </header>

      {/* ── Search section ── */}
      <section className="w-full max-w-3xl mx-auto px-4 pt-10 pb-8">
        <SearchBar
          onSearch={searchByCity}
          onLocationSearch={searchByLocation}
          loading={loading}
          unit={unit}
          onUnitToggle={toggleUnit}
        />
      </section>

      {/* ── Content ── */}
      <section className="flex-1 w-full max-w-3xl mx-auto px-4 pb-16 space-y-5">
        {loading && <Loader />}
        {!loading && error && <ErrorBanner message={error} />}
        {!loading && !error && !weather && <EmptyState />}
        {!loading && !error && weather && (
          <>
            <WeatherCard data={weather} unit={unit} />
            {forecast && <ForecastList data={forecast} unit={unit} />}
          </>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="w-full text-center py-5 text-slate-600 text-xs">
        Powered by{" "}
        <a
          href="https://openweathermap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-600 hover:text-sky-400 transition-colors"
        >
          OpenWeatherMap
        </a>
        {" "}· Built with Next.js &amp; Tailwind CSS
      </footer>
    </main>
  );
}
