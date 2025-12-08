import { CloudRain, Wind } from "lucide-react";
import type { ForecastItem } from "../../types";
import { cn } from "../../lib/utils";
import { COMPONENT_STYLES } from "../../lib/designTokens";

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
      <h2 className="mb-4 text-xl font-bold text-foreground">Forecast</h2>
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
              className={cn(
                "flex flex-col justify-between rounded-2xl p-4 transition-transform hover:-translate-y-1 hover:shadow-md",
                COMPONENT_STYLES.card.glass // Use glass style
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {day}, {time}
                </span>
                {f.icon === "cloud" ? (
                  <CloudRain className="h-4 w-4 text-blue-400" />
                ) : (
                  <Wind className="h-4 w-4 text-orange-400" />
                )}
              </div>

              <div className="mt-3">
                <span className="text-2xl font-bold text-foreground">
                  {f.aqi}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">AQI</span>
              </div>

              {/* Visual bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/20">
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
