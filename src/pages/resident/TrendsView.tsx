/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAirQuality } from "../../hooks/useAirQuality";
import { Sidebar } from "../../components/layout/Sidebar";
import { HistoricalChart } from "../../components/dashboard/HistoricalChart";
import { fetchHistoricalAQI } from "../../services/realDataService";
import { toast } from "sonner";
import type { TrendAnalysis } from "../../services/historicalData";

export const TrendsView = () => {
  const { data, isLoading, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const [historicalData, setHistoricalData] = useState<any[] | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<
    TrendAnalysis["trend"] | undefined
  >(undefined);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      const location = data?.location;
      if (!location) return;

      setIsLoadingHistory(true);
      try {
        const history = await fetchHistoricalAQI(location.lat, location.lng);
        setHistoricalData(history);

        // Simple trend analysis based on the mock history
        const avg =
          history.reduce((acc: number, curr: any) => acc + curr.aqiAvg, 0) /
          history.length;
        const trend = avg > 100 ? "worsening" : "improving";
        setTrendAnalysis({
          slope: 0,
          direction: trend,
          confidence: 0.8,
        });
      } catch (error) {
        console.error("Failed to fetch history:", error);
        toast.error("Failed to load historical data");
      } finally {
        setIsLoadingHistory(false);
      }
    }
    fetchHistory();
  }, [data?.location?.lat, data?.location?.lng]);

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLocation(lat, lng);
    toast.success(`Location changed to ${name}`);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F8FAFC] lg:flex-row">
      <main className="flex-1 overflow-y-auto p-4 lg:p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Historical Trends
        </h1>

        {isLoadingHistory ? (
          <div className="h-80 w-full rounded-2xl bg-slate-200 animate-pulse" />
        ) : historicalData ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <HistoricalChart data={historicalData} trend={trendAnalysis} />
          </div>
        ) : (
          <div className="text-slate-500">No historical data available.</div>
        )}
      </main>

      <Sidebar
        data={data}
        isLoading={isLoading}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};
