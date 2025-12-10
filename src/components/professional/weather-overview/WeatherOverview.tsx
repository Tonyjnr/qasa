import { useWeather } from "../../../hooks/useWeather";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { DailyForecastList } from "./DailyForecastList";
import { HourlyForecastChart } from "./HourlyForecastChart";
import { Button } from "../../ui/button";
import { RefreshCw, MapPin } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";

interface WeatherOverviewProps {
  location: { lat: number; lng: number; name: string };
}

export const WeatherOverview = ({ location }: WeatherOverviewProps) => {
  // Ensure refetch is destructured
  const { data, isLoading, error, refetch } = useWeather(location);

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading && !data) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Failed to load weather data.</p>
        <Button onClick={handleRefresh} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="font-medium text-foreground">{location.name}</span>
        </div>
        <Button onClick={handleRefresh} variant="ghost" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Current Weather - List View */}
        <div className="xl:col-span-1 h-full">
          <CurrentWeatherCard data={data.current} />
        </div>

        {/* Forecast & Trends */}
        <div className="xl:col-span-3 space-y-6">
          <div className="h-[350px]"> 
            <HourlyForecastChart data={data.hourlyForecast} />
          </div>
          
          <div className="h-auto">
            <DailyForecastList data={data.dailyForecast} />
          </div>
        </div>
      </div>
    </div>
  );
};
