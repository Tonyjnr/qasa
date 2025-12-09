export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string; // Cardinal direction
  pressure: number;
  visibility: number;
  weatherIcon: string;
  weatherDescription: string;
  cloudCover?: number;
}

export interface ForecastDaily {
  date: string; // ISO or formatted date
  tempMin: number;
  tempMax: number;
  humidity?: number;
  windSpeed?: number;
  weatherIcon: string;
  weatherDescription: string;
  precipitationProbability?: number;
}

export interface ForecastHourly {
  time: string; // ISO or formatted time
  temperature: number;
  weatherIcon: string;
  precipitationProbability?: number;
}

export interface WeatherData {
  current: CurrentWeather;
  dailyForecast: ForecastDaily[];
  hourlyForecast: ForecastHourly[];
}
