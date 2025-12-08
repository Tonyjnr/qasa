import type { Pollutants } from "../../types";
import { cn } from "../../lib/utils";
import { COMPONENT_STYLES } from "../../lib/designTokens";

interface PollutantGridProps {
  pollutants: Pollutants;
}

export const PollutantGrid = ({ pollutants }: PollutantGridProps) => {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-foreground">Pollutants</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "PM2.5", val: pollutants.pm25, unit: "µg/m³" },
          { label: "PM10", val: pollutants.pm10, unit: "µg/m³" },
          { label: "O₃", val: pollutants.o3, unit: "ppb" },
          { label: "NO₂", val: pollutants.no2, unit: "ppb" },
          { label: "SO₂", val: pollutants.so2, unit: "ppb" },
          { label: "CO", val: pollutants.co, unit: "ppm" },
        ].map((p, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col justify-between rounded-2xl p-4 transition-transform hover:-translate-y-1 hover:shadow-md",
              COMPONENT_STYLES.card.glass // Use glass style here
            )}
          >
            <span className="text-xs font-semibold text-muted-foreground">
              {p.label}
            </span>
            <div className="mt-2">
              <span className="text-xl font-bold text-foreground">{p.val}</span>
              <span className="ml-1 text-[10px] text-muted-foreground">
                {p.unit}
              </span>
            </div>
            {/* Tiny visual bar */}
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/20">
              <div
                className="h-full bg-primary/50"
                // eslint-disable-next-line react-hooks/purity
                style={{ width: `${Math.random() * 80 + 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
