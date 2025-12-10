/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { useState, useEffect, useCallback, useRef } from "react";
import type { AQIData, Location } from "../types";
import { fetchAirQuality } from "../services/airQualityService";

// Default fallback (e.g., Lagos)
const DEFAULT_LAT = 6.5244;
const DEFAULT_LNG = 3.3792;
const DEFAULT_NAME = "Lagos, NG";
const POLL_INTERVAL = 900000; // 15 minutes

interface UseAirQualityProps {
  enablePolling?: boolean;
}

export function useAirQuality(
  props: UseAirQualityProps = { enablePolling: false }
) {
  const [data, setData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date(0)); // Initialize with old date

  const [location, setLocationState] = useState<Location>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    name: DEFAULT_NAME,
  });

  // Use ref to keep track of latest location without triggering re-renders in effect
  const locationRef = useRef(location);
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const refresh = useCallback(
    async (overrideLat?: number, overrideLng?: number) => {
      setIsLoading(true);
      setError(null);

      // Use the REF, not the state variable
      const targetLat = overrideLat ?? locationRef.current.lat;
      const targetLng = overrideLng ?? locationRef.current.lng;

      try {
        const result = await fetchAirQuality(
          targetLat,
          targetLng,
          overrideLat ? "Unknown" : locationRef.current.name
        );

        setData(result);
        setLastUpdated(new Date());

        // Only update location state if we are overriding (e.g. Geolocation or Search)
        if (overrideLat && overrideLng) {
          setLocationState({
            lat: targetLat,
            lng: targetLng,
            name: result.location.name,
          });
        }
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
    [] // <--- MUST BE EMPTY. Do not put [location] here!
  );

  const setLocation = (lat: number, lng: number, name?: string) => {
    setLocationState({ lat, lng, name: name || "Selected Location" });
  };

  // Initial Fetch & Geolocation
  useEffect(() => {
    // Initial fetch for default location
    refresh();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          refresh(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation access denied or failed:", error);
        }
      );
    }
  }, [refresh]);

  // Polling & Visibility Logic
  useEffect(() => {
    if (!props.enablePolling) return;

    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        refresh();
      }, POLL_INTERVAL);
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        // If visible, check if we need to refresh immediately
        const now = new Date();
        const timeSinceLastUpdate = now.getTime() - lastUpdated.getTime();

        if (timeSinceLastUpdate > POLL_INTERVAL) {
          refresh();
        }
        startPolling();
      }
    };

    // Initial check
    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [props.enablePolling, refresh, lastUpdated]);

  return {
    data,
    isLoading,
    error,
    refresh,
    setLocation,
    location,
    lastUpdated,
  };
}
