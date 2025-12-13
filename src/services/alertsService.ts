import axios, { type AxiosError } from "axios";
import { handleError } from "../lib/errorHandler";

export interface Alert {
  id: string;
  userId: string;
  type: string;
  threshold: number;
  operator: string;
  isActive: boolean;
  monitoringStationId?: string;
  notificationMethod: "email" | "in_app";
}

const getApi = (token: string) => {
  const api = axios.create({
    baseURL: process.env.VITE_API_BASE_URL || "/api",
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(handleError(error))
  );

  return api;
};

export const alertsService = {
  getAlerts: async (token: string): Promise<Alert[]> => {
    const response = await getApi(token).get("/alerts");
    return response.data;
  },

  createAlert: async (
    token: string,
    alert: Omit<Alert, "id">
  ): Promise<Alert> => {
    const response = await getApi(token).post("/alerts", alert);
    return response.data;
  },

  deleteAlert: async (token: string, id: string): Promise<void> => {
    await getApi(token).delete(`/alerts/${id}`);
  },

  updateAlert: async (
    token: string,
    id: string,
    updates: Partial<Alert>
  ): Promise<Alert> => {
    const response = await getApi(token).put(`/alerts/${id}`, updates);
    return response.data;
  },
};
