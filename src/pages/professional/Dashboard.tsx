import { useState, useEffect } from "react";
import { UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import {
  FileText,
  Calculator,
  UploadCloud,
  LayoutDashboard,
  Search,
  Menu,
  Bell,
  AlertTriangle,
  Cloud,
  LineChart,
  ListOrdered,
} from "lucide-react";
import { useAirQuality } from "../../hooks/useAirQuality";
import { searchLocation } from "../../services/api";
import { toast, Toaster } from "sonner";
import { apiService, type Dataset } from "../../services/apiService";

// Component Imports
import { CigaretteWidget } from "../../components/dashboard/CigaretteWidget";
import { ExerciseAdvisor } from "../../components/dashboard/ExerciseAdvisor";
import { PollutantGrid } from "../../components/dashboard/PollutantGrid";
import { ForecastList } from "../../components/dashboard/ForecastList";
import { Sidebar } from "../../components/layout/Sidebar";
import { AIAssistant } from "../../components/ai/AIAssistant";
import { cn } from "../../lib/utils";
import { ThemeToggle } from "../../components/ui/theme-toggle"; // Added

// New Feature Components
import { InteractiveMapProfessional } from "../../components/professional/interactive-map/InteractiveMapProfessional";
import { WeatherOverview } from "../../components/professional/weather-overview/WeatherOverview";
import { HistoricalChartsView } from "../../components/professional/historical-charts/HistoricalChartsView";
import { CityRankingTable } from "../../components/professional/city-ranking/CityRankingTable";

// Tab Content Components
import { ResearchOverview } from "./ResearchOverview";
import { RiskCalculator } from "./RiskCalculator";
import { DataUpload } from "./DataUpload";
import { Reports } from "./Reports";

// Resizable & Scroll
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { ScrollArea } from "../../components/ui/scroll-area";

export default function ProfessionalDashboard() {
  const { data, isLoading, error, setLocation, location } = useAirQuality({
    enablePolling: true,
  });
  const [activeTab, setActiveTab] = useState<string>(
    () => localStorage.getItem("professionalActiveTab") || "dashboard"
  );
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    localStorage.setItem("professionalActiveTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "overview") {
      const loadDatasets = async () => {
        try {
          const res = await apiService.getDatasets();
          setDatasets(res);
        } catch (err) {
          console.error("Failed to fetch datasets", err);
        }
      };
      loadDatasets();
    }
  }, [activeTab]);

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
    setLocation(lat, lng, name);
    setShowSearchResults(false);
    setSearchQuery("");
    toast.success(`Location changed to ${name}`);
  };

  // ... (navItems remain same)
  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Live Monitor" },
    { id: "weather", icon: Cloud, label: "Weather Overview" },
    { id: "historical-aqi", icon: LineChart, label: "Historical Trends" },
    { id: "city-rankings", icon: ListOrdered, label: "City Rankings" },
    { id: "overview", icon: FileText, label: "Research Overview" },
    { id: "risk", icon: Calculator, label: "Risk Calculator" },
    { id: "upload", icon: UploadCloud, label: "Data Upload" },
    { id: "reports", icon: FileText, label: "Reports" },
  ];

  if (isLoading && !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Connection Failed
          </h2>
          <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Toaster position="top-center" />

      {/* Left Sidebar */}
      <aside className="w-64 hidden md:flex flex-col flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex h-20 items-center border-b border-gray-200 dark:border-gray-800 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              Pro
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Research
            </span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={75} minSize={40}>
          <div className="flex flex-1 flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="flex h-auto flex-col justify-between gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 md:h-20 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 -ml-2 text-gray-500">
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Dashboard
                    </span>
                    <span className="text-xs">›</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Professional
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Air Quality Monitor
                  </h1>
                </div>
              </div>

              <div className="flex w-full items-center gap-3 md:w-auto">
                <div className="relative flex-1 md:w-96">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
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
                    className={`w-full rounded-full border-none bg-white dark:bg-gray-800 py-3 pl-10 pr-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-shadow focus:ring-2 focus:ring-blue-500 ${
                      isSearching ? "opacity-50" : ""
                    }`}
                    disabled={isSearching}
                  />
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full z-[999] mt-2 max-h-64 w-full overflow-y-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
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
                          className="w-full border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {result.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {result.state ? `${result.state}, ` : ""}
                            {result.country}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle /> {/* Added ThemeToggle */}
                  <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                    <Bell className="h-5 w-5" />
                  </button>
                  <UserButton
                    appearance={{
                      baseTheme: dark,
                      elements: {
                        userButtonPopoverFooter: "hidden",
                      },
                    }}
                  />
                </div>
              </div>
            </header>

            <ScrollArea className="flex-1">
              <main className="p-4 lg:p-10">
                {activeTab === "dashboard" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Map Section */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-foreground">
                          Live Monitoring Network
                        </h2>
                      </div>
                      {/* Pass current location to map */}
                      <InteractiveMapProfessional center={[location.lat, location.lng]} />
                    </section>

                    {/* Pollutants & Forecast (Reordered above Health) */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      <PollutantGrid pollutants={data.pollutants} />
                      <ForecastList forecast={data.forecast} />
                    </div>

                    {/* Health Insights */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <CigaretteWidget pm25={data.pollutants.pm25} />
                      <ExerciseAdvisor
                        currentAQI={data.aqi}
                        forecast={data.forecast}
                      />
                    </section>
                  </div>
                )}

                {activeTab === "weather" && (
                  <WeatherOverview location={location} />
                )}
                {activeTab === "historical-aqi" && (
                  <HistoricalChartsView location={location} />
                )}
                {activeTab === "city-rankings" && <CityRankingTable />}

                {activeTab === "overview" && (
                  <ResearchOverview datasets={datasets} />
                )}
                {activeTab === "risk" && <RiskCalculator data={data} />}
                {activeTab === "upload" && <DataUpload />}
                {activeTab === "reports" && <Reports />}
              </main>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-gray-200 dark:bg-gray-800 hover:bg-blue-500/20"
        />

        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <ScrollArea className="h-full">
            <Sidebar
              data={data}
              isLoading={isLoading}
              onLocationSelect={handleLocationSelect}
              className="h-full w-full"
            />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>

      <AIAssistant mode="professional" contextData={data} />
    </div>
  );
}