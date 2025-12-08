import {
  FileText,
  Download,
  Share2,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

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

export const Reports = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 lg:p-8">
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
  );
};