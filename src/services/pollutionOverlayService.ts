class PollutionOverlayService {
  private readonly API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  // If there's a separate key for maps, use that
  private readonly MAP_KEY = import.meta.env.VITE_OPENWEATHER_MAP_LAYERS_API_KEY || this.API_KEY;

  getTileUrl(layer: string): string {
    // OpenWeatherMap 1.0 maps (Newer)
    // https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API_KEY}
    // layers: 'precipitation_new', 'clouds_new', 'pressure_new', 'wind_new', 'temp_new'
    // Air Pollution layers might differ in availability on free tier.
    // Usually 'use map layers' requires a subscription for some layers.
    return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${this.MAP_KEY}`;
  }

  getLegendUrl(layer: string): string {
    // Construct legend URL if available
    return `https://openweathermap.org/img/wn/${layer}_legend.png`; 
  }
}

export const pollutionOverlayService = new PollutionOverlayService();
