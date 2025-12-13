/* eslint-disable react-hooks/purity */
import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import {
  FileText,
  Download,
  Share2,
  Filter,
  BarChart3,
  Calendar,
  MapPin,
  Info,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { DateRangePicker } from "../../components/ui/date-range-picker";
import { LocationSelector } from "../../components/professional/historical-charts/LocationSelector";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import type { DateRange } from "react-day-picker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { TrendChart } from "../../components/professional/reports/TrendChart";

const ALL_POLLUTANTS = [
  { value: "pm25", label: "PM2.5" },
  { value: "pm10", label: "PM10" },
  { value: "o3", label: "Ozone" },
  { value: "no2", label: "NO2" },
  { value: "so2", label: "SO2" },
  { value: "co", label: "CO" },
];

export const Reports = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [selectedLocationName, setSelectedLocationName] = useState<
    string | null
  >(null);
  const [selectedPollutants, setSelectedPollutants] = useState<string[]>([])
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any[]>([]);

  const handlePollutantChange = (pollutantValue: string, checked: boolean) => {
    setSelectedPollutants((prev) =>
      checked
        ? [...prev, pollutantValue]
        : prev.filter((p) => p !== pollutantValue)
    );
  };

  const generateMockData = (from?: Date, to?: Date) => {
    const startDate = from || new Date();
    const endDate = to || startDate;
    const data = [];
    const days = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );

    if (days <= 1) {
      // Hourly data for 1-2 days
      for (let i = 0; i < 24; i++) {
        const date = new Date(startDate);
        date.setHours(i);
        const point: any = { date: date.toISOString() };
        selectedPollutants.forEach((p) => {
          point[p] = Math.floor(Math.random() * 50) + 10;
        });
        data.push(point);
      }
    } else {
      // Daily data
      for (let i = 0; i <= days; i++) {
        const date = addDays(startDate, i);
        const point: any = { date: date.toISOString() };
        selectedPollutants.forEach((p) => {
          point[p] = Math.floor(Math.random() * 80) + 20;
        });
        data.push(point);
      }
    }
    return data;
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReportGenerated(false);
    
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const data = generateMockData(dateRange?.from, dateRange?.to);
    setReportData(data);
    setReportGenerated(true);
    setIsGenerating(false);
  };

  const downloadCSV = () => {
    if (!selectedLocationName || reportData.length === 0) return;

    const headers = ["Date", ...selectedPollutants].join(",");
    const rows = reportData
      .map((row) => {
        const values = [
          format(new Date(row.date), "yyyy-MM-dd HH:mm"),
          ...selectedPollutants.map((p) => row[p]),
        ];
        return values.join(",");
      })
      .join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `report_${selectedLocationName.replace(/\s+/g, "_")}_${format(
        new Date(),
        "yyyy-MM-dd"
      )}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (!selectedLocationName || reportData.length === 0) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Air Quality Analysis Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Location: ${selectedLocationName}`, 14, 30);
    doc.text(`Generated: ${format(new Date(), "PPP")}`, 14, 36);

    const tableHead = [["Date", ...selectedPollutants.map((p) => p.toUpperCase())]];
    const tableBody = reportData.slice(0, 30).map((row) => [
      format(new Date(row.date), "yyyy-MM-dd"),
      ...selectedPollutants.map((p) => String(row[p])),
    ]);

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: 44,
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] }, // emerald-500
    });

    doc.save(`report_${selectedLocationName.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Analytical Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate comprehensive air quality assessments.
          </p>
        </div>
      </div>

      {/* Report Configuration Panel */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-primary" /> Report Parameters
          </CardTitle>
          <CardDescription>
            Select the data scope for your report.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Date Range Picker */}
            <div className="space-y-3 flex flex-col">
              <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" /> Date
                Range
              </Label>
              <DateRangePicker 
                date={dateRange} 
                setDate={setDateRange} 
                className="w-full"
                compact={!isDesktop} 
              />
            </div>

            {/* Location Selector */}
            <div className="space-y-3 flex flex-col">
              <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" /> Location
              </Label>
              <div className="flex-1">
                <LocationSelector
                  selectedId={selectedLocationId}
                  onSelect={(id, name) => {
                    setSelectedLocationId(id);
                    setSelectedLocationName(name);
                  }}
                />
              </div>
            </div>

            {/* Pollutant Selector */}
            <div className="space-y-3 flex flex-col">
              <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />{" "}
                Pollutants
              </Label>
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border border-border/50 h-full max-h-[120px] overflow-y-auto">
                {ALL_POLLUTANTS.map((pollutant) => (
                  <div
                    key={pollutant.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`pollutant-${pollutant.value}`}
                      checked={selectedPollutants.includes(pollutant.value)}
                      onCheckedChange={(checked: boolean) =>
                        handlePollutantChange(pollutant.value, checked)
                      }
                    />
                    <Label
                      htmlFor={`pollutant-${pollutant.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {pollutant.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end pt-4 border-t border-border/60">
            <Button
              onClick={handleGenerateReport}
              disabled={
                isGenerating ||
                !selectedLocationId ||
                selectedPollutants.length === 0
              }
              size="lg"
              className="w-full sm:w-auto min-w-[150px]"
            >
              {isGenerating ? (
                <>
                  <FileText className="mr-2 h-4 w-4 animate-pulse" />{" "}
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" /> Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportGenerated ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* Report Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-xl shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  Finalized
                </span>
                <span className="text-muted-foreground text-sm">
                  Ref: REP-{Math.floor(Math.random() * 10000)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Air Quality Analysis: {selectedLocationName}
              </h2>
              <p className="text-muted-foreground">
                Period:{" "}
                {dateRange?.from ? format(dateRange.from, "PPP") : "N/A"} —{" "}
                {dateRange?.to ? format(dateRange.to, "PPP") : "Present"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadCSV}>
                <Share2 className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <Button variant="default" onClick={downloadPDF}>
                <Download className="mr-2 h-4 w-4" /> PDF Report
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card/50">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Average AQI
                </p>
                <p className="text-4xl font-black text-emerald-500 mt-2">42</p>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full mt-2">
                  Good
                </span>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Peak AQI
                </p>
                <p className="text-4xl font-black text-amber-500 mt-2">112</p>
                <span className="text-xs text-amber-600 font-medium bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full mt-2">
                  Unhealthy (SG)
                </span>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Dominant Pollutant
                </p>
                <p className="text-4xl font-black text-foreground mt-2">
                  PM2.5
                </p>
                <span className="text-xs text-muted-foreground mt-2">
                  Particulate Matter
                </span>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Exceedance Days
                </p>
                <p className="text-4xl font-black text-destructive mt-2">3</p>
                <span className="text-xs text-destructive mt-2 font-medium">
                  Above WHO Limits
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={reportData} pollutants={selectedPollutants} />
            </CardContent>
          </Card>

          {/* Insights */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="flex items-center gap-2 font-bold text-lg text-blue-900 dark:text-blue-100 mb-3">
              <Info className="h-5 w-5" /> Key Insights
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li>
                • PM2.5 levels peaked on weekends, suggesting correlation with
                local traffic patterns or events.
              </li>
              <li>
                • Air quality remained "Good" for 85% of the selected timeframe.
              </li>
              <li>
                • NO2 levels show a steady decline compared to the previous
                month.
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/50 rounded-xl bg-accent/5">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No Report Generated
          </h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Select a location, date range, and pollutants above, then click
            "Generate Report" to view the analysis.
          </p>
        </div>
      )}
    </div>
  );
};