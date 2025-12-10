import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import axios from "axios";
import { db } from "../src/db";
import {
  aqiTimeSeries,
  datasets,
  notifications,
  monitoringStations,
  userAlerts,
} from "../src/db/schema";
import { desc, eq, and } from "drizzle-orm";

import path from "path";
import { fileURLToPath } from "url";

// Determine __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://qasa-aqi.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
}

// --- API ENDPOINTS ---

// GET /api/datasets
app.get("/api/datasets", async (req, res) => {
  try {
    const result = await db
      .select()
      .from(datasets)
      .orderBy(desc(datasets.uploadedAt));
    res.json(result);
  } catch (error) {
    console.error("Failed to fetch datasets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const result = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt));
    res.json(result);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/monitoring-stations
app.get("/api/monitoring-stations", async (req, res) => {
  try {
    const stations = await db.select().from(monitoringStations);

    // Enrich with latest AQI (simplified: just fetching latest time series entry for each)
    // For production, use a JOIN or a dedicated 'current_conditions' table/cache
    const enrichedStations = await Promise.all(
      stations.map(async (station) => {
        const latest = await db
          .select()
          .from(aqiTimeSeries)
          .where(eq(aqiTimeSeries.monitoringStationId, station.id))
          .orderBy(desc(aqiTimeSeries.recordedAt))
          .limit(1);

        return {
          ...station,
          currentAqi: latest.length > 0 ? parseInt(latest[0].aqi) : null,
          lastUpdated: latest.length > 0 ? latest[0].recordedAt : null,
        };
      })
    );

    res.json({ stations: enrichedStations });
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/alerts
app.get("/api/alerts", async (req, res) => {
  try {
    // In a real app, filter by req.user.id
    const alerts = await db.select().from(userAlerts);
    res.json(alerts);
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/alerts
app.post("/api/alerts", async (req, res) => {
  try {
    const newAlert = req.body;
    // Basic validation
    if (!newAlert.type || !newAlert.threshold) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const inserted = await db
      .insert(userAlerts)
      .values({
        ...newAlert,
        userId: newAlert.userId || "demo-user-id", // Fallback for demo
      })
      .returning();

    res.json(inserted[0]);
  } catch (error) {
    console.error("Failed to create alert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/alerts/:id
app.delete("/api/alerts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(userAlerts).where(eq(userAlerts.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete alert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/historical-aqi
app.get("/api/historical-aqi", async (req, res) => {
  try {
    // Cast query params to string explicitly to avoid type issues
    const { monitoringStationId, days } = req.query as {
      monitoringStationId?: string;
      days?: string;
    };

    if (!monitoringStationId) {
      return res.status(400).json({ error: "Missing monitoringStationId" });
    }

    const numDays = parseInt(days || "7", 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

    // Dynamic import for operators if not available in closure
    const { gte, asc } = await import("drizzle-orm");

    const data = await db
      .select()
      .from(aqiTimeSeries)
      .where(
        and(
          eq(aqiTimeSeries.monitoringStationId, monitoringStationId),
          gte(aqiTimeSeries.recordedAt, startDate)
        )
      )
      .orderBy(asc(aqiTimeSeries.recordedAt));

    res.json({ data });
  } catch (error) {
    console.error("Failed to fetch historical AQI:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ... (existing imports and setup)

// --- HELPER FUNCTION: Fetch & Store AQI ---
async function fetchAndStoreAqi() {
  console.log("⏳ Running AQI fetch...");

  if (!API_KEY) {
    console.error("❌ Missing OpenWeather API Key. Skipping fetch.");
    return;
  }

  for (const loc of LOCATIONS_TO_TRACK) {
    try {
      // 1. Get or Create Station
      let stationId: string;
      const existing = await db
        .select()
        .from(monitoringStations)
        .where(eq(monitoringStations.name, loc.name))
        .limit(1);

      if (existing.length > 0) {
        stationId = existing[0].id;
      } else {
        const inserted = await db
          .insert(monitoringStations)
          .values({
            name: loc.name,
            lat: loc.lat,
            lng: loc.lon,
            country: "NG", // Defaulting for cron
            source: "OpenWeatherMap",
          })
          .returning();
        stationId = inserted[0].id;
      }

      // 2. Fetch Data
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/air_pollution",
        {
          params: {
            lat: loc.lat,
            lon: loc.lon,
            appid: API_KEY,
          },
        }
      );

      const data = response.data.list[0];
      const components = data.components;
      const aqi = data.main.aqi;
      const standardAqi = mapOWMAqiToScale(aqi);

      // 3. Insert Time Series
      await db.insert(aqiTimeSeries).values({
        monitoringStationId: stationId,
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
}

// POST /api/cron/trigger-aqi-fetch
app.post("/api/cron/trigger-aqi-fetch", async (req, res) => {
  try {
    console.log("👆 Manual trigger received for AQI fetch");
    await fetchAndStoreAqi();
    res.json({ success: true, message: "AQI fetch triggered" });
  } catch (error) {
    console.error("Manual trigger failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SPA fallback for production
if (process.env.NODE_ENV === "production") {
  app.get(/.*/, (req, res) => {
    if (!req.path.startsWith("/api")) {
      const distPath = path.join(__dirname, "../dist");
      res.sendFile(path.join(distPath, "index.html"));
    }
  });
}

// --- CRON JOB: Fetch AQI hourly ---
const LOCATIONS_TO_TRACK = [
  { name: "Lagos", lat: 6.5244, lon: 3.3792 },
  { name: "Abuja", lat: 9.0765, lon: 7.3986 },
];

const API_KEY =
  process.env.VITE_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;

cron.schedule("0 * * * *", async () => {
  await fetchAndStoreAqi();
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
