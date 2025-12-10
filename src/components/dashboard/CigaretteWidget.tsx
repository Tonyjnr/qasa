import { CigaretteEquivalence } from "../../services/cigaretteEquivalence";
import { DataCard } from "./DataCard";

interface CigaretteWidgetProps {
  pm25: number;
}

export function CigaretteWidget({ pm25 }: CigaretteWidgetProps) {
  const cigarettes = CigaretteEquivalence.calculate(pm25);
  const impact = CigaretteEquivalence.getHealthImpact(cigarettes);
  const viz = CigaretteEquivalence.getVisualization(cigarettes);

  return (
    <DataCard
      title="Cigarette Equivalent"
      value={cigarettes.toFixed(1)}
      unit="cigs/day"
      icon={<span className="text-xl">🚬</span>}
      className="h-full"
    >
      <div className="space-y-4">
        <div className="text-3xl tracking-widest leading-relaxed break-words">
          {viz}
        </div>

        <p className="text-sm text-foreground bg-background/40 rounded-lg p-3 backdrop-blur-sm border border-border/50">
          {impact}
        </p>

        <p className="text-[10px] text-muted-foreground">
          Based on Berkeley Earth research (2016): 22 µg/m³ PM2.5 ≈ 1
          cigarette/day
        </p>
      </div>
    </DataCard>
  );
}