/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance, type AxiosError } from "axios";
import { handleError } from "../lib/errorHandler";
import type { MonitoringStation } from "../types/maps";

class MonitoringStationsService {
  private api: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_TTL = 300000;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // Fallback to relative path for proxy
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
      // Try fetching from backend first
      // const response = await this.api.get('/monitoring-stations');
      // const data = response.data.stations || response.data;

      // if (data && data.length > 0) {
      //   this.setCache(cacheKey, data);
      //   return data;
      // }

      console.log(
        "[MonitoringStationsService] Backend empty or unavailable, using mock data"
      );
      const mockData = this.generateMockStations();
      this.setCache(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.warn(
        "[MonitoringStationsService] Fetch failed, falling back to mock",
        error
      );
      const mockData = this.generateMockStations();
      this.setCache(cacheKey, mockData);
      return mockData;
    }
  }

  private generateMockStations(): MonitoringStation[] {
    return [
      {
        id: "1",
        name: "Lagos Island",
        lat: 6.4549,
        lng: 3.4246,
        country: "NG",
        city: "Lagos",
        source: "QASA",
        currentAqi: 45,
        lastUpdated: new Date(),
      },
      {
        id: "2",
        name: "Ikeja",
        lat: 6.6018,
        lng: 3.3515,
        country: "NG",
        city: "Lagos",
        source: "QASA",
        currentAqi: 112,
        lastUpdated: new Date(),
      },
      {
        id: "3",
        name: "Victoria Island",
        lat: 6.4281,
        lng: 3.4219,
        country: "NG",
        city: "Lagos",
        source: "QASA",
        currentAqi: 55,
        lastUpdated: new Date(),
      },
      {
        id: "4",
        name: "Lekki Phase 1",
        lat: 6.4355,
        lng: 3.4682,
        country: "NG",
        city: "Lagos",
        source: "QASA",
        currentAqi: 35,
        lastUpdated: new Date(),
      },
      {
        id: "5",
        name: "Alausa",
        lat: 6.6194,
        lng: 3.3571,
        country: "NG",
        city: "Lagos",
        source: "QASA",
        currentAqi: 85,
        lastUpdated: new Date(),
      },
      {
        id: "6",
        name: "Accra Central",
        lat: 5.6037,
        lng: -0.187,
        country: "GH",
        city: "Accra",
        source: "QASA",
        currentAqi: 65,
        lastUpdated: new Date(),
      },
      {
        id: "7",
        name: "Nairobi West",
        lat: -1.2921,
        lng: 36.8219,
        country: "KE",
        city: "Nairobi",
        source: "QASA",
        currentAqi: 42,
        lastUpdated: new Date(),
      },
      {
        id: "8",
        name: "Cape Town City",
        lat: -33.9249,
        lng: 18.4241,
        country: "ZA",
        city: "Cape Town",
        source: "QASA",
        currentAqi: 25,
        lastUpdated: new Date(),
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
