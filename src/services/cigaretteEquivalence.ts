export class CigaretteEquivalence {
  // Berkeley Earth Rule of Thumb: 22 µg/m3 of PM2.5 roughly equivalent to 1 cigarette/day
  private static readonly PM25_PER_CIGARETTE = 22;

  static calculate(pm25: number, exposureHours: number = 24): number {
    // Daily exposure cigarette equivalent
    // Formula: (PM2.5 / 22) * (hours / 24)
    const cigarettes = (pm25 / this.PM25_PER_CIGARETTE) * (exposureHours / 24);
    // Round to 1 decimal place, minimum 0
    return Math.max(0, Math.round(cigarettes * 10) / 10);
  }

  static getHealthImpact(cigarettes: number): string {
    if (cigarettes < 0.5)
      return "Minimal impact - equivalent to very light exposure";
    if (cigarettes < 2)
      return "Low impact - comparable to occasional secondhand smoke";
    if (cigarettes < 5) return "Moderate impact - like being in a smoking area";
    if (cigarettes < 10)
      return "Significant impact - equivalent to light smoking";
    return "Severe impact - comparable to active smoking";
  }

  static getVisualization(cigarettes: number): string {
    const fullCigs = Math.floor(cigarettes);
    const partial = cigarettes - fullCigs;

    // Limit visualization to avoid screen overflow
    const maxIcons = 20;
    let count = 0;

    let viz = "";
    for (let i = 0; i < fullCigs; i++) {
      if (count >= maxIcons) break;
      viz += "🚬";
      count++;
    }

    if (count < maxIcons && partial >= 0.5) {
      viz += "🚬";
    }

    return viz || "✅"; // Return checkmark if 0 cigarettes
  }
}
