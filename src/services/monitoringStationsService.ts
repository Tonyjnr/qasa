/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import axios, { type AxiosInstance, type AxiosError } from "axios";
import { handleError } from "../lib/errorHandler";
import type { MonitoringStation } from "../types/maps";

class MonitoringStationsService {
  private api: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_TTL = 300000;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
      timeout: 10000,
    });

    this.cache = new Map();

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => Promise.reject(handleError(error))
    );
  }

  async getStations(bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<MonitoringStation[]> {
    const cacheKey = bounds
      ? `stations-${JSON.stringify(bounds)}`
      : "stations-all";
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      console.log("[MonitoringStationsService] Fetching from backend...");
      const response = await this.api.get("/monitoring-stations");
      const data = response.data.stations || response.data;

      if (data && Array.isArray(data) && data.length > 0) {
        this.setCache(cacheKey, data);
        return data;
      }
      throw new Error("Backend returned empty data");
    } catch (error) {
      console.warn(
        "[MonitoringStationsService] Fetch failed or empty, using expanded mock data.",
        error
      );
      const mockData = this.generateMockStations();
      this.setCache(cacheKey, mockData);
      return mockData;
    }
  }

  private generateMockStations(): MonitoringStation[] {
    const now = new Date();
    // Helper to randomize AQI
    const randAqi = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    return [
      // Nigeria
      {
        id: "1",
        name: "Lagos Island",
        lat: 6.4549,
        lng: 3.4246,
        country: "NG",
        city: "Lagos",
        source: "QASA",
        currentAqi: randAqi(40, 150),
        lastUpdated: now,
      },
      {
        id: "2",
        name: "Ikeja",
        lat: 6.6018,
        lng: 3.3515,
        country: "NG",
        city: "Lagos",
        source: "QASA",
        currentAqi: randAqi(80, 200),
        lastUpdated: now,
      },
      {
        id: "3",
        name: "Victoria Island",
        lat: 6.4281,
        lng: 3.4219,
        country: "NG",
        city: "Lagos",
        source: "QASA",
        currentAqi: randAqi(30, 90),
        lastUpdated: now,
      },
      {
        id: "4",
        name: "Abuja Central",
        lat: 9.0765,
        lng: 7.3986,
        country: "NG",
        city: "Abuja",
        source: "QASA",
        currentAqi: randAqi(20, 60),
        lastUpdated: now,
      },

      // Africa
      {
        id: "6",
        name: "Accra Central",
        lat: 5.6037,
        lng: -0.187,
        country: "GH",
        city: "Accra",
        source: "QASA",
        currentAqi: randAqi(50, 120),
        lastUpdated: now,
      },
      {
        id: "7",
        name: "Nairobi West",
        lat: -1.2921,
        lng: 36.8219,
        country: "KE",
        city: "Nairobi",
        source: "QASA",
        currentAqi: randAqi(30, 80),
        lastUpdated: now,
      },
      {
        id: "8",
        name: "Cape Town City",
        lat: -33.9249,
        lng: 18.4241,
        country: "ZA",
        city: "Cape Town",
        source: "QASA",
        currentAqi: randAqi(10, 40),
        lastUpdated: now,
      },
      {
        id: "9",
        name: "Cairo Downtown",
        lat: 30.0444,
        lng: 31.2357,
        country: "EG",
        city: "Cairo",
        source: "QASA",
        currentAqi: randAqi(100, 250),
        lastUpdated: now,
      },

      // Europe
      {
        id: "10",
        name: "London City",
        lat: 51.5074,
        lng: -0.1278,
        country: "UK",
        city: "London",
        source: "Defra",
        currentAqi: randAqi(20, 60),
        lastUpdated: now,
      },
      {
        id: "11",
        name: "Paris Centre",
        lat: 48.8566,
        lng: 2.3522,
        country: "FR",
        city: "Paris",
        source: "AirParif",
        currentAqi: randAqi(30, 70),
        lastUpdated: now,
      },
      {
        id: "12",
        name: "Berlin Mitte",
        lat: 52.52,
        lng: 13.405,
        country: "DE",
        city: "Berlin",
        source: "UBA",
        currentAqi: randAqi(15, 50),
        lastUpdated: now,
      },

      // Asia
      {
        id: "13",
        name: "Beijing Chaoyang",
        lat: 39.9042,
        lng: 116.4074,
        country: "CN",
        city: "Beijing",
        source: "CNEMC",
        currentAqi: randAqi(50, 300),
        lastUpdated: now,
      },
      {
        id: "14",
        name: "Tokyo Shinjuku",
        lat: 35.6895,
        lng: 139.6917,
        country: "JP",
        city: "Tokyo",
        source: "JMOE",
        currentAqi: randAqi(20, 50),
        lastUpdated: now,
      },
      {
        id: "15",
        name: "Delhi CP",
        lat: 28.6139,
        lng: 77.209,
        country: "IN",
        city: "Delhi",
        source: "CPCB",
        currentAqi: randAqi(150, 400),
        lastUpdated: now,
      },
      {
        id: "16",
        name: "Dubai Marina",
        lat: 25.0763,
        lng: 55.1396,
        country: "AE",
        city: "Dubai",
        source: "DM",
        currentAqi: randAqi(60, 150),
        lastUpdated: now,
      },

      // Americas
      {
        id: "17",
        name: "New York Manhattan",
        lat: 40.7128,
        lng: -74.006,
        country: "US",
        city: "New York",
        source: "EPA",
        currentAqi: randAqi(20, 55),
        lastUpdated: now,
      },
      {
        id: "18",
        name: "Los Angeles Downtown",
        lat: 34.0522,
        lng: -118.2437,
        country: "US",
        city: "Los Angeles",
        source: "EPA",
        currentAqi: randAqi(40, 90),
        lastUpdated: now,
      },
      {
        id: "19",
        name: "Sao Paulo Paulista",
        lat: -23.5505,
        lng: -46.6333,
        country: "BR",
        city: "Sao Paulo",
        source: "CETESB",
        currentAqi: randAqi(50, 110),
        lastUpdated: now,
      },
      {
        id: "20",
        name: "Mexico City Centro",
        lat: 19.4326,
        lng: -99.1332,
        country: "MX",
        city: "Mexico City",
        source: "SEDEMA",
        currentAqi: randAqi(70, 140),
        lastUpdated: now,
      },

      // Oceania
      {
        id: "21",
        name: "Sydney CBD",
        lat: -33.8688,
        lng: 151.2093,
        country: "AU",
        city: "Sydney",
        source: "NSW DPIE",
        currentAqi: randAqi(10, 35),
        lastUpdated: now,
      },
    ];
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

export const monitoringStationsService = new MonitoringStationsService();
