/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText, Download, Share2, Calendar, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const downloadCSV = (data: any[]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Date,Value,Status",
        ...data.map((e) => Object.values(e).join(",")),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Air Quality Report", 14, 15);
    autoTable(doc, {
      head: [["Date", "AQI", "Status"]],
      body: [
        ["2024-10-01", "45", "Good"],
        ["2024-10-02", "112", "Unhealthy"],
        ["2024-10-03", "55", "Moderate"],
      ],
      startY: 20,
    });
    doc.save("report.pdf");
  };

  const handleDownload = (type: string) => {
    if (type === "CSV") {
      downloadCSV([
        { date: "2024-10-01", value: 45, status: "Good" },
        { date: "2024-10-02", value: 112, status: "Unhealthy" },
      ]);
    } else {
      downloadPDF();
    }
  };

  return (
    // Removed p-4 lg:p-8 to avoid double padding (Dashboard layout handles container padding)
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header Controls - Stack vertically on mobile, row on tablet+ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Group - Allow horizontal scrolling on very small screens if needed */}
        <div className="flex items-center gap-1 sm:gap-2 bg-card border border-border p-1 rounded-lg overflow-x-auto max-w-full">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 sm:h-8 text-xs font-medium whitespace-nowrap"
          >
            All Reports
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 sm:h-8 text-xs font-medium text-muted-foreground whitespace-nowrap"
          >
            Generated
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 sm:h-8 text-xs font-medium text-muted-foreground whitespace-nowrap"
          >
            Archived
          </Button>
        </div>

        {/* Action Buttons - Full width on mobile */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none gap-2 text-xs sm:text-sm"
          >
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
          <Button
            size="sm"
            onClick={() => handleDownload("PDF")}
            className="flex-1 sm:flex-none gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm"
          >
            <FileText className="h-3.5 w-3.5" /> Generate
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {REPORTS.map((report) => (
          <div
            key={report.id}
            className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
          >
            <div className="mb-3 sm:mb-4">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                {/* Smaller icon container on mobile */}
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 sm:py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    report.status === "Ready"
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  )}
                >
                  {report.status}
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-2 mb-1 sm:mb-2">
                {report.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {report.date}
                </span>
                <span className="border-l border-border pl-3">
                  {report.type}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 pt-3 sm:pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground h-8 sm:h-9"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(report.type)}
                disabled={report.status !== "Ready"}
                className="flex-1 gap-2 border-primary/20 hover:bg-primary/5 text-primary hover:text-primary text-xs sm:text-sm h-8 sm:h-9"
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
