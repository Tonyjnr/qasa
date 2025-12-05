import { useState } from "react";
import type { AQIData } from "../types";

// Mock Data
export const MOCK_DATA: AQIData = {
  aqi: 87,
  location: { name: "Lagos, NG", lat: 6.5244, lng: 3.3792 },
  pollutants: {
    pm25: 12.5,
    pm10: 24.1,
    o3: 45.2,
    no2: 18.3,
    so2: 5.4,
    co: 0.8,
  },
  forecast: [
    { time: "10AM", aqi: 82, icon: "cloud" },
    { time: "12PM", aqi: 95, icon: "sun" },
    { time: "2PM", aqi: 110, icon: "sun" },
    { time: "4PM", aqi: 85, icon: "cloud" },
  ],
};

export function useAirQuality() {
  const [data, setData] = useState<AQIData>(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        aqi: Math.floor(Math.random() * (120 - 50) + 50),
        pollutants: {
          pm25: +(Math.random() * 20).toFixed(1),
          pm10: +(Math.random() * 30).toFixed(1),
          o3: +(Math.random() * 50).toFixed(1),
          no2: +(Math.random() * 20).toFixed(1),
          so2: +(Math.random() * 10).toFixed(1),
          co: +(Math.random() * 2).toFixed(1),
        },
      }));
      setIsLoading(false);
    }, 800);
  };

  return { data, isLoading, refresh };
}
