# QASA Professional Dashboard Enhancement - Implementation Guide

## CONTEXT
Following the comprehensive specification document that analyzed https://www.aqi.in/ and mapped all features to QASA's Professional Dashboard, this document provides the complete implementation roadmap. The previous specification identified all required features, data sources, and component structures. This guide details the exact steps, code patterns, file modifications, and implementation sequence needed to bring those specifications to life.

QASA's current architecture uses:
- **Frontend**: React 19 + TypeScript + Vite with Tailwind CSS v4
- **State Management**: React hooks (useState, useEffect) with custom hooks pattern
- **Data Fetching**: Axios-based services with real-time polling
- **Styling**: Tailwind utility classes + CSS variables for theming
- **Components**: Radix UI primitives + custom shadcn/ui components
- **Backend**: Express.js + Drizzle ORM + PostgreSQL (Neon)
- **APIs**: OpenWeather API (primary), WAQI API (supplementary)

The implementation must maintain backward compatibility with existing Resident Dashboard while significantly expanding Professional Dashboard capabilities.

## PERSONA
You are a technical architect and implementation lead responsible for translating the feature specification into executable work packages. You understand both the big picture (system architecture, data flow, scalability) and the granular details (file structures, function signatures, error handling patterns). You provide step-by-step guidance that accounts for dependencies, testing requirements, and incremental deployment strategies.

## TASK
Create a complete, actionable implementation guide that transforms the feature specification into reality. This guide must:

### Core Objectives:

1. **Dependency Resolution**
   - Identify all new npm packages required
   - Specify exact version numbers and compatibility
   - Document installation commands and configuration
   - Address potential peer dependency conflicts

2. **File Structure Blueprint**
   - Complete directory tree for all new files
   - Modifications needed for existing files (line-by-line where critical)
   - Import/export patterns across the codebase
   - Asset organization (icons, images, constants)

3. **API Integration Playbook**
   - Detailed OpenWeather API endpoint configurations
   - Request/response transformation patterns
   - Caching strategy implementation
   - Rate limiting and quota management
   - Error handling and retry logic

4. **Database Schema Evolution**
   - Drizzle ORM schema additions with exact TypeScript definitions
   - Migration scripts in correct sequence
   - Index optimization strategies
   - Data seeding approaches for development/testing

5. **Component Implementation Order**
   - Dependency graph showing build sequence
   - Foundation-first approach (services → types → UI)
   - Parallel development opportunities
   - Integration checkpoints

6. **Code Patterns & Standards**
   - Exact TypeScript patterns to follow
   - Error boundary implementations
   - Loading state management
   - Responsive design breakpoints
   - Accessibility requirements

## FORMAT

Structure your response as a multi-section implementation playbook:

### 1. PRE-IMPLEMENTATION CHECKLIST

**Environment Setup**:
```bash
# Ensure Node.js (v18+) and npm (v9+) are installed.
# Ensure PostgreSQL (local or cloud like Neon) is accessible.
# Ensure Git is configured.
```

**Required Access/Credentials**:
-   [x] OpenWeather API key with required tier (check usage limits for new features like map layers, historical weather, etc.).
-   [ ] Additional API keys (e.g., if using a different map tile provider like Mapbox).
-   [x] Database access permissions (connection string for PostgreSQL).
-   [x] Environment variable configuration (see section 2.2).

**Development Tools**:
-   [x] VS Code extensions recommended: ESLint, Prettier, TypeScript Vue Plugin (Volar) if using Vue. (Note: QASA is React, so TypeScript and ESLint are key).
-   [x] Browser dev tools setup: React Developer Tools, Redux DevTools (if Redux is introduced, though currently not), network monitor for API calls.
-   [x] Testing framework configuration: Vitest (already configured), ensure Playwright/Cypress is set up for E2E.
-   [x] Debugging tools: Browser debugger, Node.js debugger for backend.

### 2. DEPENDENCY INSTALLATION & CONFIGURATION

#### 2.1 New NPM Packages

**Package**: `react-leaflet-markercluster@^4.0.0`
**Purpose**: To enable marker clustering on the interactive map for improved performance and user experience when displaying numerous monitoring stations.
**Installation**:
```bash
npm install react-leaflet-markercluster leaflet.markercluster
```
**Configuration**:
This package requires `leaflet.markercluster` as a peer dependency. Ensure correct CSS import for styling.
```typescript
// In src/index.css or a dedicated CSS file for Leaflet
@import 'leaflet.markercluster/dist/MarkerCluster.css';
@import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
```
**Alternatives Considered**: Custom clustering logic (more complex), manually grouping markers (less efficient). This library is a well-established solution.

**Package**: `@tanstack/react-virtual@^3.0.0`
**Purpose**: For efficient rendering of large lists or tables (e.g., city rankings, detailed station lists) by only rendering visible items.
**Installation**:
```bash
npm install @tanstack/react-virtual
```
**Configuration**: No specific global configuration required; integrated directly into components.
**Alternatives Considered**: `react-window`, `react-virtualized`. `@tanstack/react-virtual` is a modern, lightweight, and framework-agnostic solution with good React integration.

**Package**: `msw@^2.0.0`
**Purpose**: To mock API requests in tests, allowing for isolated and reliable testing of components, hooks, and services without actual network calls.
**Installation**:
```bash
npm install msw --save-dev
```
**Configuration** (example setup for Vitest):
```typescript
// In src/test/setup.ts or a separate mock service worker setup file
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get('https://api.openweathermap.org/data/2.5/air_pollution', () => {
    return HttpResponse.json({
      list: [{
        main: { aqi: 2 },
        components: { pm2_5: 15, pm10: 25, o3: 30, no2: 10, so2: 5, co: 200 }
      }]
    });
  }),
  // ... more handlers for other APIs
];

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```
**Alternatives Considered**: Custom test mocks (less robust/maintainable), `jest-fetch-mock` (limited to `fetch`), `nock` (Node.js only). `msw` works across Node.js and browsers, providing a consistent mocking layer.

**Package**: `supertest@^6.0.0`
**Purpose**: For testing Express.js backend API endpoints, making HTTP assertions easier.
**Installation**:
```bash
npm install supertest --save-dev
```
**Configuration**: No specific global configuration. Used directly in backend test files.
**Alternatives Considered**: `mocha`/`chai` with `request-promise`, but `supertest` is specialized for Express.js.

**Package**: `playwright@^1.40.0` or `cypress@^13.0.0` (Choose One)
**Purpose**: For end-to-end (E2E) testing, simulating user interactions in a real browser environment. Playwright offers broader browser support and faster execution, while Cypress provides a more developer-friendly experience with time-travel debugging.
**Installation (Playwright)**:
```bash
npm install playwright --save-dev
npx playwright install # Installs browser binaries
```
**Installation (Cypress)**:
```bash
npm install cypress --save-dev
npx cypress open # Opens Cypress Test Runner
```
**Configuration**: Both require initial setup and configuration files (`playwright.config.ts` or `cypress.config.ts`).
**Alternatives Considered**: Selenium (more complex setup).

#### 2.2 Environment Variables

```bash
# .env additions (with example values - replace with actual values for development/production)

# OpenWeatherMap API Key
# For Air Pollution, Current Weather, 5-day Forecast, Geocoding
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here

# WAQI Token (Existing, if still in use)
VITE_WAQI_TOKEN=your_waqi_token_here

# Database URL (Existing)
DATABASE_URL=postgresql://user:password@host:port/database_name

# Optional: Mapbox Token if using Mapbox for enhanced map tiles or search
# VITE_MAPBOX_TOKEN=your_mapbox_token_here

# Optional: Dedicated OpenWeatherMap API Key for Map Layers (if separate from main key)
# VITE_OPENWEATHER_MAP_LAYERS_API_KEY=your_openweathermap_map_layers_api_key_here
```

**Documentation**:
-   **VITE_OPENWEATHER_API_KEY**: Obtained from OpenWeatherMap console. Critical for most data fetching.
-   **VITE_WAQI_TOKEN**: Obtained from WAQI website. Used for supplementary AQI data.
-   **DATABASE_URL**: Provided by your PostgreSQL provider (e.g., Neon).
-   **VITE_MAPBOX_TOKEN**: Obtained from Mapbox. Needed if switching to Mapbox for base maps or advanced geocoding features.
-   **VITE_OPENWEATHER_MAP_LAYERS_API_KEY**: If OpenWeatherMap offers separate API keys for map layers.
-   **Security considerations**: These keys should be kept confidential and never committed to version control. Use `.env` files for local development and secure secrets management (e.g., Vault, AWS Secrets Manager) for production environments.
-   **Fallback behavior if missing**: API calls relying on missing keys will fail, potentially leading to error messages in the UI.

### 3. FILE STRUCTURE IMPLEMENTATION

#### 3.1 Complete Directory Tree

```
src/
├── components/
│   ├── professional/
│   │   ├── interactive-map/              # Enhanced Interactive Map Components
│   │   │   ├── InteractiveMapProfessional.tsx
│   │   │   ├── AqiStationMarker.tsx
│   │   │   ├── PollutionLayer.tsx
│   │   │   ├── MapControls.tsx
│   │   │   └── types.ts
│   │   ├── weather-overview/             # Comprehensive Weather & Forecast Overview
│   │   │   ├── WeatherOverview.tsx
│   │   │   ├── CurrentWeatherCard.tsx
│   │   │   ├── DailyForecastList.tsx
│   │   │   ├── HourlyForecastChart.tsx
│   │   │   └── types.ts
│   │   ├── historical-charts/            # Location-Based Historical Charts
│   │   │   ├── HistoricalChartsView.tsx
│   │   │   ├── AqiPollutantLineChart.tsx
│   │   │   ├── DateRangeSelector.tsx
│   │   │   ├── LocationSelector.tsx
│   │   │   └── types.ts
│   │   ├── city-ranking/                 # City Rankings/Comparison
│   │   │   ├── CityRankingTable.tsx
│   │   │   └── types.ts
│   │   └── alerts/                       # User Alerts
│   │       ├── AlertSettings.tsx
│   │       └── types.ts
│   ├── dashboard/
│   │   ├── PollutantGrid.tsx             # UPDATE
│   │   ├── ForecastList.tsx              # UPDATE
│   │   ├── HistoricalChart.tsx           # UPDATE/REFACTOR
│   │   └── ExerciseAdvisor.tsx           # UPDATE
│   └── ui/
│       └── scroll-area.tsx               # (Existing, but mentioned in context)
├── services/
│   ├── weatherService.ts                 # New Weather Service
│   ├── monitoringStationsService.ts      # New Monitoring Stations Service
│   ├── pollutionOverlayService.ts        # New Pollution Overlay Service
│   ├── historicalDataService.ts          # UPDATE
│   └── alertsService.ts                  # New Alerts Service
├── hooks/
│   ├── useWeather.ts                     # New Weather Hook
│   ├── useMonitoringStations.ts          # New Monitoring Stations Hook
│   ├── usePollutionOverlay.ts            # New Pollution Overlay Hook
│   ├── useHistoricalAqi.ts               # New Historical AQI Hook
│   └── useAlerts.ts                      # New Alerts Hook
├── types/
│   ├── maps.ts                           # New Map-related Types
│   ├── weather.ts                        # New Weather-related Types
│   ├── historicalData.ts                 # UPDATE/EXPANDED
│   └── index.ts                          # UPDATE
├── lib/
│   ├── aqiUtils.ts                       # New AQI Utility Functions
│   └── chartUtils.ts                     # New Chart Utility Functions
└── pages/
    ├── professional/
    │   └── Dashboard.tsx                 # UPDATE
    └── ProfileView.tsx                   # UPDATE
```

#### 3.2 File Creation Sequence

**Order matters for dependencies**:

1.  **Phase 1: Foundation (Day 1-2)**
    *   [ ] `src/types/maps.ts` - TypeScript interfaces for map components.
    *   [ ] `src/types/weather.ts` - TypeScript interfaces for weather components.
    *   [ ] `src/types/historicalData.ts` - Update/Expand TypeScript interfaces for historical data.
    *   [ ] `src/lib/aqiUtils.ts` - New AQI Utility functions (e.g., `mapOwmAqiToStandardAqi`, AQI color mapping).
    *   [ ] `src/lib/chartUtils.ts` - New Chart Utility functions.
    *   [ ] `src/services/weatherService.ts` - Service for fetching weather data.
    *   [ ] `src/services/monitoringStationsService.ts` - Service for managing monitoring station data.
    *   [ ] `src/services/pollutionOverlayService.ts` - Service for fetching pollution overlay data.
    *   [ ] `src/services/historicalDataService.ts` - Update existing service to expand historical data fetching.
    *   [ ] `src/services/alertsService.ts` - Service for managing user-defined alerts.

2.  **Phase 2: Data Layer (Day 3-4)**
    *   [ ] Database schema updates in `src/db/schema.ts` (new tables: `monitoringStations`, `userAlerts`, `weatherTimeSeries`, `weatherDailySummary`).
    *   [ ] Create and run Drizzle migration scripts for all schema changes.
    *   [ ] `src/hooks/useWeather.ts` - Custom hook for weather data.
    *   [ ] `src/hooks/useMonitoringStations.ts` - Custom hook for monitoring station data.
    *   [ ] `src/hooks/usePollutionOverlay.ts` - Custom hook for pollution overlay data.
    *   [ ] `src/hooks/useHistoricalAqi.ts` - Custom hook for historical AQI data.
    *   [ ] `src/hooks/useAlerts.ts` - Custom hook for user alerts.

3.  **Phase 3: UI Components (Day 5-10)**
    *   [ ] `src/components/professional/interactive-map/` (all components)
    *   [ ] `src/components/professional/weather-overview/` (all components)
    *   [ ] `src/components/professional/historical-charts/` (all components)
    *   [ ] `src/components/professional/city-ranking/` (all components)
    *   [ ] `src/components/professional/alerts/AlertSettings.tsx`

4.  **Phase 4: Integration (Day 11-12)**
    *   [ ] Update `src/pages/professional/Dashboard.tsx` to integrate new feature components and hooks.
    *   [ ] Update `src/pages/ProfileView.tsx` to include `AlertSettings`.
    *   [ ] Update existing `src/components/dashboard/` components (`PollutantGrid.tsx`, `ForecastList.tsx`, `HistoricalChart.tsx`, `ExerciseAdvisor.tsx`) to consume new data structures and utilize new services/utilities.
    *   [ ] Update `src/types/index.ts` to export all new types.

### 4. DATABASE IMPLEMENTATION

#### 4.1 Schema Updates

**File**: `src/db/schema.ts`

```typescript
// Add to existing schema.ts

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
```

#### 4.2 Migration Strategy

**Create migration file**: `drizzle/00xx_add_new_features.sql` (replace `00xx` with the actual timestamp/version)

```sql
-- Up Migration
-- Create monitoring_stations table
CREATE TABLE IF NOT EXISTS "monitoring_stations" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "lat" real NOT NULL,
  "lng" real NOT NULL,
  "country" text,
  "city" text,
  "source" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Rename location_id to monitoring_station_id in aqi_time_series and aqi_daily_summary
ALTER TABLE "aqi_time_series" RENAME COLUMN "location_id" TO "monitoring_station_id";
ALTER TABLE "aqi_daily_summary" RENAME COLUMN "location_id" TO "monitoring_station_id";

-- Add temporary column for monitoring_station_id in existing tables (if needed for backfill, otherwise direct alter is fine)
-- For simplicity in this guide, we assume existing location_id values can be directly mapped or backfilled
-- Backfill of monitoring_station_id will happen via a custom script or a separate migration step after initial table creation.
-- As per the specification: "Backfill `monitoring_station_id` in existing `aqi_time_series` and `aqi_daily_summary` data"
-- This step implies a manual or script-driven population of 'monitoring_stations' and update of 'aqi_time_series' and 'aqi_daily_summary'

-- Alter columns to be NOT NULL and add foreign key constraints
ALTER TABLE "aqi_time_series" ALTER COLUMN "monitoring_station_id" SET NOT NULL;
ALTER TABLE "aqi_time_series" ADD CONSTRAINT "aqi_time_series_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "monitoring_stations"("id") ON DELETE CASCADE;

ALTER TABLE "aqi_daily_summary" ALTER COLUMN "monitoring_station_id" SET NOT NULL;
ALTER TABLE "aqi_daily_summary" ADD CONSTRAINT "aqi_daily_summary_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "monitoring_stations"("id") ON DELETE CASCADE;

-- Create user_alerts table
CREATE TABLE IF NOT EXISTS "user_alerts" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "monitoring_station_id" text,
  "type" text NOT NULL, -- e.g., 'aqi', 'pm25'
  "threshold" real NOT NULL,
  "operator" text NOT NULL, -- e.g., 'gt', 'lt', 'eq'
  "is_active" boolean DEFAULT true NOT NULL,
  "notification_method" text DEFAULT 'in_app' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "user_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "user_alerts_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "monitoring_stations"("id") ON DELETE SET NULL
);

-- Create weather_time_series table
CREATE TABLE IF NOT EXISTS "weather_time_series" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "monitoring_station_id" text NOT NULL,
  "recorded_at" timestamp NOT NULL,
  "temperature" real,
  "feels_like" real,
  "humidity" real,
  "pressure" real,
  "wind_speed" real,
  "wind_deg" real,
  "weather_icon" text,
  "weather_description" text,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "weather_time_series_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "monitoring_stations"("id") ON DELETE CASCADE
);

-- Create weather_daily_summary table
CREATE TABLE IF NOT EXISTS "weather_daily_summary" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "monitoring_station_id" text NOT NULL,
  "date" timestamp NOT NULL,
  "temp_avg" real,
  "temp_min" real,
  "temp_max" real,
  "humidity_avg" real,
  "wind_speed_avg" real,
  "weather_description_dominant" text,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "weather_daily_summary_monitoring_station_id_monitoring_stations_id_fk" FOREIGN KEY ("monitoring_station_id") REFERENCES "monitoring_stations"("id") ON DELETE CASCADE
);

-- Down Migration (for rollback)
DROP TABLE IF EXISTS "weather_daily_summary";
DROP TABLE IF EXISTS "weather_time_series";
DROP TABLE IF EXISTS "user_alerts";
ALTER TABLE "aqi_time_series" DROP CONSTRAINT "aqi_time_series_monitoring_station_id_monitoring_stations_id_fk";
ALTER TABLE "aqi_time_series" ALTER COLUMN "monitoring_station_id" DROP NOT NULL;
ALTER TABLE "aqi_time_series" RENAME COLUMN "monitoring_station_id" TO "location_id";

ALTER TABLE "aqi_daily_summary" DROP CONSTRAINT "aqi_daily_summary_monitoring_station_id_monitoring_stations_id_fk";
ALTER TABLE "aqi_daily_summary" ALTER COLUMN "monitoring_station_id" DROP NOT NULL;
ALTER TABLE "aqi_daily_summary" RENAME COLUMN "monitoring_station_id" TO "location_id";
DROP TABLE IF EXISTS "monitoring_stations";
```

**Run migration**:
```bash
npm run db:generate # Generate new migration file after schema.ts changes
npm run db:push     # Apply changes to the database (for development)
# or for production deployment:
# npm run db:migrate # Apply changes using migration files
```

#### 4.3 Seed Data Script

**File**: `drizzle/seed.ts` (or `src/db/seed/[feature]-seed.ts` if creating dedicated seeders)

```typescript
// Complete seed script with example data for new tables
import { db } from '../src/db';
import { monitoringStations, users } from '../src/db/schema';
import { eq } from 'drizzle-orm';

export async function seedNewFeatures() {
  console.log("🌱 Seeding new feature data...");

  // Example: Seed some monitoring stations
  const existingLagosStation = await db.select().from(monitoringStations).where(eq(monitoringStations.name, "Lagos Station 1"));
  if (existingLagosStation.length === 0) {
    await db.insert(monitoringStations).values([
      { id: "station-lagos-1", name: "Lagos Station 1", lat: 6.5244, lng: 3.3792, country: "NG", city: "Lagos", source: "OpenWeatherMap" },
      { id: "station-abuja-1", name: "Abuja Central", lat: 9.0765, lng: 7.3986, country: "NG", city: "Abuja", source: "OpenWeatherMap" },
      // Add more example stations
    ]);
    console.log("✅ Seeded initial monitoring stations.");
  }

  // Example: Seed user alerts (requires a user to exist)
  // const professionalUser = await db.select().from(users).where(eq(users.role, "professional")).limit(1);
  // if (professionalUser.length > 0) {
  //   const userId = professionalUser[0].id;
  //   await db.insert(userAlerts).values([
  //     { userId, type: "aqi", threshold: 150, operator: "gt", isActive: true, notificationMethod: "in_app" },
  //   ]);
  //   console.log("✅ Seeded example user alerts.");
  // }
}
```
*   **Recommendation**: Integrate `seedNewFeatures` into the main `drizzle/seed.ts` if it exists, or create separate seed files for each feature and call them from a central script. Ensure that existing seeders are not overwritten.

### 5. API SERVICE IMPLEMENTATION

#### 5.1 Service Layer Pattern

**File**: `src/services/[feature]Service.ts`

This section provides the general service layer pattern. Concrete implementations for each new service (`weatherService`, `monitoringStationsService`, `pollutionOverlayService`, `alertsService`) will follow this structure. The `historicalDataService` will be updated following this pattern as well.

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { handleError, displayError } from '@/lib/errorHandler'; // Centralized error handler
import type { RequestType, ResponseType } from '@/types/[feature]';

/**
 * [Service Purpose - e.g., Weather Data Service]
 *
 * API Documentation: [link to OpenWeatherMap or internal backend API docs]
 * Rate Limit: [details, e.g., 60 calls/minute for OpenWeatherMap Free tier]
 * Caching: [strategy, e.g., 5 minutes in-memory cache]
 */
class FeatureService {
  private api: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_TTL = 300000; // 5 minutes (300,000 ms)

  constructor(baseURL: string, apiKey?: string, headers?: Record<string, string>) {
    this.api = axios.create({
      baseURL,
      timeout: 10000, // 10 seconds
      params: apiKey ? { appid: apiKey } : {}, // Assuming 'appid' for OpenWeatherMap, adjust for others
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    this.cache = new Map();

    // Request interceptor for auth/logging
    this.api.interceptors.request.use(
      (config) => {
        // Example: Add specific headers or modify config before request
        // if (config.url?.includes('some-protected-endpoint') && this.authToken) {
        //   config.headers['Authorization'] = `Bearer ${this.authToken}`;
        // }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const appError = handleError(error);
        displayError(appError); // Show toast notification
        return Promise.reject(appError); // Re-throw as AppError for calling hook to catch
      }
    );
  }

  /**
   * [Method description - e.g., Fetches current weather data for a given location]
   * @param {RequestType} param - [description of request parameters]
   * @returns {Promise<ResponseType>} [description of returned data]
   * @throws {AppError} Classified application error
   */
  async fetchData(param: RequestType): Promise<ResponseType> {
    const cacheKey = JSON.stringify(param); // Unique key for caching based on params

    // Check cache
    const cached = this.getCached(cacheKey);
    if (cached) {
      console.log(`Cache hit for ${cacheKey}`);
      return cached;
    }

    try {
      const response = await this.api.get('[endpoint]', {
        params: {
          ...param,
          // Add any specific API params here
        },
      });

      const transformed = this.transformResponse(response.data);
      this.setCache(cacheKey, transformed);

      return transformed;
    } catch (error) {
      console.error(`FeatureService.fetchData failed for ${cacheKey}:`, error);
      // handleError and displayError are already called by the interceptor
      throw error; // Re-throw the classified AppError
    }
  }

  // --- Helper Methods ---

  private getCached(key: string): ResponseType | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache(key: string, data: ResponseType): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private transformResponse(raw: any): ResponseType {
    // Transformation logic with type safety
    // This method should be implemented by each specific service class
    throw new Error('transformResponse method not implemented.');
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }
}
```

#### 5.2 API Endpoint Mapping

**Feature**: Comprehensive Weather & Forecast Overview
**OpenWeather Endpoint**:
*   Current Weather: `GET /weather`
*   5-day / 3-hour Forecast: `GET /forecast`
**Request Parameters**:
```typescript
interface WeatherParams {
  lat: number;
  lon: number;
  units?: 'metric' | 'imperial'; // e.g., 'metric' for Celsius
}
```
**Response Structure**:
```typescript
// Raw API response (simplified example)
interface OpenWeatherCurrentRawResponse {
  coord: { lon: number; lat: number };
  weather: [{ id: number; main: string; description: string; icon: string }];
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  visibility: number;
  dt: number;
  name: string;
}

// Transformed for QASA (src/types/weather.ts)
// (Defined in Detailed Feature Specifications)
```
**Transformation Example**:
```typescript
import { CurrentWeather } from '@/types/weather';
function transformCurrentWeather(raw: OpenWeatherCurrentRawResponse): CurrentWeather {
  return {
    temperature: raw.main.temp,
    feelsLike: raw.main.feels_like,
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    windDirection: getWindDirection(raw.wind.deg), // Helper function for degrees to cardinal direction
    pressure: raw.main.pressure,
    visibility: raw.visibility,
    weatherIcon: raw.weather[0].icon,
    weatherDescription: raw.weather[0].description,
  };
}
```
**Error Scenarios**:
-   Network timeout: Handled by `axios` timeout and interceptor.
-   Invalid API key: `401` status code, handled by interceptor, toast displayed.
-   Rate limit: `429` status code, handled by interceptor, toast displayed.
-   Data unavailable: `404` status code, handled by interceptor, fallback to default UI or empty state.

---

**Feature**: Enhanced Interactive Map (Monitoring Stations)
**Backend Endpoint**: `GET /api/monitoring-stations` (new internal API)
**Request Parameters**:
```typescript
interface GetMonitoringStationsParams {
  bounds?: { lat1: number; lng1: number; lat2: number; lng2: number; }; // Optional: filter by map bounds
  aqiRange?: { min: number; max: number; }; // Optional: filter by AQI range
}
```
**Response Structure**:
```typescript
// Raw API response (from QASA backend)
interface MonitoringStationsApiResponse {
  stations: MonitoringStation[]; // MonitoringStation defined in src/types/maps.ts
}

// Transformed for QASA (src/types/maps.ts)
// (Defined in Detailed Feature Specifications)
```
**Transformation Example**: Data from backend should already be in `MonitoringStation` format.
```typescript
// No transformation needed if backend provides data in the correct format
function transformMonitoringStations(raw: MonitoringStationsApiResponse): MonitoringStation[] {
  return raw.stations;
}
```
**Error Scenarios**:
-   Backend internal error: `5xx` status codes, handled by interceptor, toast displayed.
-   No stations found: `200` with empty array, handled by UI showing "No stations in view".

---

**Feature**: Enhanced Interactive Map (Pollution Overlay)
**OpenWeather Endpoint**: Potentially "Weather maps" or "Air Pollution Maps" API (e.g., `https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={API_KEY}`)
**Request Parameters**:
```typescript
interface PollutionOverlayParams {
  layer: 'pa1' | 'pa2' | 'pm25' | 'o3'; // Specific layer from OpenWeatherMap (example)
  z: number; // Zoom level
  x: number; // Tile X coordinate
  y: number; // Tile Y coordinate
}
```
**Response Structure**: PNG image tiles.
**Transformation Example**: None, as it's directly rendered by `TileLayer` or `ImageOverlay`.
**Error Scenarios**: `401` (invalid key), `404` (tile not found), network errors.

---

**Feature**: Location-Based Historical Charts (Backend)
**Backend Endpoint**: `GET /api/historical-aqi?locationId=[id]&start=[date]&end=[date]`
**Request Parameters**:
```typescript
interface HistoricalAqiParams {
  monitoringStationId: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  interval: 'hourly' | 'daily'; // Granularity of data
}
```
**Response Structure**:
```typescript
// Raw API response (from QASA backend)
interface HistoricalAqiApiResponse {
  data: HistoricalAqiDataPoint[]; // HistoricalAqiDataPoint defined in src/types/historicalData.ts
}
```
**Transformation Example**: Data from backend should already be in `HistoricalAqiDataPoint` format.
**Error Scenarios**: `404` (no data for range), `5xx` (server error).

---

**Feature**: Customizable Alerts (Backend)
**Backend Endpoint**: `POST /api/alerts`, `GET /api/alerts`, `PUT /api/alerts/:id`, `DELETE /api/alerts/:id`
**Request Parameters**:
```typescript
// For POST
interface CreateAlertPayload {
  userId: string;
  monitoringStationId?: string;
  type: 'aqi' | 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co';
  threshold: number;
  operator: 'gt' | 'lt' | 'eq';
  notificationMethod: 'email' | 'in_app';
}
```
**Response Structure**:
```typescript
// For POST/PUT
interface UserAlertResponse {
  alert: UserAlert; // UserAlert matches the userAlerts schema definition
}
```
**Error Scenarios**: `400` (invalid payload), `401` (unauthorized), `404` (alert not found).

### 6. CUSTOM HOOKS IMPLEMENTATION

#### 6.1 Data Fetching Hook Pattern

**File**: `src/hooks/use[Feature].ts`

This section provides the general data fetching hook pattern. Concrete implementations for each new hook (`useWeather`, `useMonitoringStations`, `usePollutionOverlay`, `useHistoricalAqi`, `useAlerts`) will follow this structure.

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppError } from '@/lib/errorHandler'; // Assuming centralized AppError
import { toast } from 'sonner'; // For displaying errors

import { [feature]Service } from '@/services/[feature]Service'; // Import the corresponding service
import type { [DataType] } from '@/types/[feature]'; // Import the data type

interface Use[Feature]Options {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: [DataType]) => void;
  onError?: (error: AppError) => void; // Use AppError
  initialData?: [DataType]; // For optimistic updates or initial server data
}

interface Use[Feature]Return {
  data: [DataType] | null;
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Hook for fetching and managing [feature] data
 *
 * @param {[ParamType]} param - [description]
 * @param {Use[Feature]Options} options - Configuration options
 * @returns {Use[Feature]Return} [description]
 *
 * @example
 * const { data, isLoading, refetch } = use[Feature](location, {
 *   refetchInterval: 300000, // 5 minutes
 *   onSuccess: (data) => console.log('Data loaded', data),
 * });
 */
export function use[Feature](
  param: [ParamType], // Replace with actual parameter type (e.g., { lat: number, lng: number })
  options: Use[Feature]Options = {}
): Use[Feature]Return {
  const {
    enabled = true,
    refetchInterval,
    onSuccess,
    onError,
    initialData,
  } = options;

  const [data, setData] = useState<[DataType] | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs for cleanup
  const isMountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !param) return; // Guard against disabled state or missing params

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await [feature]Service.[method](param); // Replace with actual service method

      if (!isMountedRef.current) return;

      setData(result);
      setLastUpdated(new Date());
      onSuccess?.(result);
    } catch (err) {
      if (!isMountedRef.current) return;

      const appError = err instanceof AppError ? err : new AppError({
        type: 'UNKNOWN',
        message: 'An unknown error occurred during data fetch.',
        retryable: false,
      });
      setIsError(true);
      setError(appError);
      onError?.(appError);
      // toast.error(appError.message); // The service interceptor already handles displayError
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [param, enabled, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling setup
  useEffect(() => {
    if (!refetchInterval || !enabled || !param) return;

    intervalRef.current = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalId); // Corrected variable name
      }
    };
  }, [fetchData, refetchInterval, enabled, param]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    lastUpdated,
  };
}
```

#### 6.2 Hook Integration Pattern

**In component**:
```typescript
// src/components/professional/[Feature]/[Component].tsx

import { use[Feature] } from '@/hooks/use[Feature]';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function [Component]() {
  const { data, isLoading, error, refetch } = use[Feature](params, {
    refetchInterval: 300000, // 5 min
    // onError is handled by service interceptor, but can add component-specific logic here
    onError: (err) => {
      console.error('Component specific error handling:', err.message);
      // toast.error(err.message); // Not needed if service handles it globally
    },
  });

  if (isLoading && !data) {
    return <LoadingSkeleton />; // Replace with a more specific skeleton for the component
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Failed to load data
              </h3>
              <p className="text-sm text-muted-foreground">
                {error.message}
              </p>
            </div>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null; // Or an empty state component

  return (
    // ... component JSX using 'data'
  );
}

// Example LoadingSkeleton
const LoadingSkeleton = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-12 w-3/4" />
    <Skeleton className="h-64 w-full" />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

```

### 7. COMPONENT IMPLEMENTATION GUIDE

#### 7.1 Component Architecture Pattern

**File Structure for Complex Feature**:
```
src/components/professional/[feature]/
├── index.tsx                 # Main container component
├── [Feature]Header.tsx       # Header with controls
├── [Feature]Content.tsx      # Main content area
├── [Feature]Sidebar.tsx      # Sidebar (if applicable)
├── [Feature]Card.tsx         # Reusable card component
├── [Feature]Chart.tsx        # Chart visualization
├── [Feature]Table.tsx        # Data table
├── [Feature]Filters.tsx      # Filter controls
├── types.ts                  # Component-specific types
├── constants.ts              # Component constants
├── utils.ts                  # Helper functions
└── styles.module.css         # Component-specific styles (if needed, use Tailwind preferred)
```
*Note: This pattern will be followed for `interactive-map`, `weather-overview`, `historical-charts`, `city-ranking` and `alerts` features.*

#### 7.2 Component Template

**File**: `src/components/professional/[feature]/index.tsx` (e.g., `src/components/professional/weather-overview/WeatherOverview.tsx`)

```typescript
import { useState, useMemo, useCallback } from 'react';
import { use[Feature] } from '@/hooks/use[Feature]'; // e.g., useWeather
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { RefreshCw, CloudOff } from 'lucide-react'; // Example icons
import type { FeatureProps, FeatureData } from './types'; // Component specific types
import { AppError } from '@/lib/errorHandler';

// Sub-components (e.g., for WeatherOverview)
// import { CurrentWeatherCard } from './CurrentWeatherCard';
// import { DailyForecastList } from './DailyForecastList';
// import { HourlyForecastChart } from './HourlyForecastChart';

/**
 * [Feature] Component
 *
 * [Detailed description of what this component does, e.g., "Displays comprehensive weather information including current conditions, daily, and hourly forecasts."]
 *
 * @param {FeatureProps} props - Component props
 * @returns {JSX.Element}
 */
export function [Feature]({
  className,
  // ... other props
}: FeatureProps): JSX.Element {
  // State
  const [activeTab, setActiveTab] = useState<string>('overview'); // Example: for tabbed views within the feature
  const [filters, setFilters] = useState<any>({}); // Example: for filter state

  // Data fetching (replace with actual hook usage)
  const {
    data,
    isLoading,
    error,
    refetch
  } = use[Feature](/* params for the hook, e.g., { lat: 6.52, lng: 3.37 } */, {
    refetchInterval: 300000, // 5 min
    // onError is handled by service interceptor and `errorHandler`,
    // but can add component-specific logging if needed.
  });

  // Computed values (example)
  const processedData = useMemo(() => {
    if (!data) return null;
    // ... data processing, filtering, sorting
    return data;
  }, [data, filters]);

  // Event handlers (example)
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Loading state
  if (isLoading && !data) {
    return (
      <div className={cn("space-y-4 p-6", className)}>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("border-destructive", className)}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <CloudOff className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Failed to load data
              </h3>
              <p className="text-sm text-muted-foreground">
                {(error as AppError).message || 'An unexpected error occurred.'}
              </p>
            </div>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!processedData || Object.keys(processedData).length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <CloudOff className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No data available for this selection.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main render
  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            [Feature] Overview
          </CardTitle>
          {/* Example controls, replace with actual FeatureHeader component */}
          <Button onClick={handleRefresh} variant="ghost" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {/* Render sub-components based on processedData */}
          {/* <CurrentWeatherCard data={processedData.current} /> */}
          {/* <DailyForecastList data={processedData.dailyForecast} /> */}
          {/* <HourlyForecastChart data={processedData.hourlyForecast} /> */}
        </CardContent>
      </Card>
    </div>
  );
}

// Display name for debugging
[Feature].displayName = '[Feature]';
```

#### 7.3 Chart Component Pattern (Recharts)

**File**: `src/components/professional/[feature]/[Feature]Chart.tsx` (e.g., `src/components/professional/historical-charts/AqiPollutantLineChart.tsx`)

```typescript
import { useMemo } from 'react';
import {
  LineChart, // Or AreaChart, BarChart depending on needs
  Line,      // Or Area, Bar
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine, // For AQI thresholds or custom markers
} from 'recharts';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getAqiColor } from '@/lib/aqiUtils'; // New utility for consistent coloring
import type { ChartData } from './types'; // Component specific types

interface [Feature]ChartProps {
  data: ChartData[];
  height?: number;
  className?: string;
  title?: string;
  dataKeys: { key: string; name: string; stroke: string; }[]; // Dynamic data keys for multiple lines
  referenceLines?: { value: number; label: string; stroke: string; }[]; // Dynamic reference lines
}

export function [Feature]Chart({
  data,
  height = 300,
  className,
  title,
  dataKeys,
  referenceLines,
}: [Feature]ChartProps) {
  // Format data for Recharts (e.g., date formatting)
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      timestamp: format(new Date(item.date), 'MMM dd HH:mm'), // Example: 'MMM dd' for daily, 'MMM dd HH:mm' for hourly
    }));
  }, [data]);

  // Custom tooltip component (can be made more generic in chartUtils)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="rounded-lg border bg-background/90 p-3 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-xs">
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      {title && <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />

          <XAxis
            dataKey="timestamp"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            minTickGap={30} // Adjust based on data density
          />

          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`} // Can be extended to add units
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '20px',
              color: 'hsl(var(--muted-foreground))',
            }}
          />

          {referenceLines && referenceLines.map((line, index) => (
            <ReferenceLine
              key={`ref-line-${index}`}
              y={line.value}
              stroke={line.stroke}
              strokeDasharray="3 3"
              strokeOpacity={0.7}
              label={{
                value: line.label,
                position: "insideRight",
                fontSize: 10,
                fill: line.stroke,
              }}
            />
          ))}

          {dataKeys.map((keyConfig, index) => (
            <Line
              key={`line-${index}`}
              type="monotone"
              dataKey={keyConfig.key}
              name={keyConfig.name}
              stroke={keyConfig.stroke || getAqiColor(100)} // Fallback color
              strokeWidth={2}
              dot={false} // Hide individual dots for cleaner lines
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 8. DASHBOARD INTEGRATION

#### 8.1 Navigation Updates

**File**: `src/pages/professional/Dashboard.tsx`

**Modification 1: Add new nav items**

```typescript
// Find the navItems array (around line 80, adjust based on actual file)
const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Live Monitor" },
  { id: "overview", icon: FileText, label: "Research Overview" },
  { id: "risk", icon: Calculator, label: "Risk Calculator" },
  { id: "upload", icon: UploadCloud, label: "Data Upload" },
  { id: "reports", icon: FileText, label: "Reports" },

  // ADD NEW ITEMS HERE
  { id: "weather", icon: Cloud, label: "Weather Overview" }, // New Weather Overview tab
  { id: "historical-aqi", icon: LineChart, label: "Historical Trends" }, // New Historical AQI Trends tab
  { id: "city-rankings", icon: ListOrdered, label: "City Rankings" }, // New City Rankings tab
  // ... more items as needed for dedicated views
];
```

**Modification 2: Add route rendering**

```typescript
// Find the main content area tab rendering (around line 250, adjust based on actual file)
{activeTab === "dashboard" && (
  <div className="space-y-8 animate-in fade-in duration-500">
    {/* existing dashboard content, will be updated/replaced */}
  </div>
)}

{activeTab === "overview" && (
  <>
    <Overview datasets={MOCK_DATASETS} /> {/* Existing */}
    <div className="mt-8">
      <ResearchOverview datasets={MOCK_DATASETS} /> {/* Existing */}
    </div>
  </>
)}

{activeTab === "risk" && <RiskCalculator data={data} />} {/* Existing */}
{activeTab === "upload" && <DataUpload />} {/* Existing */}
{activeTab === "reports" && <Reports />} {/* Existing */}

// ADD NEW ROUTES
{activeTab === "weather" && <WeatherOverview />}
{activeTab === "historical-aqi" && <HistoricalChartsView />}
{activeTab === "city-rankings" && <CityRankingTable />}
// ... more routes
```

**Modification 3: Import new components**

```typescript
// At the top of the file, add imports
import { Cloud, LineChart, ListOrdered } from 'lucide-react'; // New icons for nav items
import { WeatherOverview } from '@/components/professional/weather-overview/WeatherOverview'; // New Weather Overview
import { HistoricalChartsView } from '@/components/professional/historical-charts/HistoricalChartsView'; // New Historical Charts
import { CityRankingTable } from '@/components/professional/city-ranking/CityRankingTable'; // New City Ranking Table
// ... more imports
```

#### 8.2 State Management Integration

**If global state is needed**:

The specification identified `React Context API` for managing cross-cutting state like globally selected location or active map layers.
For example, a new `LocationContext` or `DashboardSettingsContext` could be created.

**File**: `src/contexts/DashboardSettingsContext.tsx`

```typescript
import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

export interface DashboardSettings {
  selectedStationId: string | null;
  globalDateRange: { start: Date; end: Date; };
  activeMapLayers: string[];
  // ... other global dashboard settings
}

export interface DashboardSettingsActions {
  setSelectedStationId: (id: string | null) => void;
  setGlobalDateRange: (range: { start: Date; end: Date; }) => void;
  toggleMapLayer: (layerId: string) => void;
}

interface DashboardSettingsContextValue extends DashboardSettings {
  actions: DashboardSettingsActions;
}

const DashboardSettingsContext = createContext<DashboardSettingsContextValue | undefined>(undefined);

export function DashboardSettingsProvider({ children }: { children: ReactNode }) {
  const [selectedStationId, setSelectedStationIdState] = useState<string | null>(null);
  const [globalDateRange, setGlobalDateRangeState] = useState<{ start: Date; end: Date; }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Default last month
    end: new Date(),
  });
  const [activeMapLayers, setActiveMapLayersState] = useState<string[]>(['aqi_stations']);

  const setSelectedStationId = useCallback((id: string | null) => {
    setSelectedStationIdState(id);
  }, []);

  const setGlobalDateRange = useCallback((range: { start: Date; end: Date; }) => {
    setGlobalDateRangeState(range);
  }, []);

  const toggleMapLayer = useCallback((layerId: string) => {
    setActiveMapLayersState(prev =>
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
  }, []);

  const actions = useMemo(() => ({
    setSelectedStationId,
    setGlobalDateRange,
    toggleMapLayer,
  }), [setSelectedStationId, setGlobalDateRange, toggleMapLayer]);

  const value = useMemo(() => ({
    selectedStationId,
    globalDateRange,
    activeMapLayers,
    actions,
  }), [selectedStationId, globalDateRange, activeMapLayers, actions]);

  return (
    <DashboardSettingsContext.Provider value={value}>
      {children}
    </DashboardSettingsContext.Provider>
  );
}

export function useDashboardSettings() {
  const context = useContext(DashboardSettingsContext);
  if (!context) {
    throw new Error('useDashboardSettings must be used within a DashboardSettingsProvider');
  }
  return context;
}
```

**Wrap Dashboard**:

```typescript
// In src/App.tsx (recommended for global context)
import { DashboardSettingsProvider } from '@/contexts/DashboardSettingsContext';

function AppContent() {
  // ... existing AppContent logic
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {/* ... other contexts */}
      <DashboardSettingsProvider> {/* Wrap ProtectedRoutes or specific components */}
        <SignedOut>
          {/* ... */}
        </SignedOut>
        <SignedIn>
          <ProtectedRoutes />
        </SignedIn>
      </DashboardSettingsProvider>
    </Suspense>
  );
}
```

### 9. STYLING & THEMING

#### 9.1 Theme Consistency

**File**: `src/index.css` (add new CSS variables if needed)

```css
@layer base {
  :root {
    /* Existing variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... existing vars ... */

    /* NEW FEATURE-SPECIFIC VARIABLES (Examples for consistent color mapping) */
    --weather-blue: 210 80% 50%;   /* For weather elements, e.g., clear sky */
    --weather-grey: 210 10% 70%;   /* For weather elements, e.g., cloudy */
    --pollution-low: 120 70% 40%;  /* Green for low pollution */
    --pollution-moderate: 45 90% 55%; /* Yellow/Orange for moderate */
    --pollution-high: 0 80% 60%;   /* Red for high pollution */
  }

  .dark {
    /* Dark mode overrides */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... existing dark vars ... */

    /* NEW FEATURE-SPECIFIC VARIABLES (Dark mode adjustments) */
    --weather-blue: 210 80% 60%;
    --weather-grey: 210 10% 50%;
    --pollution-low: 120 70% 50%;
    --pollution-moderate: 45 90% 65%;
    --pollution-high: 0 80% 70%;
  }
}

/* FEATURE-SPECIFIC UTILITY CLASSES */
@layer utilities {
  .glass { /* Existing */
    background-color: hsl(var(--background) / 0.6);
    border: 1px solid hsl(var(--border) / 0.5);
    backdrop-filter: blur(12px);
  }

  .dashboard-bg { /* Existing */
    background-color: hsl(var(--dashboard-bg));
  }

  /* Map Marker Styling for AQI */
  .aqi-marker-good {
    background-color: hsl(var(--aqi-good));
    color: white;
  }
  .aqi-marker-moderate {
    background-color: hsl(var(--aqi-moderate));
    color: black;
  }
  .aqi-marker-unhealthy-sensitive {
    background-color: hsl(var(--aqi-unhealthy-sensitive));
    color: white;
  }
  .aqi-marker-unhealthy {
    background-color: hsl(var(--aqi-unhealthy));
    color: white;
  }
  .aqi-marker-very-unhealthy {
    background-color: hsl(var(--aqi-very-unhealthy));
    color: white;
  }
  .aqi-marker-hazardous {
    background-color: hsl(var(--aqi-hazardous));
    color: white;
  }
  .aqi-marker {
    @apply rounded-full flex items-center justify-center font-bold text-xs p-1 min-w-[28px] min-h-[28px];
  }
}
```

#### 9.2 Responsive Design Breakpoints

**Use Tailwind's default breakpoints consistently**:

```typescript
// Component responsive pattern
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
  {/* content */}
</div>
```

**For complex responsive logic**:

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery'; // Assuming this hook exists or will be created

function Component() {
  const isMobile = useMediaQuery('(max-width: 768px)');   // Tailwind `md` breakpoint - 1
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)'); // `md` to `lg`
  const isDesktop = useMediaQuery('(min-width: 1025px)'); // `lg` and up

  return (
    // Conditional rendering based on breakpoints
    <div>
      {isMobile && <p>Mobile Layout</p>}
      {isTablet && <p>Tablet Layout</p>}
      {isDesktop && <p>Desktop Layout</p>}
    </div>
  );
}
```
*   **Best Practice**: Prefer Tailwind's utility classes for responsive design where possible (e.g., `md:grid-cols-2`). Use `useMediaQuery` for more complex conditional rendering logic that cannot be achieved with utility classes alone.

### 10. ERROR HANDLING STRATEGY

#### 10.1 Error Boundary Implementation

**File**: `src/components/ErrorBoundary.tsx`

```typescript
import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { AppError } from '@/lib/errorHandler'; // Import AppError

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error | AppError, errorInfo: React.ErrorInfo) => void; // Allow AppError type
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | AppError | null; // Allow AppError type
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error | AppError): ErrorBoundaryState { // Allow AppError type
    return { hasError: true, error };
  }

  componentDidCatch(error: Error | AppError, errorInfo: React.ErrorInfo) { // Allow AppError type
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error instanceof AppError
        ? this.state.error.message
        : this.state.error?.message || 'An unexpected error occurred';

      return (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Something went wrong
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {errorMessage}
                </p>
              </div>
              <Button onClick={this.handleReset} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

**Usage**:

```typescript
// Wrap each major feature or section where errors should be caught and displayed gracefully
// Example in src/pages/professional/Dashboard.tsx for new feature components
import { ErrorBoundary } from '@/components/ErrorBoundary';

// ... inside the main return of Dashboard component
{activeTab === "[new-feature-1]" && (
  <ErrorBoundary
    onError={(error, errorInfo) => {
      // Log to error tracking service (e.g., Sentry)
      console.error('[NewFeature1] Error:', error, errorInfo);
    }}
  >
    <[NewFeature1Component] />
  </ErrorBoundary>
)}
```

#### 10.2 API Error Handling

**Centralized error handler**:

**File**: `src/lib/errorHandler.ts`

```typescript
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN',
  SERVER_UNAVAILABLE = 'SERVER_UNAVAILABLE', // Added for clarity
}

export interface AppErrorOptions {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
  retryable: boolean;
  details?: any; // Additional details for debugging
}

// Custom AppError class to distinguish application errors
export class AppError extends Error {
  public type: ErrorType;
  public originalError?: any;
  public statusCode?: number;
  public retryable: boolean;
  public details?: any;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = 'AppError';
    this.type = options.type;
    this.originalError = options.originalError;
    this.statusCode = options.statusCode;
    this.retryable = options.retryable;
    this.details = options.details;

    // Restore prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Classify and handle errors consistently
 */
export function handleError(error: unknown): AppError {
  // Network error or server unreachable
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) {
      // Network error (no response from server) or server is down
      return new AppError({
        type: ErrorType.NETWORK,
        message: 'Network connection failed or server is unreachable. Please check your internet connection and try again.',
        originalError: error,
        retryable: true,
      });
    }

    // API error with status code
    const status = axiosError.response.status;
    const data = axiosError.response.data as any; // Assuming error response has a data field

    switch (status) {
      case 400:
        return new AppError({
          type: ErrorType.VALIDATION,
          message: data?.message || 'Invalid request. Please check your input.',
          statusCode: status,
          originalError: error,
          retryable: false,
          details: data?.errors, // If backend provides specific validation errors
        });

      case 401:
      case 403:
        return new AppError({
          type: ErrorType.AUTHENTICATION,
          message: data?.message || 'Authentication failed. Please check your credentials or API key.',
          statusCode: status,
          originalError: error,
          retryable: false,
        });

      case 404:
        return new AppError({
          type: ErrorType.API,
          message: data?.message || 'Resource not found.',
          statusCode: status,
          originalError: error,
          retryable: false,
        });

      case 429:
        return new AppError({
          type: ErrorType.RATE_LIMIT,
          message: data?.message || 'Too many requests. Please try again after some time.',
          statusCode: status,
          originalError: error,
          retryable: true,
        });

      case 500:
      case 502:
      case 503:
      case 504:
        return new AppError({
          type: ErrorType.SERVER_UNAVAILABLE,
          message: data?.message || 'Our servers are experiencing issues. Please try again shortly.',
          statusCode: status,
          originalError: error,
          retryable: true,
        });

      default:
        return new AppError({
          type: ErrorType.API,
          message: data?.message || `An unexpected API error occurred: ${status}`,
          statusCode: status,
          originalError: error,
          retryable: status >= 500, // Most 5xx errors are retryable
        });
    }
  }

  // Generic error (e.g., from a promise rejection that's not an AxiosError)
  if (error instanceof Error) {
    return new AppError({
      type: ErrorType.UNKNOWN,
      message: error.message,
      originalError: error,
      retryable: false,
    });
  }

  // Unknown error type
  return new AppError({
    type: ErrorType.UNKNOWN,
    message: 'An unknown error occurred',
    originalError: error,
    retryable: false,
  });
}

/**
 * Display error to user via toast notifications.
 * This function should be called from the Axios interceptor or top-level catch blocks.
 */
export function displayError(error: AppError): void {
  const toastOptions = {
    duration: error.retryable ? 5000 : 4000,
    // Add custom toast actions, e.g., for retrying
    // action: error.retryable ? {
    //   label: 'Retry',
    //   onClick: () => console.log('Retrying...'), // This would need to trigger a refetch or similar
    // } : undefined,
  };

  switch (error.type) {
    case ErrorType.NETWORK:
    case ErrorType.SERVER_UNAVAILABLE:
      toast.error('Connection Problem', {
        description: error.message,
        ...toastOptions,
      });
      break;

    case ErrorType.AUTHENTICATION:
      toast.error('Authentication Required', {
        description: error.message,
        ...toastOptions,
      });
      break;

    case ErrorType.RATE_LIMIT:
      toast.warning('Rate Limit Exceeded', {
        description: error.message,
        ...toastOptions,
      });
      break;

    case ErrorType.VALIDATION:
      toast.error('Invalid Input', {
        description: error.message,
        ...toastOptions,
      });
      break;

    default:
      toast.error('Error', {
        description: error.message,
        ...toastOptions,
      });
  }
}

/**
 * Retry logic with exponential backoff for retryable errors.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: AppError | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = handleError(error); // Classify the error
      if (!lastError.retryable || i === maxRetries - 1) {
        // If not retryable or last attempt, rethrow immediately
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, i);
      console.warn(`Retrying (attempt ${i + 1}/${maxRetries}) after ${delay}ms for: ${lastError.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new AppError({ // Should ideally not be reached if lastError is always thrown
    type: ErrorType.UNKNOWN,
    message: "Failed after multiple retries.",
    retryable: false,
    originalError: lastError,
  });
}
```

### 11. TESTING IMPLEMENTATION

#### 11.1 Unit Test Setup

**Install testing dependencies**:

*Note: Most of these are already installed/configured in the existing QASA project based on codebase analysis. We are only ensuring the setup is complete and adding `msw`.*

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest @vitest/ui jsdom msw
```

**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts', // Points to our test setup file
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.tsx',
        '**/*.test.ts',
        'src/main.tsx', // Entry point not typically unit tested
        'src/App.tsx', // Main app component, mostly integration
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**File**: `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './mocks/server'; // Import the MSW server instance

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables used in tests
// Ensure these match your .env.test or provide reasonable defaults for testing
process.env.VITE_OPENWEATHER_API_KEY = 'test-owm-api-key';
process.env.VITE_WAQI_TOKEN = 'test-waqi-token';
process.env.VITE_CLERK_PUBLISHABLE_KEY = 'test-clerk-publishable-key';
// ... any other relevant environment variables


// --- MSW Setup ---
// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' })); // Fail tests if unhandled requests occur

// Reset any request handlers that are declared as a part of our tests (e.g. for one-off requests).
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// Mocking the crypto.randomUUID for deterministic IDs in Drizzle
// This is necessary if you use $defaultFn(() => crypto.randomUUID()) in your schema
global.crypto = {
  ...global.crypto,
  randomUUID: vi.fn(() => 'test-uuid'),
};
```

**File**: `src/test/mocks/handlers.ts` (New file for MSW handlers)

```typescript
import { HttpResponse, http } from 'msw';

export const handlers = [
  // Example handler for OpenWeatherMap Air Pollution
  http.get('https://api.openweathermap.org/data/2.5/air_pollution', ({ request, params, cookies }) => {
    // You can inspect request, params, cookies here
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (lat === '6.5244' && lon === '3.3792') { // Mock for Lagos
      return HttpResponse.json({
        coord: { lat: 6.5244, lon: 3.3792 },
        list: [
          {
            main: { aqi: 2 }, // Moderate
            components: { pm2_5: 30, pm10: 50, o3: 40, no2: 20, so2: 10, co: 300 },
            dt: Math.floor(Date.now() / 1000)
          },
        ],
      });
    }

    return HttpResponse.json({ error: 'Location not mocked' }, { status: 404 });
  }),

  // Example handler for OpenWeatherMap Current Weather
  http.get('https://api.openweathermap.org/data/2.5/weather', ({ request }) => {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    if (lat === '6.5244' && lon === '3.3792') {
      return HttpResponse.json({
        coord: { lon: 3.3792, lat: 6.5244 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: { temp: 30, feels_like: 35, pressure: 1012, humidity: 70 },
        visibility: 10000,
        wind: { speed: 5, deg: 270 },
        dt: Math.floor(Date.now() / 1000),
        name: 'Lagos',
      });
    }
    return HttpResponse.json({ error: 'Weather not mocked' }, { status: 404 });
  }),

  // Example handler for backend /api/monitoring-stations
  http.get('/api/monitoring-stations', () => {
    return HttpResponse.json({
      stations: [
        { id: 'station-lagos-1', name: 'Lagos Island', lat: 6.45, lng: 3.4, currentAqi: 120, lastUpdated: new Date().toISOString() },
        { id: 'station-mainland-1', name: 'Lagos Mainland', lat: 6.6, lng: 3.35, currentAqi: 80, lastUpdated: new Date().toISOString() },
      ],
    });
  }),

  // Add handlers for all new backend APIs and external APIs that new features consume
];
```

**File**: `src/test/mocks/server.ts` (New file for MSW server instance)

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

#### 11.2 Component Test Template

**File**: `src/components/professional/[feature]/[Component].test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { [Component] } from './[Component]';
import { use[Feature] } from '@/hooks/use[Feature]'; // Mock the custom hook
import { AppError } from '@/lib/errorHandler'; // Import AppError

// Mock the custom hook used by the component
vi.mock('@/hooks/use[Feature]', () => ({
  use[Feature]: vi.fn(),
}));

// Mock the AppError class if needed for specific error tests
// If handleError is globally mocked, this might not be strictly necessary
vi.mock('@/lib/errorHandler', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/lib/errorHandler')>();
  return {
    ...mod,
    AppError: vi.fn((opts) => new Error(opts.message) as mod.AppError), // Simplified mock for AppError
  };
});


const mockUseFeature = vi.mocked(use[Feature]); // Type the mocked hook

describe('[Component]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful mock for the hook
    mockUseFeature.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(() => Promise.resolve()),
      lastUpdated: null,
    });
  });

  it('renders loading state initially', () => {
    // Specifically set loading to true and data to null for loading state
    mockUseFeature.mockReturnValueOnce({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
      lastUpdated: null,
    });

    render(<[Component] />); // Assuming no props needed for basic render

    expect(screen.getByText(/loading/i)).toBeInTheDocument(); // Expecting a loading text or spinner
  });

  it('renders data after successful fetch', async () => {
    const mockData = {
      // ... provide mock data structure matching [DataType]
      weather: { temperature: 25, weatherDescription: 'Clear Sky' },
      forecast: [{ date: '2025-12-10', tempMax: 30 }],
    };
    mockUseFeature.mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      lastUpdated: new Date(),
    });

    render(<[Component] />);

    await waitFor(() => {
      // Check for elements that indicate data is rendered
      expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
      expect(screen.getByText('25°C')).toBeInTheDocument(); // Adjust based on actual data display
    });
  });

  it('displays error message on fetch failure', async () => {
    const errorMessage = 'Failed to fetch weather data';
    const mockError = new AppError({
      type: 'API',
      message: errorMessage,
      retryable: true,
    });
    mockUseFeature.mockReturnValueOnce({
      data: null,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: vi.fn(() => Promise.resolve()),
      lastUpdated: null,
    });

    render(<[Component] />);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('refetches data on refresh button click', async () => {
    const user = userEvent.setup();
    const mockRefetch = vi.fn(() => Promise.resolve());
    const mockData = { /* ... valid data ... */ };

    mockUseFeature.mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      lastUpdated: new Date(),
    });

    render(<[Component] />);

    const refreshButton = await screen.findByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
```

#### 11.3 Service Test Template

**File**: `src/services/[feature]Service.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpResponse, http } from 'msw';
import { server } from '@/test/mocks/server'; // MSW server instance
import { handlers } from '@/test/mocks/handlers'; // MSW handlers
import { [feature]Service } from './[feature]Service'; // Import the service to test
import { AppError, ErrorType } from '@/lib/errorHandler'; // Import AppError

// Ensure that handleError and displayError are mocked to prevent actual side effects in tests
vi.mock('@/lib/errorHandler', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/lib/errorHandler')>();
  return {
    ...mod,
    handleError: vi.fn(mod.handleError), // Still classify errors but spy on it
    displayError: vi.fn(), // Completely mock displayError
    AppError: mod.AppError, // Use the real AppError class
  };
});

const mockedHandleError = vi.mocked(AppError); // Correctly type the mocked AppError constructor


describe('[Feature]Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    [feature]Service.clearCache(); // Clear service cache before each test
  });

  afterEach(() => {
    server.resetHandlers(); // Reset MSW handlers after each test
  });

  it('fetches data successfully and transforms it', async () => {
    // Override default handlers with a specific success response
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', () => {
        return HttpResponse.json({
          coord: { lon: 3.3792, lat: 6.5244 },
          weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
          main: { temp: 30, feels_like: 35, pressure: 1012, humidity: 70 },
          visibility: 10000,
          wind: { speed: 5, deg: 270 },
          dt: Math.floor(Date.now() / 1000),
          name: 'Lagos',
        });
      }),
    );

    const result = await [feature]Service.getCurrentWeather(6.5244, 3.3792); // Assuming a method like this

    expect(result).toEqual({
      temperature: 30,
      feelsLike: 35,
      humidity: 70,
      // ... other expected transformed fields
    });
    expect(vi.mocked(AppError)).not.toHaveBeenCalled();
  });

  it('uses cached data on subsequent calls within TTL', async () => {
    const mockData = { /* ... mock transformed data ... */ };
    const mockRawResponse = { /* ... mock raw API response ... */ };

    // Use a custom handler to count requests
    let requestCount = 0;
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', () => {
        requestCount++;
        return HttpResponse.json(mockRawResponse);
      }),
    );

    // First call
    await [feature]Service.getCurrentWeather(6.5244, 3.3792);
    expect(requestCount).toBe(1);

    // Second call (should use cache)
    await [feature]Service.getCurrentWeather(6.5244, 3.3792);
    expect(requestCount).toBe(1); // Still 1 request because of caching
  });

  it('handles network errors correctly and rethrows AppError', async () => {
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', () => {
        return HttpResponse.error(); // Simulate network error
      }),
    );

    await expect([feature]Service.getCurrentWeather(6.5244, 3.3792)).rejects.toBeInstanceOf(AppError);
    const error = await [feature]Service.getCurrentWeather(6.5244, 3.3792).catch(e => e);
    expect(error.type).toBe(ErrorType.NETWORK);
    expect(vi.mocked(AppError)).toHaveBeenCalledWith(
      expect.objectContaining({ type: ErrorType.NETWORK })
    );
  });

  it('handles API rate limit errors (429) and rethrows AppError', async () => {
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', () => {
        return HttpResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
      }),
    );

    await expect([feature]Service.getCurrentWeather(6.5244, 3.3792)).rejects.toBeInstanceOf(AppError);
    const error = await [feature]Service.getCurrentWeather(6.5244, 3.3792).catch(e => e);
    expect(error.type).toBe(ErrorType.RATE_LIMIT);
  });
});
```

#### 11.4 Hook Test Template

**File**: `src/hooks/use[Feature].test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { use[Feature] } from './use[Feature]';
import { [feature]Service } from '@/services/[feature]Service'; // Mock the service
import { AppError, ErrorType } from '@/lib/errorHandler'; // Import AppError

// Mock the service that the hook depends on
vi.mock('@/services/[feature]Service', () => ({
  [feature]Service: {
    // Mock all methods the hook calls
    getCurrentWeather: vi.fn(),
    clearCache: vi.fn(), // Ensure clearCache is mocked if it's called
  },
}));

// Mock the AppError for testing error states
vi.mock('@/lib/errorHandler', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/lib/errorHandler')>();
  return {
    ...mod,
    handleError: vi.fn(mod.handleError), // Still classify errors but spy on it
    displayError: vi.fn(), // Completely mock displayError
    AppError: mod.AppError, // Use the real AppError class
  };
});

const mockFeatureService = vi.mocked([feature]Service); // Type the mocked service

describe('use[Feature]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFeatureService.clearCache(); // Always clear cache for isolated tests
  });

  it('fetches data on mount successfully', async () => {
    const mockData = {
      // ... provide mock transformed data for success
      temperature: 25,
      weatherDescription: 'Clear Sky',
    };
    mockFeatureService.getCurrentWeather.mockResolvedValue(mockData);

    const { result } = renderHook(() => use[Feature]({ lat: 6.52, lng: 3.37 })); // Pass required params

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockFeatureService.getCurrentWeather).toHaveBeenCalledWith(6.52, 3.37);
  });

  it('handles errors correctly and sets error state', async () => {
    const errorMessage = 'Failed to fetch weather';
    const mockAppError = new AppError({
      type: ErrorType.NETWORK,
      message: errorMessage,
      retryable: true,
    });
    mockFeatureService.getCurrentWeather.mockRejectedValue(mockAppError);

    const { result } = renderHook(() => use[Feature]({ lat: 6.52, lng: 3.37 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(mockAppError);
    expect(result.current.data).toBeNull();
  });

  it('refetches data on refetch call', async () => {
    const mockData1 = { temperature: 20 };
    const mockData2 = { temperature: 22 };

    mockFeatureService.getCurrentWeather.mockResolvedValueOnce(mockData1);
    const { result } = renderHook(() => use[Feature]({ lat: 6.52, lng: 3.37 }));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1);
    });

    mockFeatureService.getCurrentWeather.mockResolvedValueOnce(mockData2);
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2);
    });

    expect(mockFeatureService.getCurrentWeather).toHaveBeenCalledTimes(2);
  });

  it('polls data at specified interval', async () => {
    vi.useFakeTimers();

    const mockData = { temperature: 20 };
    mockFeatureService.getCurrentWeather.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      use[Feature]({ lat: 6.52, lng: 3.37 }, { refetchInterval: 5000 })
    );

    // Initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(mockFeatureService.getCurrentWeather).toHaveBeenCalledTimes(1);

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(mockFeatureService.getCurrentWeather).toHaveBeenCalledTimes(2);
    });

    // Fast-forward another 5 seconds
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(mockFeatureService.getCurrentWeather).toHaveBeenCalledTimes(3);
    });

    vi.useRealTimers();
  });

  it('does not fetch if enabled is false', async () => {
    mockFeatureService.getCurrentWeather.mockResolvedValue({ temperature: 20 });

    const { result } = renderHook(() =>
      use[Feature]({ lat: 6.52, lng: 3.37 }, { enabled: false })
    );

    // Give it some time, but it should not fetch
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockFeatureService.getCurrentWeather).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
```

### 12. PERFORMANCE OPTIMIZATION

#### 12.1 Code Splitting Strategy

**Implement lazy loading for feature components**:

```typescript
// In src/pages/professional/Dashboard.tsx (or main routing file)

import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components (e.g., Weather Overview, Historical Charts, City Rankings)
const WeatherOverview = lazy(() =>
  import('@/components/professional/weather-overview/WeatherOverview').then(m => ({ default: m.WeatherOverview }))
);

const HistoricalChartsView = lazy(() =>
  import('@/components/professional/historical-charts/HistoricalChartsView').then(m => ({ default: m.HistoricalChartsView }))
);

const CityRankingTable = lazy(() =>
  import('@/components/professional/city-ranking/CityRankingTable').then(m => ({ default: m.CityRankingTable }))
);

// Loading fallback for lazy-loaded components
function FeatureLoadingFallback() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

// In render of Dashboard's main content area (where activeTab is checked)
{activeTab === "weather" && (
  <Suspense fallback={<FeatureLoadingFallback />}>
    <WeatherOverview />
  </Suspense>
)}
{activeTab === "historical-aqi" && (
  <Suspense fallback={<FeatureLoadingFallback />}>
    <HistoricalChartsView />
  </Suspense>
)}
{activeTab === "city-rankings" && (
  <Suspense fallback={<FeatureLoadingFallback />}>
    <CityRankingTable />
  </Suspense>
)}
```

#### 12.2 Memoization Strategy

**File**: `src/components/professional/[feature]/[Component].tsx`

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive calculations
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  // Expensive data processing
  const processedData = useMemo(() => {
    console.log('Processing data...');
    // This heavy transformation will only re-run if 'data' changes
    return data.map(item => ({
      // ... heavy transformation
    }));
  }, [data]);

  // Memoize callbacks passed to children
  const handleItemClick = useCallback((id: string) => {
    // ... handler logic
  }, []); // Dependencies array should be empty or contain stable references

  return (
    <div>
      {processedData.map(item => (
        <ChildComponent
          key={item.id}
          item={item}
          onClick={handleItemClick} // This callback is stable
        />
      ))}
    </div>
  );
});

// Memoize child components that receive stable props
const ChildComponent = memo(function ChildComponent({ item, onClick }: ChildProps) {
  return (
    <div onClick={() => onClick(item.id)}>
      {item.name}
    </div>
  );
});
```
*   **Recommendation**: Apply `React.memo` to all pure functional components that receive static props or whose props are memoized. Use `useMemo` for expensive computations and `useCallback` for functions passed down to child components.

#### 12.3 Virtual Scrolling for Large Lists

**Install dependency**:
```bash
npm install @tanstack/react-virtual
```

**Implementation**:
*Note: This will be particularly useful for the `CityRankingTable.tsx` and any detailed lists of monitoring stations.*

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function LargeList({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated row height (can be dynamic if items vary)
    overscan: 5, // Render 5 extra items above/below viewport for smooth scrolling
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto" // Parent container must have fixed height and overflow
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`, // Total height of all items
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`, // Position item
              }}
            >
              <ItemComponent item={item} /> {/* Render your actual item component */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

#### 12.4 Image Optimization

**For static images**:

```typescript
// Use Vite's built-in optimization (already in use)
import heroImage from '@/assets/hero.png?width=800&format=webp';

<img src={heroImage} alt="Hero" loading="lazy" />
```
*   **Recommendation**: Continue using Vite's asset handling for static images, specifying width and format where possible.

**For dynamic images from APIs (e.g., weather icons)**:

```typescript
import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function OptimizedImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 h-full w-full" /> // Placeholder while loading
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageOff className="h-8 w-8 text-muted-foreground" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy" // Defer loading offscreen images
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          className={cn(
            "transition-opacity duration-300 object-contain", // object-contain for weather icons
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
        />
      )}
    </div>
  );
}
```
*   **Recommendation**: Use this `OptimizedImage` component for all dynamically loaded images, especially weather icons from OpenWeatherMap. This provides loading states, error handling, and lazy loading.

### 13. DEPLOYMENT CHECKLIST

#### 13.1 Pre-Deployment Steps

**Environment Variables**:
```bash
# Verify all required env vars are set in the production environment
✓ VITE_OPENWEATHER_API_KEY
✓ VITE_WAQI_TOKEN               # If WAQI remains in use
✓ VITE_CLERK_PUBLISHABLE_KEY
✓ DATABASE_URL                  # For connecting to the PostgreSQL database
✓ (Optional) VITE_MAPBOX_TOKEN  # If Mapbox is integrated
✓ (Optional) VITE_OPENWEATHER_MAP_LAYERS_API_KEY # If separate OWM Map Layers key is used

# Production-specific vars
✓ NODE_ENV=production
✓ VITE_API_BASE_URL=[production API URL, e.g., https://api.qasa.com]
✓ SENTRY_DSN                    # If Sentry is implemented for error tracking
```
*   **Action**: Ensure all necessary environment variables are securely configured in the production hosting environment (e.g., Vercel, Netlify for frontend; Render, AWS EC2 for backend).

**Build Optimization**:
```bash
# Run production build for the frontend
npm run build

# Check build size and analyze bundles for excessive size (optional, but recommended)
# This might involve tools like 'rollup-plugin-visualizer' or 'webpack-bundle-analyzer' if configured.
# Example: npm run build -- --analyze

# Verify no build errors or warnings
# Check 'dist/' folder content for expected output
```
*   **Action**: Perform a clean production build and verify its integrity and optimized size.

**Database Migration**:
```bash
# Run migrations in a staging environment first
npm run db:migrate -- --env staging # or equivalent command for your CI/CD setup

# Review the applied changes on staging before proceeding to production

# Then apply to production
npm run db:migrate # Use the dedicated migration command for production
```
*   **Action**: Ensure all Drizzle ORM migrations, including new tables (`monitoring_stations`, `user_alerts`, `weather_time_series`, `weather_daily_summary`) and modifications to existing tables, are successfully applied to the production database. This should ideally be part of an automated CI/CD pipeline.

#### 13.2 Deployment Verification

**Checklist after deployment**:
-   [ ] **All pages load without errors**: Navigate through the Professional Dashboard, including new tabs/sections.
-   [ ] **API connections working**: Use browser developer tools (Network tab) to confirm all frontend API calls are successful (to QASA backend and external APIs).
-   [ ] **Authentication flow functional**: Verify user login, logout, and role-based access for professional users.
-   [ ] **Data fetching working across all features**: Ensure all new components (Weather Overview, Historical Charts, City Rankings, Interactive Map) display correct and up-to-date data.
-   [ ] **Charts rendering correctly**: Verify Recharts-based components display data without visual glitches.
-   [ ] **Maps loading properly**: Ensure Leaflet map loads, markers are visible, and new layers/clustering work.
-   [ ] **Responsive design working on mobile/tablet**: Test layout and functionality across various screen sizes.
-   [ ] **Dark mode toggling correctly**: Confirm theme changes apply consistently to new UI elements.
-   [ ] **Error handling displaying properly**: Simulate error conditions (e.g., temporarily disable a backend service) and verify error boundaries and toast notifications.
-   [ ] **Loading states showing correctly**: Observe loading skeletons and spinners during data fetches.
-   [ ] **No console errors or warnings**: Check browser console for any runtime issues.
-   [ ] **Performance metrics acceptable**: Conduct a quick check with Lighthouse or similar tools to ensure new features haven't introduced significant performance regressions.

#### 13.3 Monitoring Setup

**Add error tracking** (optional but recommended):

```bash
npm install @sentry/react @sentry/tracing @sentry/replay
```
*   **Recommendation**: Integrate Sentry (or similar tool) for production error tracking. This provides real-time alerts and detailed stack traces for frontend and backend errors.

```typescript
// src/main.tsx (or main entry point for frontend)
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing"; // Deprecated, use @sentry/react's built-in tracing
import { Replay } from "@sentry/replay"; // Import Replay

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing(), // Integrated tracing
      new Replay({
        maskAllText: true,    // Mask sensitive text by default
        blockAllMedia: true,  // Block sensitive media by default
      }),
    ],
    tracesSampleRate: 1.0,  // Capture 100% of transactions
    replaysSessionSampleRate: 0.1, // Session replay for 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Replay all sessions with errors
  });
}
```
*   **Action**: Configure Sentry DSN in production environment variables (`VITE_SENTRY_DSN`).

### 14. ROLLBACK STRATEGY

An effective rollback strategy is crucial to minimize downtime and data loss in case unexpected issues arise after deployment. This plan outlines procedures for both code and database rollbacks.

#### 14.1 Git Workflow (Code Rollback)

The following Git workflow ensures that changes can be easily reverted if necessary:

```bash
# 1. Create a dedicated feature branch for all new developments
git checkout -b feature/pro-dashboard-enhancements

# 2. Make frequent, atomic commits with clear messages
# Example: git commit -m "feat(weather): add current weather service and hook"

# 3. Before merging into 'main' (or 'master'), ensure 'main' is stable and up-to-date
git checkout main
git pull origin main

# 4. Create a backup branch of 'main' just before the merge (optional, but recommended for large features)
# This provides a clean revert point if the merge itself causes issues.
git branch backup/pre-pro-dashboard-merge

# 5. Merge the feature branch into 'main' (preferably via a Pull Request with reviews and CI checks)
git merge feature/pro-dashboard-enhancements
# or (if PR is merged) git pull origin main

# 6. If issues arise after merging:
#    a) Quick rollback (reverts the last merge commit):
#       This creates a new commit that undoes the changes of the merge. It preserves history.
git revert -m 1 HEAD
git push origin main # Push the revert commit

#    b) Hard reset (use with extreme caution, re-writes history, avoid on shared branches if possible):
#       If you absolutely need to discard the merge and subsequent commits, reset to the backup branch.
#       Only use if the 'main' branch hasn't been pulled by others since the merge.
git reset --hard backup/pre-pro-dashboard-merge
git push origin main --force # Force push is required as history is re-written
```
*   **Recommendation**: Favor `git revert` for rollbacks on shared branches as it maintains a clear history. `git reset --hard` should be reserved for personal branches or very early stages of development.

#### 14.2 Database Rollback

Database rollbacks require careful consideration as they involve data changes. Drizzle ORM migrations provide a structured way to manage schema evolution.

**Migration Rollback**:

```sql
-- Ensure all Drizzle migration files have a corresponding 'Down Migration' section.
-- (Example from Drizzle migration file)
-- Up Migration
-- ... SQL for creating/altering tables ...

-- Down Migration
-- DROP TABLE IF EXISTS "new_table";
-- ALTER TABLE "existing_table" DROP COLUMN "new_column";
-- ... SQL to undo changes ...
```

**Steps for Database Rollback**:

1.  **Identify the problematic migration**: Determine which specific migration introduced the issue.
2.  **Review the 'Down Migration' scripts**: Ensure the `down.sql` (or `down` section in a single file) for the problematic migration is correct and safe to execute.
3.  **Execute the rollback**:
    ```bash
    # Use Drizzle's CLI to revert a specific number of migrations (e.g., 1 migration back)
    drizzle-kit migrate down --to-version <previous_migration_hash>
    # or to revert a specific migration file
    drizzle-kit migrate down --to-file <migration_file_name>
    ```
    *   **Caution**: Always backup your production database before performing any rollback operation, especially if it involves data-altering migrations.
4.  **Data Consistency**:
    *   If the issue involved data corruption, a simple schema rollback might not suffice. A database restore from a point-in-time backup might be necessary, followed by re-applying subsequent, non-problematic migrations.
    *   Ensure application code is compatible with the rolled-back database schema.

### 15. DOCUMENTATION REQUIREMENTS

Comprehensive and consistent documentation is crucial for maintaining the QASA codebase, facilitating onboarding of new developers, and ensuring the long-term success of the project. All new and updated code should adhere to the following documentation standards.

#### 15.1 Code Documentation

**General Principles**:
*   **Purpose over Implementation**: Comments should explain *why* a piece of code exists or *what* it achieves, rather than simply reiterating *how* it works (which should be evident from well-written code).
*   **Keep it DRY**: Avoid duplicating information that is self-evident from the code, variable names, or TypeScript types.
*   **Update Regularly**: Ensure documentation is kept up-to-date with code changes. Outdated comments are worse than no comments.
*   **Clarity and Conciseness**: Use clear, simple language.

**Component Documentation**:

```typescript
/**
 * [Component Name]
 *
 * [Detailed description of purpose and behavior, e.g., "Displays comprehensive weather information including current conditions, daily, and hourly forecasts."]
 *
 * @component
 * @example
 * ```tsx
 * <[Component]
 *   location={{ lat: 6.52, lng: 3.37 }}
 *   units="metric"
 * />
 * ```
 *
 * @param {{ lat: number; lng: number; }} props.location - The geographical coordinates for which to display weather data.
 * @param {'metric' | 'imperial'} [props.units='metric'] - The unit system for temperature and speed.
 * @param {string} [props.className] - Optional CSS class for custom styling.
 *
 * @returns {JSX.Element} Rendered component
 *
 * @remarks
 * [Any important notes about the component, e.g., "Relies on `useWeather` hook for data fetching. Ensure `WeatherProvider` is available in the component tree."]
 */
export function [Component]({
  location,
  units = 'metric',
  className,
  // ... other props
}: { location: { lat: number; lng: number; }; units?: 'metric' | 'imperial'; className?: string; }): JSX.Element { // Explicitly type props here
  // ... component logic
}
```
*   **Tools**: Use JSDoc-style comments for React components and their props.
*   **Fields**: Include `@component`, `@example`, `@param`, `@returns`, and `@remarks` where applicable.

**Hook Documentation**:

```typescript
/**
 * Hook for fetching and managing [feature] data.
 *
 * @param {{ lat: number; lng: number; }} param - The geographical coordinates for which to fetch data.
 * @param {Use[Feature]Options} options - Configuration options for the hook.
 * @param {boolean} [options.enabled=true] - Whether the data fetching should be active.
 * @param {number} [options.refetchInterval] - Interval in milliseconds for data polling.
 * @param {(data: [DataType]) => void} [options.onSuccess] - Callback function to execute on successful data fetch.
 *
 * @returns {object} An object containing the fetched data, loading state, error, and a refetch function.
 * @returns {[DataType] | null} return.data - The fetched data or null.
 * @returns {boolean} return.isLoading - True if data is currently being fetched.
 * @returns {AppError | null} return.error - An error object if fetching failed, otherwise null.
 * @returns {() => Promise<void>} return.refetch - A function to manually re-trigger data fetching.
 *
 * @example
 * const { data, isLoading, error, refetch } = useWeather({ lat: 6.52, lng: 3.37 }, { refetchInterval: 60000 });
 */
export function use[Feature](param: { lat: number, lng: number }, options: Use[Feature]Options) {
  // ... hook logic
}
```
*   **Tools**: JSDoc-style comments.
*   **Fields**: Include a clear description of purpose, `@param`, `@returns` (with descriptions for each property of the returned object), and `@example`.

**Service Documentation**:

```typescript
/**
 * WeatherService: Provides methods for fetching current, daily, and hourly weather forecasts from OpenWeatherMap.
 *
 * @remarks
 * This service implements in-memory caching for frequently requested data to reduce API calls.
 * All API interactions are handled via a configured Axios instance with error interceptors.
 *
 * @see https://openweathermap.org/api/one-call-api
 */
class WeatherService extends FeatureService {
  // ...
  /**
   * Fetches current weather conditions for a given latitude and longitude.
   * @param {number} lat - Latitude of the location.
   * @param {number} lng - Longitude of the location.
   * @returns {Promise<CurrentWeather>} A promise that resolves to the current weather data.
   * @throws {AppError} If the API call fails or encounters an error.
   */
  async getCurrentWeather(lat: number, lng: number): Promise<CurrentWeather> {
    // ...
  }
}
export const weatherService = new WeatherService();
```
*   **Tools**: JSDoc-style comments.
*   **Fields**: Include a clear service-level description (`@remarks`, `@see` for external links), and for each method: `@param`, `@returns`, `@throws`.

**Utility Functions and Types**:
*   Brief JSDoc comments for any exported utility functions explaining their purpose, parameters, and return values.
*   TypeScript interfaces and types are self-documenting for data structures, but complex types can benefit from inline comments.

#### 15.2 Backend API Documentation (OpenAPI/Swagger)

*   **Tools**: For Express.js backend, consider integrating `swagger-jsdoc` and `swagger-ui-express` to automatically generate API documentation from JSDoc comments in route handlers.
*   **Purpose**: Provides an interactive interface for frontend developers and other consumers to understand available endpoints, request/response schemas, and authentication requirements.
*   **Fields**: Each API endpoint should be documented with method type, path, description, request parameters (query, path, body), example requests/responses, and error codes.