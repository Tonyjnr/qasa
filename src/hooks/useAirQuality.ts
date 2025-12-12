import { useState, useEffect, useCallback, useRef } from "react";
import type { AQIData, Location } from "../types";
import { fetchAirQuality } from "../services/airQualityService";

// Default fallback (Lagos)
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

  const locationRef = useRef(location);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const refresh = useCallback(
    async (
      overrideLat?: number,
      overrideLng?: number,
      overrideName?: string
    ) => {
      // Prevent multiple simultaneous fetches
      if (isFetchingRef.current) {
        console.log("[useAirQuality] Fetch already in progress, skipping...");
        return;
      }

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const targetLat = overrideLat ?? locationRef.current.lat;
      const targetLng = overrideLng ?? locationRef.current.lng;
      const targetName = overrideName ?? locationRef.current.name;

      console.log(
        `[useAirQuality] Fetching for: ${targetLat}, ${targetLng}, ${targetName}`
      );

      try {
        const result = await fetchAirQuality(targetLat, targetLng, targetName);

        console.log("[useAirQuality] Fetch successful:", result);
        setData(result);
        setLastUpdated(new Date());

        // Update location state if overriding
        if (overrideLat && overrideLng) {
          setLocationState({
            lat: targetLat,
            lng: targetLng,
            name: result.location.name,
          });
        }
      } catch (err) {
        console.error("[useAirQuality] Fetch failed:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load air quality data. Please check your internet connection.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    []
  );

  const setLocation = useCallback(
    (lat: number, lng: number, name?: string) => {
      console.log(`[useAirQuality] Setting location: ${lat}, ${lng}, ${name}`);
      setLocationState({ lat, lng, name: name || "Selected Location" });
      // Trigger immediate refresh with new location
      refresh(lat, lng, name);
    },
    [refresh]
  );

  // Initial Fetch & Geolocation
  useEffect(() => {
    let mounted = true;

    const initializeFetch = async () => {
      // First, try to get user's geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (mounted) {
              console.log(
                "[useAirQuality] Geolocation success:",
                position.coords
              );
              refresh(position.coords.latitude, position.coords.longitude);
            }
          },
          (geoError) => {
            console.warn(
              "[useAirQuality] Geolocation denied/failed:",
              geoError.message
            );
            // Fallback to default location
            if (mounted) {
              refresh();
            }
          },
          {
            timeout: 10000,
            maximumAge: 300000, // Cache position for 5 minutes
            enableHighAccuracy: false,
          }
        );
      } else {
        // No geolocation support, use default
        console.log(
          "[useAirQuality] Geolocation not supported, using default location"
        );
        if (mounted) {
          refresh();
        }
      }
    };

    initializeFetch();

    return () => {
      mounted = false;
    };
  }, [refresh]);

  // Polling Logic
  useEffect(() => {
    if (!props.enablePolling || !data) return;

    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (!document.hidden) {
          refresh();
        }
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
  }, [props.enablePolling, refresh, lastUpdated, data]);

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