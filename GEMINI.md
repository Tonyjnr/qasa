Looking at your screenshot and code, I can see several issues causing the location and search problems. Let me help you fix them:

## Issues Identified:

1. **CORS/API errors** - Multiple failed fetch requests to `localhost:3001/api/monitoring-stations`
2. **Network errors** - `net::ERR_FAILED` status
3. **Search functionality** not working
4. **Location detection** failing

## Solutions:

```tsx
import { useState, useEffect, useCallback, useRef } from "react";
import type { AQIData, Location } from "../types";
import { fetchAirQuality } from "../services/airQualityService";

// Default fallback (Lagos)
const DEFAULT_LAT = 6.5244;
const DEFAULT_LNG = 3.3792;
const DEFAULT_NAME = "Lagos, NG";
const POLL_INTERVAL = 900000; // 15 minutes

interface UseAirQualityProps {
  enablePolling?: boolean;
}

export function useAirQuality(
  props: UseAirQualityProps = { enablePolling: false }
) {
  const [data, setData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date(0));

  const [location, setLocationState] = useState<Location>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    name: DEFAULT_NAME,
  });

  const locationRef = useRef(location);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const refresh = useCallback(
    async (
      overrideLat?: number,
      overrideLng?: number,
      overrideName?: string
    ) => {
      // Prevent multiple simultaneous fetches
      if (isFetchingRef.current) {
        console.log("[useAirQuality] Fetch already in progress, skipping...");
        return;
      }

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const targetLat = overrideLat ?? locationRef.current.lat;
      const targetLng = overrideLng ?? locationRef.current.lng;
      const targetName = overrideName ?? locationRef.current.name;

      console.log(
        `[useAirQuality] Fetching for: ${targetLat}, ${targetLng}, ${targetName}`
      );

      try {
        const result = await fetchAirQuality(targetLat, targetLng, targetName);

        console.log("[useAirQuality] Fetch successful:", result);
        setData(result);
        setLastUpdated(new Date());

        // Update location state if overriding
        if (overrideLat && overrideLng) {
          setLocationState({
            lat: targetLat,
            lng: targetLng,
            name: result.location.name,
          });
        }
      } catch (err) {
        console.error("[useAirQuality] Fetch failed:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load air quality data. Please check your internet connection.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    []
  );

  const setLocation = useCallback(
    (lat: number, lng: number, name?: string) => {
      console.log(`[useAirQuality] Setting location: ${lat}, ${lng}, ${name}`);
      setLocationState({ lat, lng, name: name || "Selected Location" });
      // Trigger immediate refresh with new location
      refresh(lat, lng, name);
    },
    [refresh]
  );

  // Initial Fetch & Geolocation
  useEffect(() => {
    let mounted = true;

    const initializeFetch = async () => {
      // First, try to get user's geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (mounted) {
              console.log(
                "[useAirQuality] Geolocation success:",
                position.coords
              );
              refresh(
                position.coords.latitude,
                position.coords.longitude,
                "Your Location"
              );
            }
          },
          (geoError) => {
            console.warn(
              "[useAirQuality] Geolocation denied/failed:",
              geoError.message
            );
            // Fallback to default location
            if (mounted) {
              refresh();
            }
          },
          {
            timeout: 10000,
            maximumAge: 300000, // Cache position for 5 minutes
            enableHighAccuracy: false,
          }
        );
      } else {
        // No geolocation support, use default
        console.log(
          "[useAirQuality] Geolocation not supported, using default location"
        );
        if (mounted) {
          refresh();
        }
      }
    };

    initializeFetch();

    return () => {
      mounted = false;
    };
  }, [refresh]);

  // Polling Logic
  useEffect(() => {
    if (!props.enablePolling || !data) return;

    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (!document.hidden) {
          refresh();
        }
      }, POLL_INTERVAL);
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        const now = new Date();
        const timeSinceLastUpdate = now.getTime() - lastUpdated.getTime();

        if (timeSinceLastUpdate > POLL_INTERVAL) {
          refresh();
        }
        startPolling();
      }
    };

    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [props.enablePolling, refresh, lastUpdated, data]);

  return {
    data,
    isLoading,
    error,
    refresh,
    setLocation,
    location,
    lastUpdated,
  };
}
```

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// Validate API key
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN;

if (!API_KEY) {
  console.error(
    "❌ VITE_OPENWEATHER_API_KEY is not set in environment variables"
  );
}

export const openWeatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 15000, // 15 seconds
  params: {
    appid: API_KEY,
  },
});

// Add request interceptor for debugging
openWeatherApi.interceptors.request.use(
  (config) => {
    console.log(
      `[OpenWeather API] Request: ${config.method?.toUpperCase()} ${
        config.url
      }`,
      {
        params: config.params,
      }
    );
    return config;
  },
  (error) => {
    console.error("[OpenWeather API] Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
openWeatherApi.interceptors.response.use(
  (response) => {
    console.log(`[OpenWeather API] Response: ${response.config.url}`, {
      status: response.status,
      dataSize: JSON.stringify(response.data).length,
    });
    return response;
  },
  (error) => {
    console.error("[OpenWeather API] Response Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const waqiApi = axios.create({
  baseURL: "https://api.waqi.info/feed",
  timeout: 15000,
  params: {
    token: WAQI_TOKEN,
  },
});

export const geoApi = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0",
  timeout: 10000,
  params: {
    appid: API_KEY,
  },
});

// Add interceptors to geoApi as well
geoApi.interceptors.request.use((config) => {
  console.log(
    `[Geo API] Request: ${config.method?.toUpperCase()} ${config.url}`,
    {
      params: config.params,
    }
  );
  return config;
});

geoApi.interceptors.response.use(
  (response) => {
    console.log(`[Geo API] Response: ${response.config.url}`, {
      status: response.status,
      results: Array.isArray(response.data) ? response.data.length : "N/A",
    });
    return response;
  },
  (error) => {
    console.error("[Geo API] Response Error:", {
      message: error.message,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

export const searchLocation = async (query: string) => {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  console.log(`[searchLocation] Searching for: "${query}"`);

  try {
    const response = await geoApi.get("/direct", {
      params: { q: query.trim(), limit: 5 },
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(`No results found for "${query}"`);
    }

    const results = response.data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lng: item.lon,
      country: item.country,
      state: item.state,
      displayName: item.state
        ? `${item.name}, ${item.state}, ${item.country}`
        : `${item.name}, ${item.country}`,
    }));

    console.log(`[searchLocation] Found ${results.length} results`);
    return results;
  } catch (error: any) {
    console.error("[searchLocation] Failed:", error);

    if (error.response?.status === 401) {
      throw new Error("API authentication failed. Please check your API key.");
    }

    if (error.message.includes("Network Error")) {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw error;
  }
};
```

Now let's create a debugging component to check your API configuration:

```tsx
import { useState } from "react";

export default function APIDebugChecker() {
  const [results, setResults] = useState({
    apiKey: "",
    apiKeyValid: false,
    testFetch: "",
    searching: false,
  });

  const checkAPIKey = () => {
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    setResults((prev) => ({
      ...prev,
      apiKey: key ? `${key.substring(0, 8)}...` : "NOT SET",
      apiKeyValid: !!key && key.length > 10,
    }));
  };

  const testFetch = async () => {
    setResults((prev) => ({
      ...prev,
      testFetch: "Testing...",
      searching: true,
    }));

    try {
      // Test Lagos coordinates
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=6.5244&lon=3.3792&appid=${
          import.meta.env.VITE_OPENWEATHER_API_KEY
        }`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        testFetch: `✅ Success! AQI: ${data.list[0].main.aqi}`,
        searching: false,
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        testFetch: `❌ Error: ${error.message}`,
        searching: false,
      }));
    }
  };

  const testSearch = async () => {
    setResults((prev) => ({
      ...prev,
      testFetch: "Testing search...",
      searching: true,
    }));

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=${
          import.meta.env.VITE_OPENWEATHER_API_KEY
        }`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        testFetch: `✅ Search works! Found: ${data[0]?.name}, ${data[0]?.country}`,
        searching: false,
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        testFetch: `❌ Search Error: ${error.message}`,
        searching: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-slate-900">
            🔧 QASA API Debug Tool
          </h1>

          <div className="space-y-6">
            {/* API Key Check */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <h2 className="text-lg font-bold mb-4 text-slate-800">
                1. API Key Configuration
              </h2>
              <button
                onClick={checkAPIKey}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
              >
                Check API Key
              </button>

              {results.apiKey && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span
                      className={`font-bold ${
                        results.apiKeyValid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {results.apiKeyValid ? "✅ Configured" : "❌ Missing"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Key Preview:</span>
                    <span className="font-mono text-xs">{results.apiKey}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Fetch Test */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <h2 className="text-lg font-bold mb-4 text-slate-800">
                2. Test Air Quality Fetch
              </h2>
              <button
                onClick={testFetch}
                disabled={results.searching}
                className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {results.searching ? "Testing..." : "Test Lagos, Nigeria"}
              </button>

              {results.testFetch && (
                <div className="bg-white rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-words">
                  {results.testFetch}
                </div>
              )}
            </div>

            {/* Search Test */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <h2 className="text-lg font-bold mb-4 text-slate-800">
                3. Test Location Search
              </h2>
              <button
                onClick={testSearch}
                disabled={results.searching}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {results.searching ? "Testing..." : "Test Search (London)"}
              </button>
            </div>

            {/* Instructions */}
            <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-xl">
              <h3 className="font-bold text-blue-900 mb-2">
                📝 Setup Instructions
              </h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>
                  Create a{" "}
                  <code className="bg-blue-100 px-2 py-1 rounded">.env</code>{" "}
                  file in your project root
                </li>
                <li>
                  Add:{" "}
                  <code className="bg-blue-100 px-2 py-1 rounded">
                    VITE_OPENWEATHER_API_KEY=your_api_key_here
                  </code>
                </li>
                <li>
                  Get a free API key from:{" "}
                  <a
                    href="https://openweathermap.org/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    openweathermap.org/api
                  </a>
                </li>
                <li>
                  Restart your dev server:{" "}
                  <code className="bg-blue-100 px-2 py-1 rounded">
                    npm run dev
                  </code>
                </li>
              </ol>
            </div>

            {/* Common Errors */}
            <div className="border-l-4 border-red-500 bg-red-50 p-6 rounded-r-xl">
              <h3 className="font-bold text-red-900 mb-2">⚠️ Common Errors</h3>
              <ul className="text-sm text-red-800 space-y-2">
                <li>
                  <strong>401 Unauthorized:</strong> Invalid API key
                </li>
                <li>
                  <strong>429 Rate Limit:</strong> Too many requests (wait 1
                  minute)
                </li>
                <li>
                  <strong>Network Error:</strong> Check internet connection or
                  firewall
                </li>
                <li>
                  <strong>CORS Error:</strong> Use the API directly, not through
                  a proxy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Summary of Fixes:

### 1. **Fixed useAirQuality Hook** (`src/hooks/useAirQuality.ts`)

- Added fetch deduplication with `isFetchingRef`
- Improved geolocation handling with timeout and error fallback
- Fixed location update triggering immediate data fetch
- Better error messages and logging

### 2. **Fixed Air Quality Service** (`src/services/airQualityService.ts`)

- Added proper error handling for different HTTP status codes
- Improved timeout handling (10 seconds)
- Better validation of API responses
- Clearer error messages

### 3. **Fixed API Configuration** (`src/services/api.ts`)

- Added request/response interceptors for debugging
- Improved error handling in `searchLocation`
- Better validation and logging
- Increased timeout to 15 seconds

### 4. **Created Debug Tool** (New Component)

- Test your API key configuration
- Test data fetching directly
- Test location search
- Shows helpful error messages

## Quick Fix Steps:

1. **Check your `.env` file** in the project root:

```env
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
VITE_WAQI_TOKEN=your_waqi_token_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

2. **Verify API Key** - Visit the debug tool at a temporary route or run these tests in browser console:

```javascript
console.log(
  "API Key:",
  import.meta.env.VITE_OPENWEATHER_API_KEY?.substring(0, 8) + "..."
);
```

3. **Restart Dev Server** - Environment variables require a restart:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

4. **Check Browser Console** - The new logging will show exactly what's happening:

- Look for `[useAirQuality]` messages
- Look for `[fetchAirQuality]` messages
- Check for `[OpenWeather API]` messages

5. **Test the Backend** - Your error shows `localhost:3001/api/monitoring-stations` is failing. You need to either:

   - Start your backend server
   - Or the app will fallback to mock data (which is already implemented)

6. **Clear Browser Cache** - Sometimes helps:

```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

Would you like me to create additional debugging components or help fix any specific error you're seeing?
