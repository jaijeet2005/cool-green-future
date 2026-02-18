export interface CityData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  climate: "tropical" | "arid" | "subtropical" | "temperate" | "semi-arid";
  currentTemp: number;
  currentAQI: number;
  treeCoverPercent: number;
  urbanHeatIndex: number;
  monthlyTemp: number[];
  monthlyAQI: number[];
  aqiBreakdown: { label: string; value: number }[];
}

export const cities: CityData[] = [
  {
    id: "delhi",
    name: "Delhi",
    state: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    climate: "semi-arid",
    currentTemp: 42,
    currentAQI: 312,
    treeCoverPercent: 12.7,
    urbanHeatIndex: 8.4,
    monthlyTemp: [14, 17, 24, 33, 39, 42, 38, 35, 34, 29, 22, 16],
    monthlyAQI: [380, 340, 280, 200, 180, 160, 140, 150, 170, 290, 420, 400],
    aqiBreakdown: [
      { label: "PM2.5", value: 180 },
      { label: "PM10", value: 260 },
      { label: "NO₂", value: 62 },
      { label: "SO₂", value: 28 },
      { label: "O₃", value: 45 },
      { label: "CO", value: 32 },
    ],
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    climate: "subtropical",
    currentTemp: 40,
    currentAQI: 184,
    treeCoverPercent: 13.9,
    urbanHeatIndex: 7.3,
    monthlyTemp: [16, 19, 25, 33, 38, 40, 35, 33, 33, 30, 24, 18],
    monthlyAQI: [240, 220, 190, 150, 135, 120, 95, 100, 120, 165, 230, 250],
    aqiBreakdown: [
      { label: "PM2.5", value: 105 },
      { label: "PM10", value: 165 },
      { label: "NO₂", value: 50 },
      { label: "SO₂", value: 19 },
      { label: "O₃", value: 39 },
      { label: "CO", value: 25 },
    ],
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    lat: 19.076,
    lng: 72.8777,
    climate: "tropical",
    currentTemp: 34,
    currentAQI: 168,
    treeCoverPercent: 17.2,
    urbanHeatIndex: 6.1,
    monthlyTemp: [25, 26, 28, 31, 33, 34, 30, 29, 30, 31, 29, 26],
    monthlyAQI: [180, 170, 160, 130, 100, 80, 60, 65, 90, 140, 190, 200],
    aqiBreakdown: [
      { label: "PM2.5", value: 90 },
      { label: "PM10", value: 140 },
      { label: "NO₂", value: 48 },
      { label: "SO₂", value: 18 },
      { label: "O₃", value: 38 },
      { label: "CO", value: 24 },
    ],
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    climate: "tropical",
    currentTemp: 30,
    currentAQI: 98,
    treeCoverPercent: 22.5,
    urbanHeatIndex: 4.2,
    monthlyTemp: [22, 24, 27, 30, 30, 28, 26, 26, 26, 25, 23, 22],
    monthlyAQI: [120, 110, 100, 85, 70, 60, 55, 58, 65, 90, 115, 125],
    aqiBreakdown: [
      { label: "PM2.5", value: 52 },
      { label: "PM10", value: 85 },
      { label: "NO₂", value: 38 },
      { label: "SO₂", value: 12 },
      { label: "O₃", value: 32 },
      { label: "CO", value: 18 },
    ],
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    climate: "tropical",
    currentTemp: 36,
    currentAQI: 124,
    treeCoverPercent: 15.8,
    urbanHeatIndex: 5.8,
    monthlyTemp: [25, 27, 29, 32, 36, 38, 36, 35, 34, 30, 27, 25],
    monthlyAQI: [140, 130, 120, 100, 90, 85, 75, 80, 95, 120, 145, 150],
    aqiBreakdown: [
      { label: "PM2.5", value: 65 },
      { label: "PM10", value: 100 },
      { label: "NO₂", value: 42 },
      { label: "SO₂", value: 15 },
      { label: "O₃", value: 35 },
      { label: "CO", value: 20 },
    ],
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    climate: "subtropical",
    currentTemp: 37,
    currentAQI: 198,
    treeCoverPercent: 14.3,
    urbanHeatIndex: 7.1,
    monthlyTemp: [19, 23, 28, 33, 36, 37, 34, 33, 33, 30, 25, 20],
    monthlyAQI: [220, 200, 180, 150, 130, 120, 100, 110, 130, 180, 240, 250],
    aqiBreakdown: [
      { label: "PM2.5", value: 110 },
      { label: "PM10", value: 170 },
      { label: "NO₂", value: 52 },
      { label: "SO₂", value: 22 },
      { label: "O₃", value: 40 },
      { label: "CO", value: 28 },
    ],
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    lat: 17.385,
    lng: 78.4867,
    climate: "semi-arid",
    currentTemp: 38,
    currentAQI: 142,
    treeCoverPercent: 18.6,
    urbanHeatIndex: 5.5,
    monthlyTemp: [22, 25, 29, 34, 38, 36, 32, 31, 31, 28, 24, 22],
    monthlyAQI: [160, 150, 140, 120, 110, 90, 75, 80, 100, 135, 170, 175],
    aqiBreakdown: [
      { label: "PM2.5", value: 75 },
      { label: "PM10", value: 120 },
      { label: "NO₂", value: 45 },
      { label: "SO₂", value: 16 },
      { label: "O₃", value: 36 },
      { label: "CO", value: 22 },
    ],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    climate: "arid",
    currentTemp: 43,
    currentAQI: 210,
    treeCoverPercent: 8.2,
    urbanHeatIndex: 8.9,
    monthlyTemp: [15, 19, 26, 34, 40, 43, 38, 35, 34, 30, 23, 17],
    monthlyAQI: [250, 230, 200, 170, 150, 140, 120, 125, 145, 200, 260, 270],
    aqiBreakdown: [
      { label: "PM2.5", value: 120 },
      { label: "PM10", value: 200 },
      { label: "NO₂", value: 55 },
      { label: "SO₂", value: 20 },
      { label: "O₃", value: 42 },
      { label: "CO", value: 26 },
    ],
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    climate: "semi-arid",
    currentTemp: 33,
    currentAQI: 112,
    treeCoverPercent: 20.1,
    urbanHeatIndex: 4.8,
    monthlyTemp: [21, 23, 27, 32, 34, 33, 28, 27, 28, 28, 24, 21],
    monthlyAQI: [130, 120, 110, 95, 80, 70, 55, 60, 75, 105, 140, 145],
    aqiBreakdown: [
      { label: "PM2.5", value: 58 },
      { label: "PM10", value: 92 },
      { label: "NO₂", value: 40 },
      { label: "SO₂", value: 14 },
      { label: "O₃", value: 34 },
      { label: "CO", value: 19 },
    ],
  },
];

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getAQICategory(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "hsl(var(--aqi-good))" };
  if (aqi <= 100) return { label: "Moderate", color: "hsl(var(--aqi-moderate))" };
  if (aqi <= 200) return { label: "Poor", color: "hsl(var(--aqi-poor))" };
  return { label: "Hazardous", color: "hsl(var(--aqi-hazardous))" };
}

export function getHeatCategory(uhi: number): { label: string; color: string } {
  if (uhi <= 3) return { label: "Low", color: "hsl(var(--heat-low))" };
  if (uhi <= 5) return { label: "Moderate", color: "hsl(var(--heat-moderate))" };
  if (uhi <= 7) return { label: "High", color: "hsl(var(--heat-high))" };
  return { label: "Extreme", color: "hsl(var(--heat-extreme))" };
}
