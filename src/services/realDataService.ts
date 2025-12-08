/* eslint-disable @typescript-eslint/no-explicit-any */
import { openWeatherApi, geoApi } from "./api";
import { subDays, format } from "date-fns";
import axios from "axios";

// Real-time global city monitoring
export async function fetchGlobalCityAQI(cities: string[]) {
  const promises = cities.map(async (cityQuery) => {
    try {
      // 1. Get coordinates
      const geoRes = await geoApi.get("/direct", {
        params: { q: cityQuery, limit: 1 },
      });

      if (!geoRes.data || geoRes.data.length === 0) {
        throw new Error(`City not found: ${cityQuery}`);
      }

      const { lat, lon, name, country } = geoRes.data[0];

      // 2. Get AQI
      const aqiRes = await openWeatherApi.get("/air_pollution", {
        params: { lat, lon },
      });

      const aqi = mapOWMAqiToScale(aqiRes.data.list[0].main.aqi);

      return {
        city: `${name}, ${country}`,
        aqi,
        status: getAQIStatus(aqi),
      };
    } catch (error) {
      console.error(`Failed to fetch AQI for ${cityQuery}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((r) => r !== null);
}

// Fetch historical AQI using Open-Meteo (Free, Production-Grade)
export async function fetchHistoricalAQI(lat: number, lon: number, days = 30) {
  try {
    const endDate = new Date();
    const startDate = subDays(endDate, days);

    const response = await axios.get(
      "https://air-quality-api.open-meteo.com/v1/air-quality",
      {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: "us_aqi", // Directly fetch US AQI
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          timezone: "auto",
        },
      }
    );

    const hourly = response.data.hourly;
    const timeArray = hourly.time;
    const aqiArray = hourly.us_aqi;

    // Aggregate hourly data into daily averages for the chart
    const dailyData: any[] = [];
    const tempMap = new Map<string, { sum: number; count: number }>();

    timeArray.forEach((timestamp: string, index: number) => {
      // timestamp is ISO like "2024-01-01T00:00"
      const dateStr = timestamp.split("T")[0];
      const val = aqiArray[index];

      if (val !== null && val !== undefined) {
        if (!tempMap.has(dateStr)) {
          tempMap.set(dateStr, { sum: 0, count: 0 });
        }
        const entry = tempMap.get(dateStr)!;
        entry.sum += val;
        entry.count += 1;
      }
    });

    tempMap.forEach((value, key) => {
      dailyData.push({
        date: key, // YYYY-MM-DD
        aqiAvg: Math.round(value.sum / value.count),
      });
    });

    return dailyData;
  } catch (error) {
    console.error("Failed to fetch historical AQI from Open-Meteo:", error);
    throw error;
  }
}

/**
 * Alternative: Use WAQI for historical data (limited free tier)
 */
export async function fetchWAQIHistorical(cityName: string) {
  try {
    const response = await fetch(
      `https://api.waqi.info/feed/${cityName}/?token=${
        import.meta.env.VITE_WAQI_TOKEN
      }`
    );

    if (!response.ok) throw new Error("WAQI API failed");

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("WAQI returned error");
    }

    // WAQI doesn't provide historical in free tier either
    // You'll need to store readings yourself
    console.warn("WAQI free tier also lacks historical data");

    return [];
  } catch (error) {
    console.error("Failed to fetch WAQI historical data:", error);
    throw error;
  }
}

// Real monitoring stations near location
export async function fetchNearbyStations(lat: number, lon: number) {
  // For now, we'll use WAQI to find nearby stations
  try {
    const response = await fetch(
      `https://api.waqi.info/map/bounds/?latlng=${lat - 0.5},${lon - 0.5},${
        lat + 0.5
      },${lon + 0.5}&token=${import.meta.env.VITE_WAQI_TOKEN}`
    );

    if (!response.ok) throw new Error("WAQI API failed");

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("WAQI returned error");
    }

    return data.data.map((station: any) => ({
      name: station.station.name,
      lat: station.lat,
      lng: station.lon,
      aqi: station.aqi === "-" ? 0 : station.aqi,
      status: station.aqi === "-" ? "Offline" : "Active",
    }));
  } catch (error) {
    console.error("Failed to fetch nearby stations:", error);
    // Fallback to major cities if WAQI fails
    return await fetchGlobalCityAQI([
      "Lagos,NG",
      "London,UK",
      "New York,US",
      "Tokyo,JP",
    ]);
  }
}

// ============================================================================
// CRON JOB HELPER (for storing historical data)
// ============================================================================

/**
 * This function should be called by a cron job every hour
 * to build up historical data in your database
 *
 * Setup:
 * 1. Create a serverless function (Vercel, Netlify, etc.)
 * 2. Schedule it to run every hour using cron
 * 3. Store results in your Neon database
 *
 * Example cron: 0 * * * * (every hour)
 */
export async function storeAQIReading(
  locationId: string,
  lat: number,
  lon: number
) {
  try {
    const aqiRes = await openWeatherApi.get("/air_pollution", {
      params: { lat, lon },
    });

    const data = aqiRes.data.list[0];

    const reading = {
      locationId,
      recordedAt: new Date(),
      aqi: mapOWMAqiToScale(data.main.aqi),
      pm25: data.components.pm2_5,
      pm10: data.components.pm10,
      o3: data.components.o3,
      no2: data.components.no2,
      so2: data.components.so2,
      co: data.components.co,
    };

    // Note: Database insertion logic should be here if running in a Node environment
    // For this client-side file, we return the reading to be used by a backend service.
    // In a real implementation, this file would likely be shared or this function
    // would live in an API route.

    console.log(`✅ Collected AQI reading for ${locationId}:`, reading.aqi);
    return reading;
  } catch (error) {
    console.error("Failed to store AQI reading:", error);
    throw error;
  }
}

// Helper functions
function mapOWMAqiToScale(owmAqi: number): number {
  const mapping: Record<number, number> = {
    1: 40,
    2: 80,
    3: 120,
    4: 180,
    5: 250,
  };
  return mapping[owmAqi] || 50;
}

function getAQIStatus(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}
