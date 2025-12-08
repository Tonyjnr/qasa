/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FileText,
  Calculator,
  UploadCloud,
  LayoutDashboard,
  Search,
  Menu,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { useAirQuality } from "../../hooks/useAirQuality";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { apiService, type Dataset } from "../../services/apiService";

import { Button } from "../../components/ui/button";
import { AIAssistant } from "../../components/ai/AIAssistant";
import { cn } from "../../lib/utils";
import { Sidebar } from "../../components/layout/Sidebar";

// Imported Tab Content Components
import { ResearchOverview } from "./ResearchOverview";
import { RiskCalculator } from "./RiskCalculator";
import { DataUpload } from "./DataUpload";
import { Reports } from "./Reports";
import { dark } from "@clerk/themes";
import { useTheme } from "../../contexts/ThemeProvider";

export const Dashboard = () => {
  const { data, isLoading } = useAirQuality({
    enablePolling: true,
  });
  const { theme } = useTheme();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "risk" | "upload" | "reports"
  >("overview");

  // Fetch datasets on mount
  useEffect(() => {
    async function fetchDatasets() {
      try {
        const result = await apiService.getDatasets();
        setDatasets(result);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load datasets");
      }
    }
    fetchDatasets();
  }, []);

  // Nav Items Configuration
  const navItems = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "risk", icon: Calculator, label: "Risk Calculator" },
    { id: "upload", icon: UploadCloud, label: "Data Upload" },
    { id: "reports", icon: FileText, label: "Reports" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ResearchOverview datasets={datasets} />;
      case "risk":
        return data ? (
          <RiskCalculator data={data} />
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Loading environmental data...
          </div>
        );
      case "upload":
        return <DataUpload />;
      case "reports":
        return <Reports />;
      default:
        return <ResearchOverview datasets={datasets} />;
    }
  };

  const getPageTitle = () => {
    const item = navItems.find((n) => n.id === activeTab);
    return item ? item.label : "Dashboard";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Toaster position="top-center" />

      {/* --- PROFESSIONAL LEFT SIDEBAR (Reduced width by 10% -> ~210px) --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[210px] flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:flex",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-20 items-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              Pro
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Research
            </span>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full justify-start gap-3 mb-1",
                activeTab === item.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      {/* --- MIDDLE CONTENT AREA --- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-auto flex-col justify-between gap-4 border-b border-border bg-background/50 px-6 py-4 backdrop-blur-sm md:h-20 md:flex-row md:items-center md:py-0 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-muted-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Dashboard
                </span>
                <span className="text-xs">›</span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                  Professional
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-slate-500">
                Welcome back, Dr. Researcher
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search datasets..."
                className="h-10 w-64 rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <ThemeToggle />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <UserButton
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
                  userButtonPopoverFooter: "hidden",
                  footer: "hidden",
                  footerAction: "hidden",
                  navbarMobileMenuFooter: "hidden",
                },
              }}
              userProfileProps={{
                appearance: {
                  baseTheme: theme === "dark" ? dark : undefined,
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
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {renderContent()}
        </main>
      </div>

      {/* --- RIGHT SIDEBAR (Reused from Resident, reduced size by 10% -> ~380px) --- */}
      {data && (
        <Sidebar
          data={data}
          isLoading={isLoading}
          className="hidden lg:flex lg:w-[380px] border-l border-border"
        />
      )}

      {/* AI Assistant */}
      <AIAssistant mode="professional" contextData={data} />
    </div>
  );
};
