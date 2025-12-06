import { createContext, useContext, useState, type ReactNode } from "react";
import { getCurrentUser, setAuthToken, removeAuthToken } from "../lib/auth";
import type { TokenPayload } from "../lib/auth";
import { authApi } from "../services/authApi";

interface AuthContextType {
  user: TokenPayload | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state synchronously from cookies
  const [user, setUser] = useState<TokenPayload | null>(() => getCurrentUser());
  const isLoading = false;

  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    setAuthToken(result.token);
    setUser(getCurrentUser());
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const result = await authApi.register(data);
    setAuthToken(result.token);
    setUser(getCurrentUser());
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      removeAuthToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
