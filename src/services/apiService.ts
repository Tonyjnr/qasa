import axios from "axios";

// API client for our own backend (Express server)
export const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export interface Dataset {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: string;
  status: string;
}

export interface Notification {
  id: string;
  type: "alert" | "info" | "success" | "warning";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const apiService = {
  getDatasets: async (): Promise<Dataset[]> => {
    const response = await apiClient.get("/datasets");
    return response.data;
  },

  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get("/notifications");
    return response.data;
  },
};
