import { Search, Map as MapIcon, List, Bell } from "lucide-react";
import { useAirQuality } from "../hooks/useAirQuality";
import { UserButton } from "@clerk/clerk-react";
import type { UserRole } from "../types";
import { PollutantGrid } from "../components/dashboard/PollutantGrid";
import { ForecastList } from "../components/dashboard/ForecastList";
import { Sidebar } from "../components/layout/Sidebar";
import { InteractiveMap } from "../components/dashboard/InteractiveMap";
import { ListView } from "../components/dashboard/ListView";
import { useState } from "react";
import { searchLocation } from "../services/api";
import { Toaster, toast } from "sonner";

interface DashboardViewProps {
  role: UserRole;
  onLogout: () => void; // Keep for interface compatibility if needed, though replaced by UserButton
}

export const DashboardView = ({ role }: DashboardViewProps) => {
  const { data, isLoading, refresh, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to search location");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLocation(lat, lng);
    setShowSearchResults(false);
    setSearchQuery("");
    toast.success(`Location changed to ${name}`);
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F8FAFC] font-sans text-slate-800 lg:flex-row">
      <Toaster position="top-center" />
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
              Air Quality Monitor
            </h1>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={`w-full rounded-2xl border-none bg-white py-3 pl-10 pr-4 shadow-sm ring-1 ring-slate-200 transition-shadow focus:ring-2 focus:ring-blue-500 ${
                  isSearching ? "opacity-50" : ""
                }`}
                disabled={isSearching}
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 max-h-64 overflow-y-auto z-50">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        handleLocationSelect(
                          result.lat,
                          result.lng,
                          result.name
                        )
                      }
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <div className="font-medium text-slate-900">
                        {result.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {result.state ? `${result.state}, ` : ""}
                        {result.country}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                <Bell className="h-5 w-5" />
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Map/List Section */}
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold text-slate-800">Live Overview</h2>
            <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                  viewMode === "map"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <MapIcon className="h-3 w-3" /> Map
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <List className="h-3 w-3" /> List
              </button>
            </div>
          </div>

          <div className="relative h-80 w-full overflow-hidden rounded-[2rem] bg-slate-200 shadow-lg">
            {viewMode === "map" ? (
              <InteractiveMap
                data={data}
                onLocationChange={(lat, lng) => {
                  setLocation(lat, lng);
                  toast.info("Fetching AQI for new location...");
                }}
              />
            ) : (
              <ListView data={data} />
            )}
          </div>
        </section>

        {/* Pollutants & Forecast */}
        {data && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <PollutantGrid pollutants={data.pollutants} />
            <ForecastList forecast={data.forecast} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && !data && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-slate-600">Loading air quality data...</p>
            </div>
          </div>
        )}
      </main>

      {/* --- RIGHT PANEL: Summary Area (Dark) --- */}
      {data && (
        <Sidebar
          data={data}
          isLoading={isLoading}
          refresh={refresh}
          onLocationSelect={handleLocationSelect}
        />
      )}
    </div>
  );
};
