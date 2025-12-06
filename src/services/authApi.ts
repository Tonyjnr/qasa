import { hashPassword, verifyPassword, generateToken } from "../lib/auth";
import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

// This is a CLIENT-SIDE MOCK - In production, these should be SERVER-SIDE API routes

export const authApi = {
  // Register new user
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      // Check if user exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, data.email.toLowerCase()),
      });

      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Hash password
      const passwordHash = await hashPassword(data.password);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email: data.email.toLowerCase(),
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "resident",
        })
        .returning();

      // Generate token
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      // Create session
      await db.insert(sessions).values({
        userId: newUser.id,
        deviceName: navigator.userAgent.includes("Chrome")
          ? "Chrome"
          : "Browser",
        ipAddress: "0.0.0.0", // TODO: Get real IP from server
        userAgent: navigator.userAgent,
      });

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
        token,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Login user
  async login(data: { email: string; password: string }) {
    try {
      // Find user
      const user = await db.query.users.findFirst({
        where: eq(users.email, data.email.toLowerCase()),
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Verify password
      const isValid = await verifyPassword(data.password, user.passwordHash);

      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Create/update session
      await db.insert(sessions).values({
        userId: user.id,
        deviceName: navigator.userAgent.includes("Chrome")
          ? "Chrome"
          : "Browser",
        ipAddress: "0.0.0.0",
        userAgent: navigator.userAgent,
      });

      // Update last login
      await db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Get current user details
  async getCurrentUser() {
    try {
      // In a real app, this would be a GET /me call that reads the httpOnly cookie.
      // Here we simulate it by reading the client accessible cookie (which we shouldn't really have in prod but this is a mock).
      // Or we can just look up the user by the current token.
      // We need to import the helper safely.
      // Dynamic import to avoid circular dependency issues if any?
      // Actually imports are already top level.
      const { getCurrentUser } = await import("../lib/auth");
      const tokenUser = getCurrentUser();

      if (!tokenUser) return null;

      const user = await db.query.users.findFirst({
        where: eq(users.id, tokenUser.userId),
      });

      return user || null;
    } catch (error) {
      console.error("Get current user error", error);
      return null;
    }
  },

  // Get user sessions
  async getSessions(userId: string) {
    try {
      const userSessions = await db.query.sessions.findMany({
        where: eq(sessions.userId, userId),
        orderBy: (sessions, { desc }) => [desc(sessions.lastActive)],
      });

      return userSessions;
    } catch (error) {
      console.error("Get sessions error:", error);
      throw error;
    }
  },

  // Revoke session
  async revokeSession(sessionId: string) {
    try {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    } catch (error) {
      console.error("Revoke session error:", error);
      throw error;
    }
  },

  // Logout (revoke current session)
  async logout() {
    try {
      // In a real app with HttpOnly cookies, we'd hit the logout endpoint.
      // For this mock, we'll just return true and let the context handle cookie removal.
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  // Update password
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) throw new Error("User not found");

      const isValid = await verifyPassword(currentPassword, user.passwordHash);
      if (!isValid) throw new Error("Incorrect current password");

      const passwordHash = await hashPassword(newPassword);

      await db
        .update(users)
        .set({ passwordHash, updatedAt: new Date() })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error("Update password error:", error);
      throw error;
    }
  },

  // Delete account
  async deleteAccount(userId: string, password: string) {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) throw new Error("User not found");

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) throw new Error("Incorrect password");

      // Delete sessions first (cascade should handle it but consistent with todo.md)
      await db.delete(sessions).where(eq(sessions.userId, userId));
      await db.delete(users).where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  },
};
