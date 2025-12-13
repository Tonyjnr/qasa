/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { useState, useMemo } from "react";
import {
  FileText,
  UploadCloud,
  Database,
  Sparkles,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import type { Dataset } from "../../services/apiService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../../components/ui/dropdown-menu";
import {
  StorageUsage,
  type StorageMetrics,
} from "../../components/professional/research/StorageUsage";
import { formatBytes } from "../../lib/utils";

const FILE_TYPE_COLORS: Record<string, string> = {
  csv: "#10b981", // emerald
  json: "#3b82f6", // blue
  pdf: "#f59e0b", // amber
  image: "#8b5cf6", // violet
  other: "#64748b", // slate
};

export const ResearchOverview = ({
  datasets,
  onNavigateToUpload,
}: {
  datasets: Dataset[];
  onNavigateToUpload: () => void;
}) => {
  // --- STATE ---
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Dataset;
    direction: "asc" | "desc";
  }>({ key: "uploadedAt", direction: "desc" });

  const [filterType, setFilterType] = useState<string>("all");
  const [filterUploader, setFilterUploader] = useState<string>("all");

  // --- DERIVED DATA ---

  // 1. Storage Metrics
  const storageMetrics: StorageMetrics = useMemo(() => {
    let totalUsed = 0;
    const typeBreakdown: Record<string, number> = {};

    datasets.forEach((d) => {
      // Default to parsed 'size' if sizeBytes is missing (fallback)
      const bytes = d.sizeBytes || 0;
      totalUsed += bytes;

      const type = d.type.toLowerCase();
      typeBreakdown[type] = (typeBreakdown[type] || 0) + bytes;
    });

    const breakdown = Object.entries(typeBreakdown).map(([name, value]) => ({
      name: name.toUpperCase(),
      value,
      color: FILE_TYPE_COLORS[name] || FILE_TYPE_COLORS.other,
    }));

    return {
      totalUsedBytes: totalUsed,
      totalLimitBytes: 5 * 1024 * 1024 * 1024, // 5GB Hardcoded Limit
      breakdown,
    };
  }, [datasets]);

  // 2. Unique Filter Options
  const uniqueTypes = useMemo(
    () => Array.from(new Set(datasets.map((d) => d.type))),
    [datasets]
  );
  const uniqueUploaders = useMemo(
    () =>
      Array.from(new Set(datasets.map((d) => d.uploader || "System"))).filter(
        Boolean
      ),
    [datasets]
  );

  // 3. Filtered & Sorted Datasets
  const processedDatasets = useMemo(() => {
    let result = [...datasets];

    // Filter
    if (filterType !== "all") {
      result = result.filter((d) => d.type === filterType);
    }
    if (filterUploader !== "all") {
      result = result.filter(
        (d) => (d.uploader || "System") === filterUploader
      );
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [datasets, filterType, filterUploader, sortConfig]);

  const handleSort = (key: keyof Dataset) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 lg:p-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Datasets
            </CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {datasets.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {uniqueTypes.length} file types
            </p>
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
            <div className="text-2xl font-bold text-foreground">
              {formatBytes(storageMetrics.totalUsedBytes)}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (storageMetrics.totalUsedBytes /
                  storageMetrics.totalLimitBytes) *
                100
              ).toFixed(1)}
              % of {formatBytes(storageMetrics.totalLimitBytes)}
            </p>
          </CardContent>
        </Card>
        {/* Placeholder for Data Points */}
        <Card className="bg-card border-border shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Processing Status
            </CardTitle>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Active</div>
            <p className="text-xs text-muted-foreground">System healthy</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Datasets */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-foreground">
              Recent Datasets
            </h2>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    All Types
                  </DropdownMenuItem>
                  {uniqueTypes.map((t) => (
                    <DropdownMenuItem
                      key={t}
                      onClick={() => setFilterType(t)}
                      className="capitalize"
                    >
                      {t}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Uploader</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterUploader("all")}>
                    All Uploaders
                  </DropdownMenuItem>
                  {uniqueUploaders.map((u) => (
                    <DropdownMenuItem
                      key={u}
                      onClick={() => setFilterUploader(u)}
                    >
                      {u}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                onClick={onNavigateToUpload}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <UploadCloud className="mr-2 h-4 w-4" /> Upload New
              </Button>
            </div>
          </div>

          <div className="bg-card dark:bg-card/50 rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th
                      className="p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        File Name <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("sizeBytes")}
                    >
                      <div className="flex items-center gap-1">
                        Size <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("uploadedAt")}
                    >
                      <div className="flex items-center gap-1">
                        Uploaded <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("uploader")}
                    >
                      <div className="flex items-center gap-1">
                        Uploader <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="p-4 font-medium text-muted-foreground text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {processedDatasets.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-medium flex items-center gap-3 text-foreground min-w-[200px]">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span>{file.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {file.type}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {file.sizeBytes ? formatBytes(file.sizeBytes) : file.size}
                      </td>
                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        {file.uploader || "System"}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary hover:text-primary hover:bg-primary/10 transition-all duration-200"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {processedDatasets.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No datasets match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Storage & Tools */}
        <div className="space-y-6">
          <StorageUsage metrics={storageMetrics} />
        </div>
      </div>
    </div>
  );
};