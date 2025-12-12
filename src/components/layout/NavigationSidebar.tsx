/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import {
  LayoutDashboard,
  Cloud,
  LineChart,
  ListOrdered,
  FileText,
  Calculator,
  UploadCloud,
} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface NavigationSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
}

export const NavigationSidebar = ({
  activeTab,
  setActiveTab,
  className,
}: NavigationSidebarProps) => {
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

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border bg-card",
        className
      )}
    >
      <div className="flex h-20 items-center border-b border-border px-6 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-8 w-8 flex-col justify-center gap-[3px] overflow-hidden rounded-full bg-foreground/5 p-1.5 backdrop-blur-sm">
            <div className="h-1 w-full rounded-full bg-[#4285F4]" />
            <div className="h-1 w-[80%] rounded-full bg-[#26A69A]" />
            <div className="h-1 w-full rounded-full bg-[#152236]/60" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            QASA{" "}
            <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1 align-middle">
              PRO
            </span>
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === item.id
                  ? "bg-[#1e293b] text-white shadow-md border border-white/10 ring-1 ring-white/10"
                  : "text-muted-foreground hover:bg-background/80 hover:bg-opacity-50 hover:border hover:border-white/10 hover:text-white hover:pl-4"
              )}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};
