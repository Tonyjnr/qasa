/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { FileText, Database, UploadCloud } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import type { Dataset } from "../../services/apiService";

interface OverviewProps {
  datasets: Dataset[];
}

export const Overview = ({ datasets }: OverviewProps) => {
  return (
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
            <h2 className="text-lg font-bold text-foreground">
              Recent Datasets
            </h2>
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
                  <th className="p-4 font-medium text-muted-foreground">
                    Size
                  </th>
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
                <span className="text-emerald-600 font-medium">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />{" "}
                  Database
                </span>
                <span className="text-muted-foreground">Syncing...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
