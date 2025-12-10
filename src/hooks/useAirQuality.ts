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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date(0));

  const [location, setLocationState] = useState<Location>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    name: DEFAULT_NAME,
  });

  // 1. Ref to track location without triggering loops, but we also need a reactive effect
  const locationRef = useRef(location);
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  // 2. The core fetch function
  const refresh = useCallback(
    async (overrideLat?: number, overrideLng?: number, overrideName?: string) => {
      setIsLoading(true);
      setError(null);

      // Use overrides if provided (e.g. from Geolocation), otherwise use current state
      const targetLat = overrideLat ?? locationRef.current.lat;
      const targetLng = overrideLng ?? locationRef.current.lng;
      const targetName = overrideName ?? locationRef.current.name;

      try {
        const result = await fetchAirQuality(
          targetLat,
          targetLng,
          targetName
        );
        setData(result);
        
        // If we used overrides (like from Geolocation), update the state to match
        if (overrideLat !== undefined && overrideLng !== undefined) {
           setLocationState({
             lat: targetLat,
             lng: targetLng,
             name: result.location.name // Use the name returned from API if available
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
    [] 
  );

  // 3. Exposed setter that updates state -> triggers effect
  const setLocation = useCallback((lat: number, lng: number, name?: string) => {
    setLocationState({ lat, lng, name: name || "Selected Location" });
  }, []);

  // 4. MAIN TRIGGER: When `location` state changes, fetch new data automatically.
  // This connects the Search Bar/Map click (which call setLocation) to the Data Fetch.
  useEffect(() => {
    refresh(location.lat, location.lng, location.name);
  }, [location, refresh]);

  // 5. Initial Geolocation (Mount only)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This will trigger setLocation -> which triggers the effect above
          setLocation(position.coords.latitude, position.coords.longitude, "My Location");
        },
        (error) => {
          console.warn("Geolocation access denied or failed:", error);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 6. Polling Logic
  useEffect(() => {
    if (!props.enablePolling) return;

    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        refresh(); // refetch current location
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
        const now = new Date();
        const timeSinceLastUpdate = now.getTime() - lastUpdated.getTime();
        if (timeSinceLastUpdate > POLL_INTERVAL) {
          refresh();
        }
        startPolling();
      }
    };

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
    refresh, // Manually trigger refresh if needed
    setLocation,
    location,
    lastUpdated,
  };
}