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
  console.log(
    `[fetchAirQuality] Fetching for: lat=${lat}, lng=${lng}, name=${locationName}`
  );
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
          console.log("[fetchAirQuality] Reverse geocoding successful:", geoRes.data[0]);
          const { name, country } = geoRes.data[0];
          resolvedName = `${name}, ${country}`;
        } else {
          console.warn("[fetchAirQuality] Reverse geocoding returned no results for coordinates.");
        }
      } catch (geoError) {
        console.warn("Reverse geocoding failed, using coordinates", geoError);
        resolvedName = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
      }
    }

    if (
      resolvedName === "Selected Location" ||
      resolvedName === "Unknown" ||
      resolvedName === `${lat.toFixed(2)}, ${lng.toFixed(2)}`
    ) {
      console.warn(
        `[fetchAirQuality] Resolved name '${resolvedName}' still looks generic. Check geocoding logic or input.`
      );
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
        time: new Date(item.dt * 1000).toISOString(),
        aqi: mapOWMAqiToScale(item.main.aqi),
        icon: item.main.aqi <= 2 ? "cloud" : "sun", // Simple icon logic
      })) as ForecastItem[],
    };
  } catch (error: any) {
    console.error("Failed to fetch air quality data:", error);
    if (error.response) {
      console.error("API Response Error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        params: error.config?.params,
      });
    }
    throw error;
  }
};
