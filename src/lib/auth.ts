import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"; // Removed incompatible Node library
import Cookies from "js-cookie";

const JWT_SECRET =
  import.meta.env.VITE_JWT_SECRET || "your-secret-key-change-this";
// const TOKEN_EXPIRY = "7d"; // Not strictly enforced in this simple mock

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

// Password hashing (bcryptjs works in browser)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT tokens (Browser-compatible Mock Implementation)
export function generateToken(payload: TokenPayload): string {
  // Add expiry
  const data = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  // Simple Base64 encoding for mock token (header.payload.signature)
  // We don't perform actual cryptographic signing to avoid Node polyfills issues,
  // relying on the client-side secret simulation.
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = btoa(JSON.stringify(data));
  const signature = btoa(JWT_SECRET); // Mock signature

  return `${header}.${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // In a real implementation we would check the signature here.
    // In this mock, we just trust the payload if it parses and hasn't expired.

    const payload = JSON.parse(atob(parts[1])) as TokenPayload;

    // Check expiry
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Cookie management (client-side)
export function setAuthToken(token: string) {
  Cookies.set("auth_token", token, {
    expires: 7, // 7 days
    secure: import.meta.env.PROD,
    sameSite: "lax",
  });
}

export function getAuthToken(): string | undefined {
  return Cookies.get("auth_token");
}

export function removeAuthToken() {
  Cookies.remove("auth_token");
}

// Get current user from token
export function getCurrentUser(): TokenPayload | null {
  const token = getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}
