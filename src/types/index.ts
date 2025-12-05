import type { ReactNode } from "react";
export type ViewState = "AUTH" | "DASHBOARD";
export type UserRole = "resident" | "professional";

export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export interface Pollutants {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

export interface ForecastItem {
  [x: string]: ReactNode;
  time: string;
  aqi: number;
  icon: string;
}

export interface AQIData {
  aqi: number;
  location: Location;
  pollutants: Pollutants;
  forecast: ForecastItem[];
}
