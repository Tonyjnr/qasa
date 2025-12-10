import { useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { getAqiColor, getAqiCategory } from "../../../lib/aqiUtils";

const STATIC_RANKINGS = Array.from({ length: 100 }, (_, i) => ({
  rank: i + 1,
  city: `City ${i + 1}`,
  country: ["NG", "GH", "KE", "ZA"][Math.floor(Math.random() * 4)],
  aqi: Math.floor(Math.random() * 300) + 20,
}))
  .sort((a, b) => b.aqi - a.aqi)
  .map((item, i) => ({ ...item, rank: i + 1 }));

export const CityRankingTable = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const data = useMemo(() => STATIC_RANKINGS, []);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // Slightly taller rows for better readability
    overscan: 5,
  });

  return (
    <Card className="h-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-bold">Live Rankings</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {/* Header Row */}
        <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-wider pb-3 border-b mb-2 px-4">
          <div className="w-12 text-center">Rank</div>
          <div className="flex-1 pl-4">City</div>
          <div className="w-20 text-right">AQI</div>
          <div className="w-24 text-right hidden sm:block">Status</div>
        </div>

        {/* Scrollable Body */}
        <div ref={parentRef} className="h-[600px] overflow-auto pr-2 custom-scrollbar">
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
                  className="absolute top-0 left-0 w-full flex items-center p-3 my-1 rounded-lg border border-transparent hover:bg-muted/50 transition-colors"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="w-12 text-center font-mono font-bold text-muted-foreground bg-muted/30 rounded py-1">
                    #{city.rank}
                  </div>
                  <div className="flex-1 pl-4 font-medium truncate">
                    <span className="text-foreground">{city.city}</span>
                    <span className="text-muted-foreground text-xs ml-2">
                      {city.country}
                    </span>
                  </div>
                  <div
                    className="w-20 text-right font-black text-lg"
                    style={{ color: aqiColor }}
                  >
                    {city.aqi}
                  </div>
                  <div className="w-24 text-right text-xs hidden sm:flex justify-end">
                    <span
                      className="px-2 py-1 rounded-md text-white font-bold text-[10px] uppercase w-full text-center truncate"
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