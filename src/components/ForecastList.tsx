"use client";

import Image from "next/image";
import { Droplets, Wind } from "lucide-react";
import type { ForecastData, ForecastItem } from "@/types/weather";

interface ForecastListProps {
  data: ForecastData;
  unit: "metric" | "imperial";
}

function getDailyForecasts(list: ForecastItem[]): ForecastItem[] {
  const seen = new Set<string>();
  const daily: ForecastItem[] = [];
  for (const item of list) {
    const date = item.dt_txt.split(" ")[0];
    const hour = item.dt_txt.split(" ")[1];
    if (!seen.has(date) && hour >= "11:00:00") {
      seen.add(date);
      daily.push(item);
    }
  }
  if (daily.length < 3) {
    const seen2 = new Set<string>();
    return list.filter((item) => {
      const d = item.dt_txt.split(" ")[0];
      if (!seen2.has(d)) { seen2.add(d); return true; }
      return false;
    }).slice(0, 5);
  }
  return daily.slice(0, 5);
}

function formatDay(dtTxt: string): string {
  const date = new Date(dtTxt);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function formatDate(dtTxt: string): string {
  return new Date(dtTxt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ForecastCard({
  item,
  index,
  unit,
}: {
  item: ForecastItem;
  index: number;
  unit: "metric" | "imperial";
}) {
  const temp    = Math.round(item.main.temp);
  const tempMin = Math.round(item.main.temp_min);
  const tempMax = Math.round(item.main.temp_max);
  const ul      = unit === "metric" ? "°C" : "°F";

  return (
    <div
      className="flex-shrink-0 w-36 animate-fade-in"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="
        h-full flex flex-col items-center gap-3
        bg-white/[0.06] hover:bg-white/[0.11]
        border border-white/[0.08] hover:border-sky-500/30
        rounded-2xl p-4
        transition-all duration-200 hover:scale-105 hover:-translate-y-1
        cursor-default group
      ">
        {/* Day */}
        <div className="text-center">
          <p className="text-white font-semibold text-sm">{formatDay(item.dt_txt)}</p>
          <p className="text-slate-500 text-xs">{formatDate(item.dt_txt)}</p>
        </div>

        {/* Icon */}
        <div className="group-hover:scale-110 transition-transform duration-200">
          <Image
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt={item.weather[0].description}
            width={52}
            height={52}
            className="drop-shadow-lg"
          />
        </div>

        {/* Temp */}
        <div className="text-center">
          <p className="gradient-text font-black text-xl">{temp}{ul}</p>
          <p className="text-slate-500 text-xs capitalize mt-0.5">
            {item.weather[0].description}
          </p>
        </div>

        {/* Min / Max */}
        <div className="flex gap-2 text-xs font-semibold">
          <span className="text-sky-300">↓{tempMin}{ul}</span>
          <span className="text-rose-300">↑{tempMax}{ul}</span>
        </div>

        {/* Humidity + Wind */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1 text-slate-500">
              <Droplets size={10} className="text-sky-400" /> Hum.
            </span>
            <span className="text-slate-300">{item.main.humidity}%</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1 text-slate-500">
              <Wind size={10} className="text-sky-400" /> Wind
            </span>
            <span className="text-slate-300">{item.wind.speed} {unit === "metric" ? "m/s" : "mph"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForecastList({ data, unit }: ForecastListProps) {
  const days = getDailyForecasts(data.list);
  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
        5-Day Forecast
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {days.map((item, i) => (
          <ForecastCard key={item.dt} item={item} index={i} unit={unit} />
        ))}
      </div>
    </div>
  );
}
