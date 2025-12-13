import { useState, useEffect, useCallback } from "react";
import { AppError, ErrorType } from "../lib/errorHandler";
import { alertsService, type Alert } from "../services/alertsService";

import { useAuth } from "@clerk/clerk-react";

export function useAlerts() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const fetchAlerts = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;

    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token");

      const data = await alertsService.getAlerts(token);
      setAlerts(data);
    } catch (err) {
      setError(
        err instanceof AppError
          ? err
          : new AppError({
              type: ErrorType.UNKNOWN,
              message: "Failed to fetch alerts",
              retryable: true,
            })
      );
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = async (alert: Omit<Alert, "id">) => {
    const token = await getToken();
    if (!token) throw new Error("No auth token");

    const newAlert = await alertsService.createAlert(token, alert);
    setAlerts((prev) => [...prev, newAlert]);
    return newAlert;
  };

  const deleteAlert = async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error("No auth token");

    await alertsService.deleteAlert(token, id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return { alerts, isLoading, error, fetchAlerts, createAlert, deleteAlert };
}
