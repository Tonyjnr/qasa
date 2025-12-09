import { useHistoricalAqi } from "../../../hooks/useHistoricalAqi";
import { AqiPollutantLineChart } from "./AqiPollutantLineChart";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import { useState } from "react";

interface HistoricalChartsViewProps {
  location: { lat: number; lng: number; name: string };
}

export const HistoricalChartsView = ({
  location,
}: HistoricalChartsViewProps) => {
  // Mock station ID for now, in real app we'd find station by lat/lng
  const [stationId] = useState("station-lagos-1");
  const [days, setDays] = useState(7);

  const { data, isLoading, error } = useHistoricalAqi(stationId, days);

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Failed to load historical data.
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Historical Trends</h2>
        <div className="flex gap-2">
          <Button
            variant={days === 7 ? "default" : "outline"}
            size="sm"
            onClick={() => setDays(7)}
          >
            7 Days
          </Button>
          <Button
            variant={days === 30 ? "default" : "outline"}
            size="sm"
            onClick={() => setDays(30)}
          >
            30 Days
          </Button>
        </div>
      </div>

      <AqiPollutantLineChart
        data={data.hourly}
        title={`Hourly Trends for ${location.name} (${days} Days)`}
      />

      {/* We could add a separate chart for Daily aggregates if needed */}
    </div>
  );
};
