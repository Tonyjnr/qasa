/* eslint-disable @typescript-eslint/no-explicit-any */
import { openWeatherApi, geoApi } from "./api";
import type { AQIData, ForecastItem } from "../types";

// Helper to map OWM 1-5 AQI to 0-500 scale approximation
const mapOWMAqiToScale = (owmAqi: number): number => {
  const mapping: Record<number, number> = {
    1: 40, // Good
    2: 80, // Fair
    3: 120, // Moderate
    4: 180, // Poor
    5: 250, // Very Poor
  };
  return mapping[owmAqi] || 50;
};

export const fetchAirQuality = async (
  lat: number,
  lng: number,
  locationName: string
): Promise<AQIData> => {
  try {
    let resolvedName = locationName;

    // If name is generic, try reverse geocoding
    if (
      !locationName ||
      locationName === "Selected Location" ||
      locationName === "Unknown"
    ) {
      try {
        const geoRes = await geoApi.get("/reverse", {
          params: { lat, lon: lng, limit: 1 },
        });
        if (geoRes.data && geoRes.data.length > 0) {
          const { name, country } = geoRes.data[0];
          resolvedName = `${name}, ${country}`;
        }
      } catch (geoError) {
        console.warn("Reverse geocoding failed, using coordinates", geoError);
        resolvedName = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
      }
    }

    // 1. Current Pollution
    const currentRes = await openWeatherApi.get("/air_pollution", {
      params: { lat, lon: lng },
    });
    const current = currentRes.data.list[0];

    // 2. Forecast (for graph/list)
    const forecastRes = await openWeatherApi.get("/air_pollution/forecast", {
      params: { lat, lon: lng },
    });
    const forecastList = forecastRes.data.list.slice(0, 8); // Next 8 entries (hourly)

    return {
      aqi: mapOWMAqiToScale(current.main.aqi),
      location: { name: resolvedName, lat, lng },
      pollutants: {
        pm25: current.components.pm2_5,
        pm10: current.components.pm10,
        o3: current.components.o3,
        no2: current.components.no2,
        so2: current.components.so2,
        co: current.components.co,
      },
      forecast: forecastList.map((item: any) => ({
        time: new Date(item.dt * 1000).getHours() + ":00",
        aqi: mapOWMAqiToScale(item.main.aqi),
        icon: item.main.aqi <= 2 ? "cloud" : "sun", // Simple icon logic
      })) as ForecastItem[],
    };
  } catch (error) {
    console.error("Failed to fetch air quality data:", error);
    throw error;
  }
};
