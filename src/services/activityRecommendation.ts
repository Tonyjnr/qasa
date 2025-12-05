export interface HourlyForecast {
  time: string; // ISO string
  aqi: number;
  icon: string;
}

export class ActivityRecommendation {
  // Find the best window of 'duration' hours with the lowest average AQI
  static findBestWindow(
    forecasts: HourlyForecast[],
    duration: number = 2
  ): { start: string; end: string; avgAqi: number } | null {
    if (!forecasts || forecasts.length < duration) return null;

    let bestWindow = null;
    let lowestAvgAQI = Infinity;

    // Use sliding window
    for (let i = 0; i <= forecasts.length - duration; i++) {
      const window = forecasts.slice(i, i + duration);
      const sumAQI = window.reduce((sum, f) => sum + f.aqi, 0);
      const avgAQI = sumAQI / duration;

      if (avgAQI < lowestAvgAQI) {
        lowestAvgAQI = avgAQI;
        bestWindow = {
          // start time of the first slot
          start: window[0].time,
          // end time (time of last slot + 1 hour approx, or just the time of the last slot)
          // Let's use the time of the last slot for simplicity of "End" label
          end: window[window.length - 1].time,
          avgAqi: Math.round(avgAQI),
        };
      }
    }

    return bestWindow;
  }

  static getActivityAdvice(
    aqi: number,
    activity: "running" | "cycling" | "walking"
  ): { text: string; color: string } {
    const config = {
      running: { threshold: 100, advice: "Consider indoor treadmill" },
      cycling: { threshold: 100, advice: "Limit to short rides" },
      walking: { threshold: 150, advice: "Walk indoors if possible" },
    };

    const limit = config[activity].threshold;

    if (aqi <= 50)
      return {
        text: `Conditions are perfect for ${activity}`,
        color: "text-emerald-600",
      };
    if (aqi <= limit)
      return {
        text: `Acceptable, but monitor your breathing`,
        color: "text-amber-600",
      };
    return {
      text: `Avoid outdoor ${activity}. ${config[activity].advice}`,
      color: "text-red-500",
    };
  }
}
