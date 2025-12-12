import { CheckCircle, AlertTriangle, XCircle, Skull } from "lucide-react";

// LEGACY_AQI_COLORS is deprecated. Use getAqiStatusStyles for WCAG compliant colors.
export const LEGACY_AQI_COLORS = {
  good: "#00e400", // 0-50
  moderate: "#ffff00", // 51-100
  unhealthySensitive: "#ff7e00", // 101-150
  unhealthy: "#ff0000", // 151-200
  veryUnhealthy: "#8f3f97", // 201-300
  hazardous: "#7e0023", // 300+
};

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return LEGACY_AQI_COLORS.good;
  if (aqi <= 100) return LEGACY_AQI_COLORS.moderate;
  if (aqi <= 150) return LEGACY_AQI_COLORS.unhealthySensitive;
  if (aqi <= 200) return LEGACY_AQI_COLORS.unhealthy;
  if (aqi <= 300) return LEGACY_AQI_COLORS.veryUnhealthy;
  return LEGACY_AQI_COLORS.hazardous;
}

export type AqiCategory = "good" | "moderate" | "unhealthy" | "hazardous";

export function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  // Group Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy into one "unhealthy" category for styling
  if (aqi <= 300) return "unhealthy";
  return "hazardous";
}

interface AqiStatusStyles {
  category: string;
  badgeClasses: string;
  textColor: string;
  icon: React.ElementType; // For Lucide icons
}

export function getAqiStatusStyles(aqi: number): AqiStatusStyles {
  const category = getAqiCategory(aqi);
  
  switch (category) {
    case "good":
      return {
        category: "Good",
        badgeClasses: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700",
        textColor: "text-emerald-700 dark:text-emerald-400",
        icon: CheckCircle,
      };
    case "moderate":
      return {
        category: "Moderate",
        badgeClasses: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700",
        textColor: "text-amber-700 dark:text-amber-400",
        icon: AlertTriangle,
      };
    case "unhealthy":
      return {
        category: aqi <= 150 ? "Unhealthy for Sensitive Groups" : aqi <= 200 ? "Unhealthy" : "Very Unhealthy",
        badgeClasses: "bg-red-100 text-red-900 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700",
        textColor: "text-red-700 dark:text-red-400",
        icon: XCircle,
      };
    case "hazardous":
      return {
        category: "Hazardous",
        badgeClasses: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700",
        textColor: "text-purple-700 dark:text-purple-400",
        icon: Skull,
      };
    default:
      return {
        category: "Unknown",
        badgeClasses: "bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
        textColor: "text-slate-700 dark:text-slate-400",
        icon: AlertTriangle,
      };
  }
}

export function mapOWMAqiToStandardAqi(owmAqi: number): number {
  const mapping: Record<number, number> = {
    1: 40,
    2: 80,
    3: 120,
    4: 180,
    5: 250,
  };
  return mapping[owmAqi] || 50;
}
