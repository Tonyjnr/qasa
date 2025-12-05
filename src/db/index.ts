import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Ensure usage of VITE_ prefixed env var for client-side bundle
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl && import.meta.env.PROD) {
  console.error("VITE_DATABASE_URL is missing!");
}

// Fallback for dev to avoid crash if env not set yet
const sql = neon(databaseUrl || "postgresql://mock:mock@mock/mock");

export const db = drizzle(sql, { schema });
