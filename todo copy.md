Let's work on the theme(lightmode and darkmode) and other general variables used commonly throughtout my codebase.

I'll help you set up a comprehensive theming system with proper light/dark mode support and reusable design tokens throughout your codebase.

## **Complete Theme System with Design Tokens**

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

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

@layer base {
  :root {
    /* ========================================
       LIGHT MODE - Base Colors
       ======================================== */

    /* Background & Surface Colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    /* Primary Brand Colors (Blue) */
    --primary: 221 83% 53%; /* #4285F4 - Google Blue */
    --primary-foreground: 0 0% 100%;

    /* Secondary Colors (Cool Gray) */
    --secondary: 214 32% 91%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    /* Muted/Subtle Colors */
    --muted: 214 32% 91%;
    --muted-foreground: 215.4 16.3% 46.9%;

    /* Accent Colors (Emerald Green) */
    --accent: 142 76% 36%; /* #0F9D58 - Google Green */
    --accent-foreground: 0 0% 100%;

    /* Destructive/Error Colors */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;

    /* Border & Input */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221 83% 53%;

    /* Border Radius */
    --radius: 0.75rem;

    /* ========================================
       CUSTOM DESIGN TOKENS - LIGHT MODE
       ======================================== */

    /* Dashboard Background */
    --dashboard-bg: 210 40% 98%; /* #F8FAFC */
    --dashboard-surface: 0 0% 100%;
    --dashboard-surface-elevated: 0 0% 100%;

    /* Sidebar Colors */
    --sidebar-bg: 210 40% 98%; /* #F8FAFC */
    --sidebar-border: 214.3 31.8% 91.4%;
    --sidebar-text: 215.4 16.3% 46.9%;
    --sidebar-text-active: 222.2 84% 4.9%;

    /* AQI Status Colors */
    --aqi-good: 142 76% 36%; /* Green */
    --aqi-moderate: 45 93% 47%; /* Yellow */
    --aqi-unhealthy-sensitive: 25 95% 53%; /* Orange */
    --aqi-unhealthy: 0 72% 51%; /* Red */
    --aqi-very-unhealthy: 348 83% 47%; /* Rose */
    --aqi-hazardous: 271 91% 65%; /* Purple */

    /* Glassmorphism Effects */
    --glass-bg: 0 0% 100% / 0.6;
    --glass-border: 0 0% 100% / 0.4;
    --glass-backdrop: blur(12px);

    /* Gradients */
    --gradient-primary: linear-gradient(
      135deg,
      hsl(221 83% 53%) 0%,
      hsl(142 76% 36%) 100%
    );
    --gradient-danger: linear-gradient(
      135deg,
      hsl(0 72% 51%) 0%,
      hsl(348 83% 47%) 100%
    );
    --gradient-success: linear-gradient(
      135deg,
      hsl(142 76% 36%) 0%,
      hsl(158 64% 52%) 100%
    );

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 /
            0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 /
            0.1);

    /* Animations */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark {
    /* ========================================
       DARK MODE - Base Colors
       ======================================== */

    /* Background & Surface Colors */
    --background: 222.2 84% 4.9%; /* Deep Navy */
    --foreground: 210 40% 98%;
    --card: 217.2 32.6% 17.5%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    /* Primary Brand Colors (Brighter in dark mode) */
    --primary: 213 94% 68%; /* Lighter blue for dark bg */
    --primary-foreground: 222.2 47.4% 11.2%;

    /* Secondary Colors */
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    /* Muted/Subtle Colors */
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    /* Accent Colors (Brighter green) */
    --accent: 142 71% 45%;
    --accent-foreground: 210 40% 98%;

    /* Destructive/Error Colors */
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    /* Border & Input */
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 213 94% 68%;

    /* ========================================
       CUSTOM DESIGN TOKENS - DARK MODE
       ======================================== */

    /* Dashboard Background */
    --dashboard-bg: 222.2 84% 4.9%; /* #0F172A - Deep Navy */
    --dashboard-surface: 217.2 32.6% 17.5%;
    --dashboard-surface-elevated: 215.4 16.3% 25%;

    /* Sidebar Colors */
    --sidebar-bg: 222.2 84% 4.9%;
    --sidebar-border: 217.2 32.6% 17.5%;
    --sidebar-text: 215 20.2% 65.1%;
    --sidebar-text-active: 210 40% 98%;

    /* AQI Status Colors (Adjusted for dark mode) */
    --aqi-good: 142 71% 45%;
    --aqi-moderate: 45 93% 55%;
    --aqi-unhealthy-sensitive: 25 95% 60%;
    --aqi-unhealthy: 0 72% 60%;
    --aqi-very-unhealthy: 348 83% 57%;
    --aqi-hazardous: 271 91% 70%;

    /* Glassmorphism Effects */
    --glass-bg: 217.2 32.6% 17.5% / 0.6;
    --glass-border: 210 40% 98% / 0.1;
    --glass-backdrop: blur(12px);

    /* Shadows (Deeper in dark mode) */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 /
            0.4);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.6), 0 8px 10px -6px rgb(0 0 0 /
            0.5);
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Smooth transitions for theme changes */
  * {
    transition-property: color, background-color, border-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
}

/* ========================================
   UTILITY CLASSES
   ======================================== */

@layer utilities {
  /* Dashboard Backgrounds */
  .dashboard-bg {
    background-color: hsl(var(--dashboard-bg));
  }

  .dashboard-surface {
    background-color: hsl(var(--dashboard-surface));
  }

  .dashboard-surface-elevated {
    background-color: hsl(var(--dashboard-surface-elevated));
  }

  /* Glassmorphism */
  .glass {
    background-color: hsl(var(--glass-bg));
    border: 1px solid hsl(var(--glass-border));
    backdrop-filter: var(--glass-backdrop);
  }

  /* AQI Status Colors */
  .aqi-good {
    background-color: hsl(var(--aqi-good));
  }

  .aqi-moderate {
    background-color: hsl(var(--aqi-moderate));
  }

  .aqi-unhealthy-sensitive {
    background-color: hsl(var(--aqi-unhealthy-sensitive));
  }

  .aqi-unhealthy {
    background-color: hsl(var(--aqi-unhealthy));
  }

  .aqi-very-unhealthy {
    background-color: hsl(var(--aqi-very-unhealthy));
  }

  .aqi-hazardous {
    background-color: hsl(var(--aqi-hazardous));
  }

  /* Gradient Backgrounds */
  .gradient-primary {
    background: var(--gradient-primary);
  }

  .gradient-danger {
    background: var(--gradient-danger);
  }

  .gradient-success {
    background: var(--gradient-success);
  }

  /* Animations */
  .animate-marquee {
    animation: marquee 50s linear infinite;
  }

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  /* Pulse animation for live indicators */
  .pulse-live {
    animation: pulse-live 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse-live {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Fade in animation */
  .fade-in {
    animation: fadeIn var(--transition-base) ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Slide up animation */
  .slide-up {
    animation: slideUp var(--transition-slow) ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

/* ========================================
   COMPONENT-SPECIFIC OVERRIDES
   ======================================== */

/* Force hide Clerk's footer and branding */
.cl-footer,
.cl-footerAction,
.cl-logoBadge {
  display: none !important;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: hsl(var(--card));
}

.dark ::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.4);
}

/* Selection colors */
::selection {
  background-color: hsl(var(--primary) / 0.3);
  color: hsl(var(--foreground));
}

.dark ::selection {
  background-color: hsl(var(--primary) / 0.5);
  color: hsl(var(--foreground));
}
```

## **Updated Sidebar with Theme Support**

```tsx
import {
  ShieldCheck,
  ShieldAlert,
  Skull,
  Activity,
  MapPin,
} from "lucide-react";
import type { AQIData } from "../../types";
import { cn } from "../../lib/utils";
import { getAQIColors, getAQILabel } from "../../lib/designTokens";

interface SidebarProps {
  data: AQIData;
  isLoading: boolean;
  onLocationSelect?: (lat: number, lng: number, name: string) => void;
}

const getAQIStatus = (aqi: number) => {
  const colors = getAQIColors(aqi);
  const label = getAQILabel(aqi);

  const iconMap = {
    Good: ShieldCheck,
    Moderate: Activity,
    "Unhealthy for Sensitive Groups": ShieldAlert,
    Unhealthy: Skull,
    "Very Unhealthy": Skull,
    Hazardous: Skull,
  };

  return {
    label,
    color: colors.text,
    bg: colors.bgClass,
    border: colors.borderClass,
    icon: iconMap[label as keyof typeof iconMap] || Activity,
    desc: getAQIDescription(aqi),
  };
};

function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return "Air quality is satisfactory.";
  if (aqi <= 100)
    return "Acceptable. Moderate health concern for sensitive groups.";
  if (aqi <= 150) return "General public is not likely affected.";
  if (aqi <= 300) return "Health alert: serious health effects.";
  return "Health warning of emergency conditions.";
}

export const Sidebar = ({
  data,
  isLoading,
  onLocationSelect,
}: SidebarProps) => {
  const status = getAQIStatus(data.aqi);
  const StatusIcon = status.icon;
  const colors = getAQIColors(data.aqi);

  return (
    <aside
      className={cn(
        "relative flex h-auto w-full flex-col p-6 shadow-xl lg:h-full lg:w-[calc(400px_+_10%)]",
        "border-l border-slate-200 dark:border-slate-800",
        "bg-slate-50 dark:bg-slate-900"
      )}
    >
      {/* Decorative Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-50 dark:from-blue-900/20" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col pt-12 px-2 text-left">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {data.location.name}
          </h2>
          <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
            Today,{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="mt-16 text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="text-8xl font-black tracking-tighter text-slate-900 dark:text-white">
              {isLoading ? "--" : data.aqi}
            </span>
            <span
              className={cn(
                "text-xl font-bold uppercase tracking-widest",
                status.color
              )}
            >
              AQI
            </span>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <div
              className={cn(
                "h-3 w-3 rounded-full animate-pulse",
                colors.dotClass
              )}
            />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              Primary Pollutant:{" "}
              <span className="text-slate-900 dark:text-white font-bold">
                PM2.5 ({data.pollutants.pm25})
              </span>
            </p>
          </div>
        </div>

        {/* Health Advisory */}
        <div
          className={cn(
            "mt-12 rounded-2xl p-6",
            "border bg-slate-50 dark:bg-slate-800/50",
            status.border
          )}
        >
          <div className="mb-3 flex items-center gap-3">
            <StatusIcon className={cn("h-6 w-6", status.color)} />
            <span className={cn("text-lg font-bold", status.color)}>
              {status.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {status.desc}
          </p>
        </div>
      </div>

      {/* Monitoring Stations */}
      <div className="relative z-10 mt-auto pt-8">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Monitoring Stations
        </h4>
        <div className="space-y-2">
          {[
            {
              name: "Lagos, NG",
              lat: 6.5244,
              lng: 3.3792,
              aqi: 87,
              status: "Main Station",
            },
            {
              name: "London, UK",
              lat: 51.5074,
              lng: -0.1278,
              aqi: 45,
              status: "Active",
            },
            {
              name: "New York, US",
              lat: 40.7128,
              lng: -74.006,
              aqi: 32,
              status: "Active",
            },
            {
              name: "Tokyo, JP",
              lat: 35.6762,
              lng: 139.6503,
              aqi: 65,
              status: "Active",
            },
          ].map((station, idx) => {
            const stationColors = getAQIColors(station.aqi);
            return (
              <button
                key={idx}
                onClick={() =>
                  onLocationSelect &&
                  onLocationSelect(station.lat, station.lng, station.name)
                }
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 text-left",
                  "border border-transparent transition-all",
                  "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "hover:border-slate-200 dark:hover:border-slate-700"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                    "bg-slate-100 dark:bg-slate-800",
                    "text-slate-400 dark:text-slate-500",
                    "group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30",
                    "group-hover:text-blue-500 dark:group-hover:text-blue-400"
                  )}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                    {station.name}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {station.status}
                  </p>
                </div>
                <span className={cn("text-sm font-bold", stationColors.text)}>
                  {station.aqi}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
```

Now let me create a comprehensive implementation guide for the theme system:

## **Implementation Guide**

# QASA Theme System - Implementation Guide

## 🎨 Overview

This comprehensive theme system provides:

- ✅ **Light/Dark/System modes** with smooth transitions
- ✅ **Centralized design tokens** for consistent styling
- ✅ **AQI-specific color scales** that adapt to theme
- ✅ **Glassmorphism effects** with theme awareness
- ✅ **Reusable utility functions** for common patterns
- ✅ **Type-safe constants** for all design values

---

## 📦 Installation & Setup

### Step 1: Create Required Files

Create these new files in your project:

```
src/
├── contexts/
│   └── ThemeProvider.tsx     (NEW)
├── lib/
│   └── designTokens.ts       (NEW)
└── index.css                 (REPLACE)
```

### Step 2: Update index.css

Replace `src/index.css` with the `theme_system` artifact.

**What's new:**

- CSS custom properties for all colors
- Light and dark mode variants
- Design token variables (spacing, shadows, etc.)
- Utility classes for common patterns
- Smooth theme transitions

### Step 3: Add Theme Provider

Create `src/contexts/ThemeProvider.tsx` using the `theme_provider` artifact.

### Step 4: Add Design Tokens

Create `src/lib/designTokens.ts` using the `design_tokens` artifact.

### Step 5: Update Theme Toggle

Replace `src/components/ui/theme-toggle.tsx` with the `improved_theme_toggle` artifact.

### Step 6: Wrap Your App

Update `src/App.tsx`:

```typescript
import { ThemeProvider } from "./contexts/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="qasa-theme">
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <BrowserRouter>
          <Toaster position="top-center" />
          <AppContent />
        </BrowserRouter>
      </ClerkProvider>
    </ThemeProvider>
  );
}
```

---

## 🎯 Key Features

### 1. Theme Modes

**Three modes available:**

- `light` - Always light theme
- `dark` - Always dark theme
- `system` - Follows OS preference

**Accessing theme in components:**

```typescript
import { useTheme } from "../contexts/ThemeProvider";

function MyComponent() {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  // theme: "light" | "dark" | "system"
  // actualTheme: "light" | "dark" (resolved value)

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Actual theme: {actualTheme}</p>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setTheme("system")}>Use System</button>
    </div>
  );
}
```

### 2. AQI Color System

**Automatic color selection based on AQI value:**

```typescript
import { getAQIColors, getAQILabel } from "../lib/designTokens";

function AQIDisplay({ aqi }: { aqi: number }) {
  const colors = getAQIColors(aqi);
  const label = getAQILabel(aqi);

  return (
    <div className={colors.bgClass}>
      <span className={colors.text}>{label}</span>
      <div className={colors.dotClass} />
    </div>
  );
}
```

**Available color properties:**

- `bg` - CSS custom property value
- `text` - Tailwind text color classes
- `bgClass` - Tailwind background classes
- `borderClass` - Tailwind border classes
- `dotClass` - Tailwind dot/indicator classes

### 3. Design Tokens

**Using constants instead of hardcoded values:**

```typescript
import { SPACING, TYPOGRAPHY, RADIUS } from "../lib/designTokens";

// ❌ Before (hardcoded)
<div style={{ padding: "16px", borderRadius: "12px" }}>

// ✅ After (using tokens)
<div style={{ padding: SPACING.md, borderRadius: RADIUS.lg }}>
```

**Available token categories:**

- `SPACING` - Consistent spacing scale
- `TYPOGRAPHY` - Font sizes, weights, families
- `RADIUS` - Border radius values
- `SHADOWS` - Box shadow scales
- `TRANSITIONS` - Animation durations
- `Z_INDEX` - Z-index scale
- `BREAKPOINTS` - Responsive breakpoints

### 4. Component Styles

**Pre-built style combinations:**

```typescript
import { COMPONENT_STYLES } from "../lib/designTokens";

// Cards
<div className={COMPONENT_STYLES.card.base}>Content</div>
<div className={COMPONENT_STYLES.card.glass}>Glass card</div>

// Buttons
<button className={COMPONENT_STYLES.button.primary}>Primary</button>
<button className={COMPONENT_STYLES.button.ghost}>Ghost</button>

// Badges
<span className={COMPONENT_STYLES.badge.success}>Success</span>
<span className={COMPONENT_STYLES.badge.danger}>Error</span>
```

### 5. Utility Functions

**Helper functions for common patterns:**

```typescript
import { glassEffect, themeClasses, responsive } from "../lib/designTokens";

// Glassmorphism
<div className={glassEffect("medium")}>
  Glass effect with medium opacity
</div>

// Theme-aware classes
<div className={themeClasses("bg-white", "bg-slate-900")}>
  White in light, slate in dark
</div>

// Responsive values
const padding = responsive("1rem", "2rem", "3rem");
// { base: "1rem", md: "2rem", lg: "3rem" }
```

---

## 🔄 Migration Guide

### Updating Existing Components

#### Before (Hardcoded Colors):

```typescript
<div className="bg-slate-50 text-slate-900">
  <span className="text-emerald-500">Good</span>
</div>
```

#### After (Theme-Aware):

```typescript
<div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
  <span className={getAQIColors(45).text}>Good</span>
</div>
```

#### Better (Using Utilities):

```typescript
import { cn } from "../lib/utils";

<div
  className={cn(
    "bg-slate-50 dark:bg-slate-900",
    "text-slate-900 dark:text-white"
  )}
>
  <span className={getAQIColors(45).text}>Good</span>
</div>;
```

### Common Patterns

**1. Dashboard Backgrounds:**

```typescript
// Old
<div className="bg-[#F8FAFC]">

// New
<div className="dashboard-bg">
// or
<div className="bg-slate-50 dark:bg-slate-900">
```

**2. Cards/Surfaces:**

```typescript
// Old
<div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

// New
<div className={COMPONENT_STYLES.card.base + " rounded-2xl"}>
// or for glass effect
<div className={cn("glass", "rounded-2xl")}>
```

**3. Text Colors:**

```typescript
// Old
<p className="text-slate-900">Title</p>
<p className="text-slate-500">Subtitle</p>

// New
<p className="text-foreground">Title</p>
<p className="text-muted-foreground">Subtitle</p>
```

**4. Borders:**

```typescript
// Old
<div className="border border-slate-200">

// New
<div className="border border-border">
```

---

## 🎨 CSS Custom Properties Reference

### Color Variables

All color variables support both light and dark modes:

```css
/* Background colors */
var(--background)           /* Main background */
var(--foreground)           /* Main text color */
var(--card)                 /* Card backgrounds */
var(--card-foreground)      /* Card text */

/* Brand colors */
var(--primary)              /* Primary blue */
var(--primary-foreground)   /* Text on primary */
var(--accent)               /* Accent green */
var(--accent-foreground)    /* Text on accent */

/* Semantic colors */
var(--destructive)          /* Error/danger */
var(--muted)                /* Subtle backgrounds */
var(--muted-foreground)     /* Subtle text */

/* AQI colors */
var(--aqi-good)             /* AQI 0-50 */
var(--aqi-moderate)         /* AQI 51-100 */
var(--aqi-unhealthy-sensitive) /* AQI 101-150 */
var(--aqi-unhealthy)        /* AQI 151-200 */
var(--aqi-very-unhealthy)   /* AQI 201-300 */
var(--aqi-hazardous)        /* AQI 301+ */

/* Dashboard specific */
var(--dashboard-bg)         /* Dashboard background */
var(--sidebar-bg)           /* Sidebar background */
var(--sidebar-text)         /* Sidebar text */
```

### Using in Components

```typescript
// Direct CSS custom property
<div style={{ backgroundColor: "hsl(var(--primary))" }}>

// Tailwind class
<div className="bg-primary">

// With opacity
<div className="bg-primary/80">
```

---

## 🌓 Testing Your Theme

### Manual Testing Checklist

- [ ] Toggle between light/dark/system modes
- [ ] Verify AQI colors update correctly
- [ ] Check all text is readable in both modes
- [ ] Test glassmorphism effects
- [ ] Verify transitions are smooth
- [ ] Check theme persists on reload
- [ ] Test system preference changes

### Testing Component

Create `src/pages/ThemeTest.tsx`:

```typescript
import { useTheme } from "../contexts/ThemeProvider";
import { getAQIColors, getAQILabel } from "../lib/designTokens";
import { ThemeToggle } from "../components/ui/theme-toggle";

export function ThemeTest() {
  const { theme, actualTheme } = useTheme();

  const aqiValues = [25, 75, 125, 175, 250, 350];

  return (
    <div className="min-h-screen dashboard-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Theme Test</h1>
            <p className="text-muted-foreground">
              Mode: {theme} | Actual: {actualTheme}
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* AQI Colors */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">AQI Color Scale</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {aqiValues.map((aqi) => {
              const colors = getAQIColors(aqi);
              const label = getAQILabel(aqi);
              return (
                <div
                  key={aqi}
                  className={cn(
                    "p-4 rounded-lg border",
                    colors.bgClass,
                    colors.borderClass
                  )}
                >
                  <div className={cn("text-2xl font-bold", colors.text)}>
                    {aqi}
                  </div>
                  <div className="text-sm">{label}</div>
                  <div
                    className={cn("w-4 h-4 rounded-full mt-2", colors.dotClass)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Component Styles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Components</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className={COMPONENT_STYLES.card.base + " p-4"}>
              Standard Card
            </div>
            <div className={cn("glass", "p-4", "rounded-lg")}>Glass Card</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className={
              COMPONENT_STYLES.button.primary + " px-4 py-2 rounded-lg"
            }
          >
            Primary
          </button>
          <button
            className={
              COMPONENT_STYLES.button.secondary + " px-4 py-2 rounded-lg"
            }
          >
            Secondary
          </button>
          <button
            className={COMPONENT_STYLES.button.ghost + " px-4 py-2 rounded-lg"}
          >
            Ghost
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🚀 Best Practices

### 1. Always Use Theme-Aware Classes

```typescript
// ❌ Bad - Hardcoded colors
<div className="bg-white text-black">

// ✅ Good - Theme variables
<div className="bg-background text-foreground">

// ✅ Good - Explicit dark mode
<div className="bg-slate-50 dark:bg-slate-900">
```

### 2. Use Design Tokens for Values

```typescript
// ❌ Bad
<div style={{ padding: "16px", borderRadius: "12px" }}>

// ✅ Good
import { SPACING, RADIUS } from "../lib/designTokens";
<div style={{ padding: SPACING.md, borderRadius: RADIUS.lg }}>
```

### 3. Leverage Utility Functions

```typescript
// ❌ Bad
const colors =
  aqi <= 50
    ? "text-green-500"
    : aqi <= 100
    ? "text-yellow-500"
    : "text-red-500";

// ✅ Good
import { getAQIColors } from "../lib/designTokens";
const colors = getAQIColors(aqi);
```

### 4. Test Both Themes

Always test your components in both light and dark modes during development.

### 5. Use Semantic Color Names

```typescript
// ❌ Bad
<p className="text-slate-500">

// ✅ Good
<p className="text-muted-foreground">
```

---

## 🔧 Customization

### Adding New AQI Thresholds

Edit `src/lib/designTokens.ts`:

```typescript
export const AQI_COLORS = {
  // Add new threshold
  custom: {
    bg: "hsl(var(--aqi-custom))",
    text: "text-pink-600 dark:text-pink-400",
    bgClass: "bg-pink-500/10 dark:bg-pink-500/20",
    borderClass: "border-pink-500/20 dark:border-pink-500/30",
    dotClass: "bg-pink-500",
  },
};
```

### Adding Custom Design Tokens

```typescript
// In designTokens.ts
export const MY_CUSTOM_TOKENS = {
  specialPadding: "2.5rem",
  heroFontSize: "4rem",
} as const;
```

### Extending CSS Variables

Add to `src/index.css`:

```css
:root {
  --my-custom-color: 200 100% 50%;
}

.dark {
  --my-custom-color: 200 100% 60%;
}
```

---

## 📚 Additional Resources

- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [React Context API](https://react.dev/reference/react/useContext)

---

## ✅ Completion Checklist

- [ ] All CSS files updated with new theme system
- [ ] ThemeProvider added to App.tsx
- [ ] Design tokens file created
- [ ] Theme toggle component updated
- [ ] All hardcoded colors replaced with theme variables
- [ ] All components tested in both light and dark modes
- [ ] Theme preference persists across sessions
- [ ] System preference detection works correctly

Your theme system is now production-ready! 🎉

I'll help you set up a comprehensive theming system with proper light/dark mode support and reusable design tokens throughout your codebase.Now let me create a comprehensive implementation guide for the theme system:## Summary

I've created a comprehensive theme system for your QASA project with the following components:

### 🎨 What I've Built:

1. **Complete Theme System** (`theme_system`)

   - CSS custom properties for all colors
   - Light & dark mode variants
   - Smooth transitions between themes
   - Design tokens (spacing, shadows, typography)
   - Utility classes for common patterns
   - Glassmorphism effects

2. **Theme Provider Context** (`theme_provider`)

   - React context for theme management
   - Three modes: light, dark, system
   - Persistent theme storage
   - Automatic system preference detection

3. **Improved Theme Toggle** (`improved_theme_toggle`)

   - Dropdown menu with all three options
   - Visual indicators for active theme
   - Smooth icon transitions

4. **Design Tokens Library** (`design_tokens`)

   - AQI-specific color scales
   - Typography constants
   - Spacing & layout values
   - Shadow & transition scales
   - Utility functions for common patterns
   - Type-safe constants

5. **Updated Sidebar** (`updated_sidebar_theme`)

   - Example of theme-aware component
   - Uses design tokens throughout
   - Proper dark mode support

6. **Implementation Guide** (`theme_implementation_guide`)
   - Step-by-step setup
   - Migration patterns
   - Best practices
   - Testing checklist

### 🌟 Key Features:

**Automatic Theme Switching:**

- Light/Dark/System modes
- Persists user preference
- Follows OS theme changes

**Design Token System:**

```typescript
// Instead of hardcoded values
<div className="text-slate-900 bg-white">

// Use semantic tokens
<div className="text-foreground bg-background">

// Or design constants
import { SPACING, TYPOGRAPHY } from "./lib/designTokens";
```

**AQI Color System:**

```typescript
const colors = getAQIColors(aqi);
<div className={colors.bgClass}>
  <span className={colors.text}>{getAQILabel(aqi)}</span>
</div>;
```

**Glassmorphism Effects:**

```typescript
<div className={glassEffect("medium")}>Blurred glass effect</div>
```

### 📝 Implementation Steps:

1. Replace `src/index.css` with new theme system
2. Create `src/contexts/ThemeProvider.tsx`
3. Create `src/lib/designTokens.ts`
4. Update `src/components/ui/theme-toggle.tsx`
5. Wrap App.tsx with ThemeProvider
6. Migrate components to use theme tokens

### ✨ Benefits:

- ✅ Consistent colors across all components
- ✅ Automatic dark mode support
- ✅ Centralized design values
- ✅ Type-safe constants
- ✅ Easy to customize
- ✅ Production-ready

I would like you to:

1. Update all the components to use the new theme system?
2. Set up theme-aware animations?
