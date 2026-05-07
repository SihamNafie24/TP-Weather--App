"use client";

import { useState, useCallback, useEffect } from "react";
import type { WeatherData, ForecastData, WeatherState } from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const LAST_CITY_KEY = "weather_last_city";
const UNIT_KEY = "weather_unit";

type Unit = "metric" | "imperial";

async function fetchWeatherByCity(city: string, unit: Unit): Promise<WeatherData> {
  const res = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error("City not found. Please check the spelling.");
    if (res.status === 401) throw new Error("Invalid API key. Update NEXT_PUBLIC_WEATHER_API_KEY in .env.local");
    throw new Error("Failed to fetch weather. Please try again.");
  }
  return res.json();
}

async function fetchForecastByCity(city: string, unit: Unit): Promise<ForecastData> {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch forecast data.");
  return res.json();
}

async function fetchWeatherByCoords(lat: number, lon: number, unit: Unit): Promise<WeatherData> {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch weather for your location.");
  return res.json();
}

async function fetchForecastByCoords(lat: number, lon: number, unit: Unit): Promise<ForecastData> {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch forecast for your location.");
  return res.json();
}

export function useWeather() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [lastCity, setLastCity] = useState<string | null>(null);
  const [state, setState] = useState<WeatherState>({
    weather: null,
    forecast: null,
    loading: false,
    error: null,
  });

  const searchByCity = useCallback(async (city: string, u?: Unit) => {
    if (!city.trim()) return;
    const activeUnit = u ?? unit;
    setState({ weather: null, forecast: null, loading: true, error: null });
    try {
      const [weather, forecast] = await Promise.all([
        fetchWeatherByCity(city, activeUnit),
        fetchForecastByCity(city, activeUnit),
      ]);
      setState({ weather, forecast, loading: false, error: null });
      localStorage.setItem(LAST_CITY_KEY, city);
      setLastCity(city);
    } catch (err) {
      setState({
        weather: null, forecast: null, loading: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    }
  }, [unit]);

  const searchByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((p) => ({ ...p, error: "Geolocation not supported by your browser." }));
      return;
    }
    setState({ weather: null, forecast: null, loading: true, error: null });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const [weather, forecast] = await Promise.all([
            fetchWeatherByCoords(coords.latitude, coords.longitude, unit),
            fetchForecastByCoords(coords.latitude, coords.longitude, unit),
          ]);
          setState({ weather, forecast, loading: false, error: null });
          localStorage.setItem(LAST_CITY_KEY, weather.name);
          setLastCity(weather.name);
        } catch (err) {
          setState({
            weather: null, forecast: null, loading: false,
            error: err instanceof Error ? err.message : "Location fetch failed.",
          });
        }
      },
      () => {
        setState({
          weather: null, forecast: null, loading: false,
          error: "Location access denied. Please allow location or search manually.",
        });
      }
    );
  }, [unit]);

  // Toggle °C / °F — re-fetch current city with new unit
  const toggleUnit = useCallback(() => {
    const next: Unit = unit === "metric" ? "imperial" : "metric";
    setUnit(next);
    localStorage.setItem(UNIT_KEY, next);
    if (lastCity) searchByCity(lastCity, next);
  }, [unit, lastCity, searchByCity]);

  // Restore preferences on mount
  useEffect(() => {
    const savedUnit = (localStorage.getItem(UNIT_KEY) as Unit) ?? "metric";
    setUnit(savedUnit);
    const city = localStorage.getItem(LAST_CITY_KEY);
    if (city) {
      setLastCity(city);
      searchByCity(city, savedUnit);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, unit, searchByCity, searchByLocation, toggleUnit };
}
