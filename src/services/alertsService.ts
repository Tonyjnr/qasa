import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { handleError } from '../lib/errorHandler';

export interface Alert {
  id: string;
  userId: string;
  type: string;
  threshold: number;
  operator: string;
  isActive: boolean;
  monitoringStationId?: string;
  notificationMethod: 'email' | 'in_app';
}

class AlertsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.VITE_API_BASE_URL || '/api',
      timeout: 10000,
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => Promise.reject(handleError(error))
    );
  }

  async getAlerts(): Promise<Alert[]> {
    const response = await this.api.get('/alerts');
    return response.data;
  }

  async createAlert(alert: Omit<Alert, 'id'>): Promise<Alert> {
    const response = await this.api.post('/alerts', alert);
    return response.data;
  }

  async deleteAlert(id: string): Promise<void> {
    await this.api.delete(`/alerts/${id}`);
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
    const response = await this.api.put(`/alerts/${id}`, updates);
    return response.data;
  }
}

export const alertsService = new AlertsService();
