/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { AppError } from "../lib/errorHandler";
import { historicalDataService } from "../services/historicalDataService";
import type { HistoricalTrendsData } from "../types/historicalData";

interface UseHistoricalAqiOptions {
  enabled?: boolean;
  onSuccess?: (data: HistoricalTrendsData) => void;
  onError?: (error: AppError) => void;
}

interface UseHistoricalAqiReturn {
  data: HistoricalTrendsData | null;
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useHistoricalAqi(
  monitoringStationId: string | null,
  days: number = 30,
  options: UseHistoricalAqiOptions = {}
): UseHistoricalAqiReturn {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<HistoricalTrendsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    if (!monitoringStationId) {
      console.warn("[useHistoricalAqi] No monitoringStationId provided");
      return;
    }

    console.log("[useHistoricalAqi] Fetching for", monitoringStationId, days);
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await historicalDataService.getHistoricalAqi(
        monitoringStationId,
        days
      );

      if (!isMountedRef.current) return;

      console.log("[useHistoricalAqi] Fetch success", result);
      setData(result);
      setLastUpdated(new Date());
      onSuccess?.(result);
    } catch (err) {
      if (!isMountedRef.current) return;

      console.error("[useHistoricalAqi] Fetch error", err);
      const appError =
        err instanceof AppError
          ? err
          : new AppError({
              type: "UNKNOWN" as any,
              message:
                "An unknown error occurred during historical data fetch.",
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
  }, [monitoringStationId, days, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
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
