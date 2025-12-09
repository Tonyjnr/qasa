export const AQI_COLORS = {
  good: "#00e400", // 0-50
  moderate: "#ffff00", // 51-100
  unhealthySensitive: "#ff7e00", // 101-150
  unhealthy: "#ff0000", // 151-200
  veryUnhealthy: "#8f3f97", // 201-300
  hazardous: "#7e0023", // 300+
};

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return AQI_COLORS.good;
  if (aqi <= 100) return AQI_COLORS.moderate;
  if (aqi <= 150) return AQI_COLORS.unhealthySensitive;
  if (aqi <= 200) return AQI_COLORS.unhealthy;
  if (aqi <= 300) return AQI_COLORS.veryUnhealthy;
  return AQI_COLORS.hazardous;
}

export function getAqiCategory(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
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
