import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: ["resident", "professional", "admin"] })
    .default("resident")
    .notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  deviceName: text("device_name"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  lastActive: timestamp("last_active").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  // Storing simple array of saved location objects
  savedLocations:
    jsonb("saved_locations").$type<
      { name: string; lat: number; lng: number }[]
    >(),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aqiTimeSeries = pgTable("aqi_time_series", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  locationId: text("location_id"), // Ideally references saved_locations if we had a dedicated table for that, or just user_id + lat/lng
  // For simplicity in this phase, we might link to user or just keep it loose
  recordedAt: timestamp("recorded_at").notNull(),
  aqi: text("aqi").notNull(), // keeping flexible or convert to integer
  pm25: text("pm25"),
  pm10: text("pm10"),
  o3: text("o3"),
  no2: text("no2"),
  so2: text("so2"),
  co: text("co"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aqiDailySummary = pgTable("aqi_daily_summary", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  locationId: text("location_id"),
  date: timestamp("date").notNull(),
  aqiAvg: text("aqi_avg"),
  aqiMin: text("aqi_min"),
  aqiMax: text("aqi_max"),
  createdAt: timestamp("created_at").defaultNow(),
});
