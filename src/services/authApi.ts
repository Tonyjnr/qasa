/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/authApi.ts - PRODUCTION-READY VERSION
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  // Register new user
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  },

  // Login user
  async login(data: { email: string; password: string }) {
    try {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  },

  // Logout
  async logout() {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Logout failed");
    }
  },

  // Get current user details
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error: any) {
      // If 401, user not authenticated - return null instead of throwing
      if (error.response?.status === 401) {
        return null;
      }
      throw new Error(error.response?.data?.error || "Failed to fetch user");
    }
  },

  // Get user sessions
  async getSessions() {
    try {
      const response = await apiClient.get("/auth/sessions");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch sessions"
      );
    }
  },

  // Revoke session
  async revokeSession(sessionId: string) {
    try {
      const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to revoke session"
      );
    }
  },

  // Update password
  async updatePassword(currentPassword: string, newPassword: string) {
    try {
      const response = await apiClient.post("/auth/update-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to update password"
      );
    }
  },

  // Delete account
  async deleteAccount(password: string) {
    try {
      const response = await apiClient.post("/auth/delete-account", {
        password,
        confirmation: "DELETE",
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to delete account"
      );
    }
  },
};

// Export for use in AccountDialog (to avoid re-importing with different userId signature)
export default authApi;
