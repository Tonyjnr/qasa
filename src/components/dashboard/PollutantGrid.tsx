import type { Pollutants } from "../../types";
import { DataCard } from "./DataCard";

interface PollutantGridProps {
  pollutants: Pollutants;
}

export const PollutantGrid = ({ pollutants }: PollutantGridProps) => {
  const items = [
    { label: "PM2.5", val: pollutants.pm25, unit: "µg/m³" },
    { label: "PM10", val: pollutants.pm10, unit: "µg/m³" },
    { label: "O₃", val: pollutants.o3, unit: "ppb" },
    { label: "NO₂", val: pollutants.no2, unit: "ppb" },
    { label: "SO₂", val: pollutants.so2, unit: "ppb" },
    { label: "CO", val: pollutants.co, unit: "ppm" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-foreground">Pollutants</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((p, i) => (
          <DataCard
            key={i}
            title={p.label}
            value={p.val}
            unit={p.unit}
            // Optional: visual bar as children
            children={
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/20">
                <div
                  className="h-full bg-primary/50"
                  style={{
                    width: `${Math.min((Number(p.val) / 100) * 100, 100)}%`,
                  }}
                />
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};