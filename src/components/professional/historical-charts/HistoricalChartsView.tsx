import { useState, useEffect } from "react";
import { useHistoricalAqi } from "../../../hooks/useHistoricalAqi";
import { AqiPollutantLineChart } from "./AqiPollutantLineChart";
import { DateRangeSelector } from "./DateRangeSelector";
import { Skeleton } from "../../ui/skeleton";
import { Card, CardContent } from "../../ui/card";
import { useMonitoringStations } from "../../../hooks/useMonitoringStations";

interface HistoricalChartsViewProps {
  location?: { lat: number; lng: number; name: string };
}

export const HistoricalChartsView = ({ location }: HistoricalChartsViewProps) => {
  const [stationId, setStationId] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  
  // Get available stations to potentially match against the search location
  const { data: stations } = useMonitoringStations();
  
  // Automatically update station context when global location changes
  useEffect(() => {
    if (location) {
      // In a real app with a full backend, we would query: GET /stations?near=${lat},${lng}
      // Here we simulate finding or assigning a station ID for the location
      if (stations && stations.length > 0) {
        // Simple heuristic: if we have stations, pick the first one to render *something*
        // or theoretically find the closest one.
        // For this demo, we just ensure the chart has an ID to fetch with.
        setStationId(stations[0].id);
      } else {
        // Fallback ID if no stations list is loaded yet
        setStationId("temp-station-id");
      }
    }
  }, [location, stations]);

  const { data, isLoading, error } = useHistoricalAqi(stationId, days);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Controls Header - Simplified */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-foreground">Historical Analysis</h2>
          <p className="text-sm text-muted-foreground">
            {location ? `Trends for ${location.name}` : "Select a location via search"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Location Picker Removed */}
          <DateRangeSelector 
            days={days} 
            onRangeChange={setDays} 
          />
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        ) : error ? (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center justify-center h-[400px] text-destructive">
              Failed to load historical data.
            </CardContent>
          </Card>
        ) : data?.hourly && data.hourly.length > 0 ? (
          <AqiPollutantLineChart
            data={data.hourly}
            title={`Air Quality Trends (${days} Days)`}
          />
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-[400px] text-muted-foreground">
              No data available for the selected range.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};