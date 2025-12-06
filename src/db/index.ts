import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Use process.env for Node.js server compatibility
const databaseUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

console.log("🔍 Database URL Check:", {
  isDefined: !!databaseUrl,
  prefix: databaseUrl?.substring(0, 15) || "MISSING",
  isProduction: process.env.NODE_ENV === "production",
});

// Better error handling
if (!databaseUrl) {
  const errorMsg = `
    ❌ DATABASE_URL is missing!
    
    1. Create .env file in project root
    2. Add: VITE_DATABASE_URL=postgresql://...
    3. Get connection string from: https://console.neon.tech
    4. Restart dev server: npm run dev
  `;

  console.error(errorMsg);

  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required in production");
  }
}

// Create connection
const sql = neon(
  databaseUrl || "postgresql://fallback:fallback@localhost:5432/fallback"
);

export const db = drizzle(sql, { schema });

// Export for testing
export { databaseUrl };
