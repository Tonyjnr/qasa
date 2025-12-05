/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const openWeatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
  },
});

export const waqiApi = axios.create({
  baseURL: "https://api.waqi.info/feed",
  params: {
    token: import.meta.env.VITE_WAQI_TOKEN,
  },
});

export const geoApi = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0",
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
  },
});

export const searchLocation = async (query: string) => {
  try {
    const response = await geoApi.get("/direct", {
      params: { q: query, limit: 5 },
    });
    return response.data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lng: item.lon,
      country: item.country,
      state: item.state,
    }));
  } catch (error) {
    console.error("Geocoding failed:", error);
    throw error;
  }
};
