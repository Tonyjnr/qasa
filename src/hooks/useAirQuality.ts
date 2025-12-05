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

  const refresh = useCallback(
    async (overrideLat?: number, overrideLng?: number) => {
      setIsLoading(true);
      setError(null);
      const targetLat = overrideLat ?? location.lat;
      const targetLng = overrideLng ?? location.lng;

      try {
        // If overriding, finding the name might be needed (reverse geo), but for now we fetch AQI
        // The fetchAirQuality service might return location name in data, which we use.
        const result = await fetchAirQuality(
          targetLat,
          targetLng,
          overrideLat ? "Unknown" : location.name
        );
        setData(result);
        // Update internal location state if we moved
        if (overrideLat && overrideLng) {
          setLocationState({
            lat: targetLat,
            lng: targetLng,
            name: result.location.name,
          });
        }
        setLastUpdated(new Date());
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load air quality data."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [location]
  );

  const setLocation = (lat: number, lng: number, name?: string) => {
    setLocationState({ lat, lng, name: name || "Selected Location" });
  };

  // Effect 1: React to Refresh/Location changes & Polling
  useEffect(() => {
    refresh();

    let intervalId: NodeJS.Timeout;
    if (props.enablePolling) {
      intervalId = setInterval(() => {
        refresh();
      }, 300000); // Poll every 5 minutes
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refresh, props.enablePolling]);

  // Effect 2: Initial Geolocation (Mount only)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This will update the location state and trigger the main effect again with the new location
          // We pass overrides to specificially target this new spot immediately
          // The refresh function handles updating the location state if overrides are present
          refresh(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation access denied or failed:", error);
          // Fallback is default location (Lagos), which main effect already handles
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only on mount

  return { data, isLoading, error, refresh, setLocation, lastUpdated };
}
