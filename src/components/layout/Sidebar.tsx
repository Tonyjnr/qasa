import {
  Wind,
  RefreshCw,
  Info,
  ShieldCheck,
  ShieldAlert,
  Skull,
  Activity,
  MapPin,
} from "lucide-react";
import type { AQIData } from "../../types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface SidebarProps {
  data: AQIData;
  isLoading: boolean;
  refresh: () => void;
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
  refresh,
  onLocationSelect,
}: SidebarProps) => {
  const status = getAQIStatus(data.aqi);
  const StatusIcon = status.icon;

  return (
    <aside className="relative flex h-auto w-full flex-col border-l border-white/5 bg-[#0F172A] p-6 text-white shadow-2xl lg:h-full lg:w-[400px]">
      {/* Decorative Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/0 to-slate-900/0" />

      {/* Main Content Info */}
      <div className="relative z-10 flex flex-1 flex-col items-center pt-8 text-center">
        <div
          className={cn(
            "mb-8 flex h-24 w-24 items-center justify-center rounded-3xl shadow-[0_0_40px_-5px_var(--tw-shadow-color)] ring-1 ring-white/10 backdrop-blur-xl",
            status.bg,
            status.color.replace("text-", "shadow-") // Dynamic shadow color
          )}
        >
          <StatusIcon className={cn("h-12 w-12", status.color)} />
        </div>

        <div className="mb-2 flex items-center gap-2 uppercase tracking-widest text-slate-400">
          <Wind className="h-3 w-3" />
          <span className="text-[10px] font-bold">Current Average</span>
        </div>

        <h2 className="text-8xl font-black tracking-tighter text-white">
          {isLoading ? (
            <span className="animate-pulse opacity-50">--</span>
          ) : (
            data.aqi
          )}
          <span className="absolute -top-4 text-4xl text-slate-600">°</span>
        </h2>

        <h3 className="mt-4 text-2xl font-light text-slate-200">
          {data.location.name}
        </h3>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[10px] text-slate-400">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          Updated just now
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
          className="mt-6 border-white/10 bg-transparent text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <RefreshCw
            className={cn("mr-2 h-3 w-3", isLoading && "animate-spin")}
          />
          Refresh Data
        </Button>

        {/* Health Advisory Card */}
        <Card className="mt-8 w-full border-white/10 bg-white/5 backdrop-blur-md">
          <CardContent className="p-4 text-left">
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Health Status
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              <span className={cn("font-bold", status.color)}>
                {status.label}:{" "}
              </span>
              {status.desc}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Stations */}
      <div className="relative z-10 mt-auto pt-8">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
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
              className="group flex w-full cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-transparent p-2 transition-all hover:border-white/5 hover:bg-white/5 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-slate-400 transition-colors group-hover:bg-blue-500/20 group-hover:text-blue-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                  {station.name}
                </p>
                <p className="text-[10px] text-slate-500">{station.status}</p>
              </div>
              <span
                className={cn(
                  "text-sm font-bold",
                  station.aqi > 50 ? "text-amber-400" : "text-emerald-400"
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
