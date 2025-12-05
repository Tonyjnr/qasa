import { Wind, RefreshCw, Info } from "lucide-react";
import type { AQIData } from "../../types";

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
      color: "text-green-500",
      bg: "bg-green-500",
      desc: "Air quality is satisfactory.",
    };
  if (aqi <= 100)
    return {
      label: "Moderate",
      color: "text-yellow-400",
      bg: "bg-yellow-400",
      desc: "Acceptable. Moderate health concern for sensitive groups.",
    };
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive Groups",
      color: "text-orange-500",
      bg: "bg-orange-500",
      desc: "General public is not likely affected.",
    };
  if (aqi <= 300)
    return {
      label: "Very Unhealthy",
      color: "text-purple-500",
      bg: "bg-purple-500",
      desc: "Health alert: everyone may experience more serious health effects.",
    };
  return {
    label: "Hazardous",
    color: "text-red-900",
    bg: "bg-red-900",
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

  return (
    <aside className="relative flex h-auto w-full flex-col bg-[#0F172A] p-8 text-white shadow-2xl lg:h-full lg:w-[400px]">
      {/* Decorative Blobs for Sidebar */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-[60px]" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/10 blur-[60px]" />

      {/* Big AQI Display */}
      <div className="relative z-10 mt-12 flex flex-1 flex-col items-center text-center">
        {/* Animated Cloud/Icon placeholder */}
        <div className="mb-6 rounded-3xl bg-white/5 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-md">
          <Wind className={`h-16 w-16 ${status.color} animate-pulse`} />
        </div>

        <span className="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-400">
          Current Average
        </span>

        <div className="relative">
          <h2 className="text-9xl font-bold tracking-tighter text-white">
            {isLoading ? (
              <span className="animate-pulse opacity-50">--</span>
            ) : (
              data.aqi
            )}
          </h2>
          <div
            className={`absolute -right-4 top-4 h-4 w-4 rounded-full ${status.bg} animate-ping`}
          />
        </div>

        <h3 className="mt-2 text-2xl font-light text-blue-200">
          {data.location.name}
        </h3>

        {/* Refresh Control */}
        <button
          onClick={refresh}
          disabled={isLoading}
          className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Updating..." : "Updated just now"}
        </button>

        {/* Health Advisory Card */}
        <div className="mt-12 w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Health Advisory
            </h4>
          </div>
          <p className="text-sm leading-relaxed text-slate-200">
            <span className={`font-bold ${status.color}`}>
              {status.label}:{" "}
            </span>
            {status.desc}
          </p>
        </div>
      </div>

      {/* Quick Locations */}
      <div className="relative z-10 mt-auto pt-8">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Monitoring Stations
        </h4>
        <div className="space-y-3">
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
              className="flex w-full cursor-pointer items-center gap-4 rounded-xl border-l-2 border-green-500 bg-white/5 p-3 transition hover:bg-white/10 text-left"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{station.name}</p>
                <p className="text-xs text-slate-400">{station.status}</p>
              </div>
              <span
                className={`text-sm font-bold ${
                  station.aqi > 50 ? "text-yellow-400" : "text-green-400"
                }`}
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
