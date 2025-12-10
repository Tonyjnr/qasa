# QASA - Air Surveillance & Health

QASA is a real-time air quality monitoring application designed to empower residents and professionals with accurate, actionable environmental data.

## Features

-   **Dual-Persona Interface**: Seamlessly switch between "Resident" (health-focused) and "Professional" (data-focused) views, now powered by an interactive onboarding flow and dynamic role switching.
-   **Enhanced Real-Time Dashboard**:
    -   **Live Ticker**: Infinite scrolling ticker showing global AQI updates.
    -   **Clean Split Layout**: Intuitive separation between detailed content and summary metrics, now with resizable panels.
    -   **Pollutant Breakdown**: Granular data on PM2.5, PM10, NO₂, O₃, CO, and SO₂.
    -   **Health Advisories**: Context-aware health recommendations based on current air quality, including Cigarette Equivalent and Exercise Advisor.
    -   **7-Day Forecast**: Predictive modeling for planning outdoor activities.
-   **Professional Dashboard - Advanced Tools**:
    -   **Interactive Map**: Visualize monitoring stations globally with AQI overlays and layer controls (temperature, wind, precipitation, etc.). Map clicks update location data dynamically.
    -   **Weather Overview**: Comprehensive current weather conditions and 5-day forecast.
    -   **Historical Trends**: Detailed charts of historical AQI and pollutant data for selected stations and time ranges.
    -   **City Rankings**: Live air quality rankings for major global cities, fetching real-time data.
    -   **Research Tools**: Dedicated sections for Data Upload, Risk Calculator, Research Overview, and Reports.
-   **Dynamic Metadata**: Browser tab title and favicon adapt based on authentication state and user role (Resident, Professional).

## Tech Stack

-   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **Database**: [Drizzle ORM](https://orm.drizzle.team/) with [PostgreSQL (Neon)](https://neon.tech/)
-   **Mapping**: [React Leaflet](https://react-leaflet.js.org/) with `react-leaflet-markercluster`
-   **Charting**: [Recharts](https://recharts.org/)
-   **Data Fetching**: [Axios](https://axios-http.com/)
-   **Testing**: [Vitest](https://vitest.dev/), [MSW](https://mswjs.io/), [Playwright](https://playwright.dev/)

## Project Structure

The project follows a scalable, component-based architecture:

```
src/
├── components/
│   ├── layout/       # Global layout components (Sidebar)
│   ├── dashboard/    # Shared dashboard widgets (PollutantGrid, ForecastList)
│   ├── professional/ # Components specific to the Professional Dashboard (Map, Weather, Charts)
│   │   ├── interactive-map/
│   │   ├── weather-overview/
│   │   └── historical-charts/
│   ├── shared/       # Reusable UI elements (e.g., MetadataManager)
│   └── ui/           # Shadcn-ui components (Button, Card, Resizable, ScrollArea)
├── contexts/         # React Context providers (ThemeProvider, DashboardSettings)
├── db/               # Drizzle ORM schema and database connection
├── hooks/            # Custom React hooks (useAirQuality, useWeather, useMonitoringStations)
├── lib/              # Utility functions (aqiUtils, errorHandler)
├── pages/            # Main view controllers (AuthView, Dashboard views for Resident/Professional)
├── services/         # API integration services (OpenWeather, internal API)
├── types/            # TypeScript interfaces and type definitions
└── App.tsx           # Main application entry and routing
```

## Quick Start

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/qasa.git
    cd qasa
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the project root based on `.env.example` (if available, otherwise refer to `src/db/index.ts` and `server/index.ts` for required variables).
    You will need:
    -   `VITE_CLERK_PUBLISHABLE_KEY`: For Clerk authentication.
    -   `VITE_OPENWEATHER_API_KEY`: For OpenWeatherMap data.
    -   `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Neon).

4.  **Database Setup**:
    -   **Push Schema**: Apply the database schema migrations.
        ```bash
        npm run db:push
        ```
        *(Note: If prompted during `db:push` regarding column renames (e.g., `location_id` to `monitoring_station_id`), select the 'Rename Column' option to preserve data.)*
    -   **Seed Data**: Populate your database with initial monitoring stations and historical AQI data for development.
        ```bash
        npx tsx scripts/seed-monitoring-data.ts
        ```

5.  **Start the development servers**:

    ```bash
    npm run dev
    ```
    This will concurrently start the frontend (Vite) and the backend (Express.js).

6.  **Build for production**:
    ```bash
    npm run build
    ```

## License

© 2024 QASA Project. All rights reserved.