import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  real,
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

export const datasets = pgTable("datasets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  size: text("size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  type: text("type").notNull(), // csv, json, pdf
  status: text("status").default("ready"),
});

export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id"), // Can be null for system-wide notifications
  type: text("type", { enum: ["alert", "info", "success", "warning"] }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
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

// New table for Monitoring Stations metadata
export const monitoringStations = pgTable("monitoring_stations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  country: text("country"),
  city: text("city"),
  source: text("source"), // e.g., "OpenWeatherMap", "WAQI", "UserUpload"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aqiTimeSeries = pgTable("aqi_time_series", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  monitoringStationId: text("monitoring_station_id") // Renamed from location_id
    .references(() => monitoringStations.id, { onDelete: "cascade" })
    .notNull(),
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
  monitoringStationId: text("monitoring_station_id") // Renamed from location_id
    .references(() => monitoringStations.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  aqiAvg: text("aqi_avg"),
  aqiMin: text("aqi_min"),
  aqiMax: text("aqi_max"),
  createdAt: timestamp("created_at").defaultNow(),
});

// New table for User-defined Alerts
export const userAlerts = pgTable("user_alerts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  monitoringStationId: text("monitoring_station_id") // Optional, can be for a general location too
    .references(() => monitoringStations.id, { onDelete: "set null" }),
  type: text("type", { enum: ["aqi", "pm25", "pm10", "o3", "no2", "so2", "co"] }).notNull(),
  threshold: real("threshold").notNull(),
  operator: text("operator", { enum: ["gt", "lt", "eq"] }).notNull(), // greater than, less than, equals
  isActive: boolean("is_active").default(true).notNull(),
  notificationMethod: text("notification_method", { enum: ["email", "in_app"] }).default("in_app").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// New table for detailed weather historical data (similar to aqiTimeSeries)
export const weatherTimeSeries = pgTable("weather_time_series", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  monitoringStationId: text("monitoring_station_id")
    .references(() => monitoringStations.id, { onDelete: "cascade" })
    .notNull(),
  recordedAt: timestamp("recorded_at").notNull(),
  temperature: real("temperature"),
  feelsLike: real("feels_like"),
  humidity: real("humidity"),
  pressure: real("pressure"),
  windSpeed: real("wind_speed"),
  windDeg: real("wind_deg"), // Wind direction in degrees
  weatherIcon: text("weather_icon"),
  weatherDescription: text("weather_description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// New table for aggregated daily weather summary
export const weatherDailySummary = pgTable("weather_daily_summary", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  monitoringStationId: text("monitoring_station_id")
    .references(() => monitoringStations.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  tempAvg: real("temp_avg"),
  tempMin: real("temp_min"),
  tempMax: real("temp_max"),
  humidityAvg: real("humidity_avg"),
  windSpeedAvg: real("wind_speed_avg"),
  weatherDescriptionDominant: text("weather_description_dominant"),
  createdAt: timestamp("created_at").defaultNow(),
});