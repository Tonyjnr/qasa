
import { db } from "../src/db";
import { monitoringStations, aqiTimeSeries } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding monitoring data...");

  // 1. Ensure Monitoring Stations exist
  const stations = [
    { name: "Lagos", lat: 6.5244, lng: 3.3792, country: "NG", city: "Lagos" },
    { name: "Abuja", lat: 9.0765, lng: 7.3986, country: "NG", city: "Abuja" },
  ];

  for (const s of stations) {
    const existing = await db
      .select()
      .from(monitoringStations)
      .where(eq(monitoringStations.name, s.name));

    let stationId;
    if (existing.length === 0) {
      console.log(`Creating station: ${s.name}`);
      const inserted = await db
        .insert(monitoringStations)
        .values({
            name: s.name,
            lat: s.lat,
            lng: s.lng,
            country: s.country,
            city: s.city,
            source: "Seed"
        })
        .returning();
      stationId = inserted[0].id;
    } else {
      console.log(`Station exists: ${s.name}`);
      stationId = existing[0].id;
    }

    // 2. Seed 7 days of AQI data
    console.log(`Seeding history for ${s.name}...`);
    const now = new Date();
    const entries = [];
    
    for (let i = 0; i < 7 * 24; i++) {
        const date = new Date(now);
        date.setHours(date.getHours() - i);
        
        // Random AQI pattern
        const baseAqi = 50 + Math.sin(i / 10) * 20;
        const noise = Math.random() * 10 - 5;
        const aqi = Math.round(Math.max(20, baseAqi + noise));

        entries.push({
            monitoringStationId: stationId,
            recordedAt: date,
            aqi: String(aqi),
            pm25: String((aqi / 2).toFixed(1)),
            pm10: String((aqi * 0.8).toFixed(1)),
            o3: String((Math.random() * 50).toFixed(1)),
            no2: String((Math.random() * 40).toFixed(1)),
            so2: String((Math.random() * 10).toFixed(1)),
            co: String((Math.random() * 5).toFixed(1)),
        });
    }

    // Bulk insert (chunks of 100 to be safe)
    for (let i = 0; i < entries.length; i += 100) {
        await db.insert(aqiTimeSeries).values(entries.slice(i, i + 100));
    }
  }

  console.log("✅ Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
