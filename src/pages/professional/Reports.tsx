import { useState } from "react";
import {
  FileText,
  Download,
  Share2,
  Calendar,
  LayoutDashboard,
  Calculator,
  UploadCloud,
  Search,
  Menu,
  Settings,
  Bell,
  X,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { useAirQuality } from "../../hooks/useAirQuality";
import { Toaster } from "sonner";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { AIAssistant } from "../../components/ai/AIAssistant";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const REPORTS = [
  {
    id: "R-2024-001",
    title: "Monthly Air Quality Summary - Lagos",
    date: "Oct 24, 2024",
    type: "PDF",
    status: "Ready",
  },
  {
    id: "R-2024-002",
    title: "Industrial Zone Safety Audit",
    date: "Oct 20, 2024",
    type: "CSV",
    status: "Ready",
  },
  {
    id: "R-2024-003",
    title: "Sensor Calibration Drift Analysis",
    date: "Oct 15, 2024",
    type: "PDF",
    status: "Processing",
  },
  {
    id: "R-2024-004",
    title: "Q3 Environmental Impact Statement",
    date: "Sep 30, 2024",
    type: "DOCX",
    status: "Ready",
  },
];

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: Calculator, label: "Risk Calculator", path: "/risk-calculator" },
  { icon: UploadCloud, label: "Data Upload", path: "/data-upload" },
  { icon: FileText, label: "Reports", path: "/reports" },
];

export const Reports = () => {
  const { data } = useAirQuality({
    enablePolling: true,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Toaster position="top-center" />

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
              QASA
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
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full gap-2 justify-start border-border hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-4 w-4" /> Settings
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b border-border bg-background/50 px-6 backdrop-blur-sm lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-muted-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Reports</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-full border border-input bg-background pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <ThemeToggle />
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

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-medium"
                >
                  All Reports
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-medium text-muted-foreground"
                >
                  Generated
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-medium text-muted-foreground"
                >
                  Archived
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-3.5 w-3.5" /> Filter
                </Button>
                <Button
                  size="sm"
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <FileText className="h-3.5 w-3.5" /> Generate Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {REPORTS.map((report) => (
                <div
                  key={report.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          report.status === "Ready"
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        )}
                      >
                        {report.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground line-clamp-2 mb-2">
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {report.date}
                      </span>
                      <span>{report.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="h-3.5 w-3.5" /> Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 border-primary/20 hover:bg-primary/5 text-primary hover:text-primary"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <AIAssistant mode="professional" contextData={data} />
    </div>
  );
};
