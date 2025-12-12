/* eslint-disable react-hooks/set-state-in-effect */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
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

export const HistoricalChartsView = ({
  location,
}: HistoricalChartsViewProps) => {
  const [stationId, setStationId] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  const { data: stations } = useMonitoringStations();

  useEffect(() => {
    if (location) {
      if (stations && stations.length > 0) {
        setStationId(stations[0].id);
      } else {
        setStationId("temp-station-id");
      }
    }
  }, [location, stations]);

  const { data, isLoading, error } = useHistoricalAqi(stationId, days);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      {/* Controls Header - More compact padding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-3 sm:p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Historical Analysis
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {location ? `Trends for ${location.name}` : "Select a location"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <DateRangeSelector days={days} onRangeChange={setDays} />
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {isLoading ? (
          <Skeleton className="h-[250px] sm:h-[400px] w-full rounded-2xl" />
        ) : error ? (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center justify-center h-[250px] sm:h-[400px] text-destructive">
              Failed to load historical data.
            </CardContent>
          </Card>
        ) : data?.hourly && data.hourly.length > 0 ? (
          // Adjust chart container height for mobile
          <div className="h-[250px] sm:h-[450px]">
            <AqiPollutantLineChart
              data={data.hourly}
              title={`Trends (${days} Days)`}
            />
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-[250px] sm:h-[400px] text-muted-foreground">
              No data available for the selected range.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
