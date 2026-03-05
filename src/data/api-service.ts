/**
 * Mock API service layer — structured for future swap to real APIs
 * (OpenWeatherMap, WAQI, Google Earth Engine)
 */

import { CityData } from "./cities";

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  description: string;
  source: "mock" | "openweathermap";
}

export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  source: "mock" | "waqi";
}

export interface CanopyData {
  coverPercent: number;
  densityScore: number;
  source: "mock" | "gee";
}

// Simulate network delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch real-time weather data for a location.
 * Currently returns mock data; swap implementation for OpenWeatherMap.
 */
export async function fetchWeatherData(city: CityData): Promise<WeatherData> {
  await delay(300 + Math.random() * 200);

  // Add slight randomness to simulate live data
  const jitter = (Math.random() - 0.5) * 2;
  return {
    temp: +(city.currentTemp + jitter).toFixed(1),
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: +(5 + Math.random() * 15).toFixed(1),
    feelsLike: +(city.currentTemp + jitter + 2).toFixed(1),
    description: city.currentTemp > 38 ? "Extreme heat" : city.currentTemp > 30 ? "Hot" : "Warm",
    source: "mock",
  };
}

/**
 * Fetch real-time AQI data for a location.
 * Currently returns mock data; swap implementation for WAQI.
 */
export async function fetchAQIData(city: CityData): Promise<AQIData> {
  await delay(250 + Math.random() * 200);

  const jitter = Math.round((Math.random() - 0.5) * 10);
  const breakdown = city.aqiBreakdown;
  return {
    aqi: city.currentAQI + jitter,
    pm25: (breakdown.find((b) => b.label === "PM2.5")?.value ?? 50) + jitter,
    pm10: (breakdown.find((b) => b.label === "PM10")?.value ?? 80) + jitter,
    o3: (breakdown.find((b) => b.label === "O₃")?.value ?? 30) + Math.round(jitter / 2),
    no2: (breakdown.find((b) => b.label === "NO₂")?.value ?? 40) + Math.round(jitter / 2),
    so2: (breakdown.find((b) => b.label === "SO₂")?.value ?? 15) + Math.round(jitter / 3),
    co: (breakdown.find((b) => b.label === "CO")?.value ?? 20) + Math.round(jitter / 3),
    source: "mock",
  };
}

/**
 * Fetch canopy cover data for a location.
 * Currently returns mock data; swap for Google Earth Engine.
 */
export async function fetchCanopyData(city: CityData): Promise<CanopyData> {
  await delay(200 + Math.random() * 150);
  return {
    coverPercent: city.treeCoverPercent + (Math.random() - 0.5) * 2,
    densityScore: +(city.treeCoverPercent / 5).toFixed(1),
    source: "mock",
  };
}
