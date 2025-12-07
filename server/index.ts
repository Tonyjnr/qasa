import "dotenv/config"; // Load environment variables first
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import axios from "axios";
import { db } from "../src/db/index.js"; // Note the .js extension for direct execution with tsx/node
import { aqiTimeSeries, datasets, notifications } from "../src/db/schema.js";
import { desc } from "drizzle-orm";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite dev server
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- API ENDPOINTS ---

// GET /api/datasets
app.get("/api/datasets", async (req, res) => {
  try {
    let result = await db.select().from(datasets).orderBy(desc(datasets.uploadedAt));
    
    // Seed if empty (Mocking initial data for production readiness feeling)
    if (result.length === 0) {
      console.log("🌱 Seeding initial datasets...");
      await db.insert(datasets).values([
        { name: "Lagos_Mainland_Q3_2024.csv", size: "2.4 MB", type: "csv", status: "ready" },
        { name: "Industrial_Zone_PM25_Raw.json", size: "156 KB", type: "json", status: "ready" },
        { name: "Sensor_Calibration_Logs.pdf", size: "1.1 MB", type: "pdf", status: "processing" },
      ]);
      result = await db.select().from(datasets).orderBy(desc(datasets.uploadedAt));
    }
    
    res.json(result);
  } catch (error) {
    console.error("Failed to fetch datasets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/notifications
app.get("/api/notifications", async (req, res) => {
  try {
    let result = await db.select().from(notifications).orderBy(desc(notifications.createdAt));
    
    // Seed if empty
    if (result.length === 0) {
      console.log("🌱 Seeding initial notifications...");
      await db.insert(notifications).values([
        {
          type: "alert",
          title: "High Pollution Alert",
          message: "Air quality in Lagos is deteriorating. AQI exceeded 150.",
          isRead: false,
        },
        {
          type: "info",
          title: "Weekly Report Ready",
          message: "Your exposure summary for last week is available.",
          isRead: true,
        },
        {
          type: "success",
          title: "Air Quality Improved",
          message: "AQI has dropped below 50. Good time for outdoor activities.",
          isRead: true,
        },
      ]);
      result = await db.select().from(notifications).orderBy(desc(notifications.createdAt));
    }
    
    res.json(result);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// --- CRON JOB: Fetch AQI hourly ---
// Fetch for Lagos as a default location to build history
const LOCATIONS_TO_TRACK = [
  { name: "Lagos", lat: 6.5244, lon: 3.3792 },
  // Add more locations here
];

const API_KEY = process.env.VITE_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;

cron.schedule("0 * * * *", async () => {
  console.log("⏳ Running hourly AQI fetch...");
  
  if (!API_KEY) {
    console.error("❌ Missing OpenWeather API Key. Skipping fetch.");
    return;
  }

  for (const loc of LOCATIONS_TO_TRACK) {
    try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/air_pollution", {
        params: {
          lat: loc.lat,
          lon: loc.lon,
          appid: API_KEY,
        },
      });

      const data = response.data.list[0];
      const components = data.components;
      const aqi = data.main.aqi;

      // Map OWM AQI (1-5) to rough standard AQI (0-500) for storage consistency
      const standardAqi = mapOWMAqiToScale(aqi);

      await db.insert(aqiTimeSeries).values({
        locationId: loc.name, // or generate a UUID if you have a locations table
        recordedAt: new Date(),
        aqi: String(standardAqi),
        pm25: String(components.pm2_5),
        pm10: String(components.pm10),
        o3: String(components.o3),
        no2: String(components.no2),
        so2: String(components.so2),
        co: String(components.co),
      });

      console.log(`✅ Saved AQI for ${loc.name}: ${standardAqi}`);
    } catch (error) {
      console.error(`❌ Failed to fetch/save AQI for ${loc.name}:`, error);
    }
  }
});

function mapOWMAqiToScale(owmAqi: number): number {
  const mapping: Record<number, number> = {
    1: 40,
    2: 80,
    3: 120,
    4: 180,
    5: 250,
  };
  return mapping[owmAqi] || 50;
}


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("📅 Hourly AQI cron job scheduled.");
});
