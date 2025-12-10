import { CigaretteEquivalence } from "../../services/cigaretteEquivalence";
import { DataCard } from "./DataCard";
import { Info } from "lucide-react";

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
        <div className="text-3xl tracking-widest leading-relaxed break-words min-h-[40px]">
          {viz}
        </div>

        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
          <p className="text-sm font-medium text-foreground mb-1">Health Impact</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {impact}. Breathing this air for 24h is roughly equivalent to smoking {cigarettes.toFixed(1)} cigarettes.
          </p>
        </div>

        <div className="flex items-start gap-2 pt-2 border-t border-border/50">
          <Info className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground">
            Methodology: Based on Berkeley Earth research (2016) equating 22 µg/m³ of PM2.5 to 1 cigarette per day.
          </p>
        </div>
      </div>
    </DataCard>
  );
}
