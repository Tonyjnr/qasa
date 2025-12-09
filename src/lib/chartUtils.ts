import { format } from "date-fns";

export function formatChartDate(
  date: string | Date,
  interval: "hourly" | "daily" = "daily"
): string {
  const d = new Date(date);
  if (interval === "hourly") {
    return format(d, "MMM dd HH:mm");
  }
  return format(d, "MMM dd");
}

export const CHART_COLORS = {
  pm25: "#8884d8",
  pm10: "#82ca9d",
  o3: "#ffc658",
  no2: "#ff7300",
  so2: "#00C49F",
  co: "#FFBB28",
};
