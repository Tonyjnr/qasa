# QASA (Quality Air Safety Application) - Project Documentation

## 1. Project Overview

QASA is a full-stack, Progressive Web Application (PWA) designed to monitor, visualize, and alert users about air quality conditions. It features role-based access for typical residents and environmental professionals, providing tailored dashboards for each.

The application leverages a modern React-based frontend attached to a Node.js/Express backend that manages data ingestion, user alerts, and historical reporting via a PostgreSQL database.

## 2. Technology Stack

### Frontend

- **Framework**: React 19 (via Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4) with Utility-First Classes
- **UI Components**: Radix UI (Headless primitives), Lucide React (Icons), Sonner (Toasts)
- **Routing**: React Router DOM (v7)
- **State Management**: React Hooks & Context API
- **Maps**: Leaflet / React Leaflet
- **Charts**: Recharts
- **Authentication**: Clerk (Role-based: 'resident' | 'professional')
- **PWA**: vite-plugin-pwa

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (running via `tsx`)
- **Database**: Neon (Serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **External Data**: OpenWeatherMap API (Polled via Cron jobs)

## 3. Project Structure

```text
/
├── .env                  # Environment variables (API keys, DB URLs)
├── drizzle/              # Drizzle ORM migration files
├── public/               # Static assets (favicons, PWA manifest)
├── server/               # Backend source code
│   └── index.ts          # Main Express server & Cron jobs
├── src/                  # Frontend source code
│   ├── components/       # Reusable UI components
│   │   ├── auth/         # Authentication dialogs
│   │   ├── onboarding/   # User onboarding flow
│   │   ├── shared/       # Shared logic (Metatags etc.)
│   │   └── ui/           # Generic UI elements (Buttons, Cards - shadcn/ui style)
│   ├── contexts/         # React Contexts (Theme, Auth wrappers)
│   ├── db/               # Shared Database Schema & Config
│   │   └── schema.ts     # Drizzle Table Definitions
│   ├── hooks/            # Custom React Hooks
│   ├── lib/              # Utilities (Class merging, error handling)
│   ├── pages/            # Application Views/Routes
│   │   ├── professional/ # Dashboard for Professional users
│   │   └── resident/     # Dashboard for Resident users
│   ├── services/         # API Service Layers
│   │   ├── api.ts        # Axios instances
│   │   └── ...           # Specific services (AirQuality, Weather, etc.)
│   ├── types/            # TypeScript Interface Definitions
│   ├── App.tsx           # Main App Component & Routing Logic
│   └── main.tsx          # Application Entry Point
├── package.json          # Dependency manifest & scripts
├── vite.config.ts        # Vite Configuration
└── drizzle.config.ts     # Drizzle Config
```

## 4. Key Modules & Features

### Authentication & Authorization

- Managed by **Clerk**.
- **Role-Based Routing**:
  - `App.tsx` checks `user.unsafeMetadata.role`.
  - **Residents** see a simplified dashboard focused on health advice and local AQI.
  - **Professionals** see advanced analytics, historical trends, and raw data tables.
- **Onboarding**: New users are guided through an `OnboardingFlow` to select their role.

### Dashboard & Visualization

- **Resident Dashboard**: Key metrics (AQI, PM2.5, Health Advice), Map view, and Notifications.
- **Professional Dashboard**: Detailed grids, historical charts, monitoring station management.
- **Maps**: Interactive Leaflet maps showing monitoring stations and heatmaps.

### Backend Services (`server/`)

- **API Endpoints**:
  - `/api/monitoring-stations`: Fetches station metadata + latest AQI.
  - `/api/historical-aqi`: Returns time-series data for detailed charts.
  - `/api/alerts`: Manages user-defined threshold alerts.
  - `/api/cron/trigger-aqi-fetch`: Manual trigger for data ingestion.
- **Data Ingestion**:
  - Uses `node-cron` to fetch air pollution data from OpenWeatherMap every hour.
  - Data is normalized and stored in the `aqi_time_series` table in Postgres.

### Database Schema (`src/db/schema.ts`)

- `monitoring_stations`: Metadata for sensor locations (Lat/Lon, Name).
- `aqi_time_series`: Historical records of pollutant levels (PM2.5, PM10, O3, NO2, etc.).
- `user_alerts`: User configurations for push notifications based on AQI thresholds.
- `datasets`: Metadata for uploaded datasets (Professional feature).

## 5. Setup & Running

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database (Neon/Supabase/Local)
- Clerk Account
- OpenWeatherMap API Key

### Installation

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create `.env` in the root:

    ```env
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    DATABASE_URL=postgres://...
    VITE_OPENWEATHER_API_KEY=...
    ```

3.  **Database Setup**:
    Push the schema to your database:
    ```bash
    npm run db:push
    ```

### Develop

Run both the frontend (Vite) and backend (Express) concurrently:

```bash
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:3001`

### Build

Compile TypeScript and build the Vite assets:

```bash
npm run build
```

## 7. Backend System Architecture

### High-Level Architecture

The backend is a **Node.js/Express server** acting as an intermediary between the React Frontend and the Neon Serverless PostgreSQL Database. It uses **Drizzle ORM** for database interactions and **node-cron** for background tasks.

### Database Layer (`src/db/`)

The system relies on a relational Postgres schema with these core tables:

- **`monitoring_stations`**: Registry for tracked locations (e.g., "Lagos", "Abuja") with metadata (coordinates, country).
- **`aqi_time_series`**: Historical record table. Stores granular pollutant data (`pm25`, `pm10`, `no2`, etc.) and normalized AQI, linked to a station.
- **`user_alerts`**: Stores user-defined notification thresholds.
- **Support Tables**: `users`, `datasets`, `notifications` for auth, file uploads, and system messages.

### Data Ingestion (Automation)

The backend acts as an autonomous agent for data collection, not relying on frontend triggers.

- **Mechanism**: Cron Job (`server/index.ts`).
- **Schedule**: Hourly (`0 * * * *`).
- **Process**:
  1.  Iterates through a hardcoded list of locations.
  2.  Checks/Creates station in `monitoring_stations`.
  3.  Fetches data from **OpenWeatherMap Air Pollution API**.
  4.  Normalizes AQI (OWM 1-5 scale → Internal 0-500 scale).
  5.  Saves record to `aqi_time_series`.

### API Layer

Exposes REST endpoints for the frontend:

- **`GET /api/monitoring-stations`**: Returns station metadata combined with the _latest_ AQI reading.
- **`GET /api/historical-aqi`**: Returns time-series data for a specific station and date range (powers charts).
- **`GET/POST /api/alerts`**: CRUD for user alert preferences.

## 8. API Layer & Data Flow

The application employs a **hybrid data strategy**, utilizing both an internal backend API and direct external API calls from the client.

### A. Internal Backend API (`src/services/monitoringStationsService.ts` → `server/index.ts`)

Used for system-managed data, persistence, and aggregated views.

| Endpoint                   | Method     | Purpose                                                   | Source                                               |
| :------------------------- | :--------- | :-------------------------------------------------------- | :--------------------------------------------------- |
| `/api/monitoring-stations` | `GET`      | Main map data. Returns all tracked stations + latest AQI. | Database (`monitoring_stations` + `aqi_time_series`) |
| `/api/historical-aqi`      | `GET`      | Historical charts.                                        | Database (`aqi_time_series`)                         |
| `/api/alerts`              | `GET/POST` | User alert preferences.                                   | Database (`user_alerts`)                             |
| `/api/datasets`            | `GET`      | List uploaded data files.                                 | Database (`datasets`)                                |

**Critical Fallback Behavior**: The frontend service (`MonitoringStationsService`) includes a robust **Mock Data fallback**. If the backend API fails (or is unreachable), the service automatically generates and serves realistic mock data (Lagos, Abuja, London, etc.) to ensure the UI remains functional.

### B. Direct External APIs (`src/services/api.ts`)

Used for ephemeral user actions where persistence is not required.

| Service Function        | Provider                           | Purpose                                                                              |
| :---------------------- | :--------------------------------- | :----------------------------------------------------------------------------------- |
| `searchLocation(query)` | **OpenWeatherMap Geo API**         | Autocomplete/Search for cities. Called directly from the browser.                    |
| `openWeatherApi`        | **OpenWeatherMap**                 | Live weather/pollution data for specific user lookups (outside of tracked stations). |
| `waqiApi`               | **WAQI (World Air Quality Index)** | Supplementary data source (configured but usage is limited).                         |

> **Note on Security**: Direct external calls rely on `VITE_OPENWEATHER_API_KEY` being exposed in the frontend bundle. This is acceptable for free-tier/prototyping but should be proxied through the backend in a production enterprise environment to protect the key.

### Current Limitations (As-Is)

1.  **Security**: API endpoints currently lack server-side token validation (Clerk tokens are not verified on the backend).
2.  **Alerting**: The Cron Job fetches data but does _not_ yet trigger notifications based on the `user_alerts` thresholds.
3.  **Locations**: Tracked cities are hardcoded in `server/index.ts`, requiring code changes to add new monitoring points.
