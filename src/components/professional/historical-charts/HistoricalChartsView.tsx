import { useState, useEffect } from "react";
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
  
  // Update station ID when global location changes
  useEffect(() => {
    if (location && stations) {
      // Find nearest station or use a temporary ID that the service can resolve to coords
      // For now, we will select the first available station to show *some* data, 
      // or in a smarter implementation, fetch history directly by lat/lng
      if (stations.length > 0) {
        // Just selecting the first one for the demo to ensure data loads
        // Ideally: setStationId(`temp-${location.lat}-${location.lng}`) and handle in service
        setStationId(stations[0].id); 
      }
    }
  }, [location, stations]);

  const { data, isLoading, error } = useHistoricalAqi(stationId, days);

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
            {location ? `Trends for ${location.name}` : "Select a station to view trends"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LocationSelector 
            selectedId={stationId} 
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