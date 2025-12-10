/* eslint-disable @typescript-eslint/no-unused-vars */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Search, Menu, Bell, AlertTriangle, X } from "lucide-react";
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
import { NavigationSidebar } from "../../components/layout/NavigationSidebar";
import { AIAssistant } from "../../components/ai/AIAssistant";
import { ThemeToggle } from "../../components/ui/theme-toggle";

import { InteractiveMapProfessional } from "../../components/professional/interactive-map/InteractiveMapProfessional";
import { WeatherOverview } from "../../components/professional/weather-overview/WeatherOverview";
import { HistoricalChartsView } from "../../components/professional/historical-charts/HistoricalChartsView";
import { CityRankingTable } from "../../components/professional/city-ranking/CityRankingTable";

import { ResearchOverview } from "./ResearchOverview";
import { RiskCalculator } from "./RiskCalculator";
import { DataUpload } from "./DataUpload";
import { Reports } from "./Reports";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useMediaQuery } from "../../hooks/useMediaQuery";

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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

  // Label lookup
  const currentTabLabel =
    {
      dashboard: "Live Monitor",
      weather: "Weather Overview",
      "historical-aqi": "Historical Trends",
      "city-rankings": "City Rankings",
      overview: "Research Overview",
      risk: "Risk Calculator",
      upload: "Data Upload",
      reports: "Reports",
    }[activeTab] || "Dashboard";

  if (isLoading && !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Connection Failed
          </h2>
          <p className="mb-8 max-w-md text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const MainContent = () => (
    <main className="p-4 lg:p-10 dashboard-bg">
      {activeTab === "dashboard" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Live Monitoring Network
              </h2>
            </div>
            <InteractiveMapProfessional
              center={[location.lat, location.lng]}
              onLocationChange={(lat, lng) => {
                setLocation(lat, lng, "Selected Location");
                toast.info("Fetching AQI for selected location...");
              }}
            />
          </section>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <PollutantGrid pollutants={data.pollutants} />
            <ForecastList forecast={data.forecast} />
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CigaretteWidget pm25={data.pollutants.pm25} />
            <ExerciseAdvisor currentAQI={data.aqi} forecast={data.forecast} />
          </section>
        </div>
      )}

      {activeTab === "weather" && <WeatherOverview location={location} />}
      {activeTab === "historical-aqi" && (
        <HistoricalChartsView location={location} />
      )}
      {activeTab === "city-rankings" && <CityRankingTable />}

      {activeTab === "overview" && <ResearchOverview datasets={datasets} />}
      {activeTab === "risk" && <RiskCalculator data={data} />}
      {activeTab === "upload" && <DataUpload />}
      {activeTab === "reports" && <Reports />}
    </main>
  );

  const Header = () => (
    <header className="flex h-auto flex-col justify-between gap-4 border-b border-border bg-card px-6 py-4 md:h-20 md:flex-row md:items-center sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {!isDesktop && (
          <button
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">
              Dashboard
            </span>
            <span className="text-xs">›</span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {currentTabLabel}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {currentTabLabel}
          </h1>
        </div>
      </div>

      <div className="flex w-full items-center gap-3 md:w-auto">
        <div className="relative flex-1 md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
            className={`w-full rounded-full border-none bg-background py-3 pl-10 pr-4 shadow-sm ring-1 ring-border transition-shadow focus:ring-2 focus:ring-primary ${
              isSearching ? "opacity-50" : ""
            }`}
            disabled={isSearching}
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full z-[999] mt-2 max-h-64 w-full overflow-y-auto rounded-3xl border border-border bg-popover text-popover-foreground shadow-lg">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    handleLocationSelect(result.lat, result.lng, result.name)
                  }
                  className="w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent last:border-b-0"
                >
                  <div className="font-medium text-foreground">
                    {result.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
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
          <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent">
            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
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
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <Toaster position="top-center" />

      {/* Mobile Sidebar Overlay */}
      {!isDesktop && isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card pt-5 pb-4 shadow-xl animate-in slide-in-from-left">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="h-full">
              <NavigationSidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsSidebarOpen(false);
                }}
                className="border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {isDesktop && (
        <div className="w-64 hidden lg:flex flex-col flex-shrink-0">
          <NavigationSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        {isDesktop ? (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={75} minSize={40}>
              <ScrollArea className="h-full">
                <MainContent />
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="bg-border hover:bg-primary/20"
            />

            <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
              <ScrollArea className="h-full">
                <Sidebar
                  data={data}
                  isLoading={isLoading}
                  onLocationSelect={handleLocationSelect}
                  className="h-full w-full border-none"
                />
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <ScrollArea className="flex-1">
            <MainContent />
            {/* Mobile Summary Sidebar at the bottom */}
            <div className="border-t border-border">
              <Sidebar
                data={data}
                isLoading={isLoading}
                onLocationSelect={handleLocationSelect}
                className="h-auto border-none shadow-none"
              />
            </div>
          </ScrollArea>
        )}
      </div>

      <AIAssistant mode="professional" contextData={data} />
    </div>
  );
}
