# QASA - Air Surveillance & Health

QASA is a real-time air quality monitoring application designed to empower residents and professionals with accurate, actionable environmental data.

## Features

- **Dual-Persona Interface**: Seamlessly switch between "Resident" (health-focused) and "Professional" (data-focused) views.
- **Real-Time Dashboard**:
  - **Live Ticker**: Infinite scrolling ticker showing global AQI updates.
  - **Clean Split Layout**: Intuitive separation between detailed content and summary metrics.
  - **Pollutant Breakdown**: Granular data on PM2.5, PM10, NO₂, O₃, CO, and SO₂.
  - **Health Advisories**: Context-aware health recommendations based on current air quality.
  - **7-Day Forecast**: Predictive modeling for planning outdoor activities.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

The project follows a scalable, component-based architecture:

```
src/
├── components/
│   ├── layout/       # Global layout components (Sidebar, LiveTicker)
│   ├── dashboard/    # Dashboard-specific widgets (PollutantGrid, ForecastList)
│   └── shared/       # Reusable UI elements
├── pages/            # Main view controllers (AuthView, DashboardView)
├── hooks/            # Custom React hooks (useAirQuality)
├── types/            # TypeScript interfaces and type definitions
├── services/         # API integration services
└── App.tsx           # Main application entry and routing
```

## Quick Start

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Start the development server**:

    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## License

© 2024 QASA Project. All rights reserved.
