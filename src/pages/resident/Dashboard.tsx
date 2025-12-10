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
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
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
import { dark } from "@clerk/themes";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { ScrollArea } from "../../components/ui/scroll-area";

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

  // --- LOADING STATE ---
  if (isLoading && !data) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground">
          Loading Air Quality Data...
        </p>
      </div>
    );
  }

  // --- ERROR STATE ---
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
            onClick={() => refresh()}
            className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full bg-background font-sans text-foreground"
    >
      <Toaster position="top-center" />

      {/* --- MAIN CONTENT PANEL --- */}
      <ResizablePanel defaultSize={70} minSize={50}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="flex h-auto flex-col justify-between gap-4 border-b border-border bg-background px-6 py-4 md:h-20 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Dashboard
                </span>
                <span className="text-xs">›</span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Resident
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Air Quality Monitor
              </h1>
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
                  <div className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-3xl border border-border bg-popover text-popover-foreground shadow-lg">
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

                {/* Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none">
                      <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                      <Bell className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-4 cursor-pointer">
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            High Pollution Alert
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Air quality in Lagos is deteriorating.
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-4 cursor-pointer">
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Weekly Report Ready
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your exposure summary is available.
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <UserButton
                  appearance={{
                    baseTheme: dark,
                    elements: {
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                  userProfileProps={{
                    appearance: {
                      baseTheme: dark,
                      elements: {
                        rootBox: "overflow-hidden",
                        card: "overflow-hidden",
                        scrollBox: "overflow-hidden",
                        footer: "hidden",
                        footerAction: "hidden",
                        navbarMobileMenuFooter: "hidden",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </header>

          <ScrollArea className="flex-1">
            <main className="p-4 lg:p-10 dashboard-bg">
              {/* Map Section */}
              <section className="mb-8 relative z-0">
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Live Overview
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />{" "}
                    Live data from network
                  </div>
                </div>

                <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-muted shadow-xl ring-1 ring-border transition-all">
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
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition-transform hover:scale-110 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                          title="Detailed View"
                        >
                          <span className="text-lg font-bold">?</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[68vw] h-[90vh] p-0 overflow-hidden bg-background border-border shadow-2xl rounded-3xl">
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
                  <ExerciseAdvisor
                    currentAQI={data.aqi}
                    forecast={data.forecast}
                  />
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
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

      {/* --- RIGHT SIDEBAR PANEL --- */}
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <ScrollArea className="h-full">
          {data && (
            <Sidebar
              data={data}
              isLoading={isLoading}
              onLocationSelect={handleLocationSelect}
            />
          )}
        </ScrollArea>
      </ResizablePanel>

      {/* AI Assistant */}
      <AIAssistant mode="resident" contextData={data} />
    </ResizablePanelGroup>
  );
};