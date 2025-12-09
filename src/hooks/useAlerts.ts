import { useState, useEffect, useCallback } from 'react';
import { AppError } from '../lib/errorHandler';
import { alertsService, type Alert } from '../services/alertsService';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await alertsService.getAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err instanceof AppError ? err : new AppError({
        type: 'UNKNOWN' as any,
        message: 'Failed to fetch alerts',
        retryable: true
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = async (alert: Omit<Alert, 'id'>) => {
    try {
      const newAlert = await alertsService.createAlert(alert);
      setAlerts(prev => [...prev, newAlert]);
      return newAlert;
    } catch (err) {
      throw err;
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      await alertsService.deleteAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return { alerts, isLoading, error, fetchAlerts, createAlert, deleteAlert };
}
