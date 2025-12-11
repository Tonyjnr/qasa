/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
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
  MapPin,
} from "lucide-react";
import { useAirQuality } from "../../hooks/useAirQuality";
import { useMediaQuery } from "../../hooks/useMediaQuery";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../../components/ui/command";

export default function ProfessionalDashboard() {
  const { data, isLoading, error, setLocation, location } = useAirQuality({
    enablePolling: true,
  });
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [activeTab, setActiveTab] = useState<string>(
    () => localStorage.getItem("professionalActiveTab") || "dashboard"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Only search if 3 or more characters
      if (searchQuery.trim().length >= 3) {
        try {
          setIsSearching(true);
          const results = await searchLocation(searchQuery);
          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error(error);
          // Silent fail for auto-search to avoid spam
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + searchResults.length) % searchResults.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        const item = searchResults[selectedIndex];
        handleLocationSelect(item.lat, item.lng, item.displayName);
      }
    } else if (e.key === "Escape") {
      setShowSearchResults(false);
    }
  };

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

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLocation(lat, lng, name);
    setShowSearchResults(false);
    setSearchQuery("");
    toast.success(`Location changed to ${name}`);
  };

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

  const currentTabLabel =
    navItems.find((n) => n.id === activeTab)?.label || "Dashboard";

  // --- LOADING / ERROR STATES ---
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

  // --- RENDER CONTENT HELPER ---
  const renderContent = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg lg:text-xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {location.name || "Live Monitoring Network"}
              </h2>
              {/* Optional: Add a badge indicating source */}
              <span className="text-[10px] bg-accent px-2 py-1 rounded text-muted-foreground uppercase tracking-wider">
                Live
              </span>
            </div>
            {/* Reduced height for mobile map */}
            <div className="h-[300px] lg:h-[500px] rounded-xl overflow-hidden border border-border shadow-sm">
              <InteractiveMapProfessional
                center={[location.lat, location.lng]}
                onLocationChange={(lat, lng) => {
                  setLocation(lat, lng, "Selected Location");
                  toast.info("Fetching AQI for selected location...");
                }}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <PollutantGrid pollutants={data.pollutants} />
            <ForecastList forecast={data.forecast} />
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
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
    </div>
  );

  // --- MOBILE LAYOUT (< 1024px) ---
  if (!isDesktop) {
    return (
      <div className="flex flex-col h-screen bg-background font-sans text-foreground overflow-hidden">
        <Toaster position="top-center" />

        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 -ml-1 text-muted-foreground focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 ml-2">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="cursor-pointer gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-lg font-bold text-foreground truncate">
              {currentTabLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton appearance={{ baseTheme: dark }} />
          </div>
        </header>

        {/* Mobile Scroll Area */}
        <ScrollArea className="flex-1">
          <main className="p-4 pb-24 bg-background">
            {/* Mobile Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() =>
                  setTimeout(() => setShowSearchResults(false), 200)
                }
                className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div
                className={cn(
                  "absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out",
                  showSearchResults && searchResults.length > 0
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                )}
                style={{
                  height:
                    showSearchResults && searchResults.length > 0
                      ? Math.min(searchResults.length * 40 + 50, 300)
                      : 0,
                }}
              >
                <Command>
                  <CommandList className="max-h-[300px] overflow-y-auto">
                    {searchResults.length === 0 && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
                    <CommandGroup heading="Search Results">
                      {searchResults.map((item, index) => (
                        <CommandItem
                          key={item.lat + "" + item.lng}
                          onSelect={() =>
                            handleLocationSelect(
                              item.lat,
                              item.lng,
                              item.displayName
                            )
                          }
                          className={cn(
                            "cursor-pointer",
                            selectedIndex === index &&
                              "bg-accent text-accent-foreground"
                          )}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleLocationSelect(
                              item.lat,
                              item.lng,
                              item.displayName
                            );
                          }}
                        >
                          {item.displayName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </div>
            {renderContent()}
          </main>
        </ScrollArea>

        {/* AI Assistant FAB */}
        <AIAssistant mode="professional" contextData={data} />
      </div>
    );
  }

  // --- DESKTOP LAYOUT (>= 1024px) ---
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <Toaster position="top-center" />

      {/* Left Sidebar */}
      <aside className="w-64 hidden lg:flex flex-col flex-shrink-0 border-r border-border bg-card">
        <div className="flex h-20 items-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-col justify-center gap-[3px] overflow-hidden rounded-full bg-foreground/5 p-1.5 backdrop-blur-sm">
              <div className="h-1 w-full rounded-full bg-[#4285F4]" />
              <div className="h-1 w-[80%] rounded-full bg-[#26A69A]" />
              <div className="h-1 w-full rounded-full bg-[#0F9D58]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              QASA{" "}
              <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1 align-middle">
                PRO
              </span>
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
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
          <div className="flex flex-1 flex-col h-full bg-background">
            {/* Header */}
            <header className="flex h-20 flex-row items-center justify-between gap-4 border-b border-border bg-card px-8">
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

              <div className="flex items-center gap-4">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() =>
                      setTimeout(() => setShowSearchResults(false), 200)
                    }
                    className="w-full rounded-full border border-input bg-background py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div
                    className={cn(
                      "absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out",
                      showSearchResults && searchResults.length > 0
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    )}
                    style={{
                      height:
                        showSearchResults && searchResults.length > 0
                          ? Math.min(searchResults.length * 40 + 50, 300)
                          : 0,
                    }}
                  >
                    <Command>
                      <CommandList className="max-h-[300px] overflow-y-auto">
                        {searchResults.length === 0 && (
                          <CommandEmpty>No results found.</CommandEmpty>
                        )}
                        <CommandGroup heading="Search Results">
                          {searchResults.map((item, index) => (
                            <CommandItem
                              key={item.lat + "" + item.lng}
                              onSelect={() =>
                                handleLocationSelect(
                                  item.lat,
                                  item.lng,
                                  item.displayName
                                )
                              }
                              className={cn(
                                "cursor-pointer",
                                selectedIndex === index &&
                                  "bg-accent text-accent-foreground"
                              )}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleLocationSelect(
                                  item.lat,
                                  item.lng,
                                  item.displayName
                                );
                              }}
                            >
                              {item.displayName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                </div>
                <ThemeToggle />
                <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent">
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                  <Bell className="h-5 w-5" />
                </button>
                <UserButton
                  appearance={{
                    baseTheme: dark,
                    elements: {
                      userButtonPopoverCard:
                        "bg-slate-900 border border-slate-800",
                      userButtonPopoverFooter: "hidden",
                      userButtonPopoverActionButton:
                        "hover:bg-slate-800 text-slate-200",
                      userButtonPopoverActionButtonText: "text-slate-200",
                      userButtonPopoverActionButtonIcon: "text-slate-400",
                    },
                  }}
                />
              </div>
            </header>

            <ScrollArea className="flex-1">
              <main className="p-8 dashboard-bg">{renderContent()}</main>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

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
