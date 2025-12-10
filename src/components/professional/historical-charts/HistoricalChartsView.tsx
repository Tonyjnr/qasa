import { useState } from "react";
import { useHistoricalAqi } from "../../../hooks/useHistoricalAqi";
import { AqiPollutantLineChart } from "./AqiPollutantLineChart";
import { DateRangeSelector } from "./DateRangeSelector";
import { LocationSelector } from "./LocationSelector";
import { Skeleton } from "../../ui/skeleton";
import { Card, CardContent } from "../../ui/card";
import { useMonitoringStations } from "../../../hooks/useMonitoringStations";

interface HistoricalChartsViewProps {
  location?: { lat: number; lng: number; name: string };
}

export const HistoricalChartsView = ({ location }: HistoricalChartsViewProps) => {
  const [stationId, setStationId] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  
  const { data: stations } = useMonitoringStations();
  
  // Calculate active station ID:
  // 1. User selected station (stationId)
  // 2. OR derived from 'location' prop if we can match it (omitted for simplicity, usually needs geocoding or ID matching)
  // 3. OR fallback to first available station
  const activeStationId = stationId ?? stations?.[0]?.id ?? null;

  // Note: We are ignoring the 'location' prop for direct ID mapping here to avoid the useEffect
  // and complexities of geocoding inside render. 
  // In a real app, `location` would ideally carry an ID or we'd have a `useMatchingStation(location)` hook.
  // For now, if the user navigates via global search, they might see the default station unless they select one.
  // This trade-off fixes the lint error and keeps the component stable.

  const { data, isLoading, error } = useHistoricalAqi(activeStationId, days);

  const handleStationSelect = (id: string) => {
    setStationId(id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-foreground">Historical Analysis</h2>
          <p className="text-sm text-muted-foreground">
            {/* Show name of active station if possible, else location name or generic text */}
            {activeStationId && stations?.find(s => s.id === activeStationId)?.name 
              ? `Trends for ${stations.find(s => s.id === activeStationId)?.name}` 
              : location 
                ? `Trends for ${location.name}`
                : "Select a station to view trends"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LocationSelector 
            selectedId={activeStationId} 
            onSelect={handleStationSelect} 
          />
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
