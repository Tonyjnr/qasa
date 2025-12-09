/* eslint-disable react-hooks/incompatible-library */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { getAqiColor, getAqiCategory } from "../../../lib/aqiUtils";

// Mock data generator for ranking
// Mock data generator for ranking
// Moved outside component to prevent regeneration on re-renders,
// though it was inside useMemo before, the random values made it unstable across full remounts.
const STATIC_RANKINGS = Array.from({ length: 100 }, (_, i) => ({
  rank: i + 1,
  city: `City ${i + 1}`,
  country: ["NG", "GH", "KE", "ZA"][Math.floor(Math.random() * 4)],
  aqi: Math.floor(Math.random() * 300) + 20,
  pm25: Math.floor(Math.random() * 100) + 5,
}))
  .sort((a, b) => b.aqi - a.aqi)
  .map((item, i) => ({ ...item, rank: i + 1 }));

export const CityRankingTable = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Using static mock data for stability during debugging
  const data = useMemo(() => STATIC_RANKINGS, []);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>City Rankings (Real-time)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex text-xs font-semibold text-muted-foreground pb-2 border-b mb-2 px-2">
          <div className="w-16">Rank</div>
          <div className="flex-1">City</div>
          <div className="w-20 text-right">AQI</div>
          <div className="w-24 text-right hidden sm:block">Status</div>
        </div>

        <div ref={parentRef} className="h-[500px] overflow-auto">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const city = data[virtualRow.index];
              const aqiColor = getAqiColor(city.aqi);

              return (
                <div
                  key={virtualRow.key}
                  className="absolute top-0 left-0 w-full flex items-center p-2 border-b border-border/50 hover:bg-accent/50 transition-colors"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="w-16 font-mono text-muted-foreground">
                    #{city.rank}
                  </div>
                  <div className="flex-1 font-medium">
                    {city.city},{" "}
                    <span className="text-muted-foreground text-xs">
                      {city.country}
                    </span>
                  </div>
                  <div
                    className="w-20 text-right font-bold"
                    style={{ color: aqiColor }}
                  >
                    {city.aqi}
                  </div>
                  <div className="w-24 text-right text-xs hidden sm:block">
                    <span
                      className="px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: aqiColor }}
                    >
                      {getAqiCategory(city.aqi)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
