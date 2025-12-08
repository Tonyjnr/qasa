I'll solve these issues by implementing the comprehensive theme system outlined in your todo list. This involves setting up the design tokens, creating the theme provider, fixing the toggle button's CSS positioning, and updating the core layout components to use semantic colors instead of hardcoded values.

Here are the files to implement the complete solution:

1.  **`src/lib/designTokens.ts`**: Defines the single source of truth for colors, spacing, and helper functions (like AQI colors).
2.  **`src/contexts/ThemeProvider.tsx`**: Manages the active theme state (light/dark/system).
3.  **`src/index.css`**: The core CSS engine defining the variables and hiding the Clerk footer.
4.  **`src/components/ui/theme-toggle.tsx`**: Fixed the positioning bug by adding `relative` to the button container so the absolute icon stays centered.
5.  **`src/App.tsx`**: Wraps the application with the `ThemeProvider`.
6.  **`src/components/layout/Sidebar.tsx`** & **`src/pages/resident/Dashboard.tsx`**: Updated to use the new semantic tokens for a consistent look.

## Design Tokens

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// DESIGN TOKENS & CONSTANTS
// ============================================================================

export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const RADIUS = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  full: "9999px",
} as const;

export const COMPONENT_STYLES = {
  card: {
    base: "bg-card text-card-foreground border border-border shadow-sm",
    glass: "glass text-foreground",
  },
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  },
  badge: {
    default:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Returns the appropriate color classes based on AQI value
 */
export function getAQIColors(aqi: number) {
  if (aqi <= 50) {
    return {
      bg: "var(--aqi-good)",
      text: "text-aqi-good",
      bgClass: "bg-aqi-good/10",
      borderClass: "border-aqi-good/20",
      dotClass: "bg-aqi-good",
    };
  }
  if (aqi <= 100) {
    return {
      bg: "var(--aqi-moderate)",
      text: "text-aqi-moderate",
      bgClass: "bg-aqi-moderate/10",
      borderClass: "border-aqi-moderate/20",
      dotClass: "bg-aqi-moderate",
    };
  }
  if (aqi <= 150) {
    return {
      bg: "var(--aqi-unhealthy-sensitive)",
      text: "text-aqi-unhealthy-sensitive",
      bgClass: "bg-aqi-unhealthy-sensitive/10",
      borderClass: "border-aqi-unhealthy-sensitive/20",
      dotClass: "bg-aqi-unhealthy-sensitive",
    };
  }
  if (aqi <= 200) {
    return {
      bg: "var(--aqi-unhealthy)",
      text: "text-aqi-unhealthy",
      bgClass: "bg-aqi-unhealthy/10",
      borderClass: "border-aqi-unhealthy/20",
      dotClass: "bg-aqi-unhealthy",
    };
  }
  if (aqi <= 300) {
    return {
      bg: "var(--aqi-very-unhealthy)",
      text: "text-aqi-very-unhealthy",
      bgClass: "bg-aqi-very-unhealthy/10",
      borderClass: "border-aqi-very-unhealthy/20",
      dotClass: "bg-aqi-very-unhealthy",
    };
  }
  return {
    bg: "var(--aqi-hazardous)",
    text: "text-aqi-hazardous",
    bgClass: "bg-aqi-hazardous/10",
    borderClass: "border-aqi-hazardous/20",
    dotClass: "bg-aqi-hazardous",
  };
}

/**
 * Returns the text label for an AQI value
 */
export function getAQILabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

/**
 * Utility for theme-aware classes
 */
export function themeClasses(light: string, dark: string) {
  return cn(light, `dark:${dark}`);
}

/**
 * Generates glassmorphism classes
 */
export function glassEffect(
  intensity: "light" | "medium" | "heavy" = "medium"
) {
  const opacity =
    intensity === "light"
      ? "bg-background/40"
      : intensity === "medium"
      ? "bg-background/60"
      : "bg-background/80";
  return cn(opacity, "backdrop-blur-md border border-border/50");
}
```

## Theme Context

```tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
```

## Global CSS & Themes

```css
@import "tailwindcss";

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));

  --color-aqi-good: hsl(var(--aqi-good));
  --color-aqi-moderate: hsl(var(--aqi-moderate));
  --color-aqi-unhealthy-sensitive: hsl(var(--aqi-unhealthy-sensitive));
  --color-aqi-unhealthy: hsl(var(--aqi-unhealthy));
  --color-aqi-very-unhealthy: hsl(var(--aqi-very-unhealthy));
  --color-aqi-hazardous: hsl(var(--aqi-hazardous));

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

@layer base {
  :root {
    /* ========================================
       LIGHT MODE - Base Colors
       ======================================== */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221 83% 53%;
    --primary-foreground: 0 0% 100%;
    --secondary: 214 32% 91%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 214 32% 91%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 142 76% 36%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221 83% 53%;
    --radius: 0.75rem;

    /* AQI Colors (HSL) */
    --aqi-good: 142 76% 36%;
    --aqi-moderate: 45 93% 47%;
    --aqi-unhealthy-sensitive: 25 95% 53%;
    --aqi-unhealthy: 0 72% 51%;
    --aqi-very-unhealthy: 348 83% 47%;
    --aqi-hazardous: 271 91% 65%;

    /* Dashboard Specific */
    --dashboard-bg: 210 40% 98%;
  }

  .dark {
    /* ========================================
       DARK MODE - Base Colors
       ======================================== */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 217.2 32.6% 17.5%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 213 94% 68%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 142 71% 45%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 213 94% 68%;

    /* AQI Colors (Adjusted for Dark Mode) */
    --aqi-good: 142 71% 45%;
    --aqi-moderate: 45 93% 55%;
    --aqi-unhealthy-sensitive: 25 95% 60%;
    --aqi-unhealthy: 0 72% 60%;
    --aqi-very-unhealthy: 348 83% 57%;
    --aqi-hazardous: 271 91% 70%;

    /* Dashboard Specific */
    --dashboard-bg: 222.2 84% 4.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  .glass {
    background-color: hsl(var(--background) / 0.6);
    border: 1px solid hsl(var(--border) / 0.5);
    backdrop-filter: blur(12px);
  }

  .dashboard-bg {
    background-color: hsl(var(--dashboard-bg));
  }

  .animate-marquee {
    animation: marquee 50s linear infinite;
  }
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* Hide Clerk Development Footer */
.cl-footer,
.cl-footerAction,
.cl-logoBadge,
.cl-internal-b3fm6y {
  display: none !important;
}
```

## Fixed Theme Toggle

```tsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none"
      title="Toggle Theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
```

## Themed Dashboard

```tsx
import { Search, Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAirQuality } from "../../hooks/useAirQuality";
import { UserButton } from "@clerk/clerk-react";
import { PollutantGrid } from "../../components/dashboard/PollutantGrid";
import { ForecastList } from "../../components/dashboard/ForecastList";
import { Sidebar } from "../../components/layout/Sidebar";
import { CigaretteWidget } from "../../components/dashboard/CigaretteWidget";
import { ExerciseAdvisor } from "../../components/dashboard/ExerciseAdvisor";
import { useState } from "react";
import { searchLocation } from "../../services/api";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { AIAssistant } from "../../components/ai/AIAssistant";
import { InteractiveMap } from "../../components/dashboard/InteractiveMap";
import { ListView } from "../../components/dashboard/ListView";

export const Dashboard = () => {
  const { data, isLoading, error, refresh, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to search location");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLocation(lat, lng);
    setShowSearchResults(false);
    setSearchQuery("");
    toast.success(`Location changed to ${name}`);
  };

  // --- LOADING STATE ---
  if (isLoading && !data) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden bg-background lg:flex-row">
        {/* Left Panel Skeleton */}
        <main className="flex-1 p-4 lg:p-10 dashboard-bg">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-4">
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
              <div className="h-10 w-64 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-12 w-96 rounded-2xl bg-muted animate-pulse hidden md:block" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="h-64 rounded-3xl bg-muted animate-pulse" />
            <div className="h-64 rounded-3xl bg-muted animate-pulse" />
          </div>
        </main>
        {/* Right Panel Skeleton */}
        <aside className="hidden h-full w-[calc(400px_+_10%)] border-l border-border bg-background p-6 lg:block">
          <div className="space-y-8">
            <div className="flex justify-center pt-8">
              <div className="h-24 w-24 rounded-3xl bg-muted animate-pulse" />
            </div>
          </div>
        </aside>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Connection Failed
          </h2>
          <p className="mb-8 max-w-md text-muted-foreground">{error}</p>
          <button
            onClick={() => refresh()}
            className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background font-sans text-foreground lg:flex-row">
      <Toaster position="top-center" />
      {/* --- LEFT PANEL: Content Area --- */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10 dashboard-bg">
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">
                Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Air Quality Monitor
            </h1>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.length >= 3) {
                    searchLocation(val).then((results) => {
                      setSearchResults(results.slice(0, 5));
                      setShowSearchResults(true);
                    });
                  } else {
                    setShowSearchResults(false);
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={`w-full rounded-full border-none bg-background py-3 pl-10 pr-4 shadow-sm ring-1 ring-border transition-shadow focus:ring-2 focus:ring-primary ${
                  isSearching ? "opacity-50" : ""
                }`}
                disabled={isSearching}
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-3xl border border-border bg-popover text-popover-foreground shadow-lg">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        handleLocationSelect(
                          result.lat,
                          result.lng,
                          result.name
                        )
                      }
                      className="w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent last:border-b-0"
                    >
                      <div className="font-medium text-foreground">
                        {result.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.state ? `${result.state}, ` : ""}
                        {result.country}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none">
                    <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                    <Bell className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-4 cursor-pointer">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          High Pollution Alert
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Air quality in Lagos is deteriorating.
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-4 cursor-pointer">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Weekly Report Ready
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your exposure summary is available.
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <UserButton />
            </div>
          </div>
        </header>

        {/* Map Section */}
        <section className="mb-8 relative z-0">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-bold text-foreground">Live Overview</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />{" "}
              Live data from network
            </div>
          </div>

          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-muted shadow-xl ring-1 ring-border transition-all">
            <InteractiveMap
              data={data}
              onLocationChange={(lat, lng) => {
                setLocation(lat, lng);
                toast.info("Fetching AQI for new location...");
              }}
            />

            {/* Help / Detailed View Trigger */}
            <div className="absolute right-4 top-4 z-[500]">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition-transform hover:scale-110 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                    title="Detailed View"
                  >
                    <span className="text-lg font-bold">?</span>
                  </button>
                </DialogTrigger>
                {/* DialogContent hosting ListView */}
                <DialogContent className="max-w-[68vw] h-[90vh] p-0 overflow-hidden bg-background border-border shadow-2xl rounded-3xl">
                  <div className="h-full w-full overflow-hidden">
                    <ListView data={data} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Health Insights Section */}
        {data && (
          <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <CigaretteWidget pm25={data.pollutants.pm25} />
            <ExerciseAdvisor currentAQI={data.aqi} forecast={data.forecast} />
          </section>
        )}

        {/* Pollutants & Forecast */}
        {data && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <PollutantGrid pollutants={data.pollutants} />
            <ForecastList forecast={data.forecast} />
          </div>
        )}
      </main>

      {/* --- RIGHT PANEL: Summary Area --- */}
      {data && (
        <Sidebar
          data={data}
          isLoading={isLoading}
          onLocationSelect={handleLocationSelect}
        />
      )}
      {/* AI Assistant */}
      <AIAssistant mode="resident" contextData={data} />
    </div>
  );
};
```
