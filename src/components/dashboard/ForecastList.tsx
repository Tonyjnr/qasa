import { CloudRain, Wind } from "lucide-react";
import type { ForecastItem } from "../../types";

interface ForecastListProps {
  forecast: ForecastItem[];
}

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { bg: "bg-green-500" };
  if (aqi <= 100) return { bg: "bg-yellow-400" };
  if (aqi <= 150) return { bg: "bg-orange-500" };
  if (aqi <= 300) return { bg: "bg-purple-500" };
  return { bg: "bg-red-900" };
};

export const ForecastList = ({ forecast }: ForecastListProps) => {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-slate-800">Forecast</h2>
      <div className="space-y-3">
        {forecast.map((f, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-slate-100"
          >
            <span className="w-12 text-sm font-semibold text-slate-500">
              {f.time}
            </span>
            <div className="flex flex-1 items-center justify-center gap-2">
              {f.icon === "cloud" ? (
                <CloudRain className="h-4 w-4 text-blue-400" />
              ) : (
                <Wind className="h-4 w-4 text-orange-400" />
              )}
              <span className="text-xs text-slate-400">AQI {f.aqi}</span>
            </div>
            <div className="h-1.5 w-24 rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${getAQIStatus(f.aqi).bg}`}
                style={{ width: `${(f.aqi / 200) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
