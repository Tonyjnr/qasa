import { Wind, Droplets, Sun, CloudRain, ArrowRight } from "lucide-react";
import type { AQIData } from "../../types";

interface ListViewProps {
  data: AQIData | null;
}

export const ListView = ({ data }: ListViewProps) => {
  if (!data) return null;

  // Mock data for "Other Cities" since we don't fetch them live yet
  const otherCities = [
    { name: "Beijing", country: "CN", condition: "Cloudy", icon: "cloud" },
    { name: "California", country: "US", condition: "Windy", icon: "wind" },
    { name: "Paris", country: "FR", condition: "Sunny", icon: "sun" },
    { name: "Dubai", country: "AE", condition: "Hot", icon: "sun" },
  ];

  return (
    <div className="h-full w-full overflow-y-auto rounded-[2rem] bg-[#0F172A] p-6 text-white shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Details View</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Next 7 Days</span>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Main Feature Card */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Today's Highlight */}
        <div className="col-span-2 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-lg">
          <div className="flex justify-between">
            <div>
              <h3 className="text-3xl font-bold">{data.location.name}</h3>
              <p className="text-blue-200">
                Today,{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="mt-8">
                <span className="text-6xl font-bold">{data.aqi}</span>
                <span className="ml-2 text-xl font-medium text-blue-200">
                  AQI
                </span>
              </div>
              <p className="mt-2 text-sm text-blue-100">
                Primary Pollutant: PM2.5 ({data.pollutants.pm25})
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Sun className="h-24 w-24 text-yellow-300 animate-pulse" />
              <span className="mt-2 text-lg font-medium">Clear Sky</span>
            </div>
          </div>
        </div>

        {/* Small Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-white/5 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Wind className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Wind</span>
            </div>
            <p className="text-xl font-bold">
              7.2{" "}
              <span className="text-xs font-normal text-slate-400">km/h</span>
            </p>
          </div>
          <div className="rounded-3xl bg-white/5 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Droplets className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Humidity</span>
            </div>
            <p className="text-xl font-bold">
              84 <span className="text-xs font-normal text-slate-400">%</span>
            </p>
          </div>
          <div className="rounded-3xl bg-white/5 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Sun className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">UV Index</span>
            </div>
            <p className="text-xl font-bold">
              5.5{" "}
              <span className="text-xs font-normal text-slate-400">Medium</span>
            </p>
          </div>
          <div className="rounded-3xl bg-white/5 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <CloudRain className="h-4 w-4" />
              <span className="text-xs font-bold uppercase">Rain</span>
            </div>
            <p className="text-xl font-bold">
              12 <span className="text-xs font-normal text-slate-400">%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Strip */}
      <h3 className="mb-4 text-lg font-bold">Hourly Forecast</h3>
      <div className="mb-8 flex gap-4 overflow-x-auto pb-4">
        {data.forecast.map((item, idx) => (
          <div
            key={idx}
            className={`min-w-[100px] flex-shrink-0 rounded-2xl p-4 text-center ${
              idx === 0 ? "bg-blue-600" : "bg-white/5"
            }`}
          >
            <p className="mb-2 text-sm text-slate-300">{item.time}</p>
            <div className="my-2 flex justify-center">
              {item.icon === "cloud" ? (
                <CloudRain className="h-8 w-8 text-slate-300" />
              ) : (
                <Sun className="h-8 w-8 text-yellow-400" />
              )}
            </div>
            <p className="font-bold">{item.aqi}</p>
            <p className="text-[10px] text-slate-400">AQI</p>
          </div>
        ))}
      </div>

      {/* Other Cities List (Mock) - Matching styling from image */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-bold">Other Cities</h3>
          <div className="space-y-4">
            {otherCities.map((city, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
                    {city.icon === "sun" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Wind className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{city.country}</p>
                    <p className="font-bold">{city.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{city.condition}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
