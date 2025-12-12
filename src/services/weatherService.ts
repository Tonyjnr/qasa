/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance, type AxiosError } from "axios";
import { handleError } from "../lib/errorHandler";
import type {
  WeatherData,
  CurrentWeather,
  ForecastDaily,
  ForecastHourly,
} from "../types/weather";

class WeatherService {
  private api: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor() {
    this.api = axios.create({
      baseURL: "https://api.openweathermap.org/data/2.5",
      params: {
        appid: process.env.VITE_OPENWEATHER_API_KEY,
        units: "metric",
      },
    });

    this.cache = new Map();

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const appError = handleError(error);
        // We generally don't want to display error toasts for background fetches automatically
        // unless it's a critical action. But following the guide pattern:
        // displayError(appError);
        return Promise.reject(appError);
      }
    );
  }

  async getWeatherData(lat: number, lng: number): Promise<WeatherData> {
    const cacheKey = `weather-${lat}-${lng}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      console.log(`[WeatherService] Returning cached data for ${cacheKey}`);
      return cached;
    }

    console.log(
      `[WeatherService] Fetching weather data for lat=${lat}, lng=${lng}`
    );
    const apiKey = process.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.error("[WeatherService] Missing VITE_OPENWEATHER_API_KEY");
    } else {
      console.log(
        `[WeatherService] API Key present: ${apiKey.substring(0, 4)}...`
      );
    }

    try {
      const [currentRes, forecastRes] = await Promise.all([
        this.api.get("/weather", { params: { lat, lon: lng } }),
        this.api.get("/forecast", { params: { lat, lon: lng } }),
      ]);

      console.log("[WeatherService] Raw responses received", {
        current: currentRes.data,
        forecast: forecastRes.data,
      });

      const data: WeatherData = {
        current: this.transformCurrent(currentRes.data),
        hourlyForecast: this.transformHourly(forecastRes.data),
        dailyForecast: this.transformDaily(forecastRes.data),
      };

      console.log("[WeatherService] Transformed data", data);

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error("[WeatherService] Fetch failed", error);
      throw error;
    }
  }

  private transformCurrent(raw: any): CurrentWeather {
    return {
      temperature: raw.main.temp,
      feelsLike: raw.main.feels_like,
      humidity: raw.main.humidity,
      pressure: raw.main.pressure,
      windSpeed: raw.wind.speed,
      windDirection: this.getWindDirection(raw.wind.deg),
      visibility: raw.visibility,
      weatherIcon: raw.weather[0].icon,
      weatherDescription: raw.weather[0].description,
      cloudCover: raw.clouds?.all,
    };
  }

  private transformHourly(raw: any): ForecastHourly[] {
    // OpenWeatherMap free forecast is 3-hour steps (5 days)
    return raw.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toISOString(),
      temperature: item.main.temp,
      weatherIcon: item.weather[0].icon,
      precipitationProbability: item.pop,
    }));
  }

  private transformDaily(raw: any): ForecastDaily[] {
    // Aggregate 3-hour steps into daily (simplified)
    // In a real app with 'One Call API' (paid), we'd get daily directly.
    // Here we'll just pick one reading per day or approx.
    const dailyMap = new Map<string, any[]>();

    raw.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0];
      if (!dailyMap.has(date)) dailyMap.set(date, []);
      dailyMap.get(date)?.push(item);
    });

    const daily: ForecastDaily[] = [];
    dailyMap.forEach((items, date) => {
      if (daily.length >= 5) return;

      const temps = items.map((i) => i.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      // Pick the item closest to noon for icon/desc
      const noonItem =
        items.find((i) => i.dt_txt.includes("12:00")) || items[0];

      daily.push({
        date,
        tempMin: minTemp,
        tempMax: maxTemp,
        humidity: noonItem.main.humidity,
        windSpeed: noonItem.wind.speed,
        weatherIcon: noonItem.weather[0].icon,
        weatherDescription: noonItem.weather[0].description,
        precipitationProbability: Math.max(
          ...items.map((i: any) => i.pop || 0)
        ),
      });
    });

    return daily;
  }

  private getWindDirection(deg: number): string {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
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

export const weatherService = new WeatherService();
