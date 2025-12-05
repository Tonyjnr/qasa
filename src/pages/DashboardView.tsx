import { Search, Map as MapIcon, List, Navigation } from "lucide-react";
import { useAirQuality } from "../hooks/useAirQuality";
import type { UserRole } from "../types";
import { PollutantGrid } from "../components/dashboard/PollutantGrid";
import { ForecastList } from "../components/dashboard/ForecastList";
import { Sidebar } from "../components/layout/Sidebar";

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { bg: "bg-green-500" };
  if (aqi <= 100) return { bg: "bg-yellow-400" };
  if (aqi <= 150) return { bg: "bg-orange-500" };
  if (aqi <= 300) return { bg: "bg-purple-500" };
  return { bg: "bg-red-900" };
};

interface DashboardViewProps {
  role: UserRole;
  onLogout: () => void;
}

export const DashboardView = ({ role, onLogout }: DashboardViewProps) => {
  const { data, isLoading, refresh } = useAirQuality();
  const status = getAQIStatus(data.aqi);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F8FAFC] font-sans text-slate-800 lg:flex-row">
      {/* --- LEFT PANEL: Content Area (Light) --- */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10">
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">
                Dashboard
              </span>
              <span className="text-xs">•</span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                {role}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Air Surveillance
            </h1>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search city..."
                className="w-full rounded-2xl border-none bg-white py-3 pl-10 pr-4 shadow-sm ring-1 ring-slate-200 transition-shadow focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </header>

        {/* Map Section */}
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold text-slate-800">Live Map</h2>
            <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
              <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-md">
                <MapIcon className="h-3 w-3" /> Map
              </button>
              <button className="flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50">
                <List className="h-3 w-3" /> List
              </button>
            </div>
          </div>

          {/* Map Visualization Placeholder */}
          <div className="relative h-64 w-full overflow-hidden rounded-[2rem] bg-slate-200 shadow-inner md:h-80">
            {/* Simulating Map UI */}
            <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/12/2355/1990.png')] bg-cover opacity-60 mix-blend-multiply grayscale-[0.2]" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />

            {/* Map Markers */}
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white ${status.bg} shadow-xl`}
              >
                <span className="text-sm font-bold text-white">{data.aqi}</span>
              </div>
              <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
                {data.location.name}
              </div>
            </div>

            {/* Other markers */}
            <div className="absolute left-1/4 top-1/3 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white/50" />
            <div className="absolute right-1/3 bottom-1/3 h-3 w-3 rounded-full bg-yellow-400 ring-4 ring-white/50" />

            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button className="rounded-lg bg-white p-2 text-slate-600 shadow-lg hover:bg-slate-50">
                <Navigation className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Pollutants & Forecast */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {/* Pollutant Breakdown */}
          <PollutantGrid pollutants={data.pollutants} />
          {/* Hourly Forecast */}
          <ForecastList forecast={data.forecast} />
        </div>
      </main>

      {/* --- RIGHT PANEL: Summary Area (Dark) --- */}
      <Sidebar
        data={data}
        isLoading={isLoading}
        refresh={refresh}
        onLogout={onLogout}
      />
    </div>
  );
};
