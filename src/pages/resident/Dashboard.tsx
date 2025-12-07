import { Search, Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAirQuality } from "../../hooks/useAirQuality";
import { UserButton } from "@clerk/clerk-react";
import { PollutantGrid } from "../../components/dashboard/PollutantGrid";
import { ForecastList } from "../../components/dashboard/ForecastList";
import { Sidebar } from "../../components/layout/Sidebar";
import { CigaretteWidget } from "../../components/dashboard/CigaretteWidget";
import { ExerciseAdvisor } from "../../components/dashboard/ExerciseAdvisor";
import { useState } from "react";
import { searchLocation } from "../../services/api";
import { Toaster, toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { AIAssistant } from "../../components/ai/AIAssistant";
import { InteractiveMap } from "../../components/dashboard/InteractiveMap";
import { ListView } from "../../components/dashboard/ListView";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";

export const Dashboard = () => {
  const { data, isLoading, error, refresh, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  // --- LOADING STATE (Skeletons) ---
  if (isLoading && !data) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F8FAFC] lg:flex-row">
        {/* Left Panel Skeleton */}
        <main className="flex-1 p-4 lg:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-4">
              <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
              <div className="h-10 w-64 rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="h-12 w-96 rounded-2xl bg-slate-200 animate-pulse hidden md:block" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            <div className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
          </div>
        </main>
        {/* Right Panel Skeleton */}
        <aside className="hidden h-full w-[calc(400px_+_10%)] border-l border-slate-200 bg-[#F8FAFC] p-6 lg:block">
          <div className="space-y-8">
            <div className="flex justify-center pt-8">
              <div className="h-24 w-24 rounded-3xl bg-slate-200 animate-pulse" />
            </div>
          </div>
        </aside>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
              <AlertTriangle className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-slate-900">
            Connection Failed
          </h2>
          <p className="mb-8 max-w-md text-slate-500">{error}</p>
          <button
            onClick={() => refresh()}
            className="rounded-full bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

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
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.length >= 3) {
                    searchLocation(val).then((results) => {
                      setSearchResults(results.slice(0, 5));
                      setShowSearchResults(true);
                    });
                  } else {
                    setShowSearchResults(false);
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={`w-full rounded-full border-none bg-white py-3 pl-10 pr-4 shadow-sm ring-1 ring-slate-200 transition-shadow focus:ring-2 focus:ring-blue-500 ${
                  isSearching ? "opacity-50" : ""
                }`}
                disabled={isSearching}
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
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
                      className="w-full border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 last:border-b-0"
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
              <ThemeToggle />

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none">
                    <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    <Bell className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 bg-white p-0 shadow-xl border border-slate-100"
                >
                  <DropdownMenuLabel className="p-4 text-sm font-bold text-slate-900">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-4 cursor-pointer hover:bg-slate-50">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          High Pollution Alert
                        </p>
                        <p className="text-xs text-slate-500">
                          Air quality in Lagos is deteriorating.
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-4 cursor-pointer hover:bg-slate-50">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Weekly Report Ready
                        </p>
                        <p className="text-xs text-slate-500">
                          Your exposure summary is available.
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <UserButton />
            </div>
          </div>
        </header>

        {/* Map Section */}
        <section className="mb-8 relative z-0">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold text-slate-800">Live Overview</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />{" "}
              Live data from network
            </div>
          </div>

          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-slate-200 shadow-xl ring-1 ring-slate-900/5 transition-all">
            <InteractiveMap
              data={data}
              onLocationChange={(lat, lng) => {
                setLocation(lat, lng);
                toast.info("Fetching AQI for new location...");
              }}
            />

            {/* Help / Detailed View Trigger */}
            <div className="absolute right-4 top-4 z-[500]">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition-transform hover:scale-110 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Detailed View"
                  >
                    <span className="text-lg font-bold">?</span>
                  </button>
                </DialogTrigger>
                {/* DialogContent hosting ListView */}
                <DialogContent className="max-w-[68vw] h-[90vh] p-0 overflow-hidden bg-[#0F172A] border-slate-800 shadow-2xl rounded-3xl">
                  <div className="h-full w-full overflow-hidden">
                    <ListView data={data} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Health Insights Section */}
        {data && (
          <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <CigaretteWidget pm25={data.pollutants.pm25} />
            <ExerciseAdvisor currentAQI={data.aqi} forecast={data.forecast} />
          </section>
        )}

        {/* Pollutants & Forecast */}
        {data && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <PollutantGrid pollutants={data.pollutants} />
            <ForecastList forecast={data.forecast} />
          </div>
        )}
      </main>

      {/* --- RIGHT PANEL: Summary Area (Dark) --- */}
      {data && (
        <Sidebar
          data={data}
          isLoading={isLoading}
          onLocationSelect={handleLocationSelect}
        />
      )}
      {/* AI Assistant */}
      <AIAssistant mode="resident" contextData={data} />
    </div>
  );
};
