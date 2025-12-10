/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleError } from "../lib/errorHandler";
import type { HistoricalTrendsData } from "../types/historicalData";
import { fetchHistoricalAQI } from "./realDataService";
import { monitoringStationsService } from "./monitoringStationsService";

class HistoricalDataService {
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_TTL = 300000;

  constructor() {
    this.cache = new Map();
  }

  async getHistoricalAqi(
    monitoringStationId: string,
    days: number = 30
  ): Promise<HistoricalTrendsData> {
    const cacheKey = `history-${monitoringStationId}-${days}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      console.log(`[HistoricalDataService] Fetching real data for ${monitoringStationId}...`);
      
      // 1. Resolve Station ID to Coordinates
      // In a real app, this would be a DB lookup. 
      // For now, we try to find it in our known stations or fallback to default
      const stations = await monitoringStationsService.getStations();
      const station = stations.find(s => s.id === monitoringStationId);
      
      let lat, lng;
      if (station) {
        lat = station.lat;
        lng = station.lng;
      } else {
        // Fallback for demo if ID is generic
        lat = 6.5244; 
        lng = 3.3792;
      }

      // 2. Fetch from Real Data Service (Open-Meteo)
      const rawData = await fetchHistoricalAQI(lat, lng, days);

      // 3. Transform to HistoricalTrendsData format
      const hourly = rawData.map((d: any) => ({
        date: new Date(d.date).toISOString(), // Ensure ISO string
        aqi: d.aqiAvg, // Using daily avg as hourly placeholder if raw is daily
        pm25: d.aqiAvg / 2, // Estimate
        pm10: d.aqiAvg / 1.5 // Estimate
      }));

      // For this specific chart, we can just duplicate hourly as daily since fetchHistoricalAQI 
      // currently returns daily aggregates in your realDataService implementation.
      const daily = rawData.map((d: any) => ({
        date: d.date,
        aqiAvg: d.aqiAvg,
        aqiMin: d.aqiAvg - 10,
        aqiMax: d.aqiAvg + 15,
        mainPollutant: "pm25"
      }));

      const data = { hourly, daily };
      this.setCache(cacheKey, data);
      return data;

    } catch (error) {
      console.error("[HistoricalDataService] Error fetching history", error);
      throw handleError(error);
    }
  }

  private getCached(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

export const historicalDataService = new HistoricalDataService();
