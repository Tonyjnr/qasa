/** biome-ignore-all lint/complexity/useOptionalChain: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import {
  ShieldCheck,
  ShieldAlert,
  Skull,
  Activity,
  MapPin,
} from "lucide-react";
import type { AQIData } from "../../types";
import { cn } from "../../lib/utils";
import { getAQIColors, getAQILabel } from "../../lib/designTokens";

interface SidebarProps {
  data: AQIData;
  isLoading: boolean;
  onLocationSelect?: (lat: number, lng: number, name: string) => void;
  className?: string;
}

const getAQIStatus = (aqi: number) => {
  const colors = getAQIColors(aqi);
  const label = getAQILabel(aqi);

  const iconMap = {
    Good: ShieldCheck,
    Moderate: Activity,
    "Unhealthy for Sensitive Groups": ShieldAlert,
    Unhealthy: Skull,
    "Very Unhealthy": Skull,
    Hazardous: Skull,
  };

  return {
    label,
    color: colors.text,
    bg: colors.bgClass,
    border: colors.borderClass,
    icon: iconMap[label as keyof typeof iconMap] || Activity,
    desc: getAQIDescription(aqi),
  };
};

function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return "Air quality is satisfactory.";
  if (aqi <= 100)
    return "Acceptable. Moderate health concern for sensitive groups.";
  if (aqi <= 150) return "General public is not likely affected.";
  if (aqi <= 300) return "Health alert: serious health effects.";
  return "Health warning of emergency conditions.";
}

export const Sidebar = ({
  data,
  isLoading,
  onLocationSelect,
  className,
}: SidebarProps) => {
  const status = getAQIStatus(data.aqi);
  const StatusIcon = status.icon;

  return (
    <aside
      className={cn(
        "relative flex h-full w-full flex-col p-6",
        "border-l border-border",
        "bg-background",
        className
      )}
    >
      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col pt-12 px-2 text-left">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            {data.location.name}
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Today,{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="mt-16 text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="text-8xl font-black tracking-tighter text-foreground">
              {isLoading ? "--" : data.aqi}
            </span>
            <span
              className={cn(
                "text-xl font-bold uppercase tracking-widest",
                status.color
              )}
            >
              AQI
            </span>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <div
              className={cn("h-3 w-3 rounded-full animate-pulse", "bg-red-500")}
            />
            <p className="text-lg font-medium text-muted-foreground">
              Primary Pollutant:{" "}
              <span className="text-foreground font-bold">
                PM2.5 ({data.pollutants.pm25})
              </span>
            </p>
          </div>
        </div>

        {/* Health Advisory */}
        <div
          className={cn(
            "mt-12 rounded-2xl p-6",
            "border bg-card/50",
            status.border
          )}
        >
          <div className="mb-3 flex items-center gap-3">
            <StatusIcon className={cn("h-6 w-6", status.color)} />
            <span className={cn("text-lg font-bold", status.color)}>
              {status.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {status.desc}
          </p>
        </div>
      </div>

      {/* Monitoring Stations */}
      <div className="relative z-10 mt-auto pt-8">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Monitoring Stations
        </h4>
        <div className="space-y-2">
          {[
            {
              name: "Lagos, NG",
              lat: 6.5244,
              lng: 3.3792,
              aqi: 87,
              status: "Main Station",
            },
            {
              name: "London, UK",
              lat: 51.5074,
              lng: -0.1278,
              aqi: 45,
              status: "Active",
            },
            {
              name: "New York, US",
              lat: 40.7128,
              lng: -74.006,
              aqi: 32,
              status: "Active",
            },
            {
              name: "Tokyo, JP",
              lat: 35.6762,
              lng: 139.6503,
              aqi: 65,
              status: "Active",
            },
          ].map((station, idx) => {
            const stationColors = getAQIColors(station.aqi);
            return (
              <button
                key={idx}
                onClick={() =>
                  onLocationSelect &&
                  onLocationSelect(station.lat, station.lng, station.name)
                }
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 text-left",
                  "border border-transparent transition-all",
                  "hover:bg-slate-600/10 hover:border-slate-500/20",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                    "bg-muted text-muted-foreground",
                    "group-hover:bg-slate-700 group-hover:text-white"
                  )}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-accent-foreground">
                    {station.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground group-hover:text-accent-foreground/70">
                    {station.status}
                  </p>
                </div>
                <span className={cn("text-sm font-bold", stationColors.text)}>
                  {station.aqi}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
