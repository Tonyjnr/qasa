/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// Validate API key
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN;

if (!API_KEY) {
  console.error(
    "❌ VITE_OPENWEATHER_API_KEY is not set in environment variables"
  );
}

export const openWeatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 15000, // 15 seconds
  params: {
    appid: API_KEY,
  },
});

// Add request interceptor for debugging
openWeatherApi.interceptors.request.use(
  (config) => {
    console.log(
      `[OpenWeather API] Request: ${config.method?.toUpperCase()} ${
        config.url
      }`,
      {
        params: config.params,
      }
    );
    return config;
  },
  (error) => {
    console.error("[OpenWeather API] Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
openWeatherApi.interceptors.response.use(
  (response) => {
    console.log(`[OpenWeather API] Response: ${response.config.url}`, {
      status: response.status,
      dataSize: JSON.stringify(response.data).length,
    });
    return response;
  },
  (error) => {
    console.error("[OpenWeather API] Response Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const waqiApi = axios.create({
  baseURL: "https://api.waqi.info/feed",
  timeout: 15000,
  params: {
    token: WAQI_TOKEN,
  },
});

export const geoApi = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0",
  timeout: 10000,
  params: {
    appid: API_KEY,
  },
});

// Add interceptors to geoApi as well
geoApi.interceptors.request.use((config) => {
  console.log(
    `[Geo API] Request: ${config.method?.toUpperCase()} ${config.url}`,
    {
      params: config.params,
    }
  );
  return config;
});

geoApi.interceptors.response.use(
  (response) => {
    console.log(`[Geo API] Response: ${response.config.url}`, {
      status: response.status,
      results: Array.isArray(response.data) ? response.data.length : "N/A",
    });
    return response;
  },
  (error) => {
    console.error("[Geo API] Response Error:", {
      message: error.message,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

export const searchLocation = async (query: string) => {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  console.log(`[searchLocation] Searching for: "${query}"`);

  try {
    const response = await geoApi.get("/direct", {
      params: { q: query.trim(), limit: 5 },
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(`No results found for "${query}"`);
    }

    const results = response.data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lng: item.lon,
      country: item.country,
      state: item.state,
      displayName: item.state
        ? `${item.name}, ${item.state}, ${item.country}`
        : `${item.name}, ${item.country}`,
    }));

    console.log(`[searchLocation] Found ${results.length} results`);
    return results;
  } catch (error: any) {
    console.error("[searchLocation] Failed:", error);

    if (error.response?.status === 401) {
      throw new Error("API authentication failed. Please check your API key.");
    }

    if (error.message.includes("Network Error")) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw error;
  }
};