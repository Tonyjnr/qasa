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