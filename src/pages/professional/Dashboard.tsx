import {
  FileText,
  Calculator,
  UploadCloud,
  LayoutDashboard,
  Search,
  Bell,
  AlertTriangle,
  Menu,
  X,
  Database,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { useAirQuality } from "../../hooks/useAirQuality";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { apiService, type Dataset } from "../../services/apiService";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { AIAssistant } from "../../components/ai/AIAssistant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { cn } from "../../lib/utils"; // Import cn utility

// --- Sub-components for Dashboard Tab Content ---

const OverviewTab = ({ datasets }: { datasets: Dataset[] }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-card border-border shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Sensors
          </CardTitle>
          <Database className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">24</div>
          <p className="text-xs text-muted-foreground">+2 from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-border shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Data Points
          </CardTitle>
          <FileText className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">1.2M</div>
          <p className="text-xs text-muted-foreground">Updated 5 mins ago</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-border shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Storage Used
          </CardTitle>
          <UploadCloud className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">45%</div>
          <p className="text-xs text-muted-foreground">24GB / 50GB</p>
        </CardContent>
      </Card>
    </div>

    {/* Main Workspace Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Recent Datasets */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent Datasets</h2>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Upload New
          </Button>
        </div>

        <div className="bg-card dark:bg-card/50 rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-medium text-muted-foreground">
                  File Name
                </th>
                <th className="p-4 font-medium text-muted-foreground">Size</th>
                <th className="p-4 font-medium text-muted-foreground">
                  Date Uploaded
                </th>
                <th className="p-4 font-medium text-muted-foreground text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {datasets.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium flex items-center gap-3 text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {file.name}
                  </td>
                  <td className="p-4 text-muted-foreground">{file.size}</td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      Analyze
                    </Button>
                  </td>
                </tr>
              ))}
              {datasets.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No datasets found. Upload data to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Quick Tools */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-foreground">System Status</h2>

        <Card className="bg-card border-border rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              API Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> REST
                API
              </span>
              <span className="text-emerald-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Database
              </span>
              <span className="text-muted-foreground">Syncing...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

// --- Main Professional Dashboard Component ---

export const Dashboard = () => {
  const { data } = useAirQuality({
    enablePolling: true,
  });

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // To determine active tab

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

  // Helper to check active route
  const isActive = (path: string) => location.pathname === path;

  // Nav Items Configuration
  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/" },
    { icon: Calculator, label: "Risk Calculator", path: "/risk-calculator" },
    { icon: UploadCloud, label: "Data Upload", path: "/data-upload" },
    { icon: FileText, label: "Reports", path: "/reports" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Toaster position="top-center" />

      {/* --- PROFESSIONAL SIDEBAR (Reduced width by ~10% from 64/256px -> 58/230px) --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[230px] flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:flex",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-20 items-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              Pro
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              QASA Research
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
            <Link to={item.path} key={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-border bg-background/50 px-6 backdrop-blur-sm lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-muted-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Dynamic Breadcrumb / Page Title */}
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {navItems.find((n) => isActive(n.path))?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search research data..."
                className="h-9 w-64 rounded-full border border-input bg-background pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <ThemeToggle />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none">
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                  <Bell className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>System Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-4 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Sensor #402 Offline
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mainland station reporting stopped.
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <UserButton />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background">
          {/* Render content based on current route - Dashboard (Overview) is default here */}
          {/* In a real router setup, <Outlet /> would be here, but for this file structure we render conditionally or assume this component handles only "/" */}
          <OverviewTab datasets={datasets} />
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant mode="professional" contextData={data} />
    </div>
  );
};
