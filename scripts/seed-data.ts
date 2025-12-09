import "dotenv/config";
import { db } from "../src/db";
import { monitoringStations, users, userAlerts, datasets, notifications } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding data...");

  // 1. Monitoring Stations
  console.log("... Seeding Stations");
  const stations = [
    { id: "station-lagos-1", name: "Lagos Island", lat: 6.45, lng: 3.4, country: "NG", city: "Lagos", source: "OpenWeatherMap" },
    { id: "station-lagos-2", name: "Lagos Mainland", lat: 6.6, lng: 3.35, country: "NG", city: "Lagos", source: "OpenWeatherMap" },
    { id: "station-abuja-1", name: "Abuja Central", lat: 9.0765, lng: 7.3986, country: "NG", city: "Abuja", source: "OpenWeatherMap" },
    { id: "station-ph-1", name: "Port Harcourt", lat: 4.8156, lng: 7.0498, country: "NG", city: "Port Harcourt", source: "OpenWeatherMap" },
  ];

  for (const station of stations) {
    await db.insert(monitoringStations).values(station).onConflictDoNothing();
  }

  // 2. Datasets (if not exists)
  console.log("... Seeding Datasets");
  const existingDatasets = await db.select().from(datasets);
  if (existingDatasets.length === 0) {
    await db.insert(datasets).values([
      { name: "Lagos_Mainland_Q3_2024.csv", size: "2.4 MB", type: "csv", status: "ready" },
      { name: "Industrial_Zone_PM25_Raw.json", size: "156 KB", type: "json", status: "ready" },
      { name: "Sensor_Calibration_Logs.pdf", size: "1.1 MB", type: "pdf", status: "processing" },
    ]);
  }

  // 3. Notifications
  console.log("... Seeding Notifications");
  const existingNotifs = await db.select().from(notifications);
  if (existingNotifs.length === 0) {
    await db.insert(notifications).values([
      { type: "alert", title: "High Pollution Alert", message: "Air quality in Lagos is deteriorating. AQI exceeded 150." },
      { type: "info", title: "Weekly Report Ready", message: "Your exposure summary for last week is available." },
      { type: "success", title: "Air Quality Improved", message: "AQI has dropped below 50. Good time for outdoor activities." },
    ]);
  }

  console.log("✅ Seeding complete.");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
