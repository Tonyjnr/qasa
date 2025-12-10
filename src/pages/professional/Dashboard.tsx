import { useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import {
  FileText,
  Calculator,
  UploadCloud,
  LayoutDashboard,
  Search,
  Bell,
  X,
  Menu,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useAirQuality } from "../../hooks/useAirQuality";
import { PollutantGrid } from "../../components/dashboard/PollutantGrid";
import { ForecastList } from "../../components/dashboard/ForecastList";
import { Sidebar } from "../../components/layout/Sidebar";
import { CigaretteWidget } from "../../components/dashboard/CigaretteWidget";
import { ExerciseAdvisor } from "../../components/dashboard/ExerciseAdvisor";
import { InteractiveMap } from "../../components/dashboard/InteractiveMap";
import { Toaster, toast } from "sonner";
import { cn } from "../../lib/utils";
import { searchLocation } from "../../services/api";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { AIAssistant } from "../../components/ai/AIAssistant";

// Sub-pages (lazy loaded in a real app, imported directly here for simplicity)
import { Overview } from "./Overview";
import { RiskCalculator } from "./RiskCalculator";
import { DataUpload } from "./DataUpload";
import { Reports } from "./Reports";
import { ResearchOverview } from "./ResearchOverview"; // Assuming this is distinct from Overview

// Mock datasets for the research overview
const MOCK_DATASETS = [
  {
    id: "1",
    name: "Lagos_Mainland_Q3.csv",
    size: "2.4 MB",
    uploadedAt: new Date().toISOString(),
    type: "csv",
    status: "ready",
  },
  {
    id: "2",
    name: "Industrial_Zone_Sensors.json",
    size: "156 KB",
    uploadedAt: new Date().toISOString(),
    type: "json",
    status: "ready",
  },
];

export default function ProfessionalDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Use the same real data hook as Resident dashboard
  const { data, isLoading, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await searchLocation(searchQuery);
      if (results.length > 0) {
        setLocation(results[0].lat, results[0].lng, results[0].name);
        toast.success(`Location changed to ${results[0].name}`);
      } else {
        toast.error("Location not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    }
  };

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Live Monitor" },
    { id: "overview", icon: FileText, label: "Research Overview" },
    { id: "risk", icon: Calculator, label: "Risk Calculator" },
    { id: "upload", icon: UploadCloud, label: "Data Upload" },
    { id: "reports", icon: FileText, label: "Reports" },
  ];

  if (isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full bg-background"
    >
      <Toaster position="top-center" />

      {/* --- LEFT SIDEBAR (Navigation) --- */}
      <ResizablePanel
        defaultSize={15}
        minSize={12}
        maxSize={20}
        className={cn(
          "bg-background border-r border-border transition-all duration-300",
          !isSidebarOpen && "hidden"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center border-b border-border px-6 justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                Pro
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Research
              </span>
            </div>
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
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
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

      {/* --- CENTER CONTENT --- */}
      <ResizablePanel defaultSize={60} minSize={40}>
        <div className="flex flex-1 flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="flex h-auto flex-col justify-between gap-4 border-b border-border bg-background px-6 py-4 md:h-20 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <button
                  className="p-2 -ml-2 text-muted-foreground"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground capitalize">
                  {navItems.find((n) => n.id === activeTab)?.label}
                </h1>
              </div>
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full rounded-full border bg-background py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <ThemeToggle />
              <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent">
                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                <Bell className="h-5 w-5" />
              </button>
              <UserButton />
            </div>
          </header>

          {/* Main Scrollable Area */}
          <ScrollArea className="flex-1">
            <main className="p-4 lg:p-8 bg-muted/10 h-full">
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* Map Section */}
                  <div className="h-80 w-full rounded-2xl overflow-hidden border border-border shadow-sm">
                    <InteractiveMap
                      data={data}
                      onLocationChange={(lat, lng) => setLocation(lat, lng)}
                    />
                  </div>

                  {/* Widgets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CigaretteWidget pm25={data.pollutants.pm25} />
                    <ExerciseAdvisor
                      currentAQI={data.aqi}
                      forecast={data.forecast}
                    />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <PollutantGrid pollutants={data.pollutants} />
                    <ForecastList forecast={data.forecast} />
                  </div>
                </div>
              )}

              {activeTab === "overview" && (
                <>
                  <Overview datasets={MOCK_DATASETS} />
                  <div className="mt-8">
                    <ResearchOverview datasets={MOCK_DATASETS} />
                  </div>
                </>
              )}

              {activeTab === "risk" && <RiskCalculator data={data} />}
              {activeTab === "upload" && <DataUpload />}
              {activeTab === "reports" && <Reports />}
            </main>
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

      {/* --- RIGHT SIDEBAR (Summary) --- */}
      <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
        <ScrollArea className="h-full">
          <Sidebar
            data={data}
            isLoading={isLoading}
            onLocationSelect={(lat, lng, name) => setLocation(lat, lng, name)}
          />
        </ScrollArea>
      </ResizablePanel>

      <AIAssistant mode="professional" contextData={data} />
    </ResizablePanelGroup>
  );
}