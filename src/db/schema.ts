import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // clerk_user_id
  email: text("email").notNull(),
  role: text("role").default("resident"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  // Storing simple array of saved location objects
  savedLocations:
    jsonb("saved_locations").$type<
      { name: string; lat: number; lng: number }[]
    >(),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
