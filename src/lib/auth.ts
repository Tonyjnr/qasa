// src/lib/auth.ts - Client Side Utils
import Cookies from "js-cookie";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

// Cookie management
export function setAuthToken(token: string) {
  Cookies.set("auth_token", token, {
    expires: 7, // 7 days
    secure: window.location.protocol === "https:",
    sameSite: "lax",
  });
}

export function getAuthToken(): string | undefined {
  return Cookies.get("auth_token");
}

export function removeAuthToken() {
  Cookies.remove("auth_token");
}

// Get current user from token (Client-side decoding)
export function getCurrentUser(): TokenPayload | null {
  const token = getAuthToken();
  if (!token) return null;

  return decodeToken(token);
}

// Simple JWT decoder (avoids 'jsonwebtoken' dependency in client)
function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1])) as TokenPayload;

    // Check expiry
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
}
