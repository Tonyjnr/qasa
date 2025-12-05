import { useState, useEffect, useCallback } from "react";
import type { AQIData } from "../types";
import { fetchAirQuality } from "../services/airQualityService";

// Default fallback (e.g., Lagos)
const DEFAULT_LAT = 6.5244;
const DEFAULT_LNG = 3.3792;
const DEFAULT_NAME = "Lagos, NG";

interface UseAirQualityProps {
  enablePolling?: boolean;
}

export function useAirQuality(
  props: UseAirQualityProps = { enablePolling: false }
) {
  const [data, setData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [location, setLocationState] = useState({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    name: DEFAULT_NAME,
  });

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAirQuality(
        location.lat,
        location.lng,
        location.name || "Unknown"
      );
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to load air quality data.");
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  const setLocation = (lat: number, lng: number, name?: string) => {
    setLocationState({ lat, lng, name: name || "Selected Location" });
  };

  // Initial load and polling
  useEffect(() => {
    refresh();

    let intervalId: NodeJS.Timeout;
    if (props.enablePolling) {
      intervalId = setInterval(refresh, 300000); // Poll every 5 minutes
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refresh, props.enablePolling]);

  return { data, isLoading, error, refresh, setLocation, lastUpdated };
}
