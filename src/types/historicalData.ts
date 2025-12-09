export interface HistoricalAqiDataPoint {
  recordedAt: string | Date;
  aqi: number;
  pm25?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  so2?: number;
  co?: number;
}

export interface HistoricalDateRange {
  start: Date;
  end: Date;
}

export interface HistoricalTrendsData {
  hourly: {
    date: string;
    aqi: number;
    pm25?: number;
  }[];
  daily: {
    date: string;
    aqiAvg: number;
    aqiMin: number;
    aqiMax: number;
    mainPollutant?: string;
  }[];
}
