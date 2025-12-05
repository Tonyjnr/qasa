import { subDays, startOfDay } from "date-fns";

export interface TrendAnalysis {
  summaries: DailySummary[];
  trend: {
    slope: number;
    direction: "improving" | "worsening" | "stable";
    confidence: number;
  };
}

export interface DailySummary {
  date: Date;
  aqiAvg: number;
}

export class HistoricalDataService {
  // Mock function to seed data if empty
  // In a real app, this would be a separate script or cron job
  static async seedMockData() {
    // Check if we have data for this location
    /* 
    // In a real DB with persistence, we'd check:
    const existing = await db.query.aqiTimeSeries.findFirst({
        where: eq(aqiTimeSeries.locationId, locationId)
    });
    if (existing) return; 
    */

    // Since we are mocking for the UI demo, we'll just generate data on the fly
    // and strictly speaking, we might not even need to write to the DB if we just want to return it to the UI
    // But let's simulate the "get" behavior.
    return this.generateMockHistory(30);
  }

  static async getTrendAnalysis(
    _locationId: string,
    days = 30
  ): Promise<TrendAnalysis> {
    // 1. Fetch data
    // For this phase, we use the mock generator directly to ensure the UI has data
    // In production: query 'aqiDailySummary' or aggregate 'aqiTimeSeries'
    const mockData = this.generateMockHistory(days);

    // 2. Analyze Trend (Simple Linear Regression on AQI)
    const points = mockData.map((d, i) => ({ x: i, y: d.aqiAvg }));
    const trend = this.calculateLinearTrend(points);

    let direction: "improving" | "worsening" | "stable" = "stable";
    if (trend.slope < -0.5) direction = "improving"; // AQI going down is good
    if (trend.slope > 0.5) direction = "worsening";

    return {
      summaries: mockData,
      trend: {
        slope: trend.slope,
        direction,
        confidence: trend.rSquared,
      },
    };
  }

  private static generateMockHistory(days: number): DailySummary[] {
    const data: DailySummary[] = [];
    const today = new Date();

    // Generate a realistic "random walk" for AQI
    let currentAQI = 80;

    for (let i = days; i >= 0; i--) {
      const date = subDays(today, i);

      // Random fluctuation
      const change = (Math.random() - 0.5) * 20;
      currentAQI = Math.max(20, Math.min(300, currentAQI + change));

      data.push({
        date: startOfDay(date),
        aqiAvg: Math.round(currentAQI),
      });
    }
    return data;
  }

  private static calculateLinearTrend(points: Array<{ x: number; y: number }>) {
    const n = points.length;
    if (n === 0) return { slope: 0, intercept: 0, rSquared: 0 };

    const sumX = points.reduce((s, p) => s + p.x, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const yMean = sumY / n;
    const ssTot = points.reduce((s, p) => s + Math.pow(p.y - yMean, 2), 0);
    const ssRes = points.reduce(
      (s, p) => s + Math.pow(p.y - (slope * p.x + intercept), 2),
      0
    );
    const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

    return { slope, intercept, rSquared };
  }
}
