import { Search, Bell, AlertTriangle } from "lucide-react";
import { useAirQuality } from "../../hooks/useAirQuality";
import { useMediaQuery } from "../../hooks/useMediaQuery";
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
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../../components/ui/command";

export const Dashboard = () => {
  const { data, isLoading, error, refresh, setLocation } = useAirQuality({
    enablePolling: true,
  });
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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
      <div className="flex h-screen w-full flex-col overflow-hidden bg-background lg:flex-row">
        {/* Left Panel Skeleton */}
        <main className="flex-1 p-4 lg:p-10 dashboard-bg">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-4">
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
              <div className="h-10 w-64 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-12 w-96 rounded-2xl bg-muted animate-pulse hidden md:block" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="h-64 rounded-3xl bg-muted animate-pulse" />
            <div className="h-64 rounded-3xl bg-muted animate-pulse" />
          </div>
        </main>
        {/* Right Panel Skeleton */}
        <aside className="hidden h-full w-[calc(400px_+_10%)] border-l border-border bg-background p-6 lg:block">
          <div className="space-y-8">
            <div className="flex justify-center pt-8">
              <div className="h-24 w-24 rounded-3xl bg-muted animate-pulse" />
            </div>
          </div>
        </aside>
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

  // --- COMMON HEADER (Used in both views) ---
  const HeaderContent = () => (
    <>
      <div className="flex items-center justify-between gap-4 w-full">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-500">
              Resident
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-foreground">
            Air Quality
          </h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <ThemeToggle />
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent focus:outline-none">
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
            </DropdownMenuContent>
          </DropdownMenu>

          <UserButton
            appearance={{
              baseTheme: dark,
              elements: { userButtonPopoverFooter: "hidden" },
            }}
          />
        </div>
      </div>
    </>
  );

  // --- MAIN CONTENT RENDERER ---
  const MainContent = () => (
    <div className="space-y-6">
      <section className="mb-6 sm:mb-8 relative z-0">
        <div className="mb-3 sm:mb-4 flex items-end justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Live Overview
          </h2>
          <div className="flex items-center gap-2 text-[10px] lg:text-xs text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />{" "}
            Live
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-60 sm:h-80 w-full overflow-hidden rounded-2xl bg-muted shadow-xl ring-1 ring-border transition-all">
          <InteractiveMap
            data={data}
            onLocationChange={(lat, lng) => {
              setLocation(lat, lng);
              toast.info("Fetching AQI for new location...");
            }}
          />
          <div className="absolute right-4 top-4 z-[500]">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition-transform hover:scale-110 hover:bg-accent focus:outline-none"
                  title="Detailed View"
                >
                  <span className="text-lg font-bold">?</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] lg:max-w-[68vw] h-[80vh] lg:h-[90vh] p-0 overflow-hidden bg-background border-border shadow-2xl rounded-3xl">
                <div className="h-full w-full overflow-hidden">
                  <ListView data={data} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Pollutants & Forecast */}
      {data && (
        <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 mb-6">
          <PollutantGrid pollutants={data.pollutants} />
          <ForecastList forecast={data.forecast} />
        </div>
      )}

      {/* Health Insights */}
      {data && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
          <CigaretteWidget pm25={data.pollutants.pm25} />
          <ExerciseAdvisor
            currentAQI={data.aqi}
            forecast={data.forecast}
          />
        </section>
      )}
    </div>
  );

  // --- MOBILE LAYOUT ---
  if (!isDesktop) {
    return (
      <div className="flex flex-col h-screen bg-background font-sans text-foreground">
        <Toaster position="top-center" />
        <header className="px-4 py-3 border-b border-border bg-background">
            <HeaderContent />
            {/* Search moved below header title on mobile */}
            <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    } else if (e.key === "Escape") {
                      setShowSearchResults(false);
                    }
                  }}
                  onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 100)} // Delay to allow click on results
                  className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {showSearchResults && searchResults.length > 0 && (
                  <Command className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Search Results">
                        {searchResults.map((item) => (
                          <CommandItem
                            key={item.lat + item.lng}
                            onSelect={() => handleLocationSelect(item.lat, item.lng, item.displayName)}
                            className="cursor-pointer"
                          >
                            {item.displayName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
            </div>
        </header>
        <ScrollArea className="flex-1">
            <main className="p-3 sm:p-4 bg-background dashboard-bg pb-20">
                <MainContent />
            </main>
        </ScrollArea>
        <AIAssistant mode="resident" contextData={data} />
      </div>
    );
  }

  // --- DESKTOP LAYOUT ---
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full bg-background font-sans text-foreground"
    >
      <Toaster position="top-center" />

      {/* Left Main Content */}
      <ResizablePanel defaultSize={70} minSize={50}>
        <div className="flex h-full flex-col">
          <header className="flex h-20 items-center justify-between border-b border-border bg-background px-8 py-4">
             <div className="flex-1 flex justify-between items-center gap-8">
                <HeaderContent />
                <div className="relative w-96 hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                    type="text"
                    placeholder="Search city..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      } else if (e.key === "Escape") {
                        setShowSearchResults(false);
                      }
                    }}
                    onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 100)} // Delay to allow click on results
                    className="w-full rounded-full border-none bg-accent/20 py-2.5 pl-10 pr-4 shadow-sm ring-1 ring-border focus:ring-2 focus:ring-primary"
                    />
                    {showSearchResults && searchResults.length > 0 && (
                      <Command className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup heading="Search Results">
                            {searchResults.map((item) => (
                              <CommandItem
                                key={item.lat + item.lng}
                                onSelect={() => handleLocationSelect(item.lat, item.lng, item.displayName)}
                                className="cursor-pointer"
                              >
                                {item.displayName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    )}
                </div>
             </div>
          </header>

          <ScrollArea className="flex-1">
            <main className="p-10 dashboard-bg">
                <MainContent />
            </main>
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

      {/* Right Sidebar */}
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

      <AIAssistant mode="resident" contextData={data} />
    </ResizablePanelGroup>
  );
};
