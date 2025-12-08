import { CigaretteEquivalence } from "../../services/cigaretteEquivalence";
import { COMPONENT_STYLES } from "../../lib/designTokens";
import { cn } from "../../lib/utils";

interface CigaretteWidgetProps {
  pm25: number;
}

export function CigaretteWidget({ pm25 }: CigaretteWidgetProps) {
  const cigarettes = CigaretteEquivalence.calculate(pm25);
  const impact = CigaretteEquivalence.getHealthImpact(cigarettes);
  const viz = CigaretteEquivalence.getVisualization(cigarettes);

  return (
    <div className={cn("p-6", COMPONENT_STYLES.card.glass, "rounded-2xl")}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🚬</span>
        <h3 className="text-lg font-bold text-foreground">
          Cigarette Equivalent
        </h3>
      </div>

      <div className="mb-4">
        <div className="text-5xl font-bold text-orange-500 mb-2">
          {cigarettes.toFixed(1)}
        </div>
        <p className="text-sm text-muted-foreground">
          cigarettes/day at current PM2.5 level ({pm25} µg/m³)
        </p>
      </div>

      <div className="text-3xl mb-4 tracking-widest leading-relaxed break-words">
        {viz}
      </div>

      <p className="text-sm text-foreground bg-background/40 rounded-lg p-3 backdrop-blur-sm border border-border/50">
        {impact}
      </p>

      <p className="mt-3 text-[10px] text-muted-foreground">
        Based on Berkeley Earth research (2016): 22 µg/m³ PM2.5 ≈ 1
        cigarette/day
      </p>
    </div>
  );
}
