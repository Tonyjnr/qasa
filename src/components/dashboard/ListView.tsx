import { Wind, Droplets, Sun, CloudRain, ArrowRight } from "lucide-react";
import type { AQIData } from "../../types";
import { cn } from "../../lib/utils";

interface ListViewProps {
  data: AQIData | null;
}

export const ListView = ({ data }: ListViewProps) => {
  if (!data) return null;

  // Mock data for "Other Cities" since we don't fetch them live yet
  const otherCities = [
    { name: "Beijing", country: "CN", condition: "Cloudy", icon: CloudRain },
    { name: "California", country: "US", condition: "Windy", icon: Wind },
    { name: "Paris", country: "FR", condition: "Sunny", icon: Sun },
    { name: "Dubai", country: "AE", condition: "Hot", icon: Sun },
  ];

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#0F172A] p-8 text-white">
      {/* Decorative Gradients (Matching Sidebar) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900/0 to-slate-900/0" />

      <div className="relative z-10 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Weather Details</h2>
          <p className="text-sm text-slate-400">
            {" "}
            comprehensive forecast & metrics
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium transition hover:bg-white/10 cursor-pointer">
          <span className="text-slate-300">Next 7 Days</span>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Main Feature Card */}
      <div className="relative z-10 mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Highlight - Darkened to match sidebar aesthetic */}
        <div className="col-span-2 overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          {/* Subtle internal gradient */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />

          <div className="relative flex justify-between">
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-4xl font-bold tracking-tighter text-white">
                  {data.location.name}
                </h3>
                <p className="mt-1 text-slate-400">
                  Today,{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="mt-12">
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-bold tracking-tighter">
                    {data.aqi}
                  </span>
                  <span className="text-2xl font-medium text-slate-500">
                    AQI
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-sm font-medium text-blue-200">
                    Primary Pollutant: PM2.5 ({data.pollutants.pm25})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4">
              <Sun className="h-32 w-32 text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]" />
              <span className="mt-4 text-xl font-medium text-slate-200">
                Clear Sky
              </span>
            </div>
          </div>
        </div>

        {/* Small Stats Grid - Uniform styling */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "Wind",
              value: "7.2",
              unit: "km/h",
              icon: Wind,
              color: "text-slate-400",
            },
            {
              label: "Humidity",
              value: "84",
              unit: "%",
              icon: Droplets,
              color: "text-blue-400",
            },
            {
              label: "UV Index",
              value: "5.5",
              unit: "Med",
              icon: Sun,
              color: "text-amber-400",
            },
            {
              label: "Rain",
              value: "12",
              unit: "%",
              icon: CloudRain,
              color: "text-slate-400",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-white/5 bg-white/5 p-5 backdrop-blur-md transition hover:bg-white/10"
            >
              <div className="mb-2 flex items-center gap-2">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-200">
                {stat.value}{" "}
                <span className="text-xs font-normal text-slate-500">
                  {stat.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Forecast Strip */}
      <h3 className="relative z-10 mb-6 text-sm font-bold uppercase tracking-widest text-slate-500">
        Hourly Forecast
      </h3>
      <div className="relative z-10 mb-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {data.forecast.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "min-w-[110px] flex-shrink-0 rounded-2xl border p-5 text-center transition-all",
              idx === 0
                ? "border-blue-500/50 bg-blue-600/20 shadow-[0_0_30px_-10px_rgba(37,99,235,0.3)]"
                : "border-white/5 bg-white/5 hover:bg-white/10"
            )}
          >
            <p className="mb-3 text-xs font-medium text-slate-400">
              {item.time}
            </p>
            <div className="my-3 flex justify-center">
              {item.icon === "cloud" ? (
                <CloudRain className="h-8 w-8 text-slate-400" />
              ) : (
                <Sun className="h-8 w-8 text-amber-400" />
              )}
            </div>
            <p className="text-lg font-bold text-slate-200">{item.aqi}</p>
            <p className="text-[10px] text-slate-500">AQI</p>
          </div>
        ))}
      </div>

      {/* Other Cities List - Matching Sidebar Monitoring Stations */}
      <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-500">
            Other Cities
          </h3>
          <div className="space-y-3">
            {otherCities.map((city, idx) => (
              <div
                key={idx}
                className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-white/5 p-4 transition-all hover:border-white/5 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors group-hover:bg-blue-500/20 group-hover:text-blue-400">
                    <city.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {city.country}
                    </p>
                    <p className="text-lg font-bold text-slate-200">
                      {city.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-400">
                    {city.condition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
