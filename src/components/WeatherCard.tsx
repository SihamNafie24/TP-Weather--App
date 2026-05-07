"use client";

import Image from "next/image";
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, MapPin } from "lucide-react";
import type { WeatherData } from "@/types/weather";

interface WeatherCardProps {
  data: WeatherData;
  unit: "metric" | "imperial";
}

function formatTime(unix: number, timezone: number): string {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
}

function getWindDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

const unitLabel = (unit: "metric" | "imperial") => (unit === "metric" ? "°C" : "°F");
const speedLabel = (unit: "metric" | "imperial") => (unit === "metric" ? "m/s" : "mph");

interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Stat({ icon, label, value }: StatProps) {
  return (
    <div className="
      flex flex-col items-center gap-1.5
      bg-white/[0.05] hover:bg-white/[0.09]
      border border-white/[0.08] hover:border-sky-500/30
      rounded-2xl px-3 py-3
      transition-all duration-200 hover:scale-105
      group cursor-default
    ">
      <span className="text-sky-400 group-hover:text-sky-300 transition-colors">{icon}</span>
      <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">{label}</span>
      <span className="text-white font-semibold text-xs text-center">{value}</span>
    </div>
  );
}

export default function WeatherCard({ data, unit }: WeatherCardProps) {
  const icon = data.weather[0].icon;
  const description = data.weather[0].description;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const tempMin = Math.round(data.main.temp_min);
  const tempMax = Math.round(data.main.temp_max);
  const ul = unitLabel(unit);
  const sl = speedLabel(unit);

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="
        relative overflow-hidden rounded-3xl
        bg-white/[0.07] backdrop-blur-xl
        border border-white/10
        shadow-2xl shadow-black/40
        p-6 sm:p-8
      ">
        {/* Subtle top glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
        {/* Corner glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* City + Icon row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={14} className="text-sky-400" />
              <span className="text-sky-300 text-xs font-semibold tracking-wide">
                {data.sys.country}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              {data.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1.5 capitalize">{description}</p>
          </div>
          <div className="animate-float -mt-2 -mr-2">
            <Image
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt={description}
              width={96}
              height={96}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-end gap-4 mb-6">
          <span className="gradient-text text-8xl sm:text-9xl font-black tracking-tighter leading-none">
            {temp}°
          </span>
          <div className="pb-4 space-y-1">
            <p className="text-slate-400 text-sm">
              Feels like{" "}
              <span className="text-white font-semibold">{feelsLike}{ul}</span>
            </p>
            <p className="text-sm">
              <span className="text-sky-300 font-medium">↓ {tempMin}{ul}</span>
              <span className="text-slate-600 mx-1.5">·</span>
              <span className="text-rose-300 font-medium">↑ {tempMax}{ul}</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.07] mb-5" />

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <Stat icon={<Droplets size={16} />} label="Humidity" value={`${data.main.humidity}%`} />
          <Stat icon={<Wind size={16} />}    label="Wind"     value={`${data.wind.speed} ${sl} ${getWindDirection(data.wind.deg)}`} />
          <Stat icon={<Eye size={16} />}     label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
          <Stat icon={<Gauge size={16} />}   label="Pressure"  value={`${data.main.pressure} hPa`} />
          <Stat icon={<Sunrise size={16} />} label="Sunrise"   value={formatTime(data.sys.sunrise, data.timezone)} />
          <Stat icon={<Sunset size={16} />}  label="Sunset"    value={formatTime(data.sys.sunset, data.timezone)} />
        </div>

        {/* Cloud bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Cloud cover</span>
            <span>{data.clouds.all}%</span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-1">
            <div
              className="h-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-400 transition-all duration-700"
              style={{ width: `${data.clouds.all}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
