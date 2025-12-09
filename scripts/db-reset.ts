import "dotenv/config";
import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function resetDb() {
  console.log("🗑️ Emptying database tables...");
  try {
    // Drop all known tables in correct dependency order (reverse of creation)
    await db.execute(sql`DROP TABLE IF EXISTS weather_daily_summary;`);
    await db.execute(sql`DROP TABLE IF EXISTS weather_time_series;`);
    await db.execute(sql`DROP TABLE IF EXISTS user_alerts;`);
    await db.execute(sql`DROP TABLE IF EXISTS aqi_daily_summary;`);
    await db.execute(sql`DROP TABLE IF EXISTS aqi_time_series;`);
    await db.execute(sql`DROP TABLE IF EXISTS user_preferences;`);
    await db.execute(sql`DROP TABLE IF EXISTS notifications;`);
    await db.execute(sql`DROP TABLE IF EXISTS datasets;`);
    await db.execute(sql`DROP TABLE IF EXISTS sessions;`);
    await db.execute(sql`DROP TABLE IF EXISTS monitoring_stations;`);
    await db.execute(sql`DROP TABLE IF EXISTS users;`);
    // Also drop drizzle migration table if it exists
    await db.execute(sql`DROP TABLE IF EXISTS __drizzle_migrations;`);
    
    console.log("✅ Database tables dropped.");
  } catch (error) {
    console.error("❌ Failed to reset database:", error);
    process.exit(1);
  }
}

resetDb();