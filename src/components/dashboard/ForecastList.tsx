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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2">
        {forecast.slice(0, 4).map((f, i) => {
          const date = new Date(f.time);
          const time = date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          });
          const day = date.toLocaleDateString([], { weekday: "short" });
          const status = getAQIStatus(f.aqi);

          return (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {day}, {time}
                </span>
                {f.icon === "cloud" ? (
                  <CloudRain className="h-4 w-4 text-blue-400" />
                ) : (
                  <Wind className="h-4 w-4 text-orange-400" />
                )}
              </div>

              <div className="mt-3">
                <span className="text-2xl font-bold text-slate-800">
                  {f.aqi}
                </span>
                <span className="ml-1 text-xs text-slate-400">AQI</span>
              </div>

              {/* Visual bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${status.bg}`}
                  style={{ width: `${Math.min((f.aqi / 300) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
