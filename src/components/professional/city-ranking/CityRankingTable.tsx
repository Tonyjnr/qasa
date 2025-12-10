import { useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { getAqiColor, getAqiCategory } from "../../../lib/aqiUtils";
import { fetchGlobalCityAQI } from "../../../services/realDataService";
import { Loader2 } from "lucide-react";

// List of major cities to track for "Live" ranking
const CITIES_TO_TRACK = [
  "Beijing,CN", "Delhi,IN", "New York,US", "London,UK", "Lagos,NG", 
  "Tokyo,JP", "Dubai,AE", "Sydney,AU", "Sao Paulo,BR", "Mexico City,MX",
  "Paris,FR", "Berlin,DE", "Cairo,EG", "Mumbai,IN", "Bangkok,TH",
  "Istanbul,TR", "Seoul,KR", "Jakarta,ID", "Karachi,PK", "Dhaka,BD",
  "Lahore,PK", "Hanoi,VN", "Lima,PE", "Bogota,CO", "Tehran,IR",
  "Riyadh,SA", "Johannesburg,ZA", "Nairobi,KE", "Accra,GH", "Casablanca,MA"
];

export const CityRankingTable = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGlobalCityAQI(CITIES_TO_TRACK);
        // Sort by AQI descending (worst air first)
        const sorted = data.sort((a, b) => b.aqi - a.aqi).map((item, index) => ({
          ...item,
          rank: index + 1
        }));
        setRankings(sorted);
      } catch (error) {
        console.error("Failed to load rankings", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: rankings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Increased row height for details
    overscan: 5,
  });

  return (
    <Card className="h-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-lg font-bold flex justify-between items-center">
          <span>Live Rankings</span>
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {rankings.length} Cities Tracked
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {/* Header Row */}
        <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-wider pb-3 border-b mb-2 px-4">
          <div className="w-12 text-center">Rank</div>
          <div className="flex-1 pl-4">City / Region</div>
          <div className="w-32 text-center">AQI (US)</div>
          <div className="w-40 text-left pl-4 hidden sm:block">Status</div>
        </div>

        {/* Scrollable Body */}
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div 
            ref={parentRef} 
            className="h-[600px] overflow-auto pr-2 smooth-scroll"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const city = rankings[virtualRow.index];
                const aqiColor = getAqiColor(city.aqi);
                const category = getAqiCategory(city.aqi);

                return (
                  <div
                    key={virtualRow.key}
                    className="absolute top-0 left-0 w-full flex items-center p-3 my-1 rounded-xl border border-transparent hover:bg-muted/40 transition-colors group"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div className="w-12 text-center">
                      <span className="font-mono font-bold text-muted-foreground bg-muted/30 rounded-lg px-2 py-1 group-hover:bg-background transition-colors">
                        #{city.rank}
                      </span>
                    </div>
                    
                    <div className="flex-1 pl-4 min-w-0">
                      <div className="font-bold text-foreground truncate text-sm">
                        {city.city.split(',')[0]}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {city.city.split(',')[1] || 'Global'}
                      </div>
                    </div>

                    <div className="w-32 text-center flex justify-center">
                      <div 
                        className="font-black text-xl px-3 py-1 rounded-lg bg-background/50 border border-border shadow-sm min-w-[3.5rem]"
                        style={{ color: aqiColor }}
                      >
                        {city.aqi}
                      </div>
                    </div>

                    <div className="w-40 pl-4 hidden sm:block">
                      <div className="flex flex-col gap-1">
                        <span
                          className="px-3 py-1.5 rounded-md text-white font-bold text-[10px] uppercase w-full text-center tracking-wide shadow-sm truncate"
                          style={{ backgroundColor: aqiColor }}
                        >
                          {category}
                        </span>
                        {/* Optional PM2.5 detail if available in future */}
                        {/* <span className="text-[10px] text-muted-foreground text-center">PM2.5: {city.pm25}</span> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
