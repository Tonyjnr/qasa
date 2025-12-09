/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance, type AxiosError } from "axios";
import { handleError } from "../lib/errorHandler";
import type { HistoricalTrendsData } from "../types/historicalData";

class HistoricalDataService {
  private api: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_TTL = 300000;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
      timeout: 10000,
    });
    this.cache = new Map();
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => Promise.reject(handleError(error))
    );
  }

  async getHistoricalAqi(
    monitoringStationId: string,
    days: number = 30
  ): Promise<HistoricalTrendsData> {
    const cacheKey = `history-${monitoringStationId}-${days}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      console.log(
        `[HistoricalDataService] Returning cached data for ${cacheKey}`
      );
      return cached;
    }

    console.log(
      `[HistoricalDataService] getHistoricalAqi called for station=${monitoringStationId}, days=${days}`
    );

    try {
      // Fetch from backend in future
      // const response = await this.api.get('/historical-aqi', {
      //   params: { monitoringStationId, days }
      // });
      // return response.data;

      // MOCK implementation
      console.log("[HistoricalDataService] Generating mock history...");
      const data = this.generateMockHistory(days);
      console.log("[HistoricalDataService] Generated mock data points:", {
        hourly: data.hourly.length,
        daily: data.daily.length,
      });

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error("[HistoricalDataService] Error generating history", error);
      throw error;
    }
  }

  private generateMockHistory(days: number): HistoricalTrendsData {
    const hourly = [];
    const daily = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString();

      const aqiAvg = Math.floor(Math.random() * 150) + 20;

      daily.push({
        date: dateStr,
        aqiAvg,
        aqiMin: Math.max(0, aqiAvg - 20),
        aqiMax: aqiAvg + 30,
        mainPollutant: "pm25",
      });

      // Generate some hourly points for the last few days
      if (i < 3) {
        for (let h = 0; h < 24; h += 4) {
          const hDate = new Date(date);
          hDate.setHours(h);
          hourly.push({
            date: hDate.toISOString(),
            aqi: Math.max(0, aqiAvg + (Math.random() * 20 - 10)),
            pm25: aqiAvg / 2,
          });
        }
      }
    }

    return {
      hourly: hourly.sort((a, b) => a.date.localeCompare(b.date)),
      daily: daily.sort((a, b) => a.date.localeCompare(b.date)),
    };
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
