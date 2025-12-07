import {
  FileText,
  Calculator,
  UploadCloud,
  Database,
  Settings,
  Search,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { Sidebar } from "../../components/layout/Sidebar";
import { useAirQuality } from "../../hooks/useAirQuality";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { apiService, type Dataset } from "../../services/apiService";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { AIAssistant } from "../../components/ai/AIAssistant";

export const Dashboard = () => {
  const { data, isLoading, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const [datasets, setDatasets] = useState<Dataset[]>([]);

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

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLocation(lat, lng);
    toast.success(`Location changed to ${name}`);
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 lg:flex-row">
      {/* --- PROFESSIONAL SIDEBAR (Nav) --- */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 lg:flex shrink-0">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              Pro
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              QASA Research
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400"
          >
            <Database className="h-4 w-4" /> Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400"
          >
            <Calculator className="h-4 w-4" /> Risk Calculator
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400"
          >
            <UploadCloud className="h-4 w-4" /> Data Upload
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400"
          >
            <FileText className="h-4 w-4" /> Reports
          </Button>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" className="w-full gap-2">
            <Settings className="h-4 w-4" /> Settings
          </Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Research Overview
            </h1>
            <p className="text-sm text-slate-500">
              Welcome back, Dr. Researcher
            </p>
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
            <UserButton />
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Active Sensors
              </CardTitle>
              <Database className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-slate-500">+2 from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Data Points
              </CardTitle>
              <FileText className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2M</div>
              <p className="text-xs text-slate-500">Updated 5 mins ago</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Storage Used
              </CardTitle>
              <UploadCloud className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45%</div>
              <p className="text-xs text-slate-500">24GB / 50GB</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recent Datasets */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Datasets</h2>
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <UploadCloud className="mr-2 h-4 w-4" /> Upload New
              </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4 font-medium text-slate-500">
                      File Name
                    </th>
                    <th className="p-4 font-medium text-slate-500">Size</th>
                    <th className="p-4 font-medium text-slate-500">
                      Date Uploaded
                    </th>
                    <th className="p-4 font-medium text-slate-500 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {datasets.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-4 font-medium flex items-center gap-3">
                        <FileText className="h-4 w-4 text-slate-400" />
                        {file.name}
                      </td>
                      <td className="p-4 text-slate-500">{file.size}</td>
                      <td className="p-4 text-slate-500">{new Date(file.uploadedAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        >
                          Analyze
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {datasets.length === 0 && (
                     <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-500">No datasets found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Quick Tools */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Quick Tools</h2>

            <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="text-indigo-900 dark:text-indigo-100 text-base">
                  Risk Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
                  Calculate potential health impact based on PM2.5 exposure
                  duration and concentration.
                </p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Open Calculator
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-base">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> API
                    Status
                  </span>
                  <span className="text-emerald-600 font-medium">
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />{" "}
                    Database
                  </span>
                  <span className="text-slate-500">Syncing...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* --- RIGHT LIVE SIDEBAR --- */}
      {data && (
        <Sidebar
          data={data}
          isLoading={isLoading}
          onLocationSelect={handleLocationSelect}
        />
      )}

      <AIAssistant mode="professional" contextData={data} />
    </div>
  );
};