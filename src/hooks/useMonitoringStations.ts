/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { AppError } from "../lib/errorHandler";
import { monitoringStationsService } from "../services/monitoringStationsService";
import type { MonitoringStation } from "../types/maps";

interface UseMonitoringStationsOptions {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: MonitoringStation[]) => void;
  onError?: (error: AppError) => void;
}

interface UseMonitoringStationsReturn {
  data: MonitoringStation[] | null;
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useMonitoringStations(
  bounds?: { north: number; south: number; east: number; west: number },
  options: UseMonitoringStationsOptions = {}
): UseMonitoringStationsReturn {
  const { enabled = true, refetchInterval, onSuccess, onError } = options;

  const [data, setData] = useState<MonitoringStation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isMountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    console.log(
      "[useMonitoringStations] Fetching stations",
      bounds ? `with bounds` : "all"
    );
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await monitoringStationsService.getStations(bounds);

      if (!isMountedRef.current) return;

      console.log(
        "[useMonitoringStations] Fetch success, count:",
        result.length
      );
      setData(result);
      setLastUpdated(new Date());
      onSuccess?.(result);
    } catch (err) {
      if (!isMountedRef.current) return;

      console.error("[useMonitoringStations] Fetch error", err);
      const appError =
        err instanceof AppError
          ? err
          : new AppError({
              type: "UNKNOWN" as any,
              message: "An unknown error occurred during stations fetch.",
              retryable: false,
            });
      setIsError(true);
      setError(appError);
      onError?.(appError);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [bounds, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    intervalRef.current = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, refetchInterval, enabled]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated,
  };
}
