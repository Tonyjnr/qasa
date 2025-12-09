/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { AppError } from "../lib/errorHandler";
import { weatherService } from "../services/weatherService";
import type { WeatherData } from "../types/weather";

interface UseWeatherOptions {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: WeatherData) => void;
  onError?: (error: AppError) => void;
}

interface UseWeatherReturn {
  data: WeatherData | null;
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useWeather(
  param: { lat: number; lng: number } | null,
  options: UseWeatherOptions = {}
): UseWeatherReturn {
  const { enabled = true, refetchInterval, onSuccess, onError } = options;

  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isMountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      console.log("[useWeather] Hook disabled");
      return;
    }
    if (!param) {
      console.log("[useWeather] No param provided");
      return;
    }

    console.log("[useWeather] Starting fetch", param);
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await weatherService.getWeatherData(param.lat, param.lng);

      if (!isMountedRef.current) return;

      console.log("[useWeather] Fetch success", result);
      setData(result);
      setLastUpdated(new Date());
      onSuccess?.(result);
    } catch (err) {
      if (!isMountedRef.current) return;

      console.error("[useWeather] Fetch error", err);
      const appError =
        err instanceof AppError
          ? err
          : new AppError({
              type: "UNKNOWN" as any,
              message: "An unknown error occurred during weather fetch.",
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
  }, [param, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!refetchInterval || !enabled || !param) return;

    intervalRef.current = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, refetchInterval, enabled, param]);

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
