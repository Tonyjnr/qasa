import {
  ShieldCheck,
  ShieldAlert,
  Skull,
  Activity,
  MapPin,
} from "lucide-react";
import type { AQIData } from "../../types";
import { cn } from "../../lib/utils";

interface SidebarProps {
  data: AQIData;
  isLoading: boolean;
  onLocationSelect?: (lat: number, lng: number, name: string) => void;
}

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50)
    return {
      label: "Good",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: ShieldCheck,
      desc: "Air quality is satisfactory.",
    };
  if (aqi <= 100)
    return {
      label: "Moderate",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: Activity,
      desc: "Acceptable. Moderate health concern for sensitive groups.",
    };
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive Groups",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      icon: ShieldAlert,
      desc: "General public is not likely affected.",
    };
  if (aqi <= 300)
    return {
      label: "Very Unhealthy",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      icon: Skull,
      desc: "Health alert: serious health effects.",
    };
  return {
    label: "Hazardous",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: Skull,
    desc: "Health warning of emergency conditions.",
  };
};

export const Sidebar = ({
  data,
  isLoading,
  onLocationSelect,
}: SidebarProps) => {
  const status = getAQIStatus(data.aqi);
  const StatusIcon = status.icon;

  return (
    <aside
      className="relative flex h-auto w-full flex-col border-l border-slate-200 p-6 shadow-xl lg:h-full lg:w-[calc(400px_+_10%)] dark:border-slate-800"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Decorative Gradients (Subtle Light Mode) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-50" />

      {/* Main Content Info */}
      <div className="relative z-10 flex flex-1 flex-col pt-12 px-2 text-left">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            {data.location.name}
          </h2>
          <p className="mt-2 text-lg text-slate-500">
            Today,{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="mt-16 text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="text-8xl font-black tracking-tighter text-slate-900">
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
              className={cn(
                "h-3 w-3 rounded-full animate-pulse",
                status.color.replace("text-", "bg-")
              )}
            />
            <p className="text-lg font-medium text-slate-600">
              Primary Pollutant:{" "}
              <span className="text-slate-900 font-bold">
                PM2.5 ({data.pollutants.pm25})
              </span>
            </p>
          </div>
        </div>

        {/* Health Advisory */}
        <div className="mt-12 rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <div className="mb-3 flex items-center gap-3">
            <StatusIcon className={cn("h-6 w-6", status.color)} />
            <span className={cn("text-lg font-bold", status.color)}>
              {status.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            {status.desc}
          </p>
        </div>
      </div>

      {/* Monitoring Stations */}
      <div className="relative z-10 mt-auto pt-8">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
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
          ].map((station, idx) => (
            <button
              key={idx}
              onClick={() =>
                onLocationSelect &&
                onLocationSelect(station.lat, station.lng, station.name)
              }
              className="group flex w-full cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-transparent p-2 transition-all hover:bg-slate-50 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400 transition-colors group-hover:bg-blue-100 group-hover:text-blue-500">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  {station.name}
                </p>
                <p className="text-[10px] text-slate-400">{station.status}</p>
              </div>
              <span
                className={cn(
                  "text-sm font-bold",
                  station.aqi > 50 ? "text-amber-500" : "text-emerald-500"
                )}
              >
                {station.aqi}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
