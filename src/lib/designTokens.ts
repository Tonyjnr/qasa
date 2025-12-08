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
      text: "text-emerald-600 dark:text-emerald-400", // Darker green/emerald
      bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
      borderClass: "border-emerald-200 dark:border-emerald-800",
      dotClass: "bg-emerald-500",
    };
  }
  if (aqi <= 100) {
    return {
      bg: "var(--aqi-moderate)",
      text: "text-yellow-600 dark:text-yellow-400",
      bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
      borderClass: "border-yellow-200 dark:border-yellow-800",
      dotClass: "bg-yellow-500",
    };
  }
  if (aqi <= 150) {
    return {
      bg: "var(--aqi-unhealthy-sensitive)",
      text: "text-orange-600 dark:text-orange-400",
      bgClass: "bg-orange-100 dark:bg-orange-900/30",
      borderClass: "border-orange-200 dark:border-orange-800",
      dotClass: "bg-orange-500",
    };
  }
  if (aqi <= 200) {
    return {
      bg: "var(--aqi-unhealthy)",
      text: "text-red-600 dark:text-red-400",
      bgClass: "bg-red-100 dark:bg-red-900/30",
      borderClass: "border-red-200 dark:border-red-800",
      dotClass: "bg-red-500",
    };
  }
  if (aqi <= 300) {
    return {
      bg: "var(--aqi-very-unhealthy)",
      text: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-100 dark:bg-purple-900/30",
      borderClass: "border-purple-200 dark:border-purple-800",
      dotClass: "bg-purple-500",
    };
  }
  return {
    bg: "var(--aqi-hazardous)",
    text: "text-rose-700 dark:text-rose-400",
    bgClass: "bg-rose-100 dark:bg-rose-900/30",
    borderClass: "border-rose-200 dark:border-rose-800",
    dotClass: "bg-rose-600",
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
