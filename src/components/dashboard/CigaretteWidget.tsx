import { CigaretteEquivalence } from "../../services/cigaretteEquivalence";

interface CigaretteWidgetProps {
  pm25: number;
}

export function CigaretteWidget({ pm25 }: CigaretteWidgetProps) {
  const cigarettes = CigaretteEquivalence.calculate(pm25);
  const impact = CigaretteEquivalence.getHealthImpact(cigarettes);
  const viz = CigaretteEquivalence.getVisualization(cigarettes);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🚬</span>
        <h3 className="text-lg font-bold text-slate-900">
          Cigarette Equivalent
        </h3>
      </div>

      <div className="mb-4">
        <div className="text-5xl font-bold text-orange-600 mb-2">
          {cigarettes.toFixed(1)}
        </div>
        <p className="text-sm text-slate-600">
          cigarettes/day at current PM2.5 level ({pm25} µg/m³)
        </p>
      </div>

      <div className="text-3xl mb-4 tracking-widest leading-relaxed break-words">
        {viz}
      </div>

      <p className="text-sm text-slate-700 bg-white/60 rounded-lg p-3 backdrop-blur-sm border border-orange-100">
        {impact}
      </p>

      <p className="mt-3 text-[10px] text-slate-400">
        Based on Berkeley Earth research (2016): 22 µg/m³ PM2.5 ≈ 1
        cigarette/day
      </p>
    </div>
  );
}
