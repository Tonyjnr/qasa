/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { useState } from "react";
import { useHistoricalAqi } from "../../../hooks/useHistoricalAqi";
import { AqiPollutantLineChart } from "./AqiPollutantLineChart";
import { DateRangeSelector } from "./DateRangeSelector";
import { LocationSelector } from "./LocationSelector";
import { Skeleton } from "../../ui/skeleton";
import { Card, CardContent } from "../../ui/card";
import { useMonitoringStations } from "../../../hooks/useMonitoringStations";

export const HistoricalChartsView = () => {
  const [stationId, setStationId] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  // Try to find a matching station ID if location is passed
  const { data: stations } = useMonitoringStations();

  // Compute active station ID (Derived State)
  const activeStationId = stationId ?? stations?.[0]?.id ?? null;

  // If location is provided, we might want to sync it, but doing it in render is tricky
  // if we want to allow user override.
  // However, the previous logic was just defaulting to first station.
  // We can treat `location` prop as an initial value or an override.
  // For now, adhering to the "no useEffect for state" rule, we rely on the derived fallback.
  // Note: If exact location matching is needed, it should be done in the parent or via a memoized lookup
  // passed to `activeStationId` logic.

  const { data, isLoading, error } = useHistoricalAqi(activeStationId, days);

  const handleStationSelect = (id: string) => {
    setStationId(id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Historical Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Compare pollutant trends over time
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LocationSelector
            selectedId={activeStationId}
            onSelect={handleStationSelect}
          />
          <DateRangeSelector days={days} onRangeChange={setDays} />
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        ) : error ? (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center justify-center h-[400px] text-destructive">
              Failed to load historical data for this station.
            </CardContent>
          </Card>
        ) : data?.hourly.length ? (
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
