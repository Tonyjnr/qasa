import type { Pollutants } from "../../types";

interface PollutantGridProps {
  pollutants: Pollutants;
}

export const PollutantGrid = ({ pollutants }: PollutantGridProps) => {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-slate-800">Pollutants</h2>
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
            className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            <span className="text-xs font-semibold text-slate-400">
              {p.label}
            </span>
            <div className="mt-2">
              <span className="text-xl font-bold text-slate-800">{p.val}</span>
              <span className="ml-1 text-[10px] text-slate-400">{p.unit}</span>
            </div>
            {/* Tiny visual bar */}
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-slate-800"
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
